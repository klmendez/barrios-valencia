"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type OfficeLocation = { city: string; address: string; schedule: string[] };

const TIMES = [
  { label: "8:00 a.m.",  hour: 8  },
  { label: "9:00 a.m.",  hour: 9  },
  { label: "10:00 a.m.", hour: 10 },
  { label: "11:00 a.m.", hour: 11 },
  { label: "2:00 p.m.",  hour: 14 },
  { label: "3:00 p.m.",  hour: 15 },
  { label: "4:00 p.m.",  hour: 16 },
  { label: "5:00 p.m.",  hour: 17 },
  { label: "6:00 p.m.",  hour: 18 },
];

const CHANNELS = ["Videollamada", "Oficina Popayán", "Llamada telefónica"];

function capitalize(v: string) { return v ? v.charAt(0).toUpperCase() + v.slice(1) : v; }

function toDateId(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isWeekday(d: Date) { const w = d.getDay(); return w !== 0 && w !== 6; }

function startOfDay(d: Date) {
  const c = new Date(d); c.setHours(0, 0, 0, 0); return c;
}

const DAY_HEADERS = ["L", "M", "X", "J", "V", "S", "D"];

function MiniCalendar({
  selectedDateId,
  onSelect,
}: {
  selectedDateId: string | null;
  onSelect: (id: string) => void;
}) {
  const now = new Date();
  const today = startOfDay(now);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const monthLabel = capitalize(
    new Date(viewYear, viewMonth, 1).toLocaleDateString("es-CO", { month: "long", year: "numeric" })
  );

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const rawDow = new Date(viewYear, viewMonth, 1).getDay();
  const startOffset = rawDow === 0 ? 6 : rawDow - 1;

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d));

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  return (
    <div className="w-full select-none rounded-none border border-[#152A42]/10 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="flex h-8 w-8 items-center justify-center border border-[#152A42]/20 text-lg text-[#152A42] transition hover:bg-[#152A42] hover:text-white"
          aria-label="Mes anterior"
        >‹</button>
        <p className="text-sm font-semibold capitalize text-[#152A42]">{monthLabel}</p>
        <button
          type="button"
          onClick={nextMonth}
          className="flex h-8 w-8 items-center justify-center border border-[#152A42]/20 text-lg text-[#152A42] transition hover:bg-[#152A42] hover:text-white"
          aria-label="Mes siguiente"
        >›</button>
      </div>

      <div className="mb-2 grid grid-cols-7">
        {DAY_HEADERS.map((h, i) => (
          <div
            key={h + i}
            className={cn(
              "py-1 text-center text-[10px] font-bold uppercase tracking-wider",
              i >= 5 ? "text-[#152A42]/20" : "text-[#A1805E]"
            )}
          >
            {h}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((date, idx) => {
          if (!date) return <div key={`blank-${idx}`} />;
          const id = toDateId(date);
          const isSelected = id === selectedDateId;
          const isToday = date.getTime() === today.getTime();
          const allSlotsPast = isToday && now.getHours() >= 18;
          const disabled = !isWeekday(date) || startOfDay(date) < today || allSlotsPast;
          return (
            <button
              key={id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(id)}
              className={cn(
                "mx-auto flex h-8 w-8 items-center justify-center text-sm font-medium transition",
                disabled
                  ? "cursor-not-allowed text-[#152A42]/18"
                  : isSelected
                    ? "bg-[#152A42] text-white"
                    : isToday
                      ? "border border-[#A1805E] text-[#152A42] hover:bg-[#152A42] hover:text-white"
                      : "text-[#152A42] hover:bg-[#152A42]/10"
              )}
              aria-pressed={isSelected}
              aria-label={date.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface AppointmentSchedulerProps {
  whatsappPhone: string;
  officeLocations: OfficeLocation[];
}

export function AppointmentScheduler({
  whatsappPhone,
}: AppointmentSchedulerProps) {
  const [selectedDayId, setSelectedDayId]     = useState<string | null>(null);
  const [selectedTime, setSelectedTime]         = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel]   = useState<string | null>(null);
  const [clientName, setClientName]             = useState("");
  const [clientEmail, setClientEmail]           = useState("");
  const [clientPhone, setClientPhone]           = useState("");
  const [selectedTopic, setSelectedTopic]       = useState("Derecho pensional");
  const [caseMessage, setCaseMessage]           = useState("");
  const [attachedFiles, setAttachedFiles]       = useState<FileList | null>(null);
  const [status, setStatus]                     = useState<"idle" | "sending" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage]       = useState<string | null>(null);

  const now = new Date();
  const isSelectedToday = selectedDayId === toDateId(now);

  const availableTimes = TIMES.filter((t) => {
    if (!isSelectedToday) return true;
    return t.hour > now.getHours() || (t.hour === now.getHours() && 0 > now.getMinutes());
  });

  const selectedDayLabel = selectedDayId
    ? capitalize(new Date(`${selectedDayId}T12:00:00`).toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" }))
    : null;

  const bookingMessage =
    selectedDayId && selectedTime && selectedChannel
      ? `Hola, quiero agendar una cita el ${selectedDayLabel} a las ${selectedTime} mediante ${selectedChannel}.`
      : null;

  const whatsappHref = bookingMessage
    ? `https://api.whatsapp.com/send?phone=${whatsappPhone}&text=${encodeURIComponent(bookingMessage)}`
    : undefined;

  const gcalUrl = (() => {
    if (!selectedDayId || !selectedTime) return undefined;
    const slot = TIMES.find((t) => t.label === selectedTime);
    if (!slot) return undefined;
    const [y, mo, d] = selectedDayId.split("-").map(Number);
    const pad = (n: number) => String(n).padStart(2, "0");
    const startStr = `${y}${pad(mo)}${pad(d)}T${pad(slot.hour)}0000`;
    const endStr   = `${y}${pad(mo)}${pad(d)}T${pad(slot.hour + 1)}0000`;
    const details  = `Cita con ${clientName || "Cliente"} — ${selectedChannel || "Modalidad por definir"}${caseMessage.trim() ? `\n\nSituación: ${caseMessage.trim()}` : ""}`;
    const attendees = `jp@barriosvalencia.com${clientEmail.trim() ? `,${clientEmail.trim()}` : ""}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Cita Barrios Valencia Abogados")}&dates=${startStr}/${endStr}&details=${encodeURIComponent(details)}&location=${encodeURIComponent("Cra. 8 #3-52, Popayán, Cauca")}&add=${encodeURIComponent(attendees)}`;
  })();

  const officeGcalUrl = (() => {
    if (!selectedDayId || !selectedTime || !clientName.trim()) return undefined;
    const slot = TIMES.find((t) => t.label === selectedTime);
    if (!slot) return undefined;
    const [y, mo, d] = selectedDayId.split("-").map(Number);
    const pad = (n: number) => String(n).padStart(2, "0");
    const startStr = `${y}${pad(mo)}${pad(d)}T${pad(slot.hour)}0000`;
    const endStr   = `${y}${pad(mo)}${pad(d)}T${pad(slot.hour + 1)}0000`;
    const details  = `Cita con ${clientName}\nEmail: ${clientEmail}${clientPhone ? `\nTeléfono: ${clientPhone}` : ""}\nTema: ${selectedTopic}${caseMessage.trim() ? `\n\nSituación:\n${caseMessage.trim()}` : ""}`;
    const attendees = clientEmail.trim() ? clientEmail.trim() : "";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Cita: ${clientName}`)}&dates=${startStr}/${endStr}&details=${encodeURIComponent(details)}&location=${encodeURIComponent("Cra. 8 #3-52, Popayán, Cauca")}${attendees ? `&add=${encodeURIComponent(attendees)}` : ""}`;
  })();

  const canSendEmail = Boolean(bookingMessage && clientName.trim() && clientEmail.trim());

  const handleSendEmail = async () => {
    if (!bookingMessage || !canSendEmail) return;
    setStatus("sending");
    setStatusMessage(null);
    const formData = new FormData();
    formData.set("name", clientName.trim());
    formData.set("email", clientEmail.trim());
    formData.set("phone", clientPhone.trim());
    formData.set("topic", selectedTopic || "Agendamiento");
    const emailMessage = `${bookingMessage}${caseMessage.trim() ? `\n\nSituación:\n${caseMessage.trim()}` : ""}${officeGcalUrl ? `\n\n📅 AGREGAR A GOOGLE CALENDAR:\n${officeGcalUrl}` : ""}`;
    formData.set("message", emailMessage);
    if (attachedFiles) Array.from(attachedFiles).forEach((f) => formData.append("attachments", f));
    try {
      const res = await fetch("/api/contacto/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (!res.ok || !result?.ok) throw new Error(result?.message || "No pudimos enviar. Inténtalo de nuevo.");
      setStatus("success");
      setStatusMessage("Recibimos tu solicitud. Te confirmaremos la cita por correo.");
    } catch (err) {
      setStatus("error");
      setStatusMessage(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
    }
  };

  const stepLabel = (n: number, text: string) => (
    <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#152A42]/50">
      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center bg-[#152A42] text-[9px] font-bold text-white">{n}</span>
      {text}
    </p>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A1805E]">Agenda en línea</p>
        <h2 className="mt-3 text-2xl font-semibold leading-snug tracking-[-0.03em] text-[#152A42] sm:text-3xl">
          Agenda tu cita
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#152A42]/55">
          Atención presencial en Popayán, videollamada o llamada. Lunes a viernes, 8 a.m. – 6 p.m.
        </p>

        {/* PASO 1 — FECHA */}
        <div className="mt-6">
          {stepLabel(1, "Selecciona una fecha")}
          <MiniCalendar
            selectedDateId={selectedDayId}
            onSelect={(id) => { setSelectedDayId(id); setSelectedTime(null); setSelectedChannel(null); }}
          />
        </div>

        {/* PASO 2 — HORA */}
        {selectedDayId && (
          <div className="mt-6">
            {stepLabel(2, "Selecciona la hora")}
            {availableTimes.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {availableTimes.map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => { setSelectedTime(t.label); setSelectedChannel(null); }}
                    className={cn(
                      "border py-3 text-center text-sm font-medium transition",
                      selectedTime === t.label
                        ? "border-[#A1805E] bg-[#152A42] text-white"
                        : "border-[#152A42]/15 bg-white text-[#152A42] hover:border-[#A1805E]/40",
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#152A42]/45">No hay horarios disponibles para hoy. Selecciona otro día.</p>
            )}
          </div>
        )}

        {/* PASO 3 — MODALIDAD */}
        {selectedTime && (
          <div className="mt-6">
            {stepLabel(3, "Selecciona la modalidad")}
            <div className="grid gap-2">
              {CHANNELS.map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setSelectedChannel(ch)}
                  className={cn(
                    "border px-4 py-3 text-left text-sm font-medium transition",
                    selectedChannel === ch
                      ? "border-[#A1805E] bg-[#152A42] text-white"
                      : "border-[#152A42]/15 bg-white text-[#152A42] hover:border-[#A1805E]/40",
                  )}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* RESUMEN */}
        <div className="mt-5">
          {bookingMessage ? (
            <div className="border-l-2 border-[#A1805E] bg-[#FFF8F3] px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A1805E]">Cita seleccionada</p>
              <p className="mt-1 text-sm font-medium text-[#152A42]">{bookingMessage}</p>
            </div>
          ) : (
            <p className="text-xs text-[#152A42]/40">
              {!selectedDayId ? "Selecciona una fecha para continuar." : !selectedTime ? "Selecciona un horario." : "Selecciona la modalidad."}
            </p>
          )}
        </div>

        {/* PASO 4 — DATOS */}
        <div className="mt-6 grid gap-4 border border-[#152A42]/10 bg-white p-5 text-sm text-[#152A42]">
          {stepLabel(4, "Cuéntanos con quién podemos confirmar")}
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs font-semibold">
              Nombre
              <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)}
                className="w-full rounded-none border border-[#152A42]/20 px-3 py-2 text-sm text-[#152A42] focus:border-[#A1805E] focus:outline-none" />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold">
              Correo electrónico
              <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)}
                className="w-full rounded-none border border-[#152A42]/20 px-3 py-2 text-sm text-[#152A42] focus:border-[#A1805E] focus:outline-none" />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold md:col-span-2">
              Teléfono o WhatsApp (opcional)
              <input type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)}
                className="w-full rounded-none border border-[#152A42]/20 px-3 py-2 text-sm text-[#152A42] focus:border-[#A1805E] focus:outline-none" />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold md:col-span-2">
              Tipo de asunto
              <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full rounded-none border border-[#152A42]/20 px-3 py-2 text-sm text-[#152A42] focus:border-[#A1805E] focus:outline-none">
                {["Derecho pensional", "Conflicto laboral", "Accidente / incapacidad", "Consulta general"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold md:col-span-2">
              Describe brevemente tu situación (opcional)
              <textarea rows={4} value={caseMessage} onChange={(e) => setCaseMessage(e.target.value)}
                className="w-full resize-none rounded-none border border-[#152A42]/20 px-3 py-2 text-sm text-[#152A42] focus:border-[#A1805E] focus:outline-none" />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold md:col-span-2">
              Adjunta documentos (PDF, JPG, PNG) – opcional
              <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setAttachedFiles(e.target.files)}
                className="mt-1 w-full cursor-pointer border border-dashed border-[#152A42]/30 bg-[#F5F4F2] px-3 py-3 text-xs text-[#152A42]/70" />
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" onClick={handleSendEmail} disabled={!canSendEmail || status === "sending"}
              className="w-full sm:w-auto sm:min-w-[200px] [--btn-bg:#152A42] [--btn-fg:#F5F4F2] [--btn-hover-bg:#0F2236] [--btn-hover-fg:#F5F4F2] [--btn-border:#152A42] disabled:opacity-50">
              {status === "sending" ? "Enviando..." : "Enviar confirmación"}
            </Button>
            {whatsappHref ? (
              <Button asChild className="w-full sm:w-auto [--btn-bg:transparent] [--btn-fg:#152A42] [--btn-hover-bg:#152A42] [--btn-hover-fg:#F5F4F2] [--btn-border:#152A42]">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </Button>
            ) : (
              <Button disabled className="w-full sm:w-auto [--btn-bg:transparent] [--btn-fg:#152A42]/60 [--btn-hover-bg:transparent] [--btn-hover-fg:#152A42]/60 [--btn-border:#152A42]/40 disabled:opacity-100">
                WhatsApp
              </Button>
            )}
            {gcalUrl ? (
              <Button asChild className="w-full sm:w-auto [--btn-bg:transparent] [--btn-fg:#152A42] [--btn-hover-bg:#152A42] [--btn-hover-fg:#F5F4F2] [--btn-border:#152A42]">
                <a href={gcalUrl} target="_blank" rel="noopener noreferrer">+ Google Calendar</a>
              </Button>
            ) : (
              <Button disabled className="w-full sm:w-auto [--btn-bg:transparent] [--btn-fg:#152A42]/60 [--btn-hover-bg:transparent] [--btn-hover-fg:#152A42]/60 [--btn-border:#152A42]/40 disabled:opacity-100">
                + Google Calendar
              </Button>
            )}
          </div>

          {statusMessage ? (
            <p className={`text-xs ${status === "error" ? "text-red-600" : "text-emerald-700"}`} aria-live="polite" role="status">
              {statusMessage}
            </p>
          ) : (
            <p className="text-xs text-[#152A42]/70">Recibirás una copia en tu correo y nuestro equipo te confirmará la cita.</p>
          )}
        </div>
      </div>
    </div>
  );
}
