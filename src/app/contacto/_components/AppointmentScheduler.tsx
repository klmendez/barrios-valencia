"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type SchedulerSlot = {
  id: string;
  time: string;
  channel: string;
};

type SchedulerDay = {
  id: string;
  label: string;
  dateLabel: string;
  fullLabel: string;
  slots: SchedulerSlot[];
};

type OfficeLocation = {
  city: string;
  address: string;
  schedule: string[];
};

const slotTemplates = [
  { time: "8:30 a.m.", channel: "Videollamada" },
  { time: "10:00 a.m.", channel: "Oficina Popayán" },
  { time: "3:00 p.m.", channel: "Llamada telefónica" },
];

function buildSchedulerDays(count = 5): SchedulerDay[] {
  const baseDate = new Date();
  const days: SchedulerDay[] = [];
  let offset = 0;

  while (days.length < count) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + offset);
    offset += 1;

    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue;
    }

    const id = date.toISOString().split("T")[0];
    const weekday = capitalize(
      date.toLocaleDateString("es-CO", { weekday: "short" }),
    );
    const dateLabel = date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
    });
    const fullLabel = capitalize(
      date.toLocaleDateString("es-CO", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    );

    const slots = slotTemplates.map((template, slotIndex) => ({
      ...template,
      id: `${id}-${slotIndex}`,
    }));

    days.push({
      id,
      label: weekday,
      dateLabel,
      fullLabel,
      slots,
    });
  }

  return days;
}

function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

interface AppointmentSchedulerProps {
  whatsappPhone: string;
  officeLocations: OfficeLocation[];
}

export function AppointmentScheduler({
  whatsappPhone,
  officeLocations,
}: AppointmentSchedulerProps) {
  const schedulerDays = useMemo(() => buildSchedulerDays(), []);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(schedulerDays[0]?.id ?? null);
  const selectedDay = schedulerDays.find((day) => day.id === selectedDayId);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const selectedSlot = selectedDay?.slots.find((slot) => slot.id === selectedSlotId) ?? null;

  const bookingMessage = selectedSlot && selectedDay
    ? `Hola, quiero agendar una cita el ${selectedDay.fullLabel} a las ${selectedSlot.time} (${selectedSlot.channel}).`
    : null;

  const mailtoHref = bookingMessage
    ? `mailto:contacto@barriosvalencia.com?subject=${encodeURIComponent("Solicitud de cita")}&body=${encodeURIComponent(bookingMessage)}`
    : undefined;

  const whatsappHref = bookingMessage
    ? `https://api.whatsapp.com/send?phone=${whatsappPhone}&text=${encodeURIComponent(bookingMessage)}`
    : undefined;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">
          Agenda en línea
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#152A42] md:text-4xl">
          Selecciona fecha, horario y canal de atención
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#152A42]/70">
          Agenda citas presenciales en Popayán, videollamadas o llamadas telefónicas. Selecciona un día disponible y luego
          el horario que prefieras.
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#A1805E]">
          Atendemos de lunes a viernes. Sábados y domingos no se programan citas.
        </p>

        <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
          {schedulerDays.map((day) => (
            <button
              key={day.id}
              type="button"
              onClick={() => {
                setSelectedDayId(day.id);
                setSelectedSlotId(null);
              }}
              className={cn(
                "min-w-[130px] rounded-xl border px-4 py-3 text-left transition",
                selectedDayId === day.id
                  ? "border-[#A1805E] bg-[#FFF8F3] text-[#152A42]"
                  : "border-[#152A42]/15 bg-white text-[#152A42]/70 hover:border-[#A1805E]/50",
              )}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A1805E]">
                {day.label}
              </span>
              <p className="text-lg font-semibold text-[#152A42]">{day.dateLabel}</p>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {selectedDay?.slots.map((slot) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => setSelectedSlotId(slot.id)}
              className={cn(
                "rounded-xl border px-4 py-4 text-left text-sm transition",
                selectedSlotId === slot.id
                  ? "border-[#A1805E] bg-[#FFF8F3] text-[#152A42]"
                  : "border-[#152A42]/15 bg-white text-[#152A42]/70 hover:border-[#A1805E]/40",
              )}
            >
              <p className="text-base font-semibold text-[#152A42]">{slot.time}</p>
              <p className="text-sm text-[#152A42]/70">{slot.channel}</p>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-[#152A42]/10 bg-[#F5F4F2] p-4 text-sm text-[#152A42]/80">
          {bookingMessage ? (
            <div>
              <p className="font-semibold text-[#152A42]">Resumen de la cita</p>
              <p className="mt-1">{bookingMessage}</p>
            </div>
          ) : (
            <p>Selecciona un día y un horario disponible para continuar.</p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          {mailtoHref ? (
            <Button asChild className="rounded-none bg-[#152A42] px-6 py-3 text-white hover:bg-[#0F2236]">
              <a href={mailtoHref}>Confirmar por correo</a>
            </Button>
          ) : (
            <Button disabled className="rounded-none bg-[#152A42]/30 px-6 py-3 text-white">
              Selecciona un horario
            </Button>
          )}

          {whatsappHref ? (
            <Button
              asChild
              className="rounded-none border border-[#152A42] bg-transparent px-6 py-3 text-[#152A42] hover:bg-[#152A42] hover:text-white"
            >
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                Confirmar por WhatsApp
              </a>
            </Button>
          ) : (
            <Button disabled className="rounded-none border border-[#152A42]/40 bg-transparent px-6 py-3 text-[#152A42]/60">
              WhatsApp
            </Button>
          )}
        </div>
      </div>

      <aside className="space-y-6 rounded-2xl border border-[#152A42]/10 bg-white p-8 shadow-sm">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">Modalidades</p>
          <ul className="mt-4 space-y-3 text-sm text-[#152A42]/80">
            <li>Presencial en Popayán, videollamada o llamada telefónica.</li>
            <li>Documentos y expedientes digitales para clientes fuera de la ciudad.</li>
            <li>Confirmamos detalles y enviamos recordatorio después de agendar.</li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">Nuestras oficinas</p>
          <div className="mt-4 space-y-4">
            {officeLocations.map((office) => (
              <div key={office.city} className="border-t border-[#152A42]/10 pt-4">
                <p className="text-base font-semibold text-[#152A42]">{office.city}</p>
                <p className="text-sm text-[#152A42]/70">{office.address}</p>
                <ul className="mt-3 space-y-1 text-xs text-[#152A42]/70">
                  {office.schedule.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
