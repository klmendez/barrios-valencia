"use client";

import { FormEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

interface ShareCaseFormProps {
  whatsappPhone: string;
}

const topics = [
  { label: "Derecho pensional", value: "Derecho pensional" },
  { label: "Conflicto laboral", value: "Conflicto laboral" },
  { label: "Accidente / incapacidad", value: "Accidente / incapacidad" },
  { label: "Consulta general", value: "Consulta general" },
];

export function ShareCaseForm({ whatsappPhone }: ShareCaseFormProps) {
  const [selectedTopic, setSelectedTopic] = useState(topics[0].value);
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const whatsappHref = summary.trim()
    ? `https://api.whatsapp.com/send?phone=${whatsappPhone}&text=${encodeURIComponent(summary)}`
    : undefined;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");
    setStatusMessage(null);

    try {
      const response = await fetch("/api/contacto/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result?.ok) {
        throw new Error(result?.message || "No pudimos subir tus documentos. Vuelve a intentarlo.");
      }

      setStatus("success");
      setStatusMessage("Recibimos tu información. Nuestro equipo te contactará muy pronto.");
      form.reset();
      setSelectedTopic(topics[0].value);
      setSummary("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ocurrió un error inesperado.";
      setStatus("error");
      setStatusMessage(message);
    }
  };

  return (
    <div className="border border-[#152A42]/10 bg-white p-8 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">Compartir información</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#152A42] md:text-4xl">
        Envía los detalles de tu caso y adjunta documentos clave
      </h2>
      <p className="mt-3 text-sm leading-7 text-[#152A42]/72">
        Este formulario envía la información directamente a nuestro backend en Next.js. Nosotros autenticamos con Google
        Drive, así que puedes adjuntar archivos sin crear cuentas adicionales. Si prefieres, también puedes reenviar el
        resumen por WhatsApp con un clic.
      </p>

      <form
        className="mt-8 grid gap-4"
        encType="multipart/form-data"
        ref={formRef}
        onChange={(event) => {
          const form = event.currentTarget;
          const formData = new FormData(form);
          const topic = formData.get("topic")?.toString() ?? selectedTopic;
          const name = formData.get("name")?.toString() ?? "";
          const email = formData.get("email")?.toString() ?? "";
          const phone = formData.get("phone")?.toString() ?? "";
          const message = formData.get("message")?.toString() ?? "";
          const files = formData
            .getAll("attachments")
            .filter((value): value is File => value instanceof File && value.size > 0);
          const fileNames = files.length ? files.map((file) => file.name).join(", ") : "Sin adjuntos";
          setSummary(
            `Nombre: ${name}\nCorreo: ${email}\nTeléfono: ${phone || "No especificado"}\nTipo de asunto: ${topic}\n\nMensaje:\n${message}\n\nDocumentos: ${fileNames}`,
          );
        }}
        onSubmit={handleSubmit}
      >
        <label className="flex flex-col text-sm font-medium text-[#152A42]">
          Nombre completo
          <input
            type="text"
            name="name"
            required
            className="mt-2 rounded-none border border-[#152A42]/20 bg-white px-4 py-3 text-sm text-[#152A42] focus:border-[#A1805E] focus:outline-none"
          />
        </label>

        <label className="flex flex-col text-sm font-medium text-[#152A42]">
          Correo electrónico
          <input
            type="email"
            name="email"
            required
            className="mt-2 rounded-none border border-[#152A42]/20 bg-white px-4 py-3 text-sm text-[#152A42] focus:border-[#A1805E] focus:outline-none"
          />
        </label>

        <label className="flex flex-col text-sm font-medium text-[#152A42]">
          Teléfono o WhatsApp
          <input
            type="tel"
            name="phone"
            className="mt-2 rounded-none border border-[#152A42]/20 bg-white px-4 py-3 text-sm text-[#152A42] focus:border-[#A1805E] focus:outline-none"
          />
        </label>

        <label className="flex flex-col text-sm font-medium text-[#152A42]">
          Tipo de asunto
          <select
            name="topic"
            value={selectedTopic}
            onChange={(event) => setSelectedTopic(event.target.value)}
            className="mt-2 rounded-none border border-[#152A42]/20 bg-white px-4 py-3 text-sm text-[#152A42] focus:border-[#A1805E] focus:outline-none"
          >
            {topics.map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col text-sm font-medium text-[#152A42]">
          Describe brevemente tu situación
          <textarea
            name="message"
            rows={5}
            required
            className="mt-2 resize-none rounded-none border border-[#152A42]/20 bg-white px-4 py-3 text-sm text-[#152A42] focus:border-[#A1805E] focus:outline-none"
          />
        </label>

        <label className="flex flex-col text-sm font-medium text-[#152A42]">
          Adjunta documentos (PDF, JPG, PNG)
          <input
            type="file"
            name="attachments"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            className="mt-2 cursor-pointer border border-dashed border-[#152A42]/30 bg-[#F5F4F2] px-4 py-5 text-sm text-[#152A42]/80"
          />
        </label>

        <Button
          type="submit"
          disabled={status === "sending"}
          className="mt-4 rounded-none bg-[#152A42] px-6 py-3 text-white hover:bg-[#0F2236] disabled:opacity-60"
        >
          {status === "sending" ? "Enviando..." : "Enviar documentos"}
        </Button>
      </form>

      {statusMessage ? (
        <p
          className={`mt-4 text-sm ${status === "error" ? "text-red-600" : "text-emerald-700"}`}
          aria-live="polite"
          role="status"
        >
          {statusMessage}
        </p>
      ) : null}

      <p className="mt-6 text-xs text-[#152A42]/65">
        Después del envío recibirás una copia en tu correo. También puedes reenviar el resumen por WhatsApp:
      </p>
      <Button
        disabled={!whatsappHref}
        className="mt-3 rounded-none border border-[#152A42] bg-transparent px-6 py-3 text-[#152A42] hover:bg-[#152A42] hover:text-white disabled:border-[#152A42]/30 disabled:text-[#152A42]/40"
        onClick={() => {
          if (!whatsappHref) return;
          window.open(whatsappHref, "_blank", "noopener,noreferrer");
        }}
      >
        Enviar resumen por WhatsApp
      </Button>

      <p className="mt-3 text-xs text-[#152A42]/50">
        Nota para el administrador: este formulario depende del endpoint interno `/api/contacto/upload`. Asegúrate de tener
        configuradas las variables de entorno de Google Drive y, si quieres correos automáticos, la clave de Resend.
      </p>
    </div>
  );
}
