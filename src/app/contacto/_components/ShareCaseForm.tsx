"use client";

import { FormEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

interface ShareCaseFormProps {
  whatsappPhone: string;
  compact?: boolean;
  hideHeader?: boolean;
}

const topics = [
  { label: "Derecho pensional", value: "Derecho pensional" },
  { label: "Conflicto laboral", value: "Conflicto laboral" },
  { label: "Accidente / incapacidad", value: "Accidente / incapacidad" },
  { label: "Consulta general", value: "Consulta general" },
];

export function ShareCaseForm({ whatsappPhone, compact = false, hideHeader = false }: ShareCaseFormProps) {
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

  const containerClass = compact
    ? "border border-[#152A42]/10 bg-white p-5 shadow-sm"
    : "border border-[#152A42]/10 bg-white p-8 shadow-sm";
  const headingClass = compact
    ? "mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#152A42]"
    : "mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#152A42] md:text-4xl";
  const descriptionClass = compact
    ? "mt-2 text-xs leading-6 text-[#152A42]/75"
    : "mt-3 text-sm leading-7 text-[#152A42]/72";
  const formClass = compact ? "mt-5 grid gap-3" : "mt-8 grid gap-4";
  const labelClass = compact
    ? "flex flex-col text-xs font-medium text-[#152A42]"
    : "flex flex-col text-sm font-medium text-[#152A42]";
  const inputClass = compact
    ? "mt-1.5 w-full rounded-none border border-[#152A42]/20 bg-white px-3 py-2 text-xs text-[#152A42] focus:border-[#A1805E] focus:outline-none"
    : "mt-2 w-full rounded-none border border-[#152A42]/20 bg-white px-4 py-3 text-sm text-[#152A42] focus:border-[#A1805E] focus:outline-none";
  const textareaClass = compact
    ? "mt-1.5 w-full resize-none rounded-none border border-[#152A42]/20 bg-white px-3 py-2 text-xs text-[#152A42] focus:border-[#A1805E] focus:outline-none"
    : "mt-2 w-full resize-none rounded-none border border-[#152A42]/20 bg-white px-4 py-3 text-sm text-[#152A42] focus:border-[#A1805E] focus:outline-none";
  const fileInputClass = compact
    ? "mt-1.5 w-full cursor-pointer border border-dashed border-[#152A42]/30 bg-[#F5F4F2] px-3 py-4 text-xs text-[#152A42]/80"
    : "mt-2 w-full cursor-pointer border border-dashed border-[#152A42]/30 bg-[#F5F4F2] px-4 py-5 text-sm text-[#152A42]/80";
  const submitButtonClass = compact
    ? "mt-3 w-full text-xs [--btn-bg:#152A42] [--btn-fg:#F5F4F2] [--btn-hover-bg:#0F2236] [--btn-hover-fg:#F5F4F2] [--btn-border:#152A42] disabled:opacity-50"
    : "mt-4 w-full [--btn-bg:#152A42] [--btn-fg:#F5F4F2] [--btn-hover-bg:#0F2236] [--btn-hover-fg:#F5F4F2] [--btn-border:#152A42] disabled:opacity-50";
  const helperTextClass = compact ? "mt-4 text-[11px] text-[#152A42]/65" : "mt-6 text-xs text-[#152A42]/65";
  const noteTextClass = compact ? "mt-2 text-[11px] text-[#152A42]/50" : "mt-3 text-xs text-[#152A42]/50";

  return (
    <div className={containerClass}>
      {!hideHeader && (
        <>
          <p className="text-[11px] font-semibold uppercase text-[#A1805E]">Compartir información</p>
          <h2 className={headingClass}>Envía los detalles de tu caso y adjunta documentos clave</h2>
          <p className={descriptionClass}>
            Este formulario envía la información directamente a nuestro EMAIL. Así que
            puedes adjuntar archivos. Si prefieres, también puedes reenviar el resumen por WhatsApp con un
            clic.
          </p>
        </>
      )}

      <form
        className={formClass}
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
        <label className={labelClass}>
          Nombre completo
          <input
            type="text"
            name="name"
            required
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Correo electrónico
          <input
            type="email"
            name="email"
            required
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Teléfono o WhatsApp
          <input
            type="tel"
            name="phone"
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Tipo de asunto
          <select
            name="topic"
            value={selectedTopic}
            onChange={(event) => setSelectedTopic(event.target.value)}
            className={inputClass}
          >
            {topics.map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClass}>
          Describe brevemente tu situación
          <textarea
            name="message"
            rows={5}
            required
            className={textareaClass}
          />
        </label>

        <label className={labelClass}>
          Adjunta documentos (PDF, JPG, PNG)
          <input
            type="file"
            name="attachments"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            className={fileInputClass}
          />
        </label>

        <Button
          type="submit"
          disabled={status === "sending"}
          className={submitButtonClass}
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

      <p className={helperTextClass}>
        Después del envío recibirás una copia en tu correo. También puedes reenviar el resumen por WhatsApp:
      </p>
      <Button
        disabled={!whatsappHref}
        className="mt-3 w-full [--btn-bg:transparent] [--btn-fg:#152A42] [--btn-hover-bg:#152A42] [--btn-hover-fg:#F5F4F2] [--btn-border:#152A42] disabled:[--btn-border:#152A42]/30 disabled:[--btn-fg:#152A42]/40 disabled:opacity-100"
        onClick={() => {
          if (!whatsappHref) return;
          window.open(whatsappHref, "_blank", "noopener,noreferrer");
        }}
      >
        Enviar resumen por WhatsApp
      </Button>

     
    </div>
  );
}
