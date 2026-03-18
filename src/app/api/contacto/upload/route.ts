import { NextRequest, NextResponse } from "next/server";
import { google, drive_v3 } from "googleapis";
import { Resend } from "resend";
import { Readable } from "node:stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requiredEnv = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REFRESH_TOKEN",
  "GOOGLE_DRIVE_FOLDER_ID",
];

let cachedDrive: drive_v3.Drive | null = null;
const resendClient = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function assertEnv() {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Faltan variables de entorno: ${missing.join(", ")}`);
  }
}

function getDriveClient(): drive_v3.Drive {
  if (cachedDrive) {
    return cachedDrive;
  }

  assertEnv();

  const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

  cachedDrive = google.drive({ version: "v3", auth });
  return cachedDrive;
}

function sanitizeName(value: string) {
  return value.replace(/[\\/:*?"<>|]/g, "-").trim();
}

function slugify(value: string, fallback: string, maxLength: number) {
  const sanitized = sanitizeName(value).replace(/\s+/g, "-").toLowerCase();
  const base = sanitized || fallback;
  return base.length > maxLength ? base.slice(0, maxLength) : base;
}

function stripExtension(filename?: string | null) {
  if (!filename) {
    return "";
  }
  const lastDot = filename.lastIndexOf(".");
  return lastDot > 0 ? filename.slice(0, lastDot) : filename;
}

function getExtension(filename?: string | null) {
  if (!filename) {
    return "";
  }
  const lastDot = filename.lastIndexOf(".");
  return lastDot > 0 ? filename.slice(lastDot + 1).toLowerCase() : "";
}

function buildDocumentName(params: { isoDate: string; clientName: string; index: number; originalName?: string }) {
  const { isoDate, clientName, index, originalName } = params;
  const caseSlug = slugify(clientName || "cliente", "cliente", 40);
  const basePrefix = `${isoDate}-${caseSlug}`.slice(0, 60);
  const originalSlug = slugify(stripExtension(originalName) || `adjunto-${index + 1}`, `adjunto-${index + 1}`, 40);
  const extension = getExtension(originalName);
  const paddedIndex = String(index + 1).padStart(2, "0");
  const composed = `${basePrefix}-doc-${paddedIndex}-${originalSlug}`.slice(0, 120);
  return extension ? `${composed}.${extension}` : composed;
}

async function ensureCaseFolder(drive: drive_v3.Drive, folderName: string, supportsAllDrives: boolean) {
  const safeName = sanitizeName(folderName || "Caso sin nombre");
  const { data } = await drive.files.create({
    requestBody: {
      name: safeName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
    },
    fields: "id, name, webViewLink",
    supportsAllDrives,
  });

  if (!data.id) {
    throw new Error("No se pudo crear la carpeta del caso en Google Drive");
  }

  return data;
}

async function uploadFile(
  drive: drive_v3.Drive,
  file: File,
  folderId: string,
  supportsAllDrives: boolean,
  desiredName?: string,
): Promise<{ id?: string | null; name?: string | null; webViewLink?: string | null }> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = desiredName || file.name || `documento-${Date.now()}`;
  const stream = Readable.from(buffer);

  const response = await drive.files.create({
    requestBody: {
      name,
      parents: [folderId],
    },
    media: {
      mimeType: file.type || "application/octet-stream",
      body: stream,
    },
    fields: "id, name, webViewLink",
    supportsAllDrives,
  });

  return response.data;
}

async function sendNotificationEmail(payload: {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  uploads: { name?: string | null; webViewLink?: string | null }[];
  folderLink?: string | null;
}) {
  if (!resendClient || !process.env.NOTIFICATIONS_FROM_EMAIL || !process.env.CONTACT_NOTIFICATION_EMAIL) {
    console.warn("Resend deshabilitado", {
      hasClient: Boolean(resendClient),
      from: process.env.NOTIFICATIONS_FROM_EMAIL,
      to: process.env.CONTACT_NOTIFICATION_EMAIL,
    });
    return;
  }

  const to = process.env.CONTACT_NOTIFICATION_EMAIL.split(",").map((email) => email.trim()).filter(Boolean);
  if (!to.length) {
    return;
  }

  const lines = [
    `Nombre: ${payload.name || "No proporcionado"}`,
    `Correo: ${payload.email || "No proporcionado"}`,
    `Teléfono: ${payload.phone || "No proporcionado"}`,
    `Tipo de asunto: ${payload.topic || "No especificado"}`,
    "",
    "Descripción:",
    payload.message || "Sin mensaje",
    "",
    `Carpeta en Drive: ${payload.folderLink || "(sin enlace)"}`,
    "",
    "Documentos:",
    payload.uploads.length
      ? payload.uploads.map((file, index) => `  ${index + 1}. ${file.name || "Archivo"} — ${file.webViewLink || "sin enlace"}`).join("\n")
      : "  No se adjuntaron archivos.",
  ];

  try {
    await resendClient.emails.send({
      from: process.env.NOTIFICATIONS_FROM_EMAIL,
      to,
      subject: `Nuevo caso recibido: ${payload.name || "Contacto sin nombre"}`,
      text: lines.join("\n"),
    });
  } catch (error) {
    console.error("No se pudo enviar el correo de notificación", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const drive = getDriveClient();
    const formData = await request.formData();

    const name = formData.get("name")?.toString().trim() ?? "";
    const email = formData.get("email")?.toString().trim() ?? "";
    const phone = formData.get("phone")?.toString().trim() ?? "";
    const topic = formData.get("topic")?.toString().trim() ?? "Otro";
    const message = formData.get("message")?.toString().trim() ?? "";

    const attachments = formData
      .getAll("attachments")
      .filter((value): value is File => value instanceof File && value.size > 0);

    const supportsAllDrives = Boolean(process.env.GOOGLE_DRIVE_TEAM_DRIVE_ID);

    const now = new Date();
    const isoDate = now.toISOString().split("T")[0];
    const folderLabel = `${now.toISOString().replace(/[:.]/g, "-")} - ${name || "Cliente"}`;
    const caseFolder = await ensureCaseFolder(drive, folderLabel, supportsAllDrives);

    const uploads = await Promise.all(
      attachments.map((file, index) =>
        uploadFile(
          drive,
          file,
          caseFolder.id!,
          supportsAllDrives,
          buildDocumentName({ isoDate, clientName: name, index, originalName: file.name }),
        ),
      ),
    );

    await sendNotificationEmail({
      name,
      email,
      phone,
      topic,
      message,
      uploads,
      folderLink: caseFolder.webViewLink ?? (caseFolder.id ? `https://drive.google.com/drive/folders/${caseFolder.id}` : null),
    });

    return NextResponse.json(
      {
        ok: true,
        folderId: caseFolder.id,
        folderLink: caseFolder.webViewLink,
        uploaded: uploads,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error al procesar el formulario", error);

    const message =
      error instanceof Error ? error.message : "No pudimos subir tus documentos. Por favor, inténtalo de nuevo más tarde.";

    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
