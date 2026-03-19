import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AppointmentScheduler } from "./_components/AppointmentScheduler";
import { ShareCaseForm } from "./_components/ShareCaseForm";

const whatsappPhone = "573005687950";
const whatsappUrl =
  `https://api.whatsapp.com/send?phone=${whatsappPhone}&text=Hola%20Barrios%20Valencia%20Abogados,%20necesito%20asesor%C3%ADa.`;

const contactChannels = [
  {
    label: "Línea directa",
    value: "+57 300 568 7950",
    helper: "Atención inmediata en horario laboral",
    href: "tel:+573005687950",
    cta: "Llamar ahora",
  },
  {
    label: "Correo electrónico",
    value: "contacto@barriosvalencia.com",
    helper: "Respondemos en menos de 24 horas",
    href: "mailto:contacto@barriosvalencia.com",
    cta: "Enviar correo",
  },
  {
    label: "WhatsApp",
    value: "+57 300 568 7950",
    helper: "Chat para resolver dudas y compartir documentos",
    href: whatsappUrl,
    cta: "Abrir WhatsApp",
  },
];

const officeLocations = [
  {
    city: "Popayán",
    address: "Cra. 8 #3-52, Edificio Jurídico, Piso 6",
    schedule: ["Lunes a viernes, 8:00 a.m. - 6:00 p.m.", "Sábados con cita previa"],
  },
  {
    city: "Atención nacional",
    address: "Consultas virtuales por videollamada y teléfono",
    schedule: ["Cobertura en Colombia y para residentes en el exterior", "Expedientes y documentos 100% digitales"],
  },
];

const processSteps = [
  {
    step: "01",
    title: "Diagnóstico inicial",
    description:
      "Recibimos tu información, identificamos riesgos y definimos qué documentos adicionales debemos revisar.",
  },
  {
    step: "02",
    title: "Ruta estratégica",
    description:
      "Establecemos si conviene una reclamación administrativa, una demanda o una actuación preventiva.",
  },
  {
    step: "03",
    title: "Acompañamiento continuo",
    description:
      "Asignamos un abogado responsable y mantenemos comunicación clara sobre el avance del caso.",
  },
];

export const metadata: Metadata = {
  title: "Contacto | Barrios Valencia Abogados",
  description:
    "Agenda una llamada, visita nuestras oficinas en Popayán o escríbenos por WhatsApp para recibir orientación jurídica especializada.",
};

export default function ContactoPage() {
  return (
    <main className="bg-[#F5F4F2] text-[#152A42]">
      {/* HERO */}
      <section className="relative -mt-20 border-b border-[#152A42]/10 bg-gradient-to-br from-[#1F354F] via-[#152A42] to-[#0A1724] pt-32 text-[#F5F4F2] md:pt-36">
        <Container className="py-10 md:py-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A6BCD8]">
                  Agenda fácil
                </p>
                <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.03em] text-white md:text-5xl">
                  Reserva tu consulta en minutos
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/80 md:text-base">
                  Agenda videollamadas, llamadas o una visita en Popayán y comparte tus documentos para empezar de inmediato.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link href="#agendar">Ver disponibilidad</Link>
                </Button>
                <Button asChild>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    Contactar por WhatsApp
                  </a>
                </Button>
              </div>
            </div>

            <aside className="border border-white/40 bg-white/10 p-6 text-white shadow-[0_25px_60px_rgba(0,0,0,0.25)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#A6BCD8]">
                Canales disponibles
              </p>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex justify-between gap-4">
                  <span className="text-white/70">Videollamada</span>
                  <span className="font-semibold text-white">Nacional e internacional</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span className="text-white/70">Oficina Popayán</span>
                  <span className="text-right font-semibold text-white">
                    Cra. 8 #3-52<br />Oficina 103 · Edificio Albarracín Ordoñez
                  </span>
                </li>
                <li className="flex justify-between gap-4">
                  <span className="text-white/70">Llamada telefónica</span>
                  <span className="font-semibold text-white">+57 300 568 7950</span>
                </li>
              </ul>
              <p className="mt-4 text-xs text-white/60">
                Atención de lunes a viernes. Sábados y domingos no se programan citas.
              </p>
            </aside>
          </div>
        </Container>
      </section>

      {/* CANALES */}
      <section className="border-b border-[#152A42]/10 bg-white py-12">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {contactChannels.map((channel) => (
              <article
                key={channel.label}
                className="border border-[#152A42]/10 bg-[#F5F4F2] p-6 shadow-sm transition hover:border-[#A1805E]/60"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#A1805E]">
                  {channel.label}
                </p>
                <p className="mt-3 text-xl font-semibold text-[#152A42]">
                  {channel.value}
                </p>
                <p className="mt-2 text-sm leading-7 text-[#152A42]/70">
                  {channel.helper}
                </p>

                <Button asChild className="mt-6 w-full">
                  <a
                    href={channel.href}
                    target={channel.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                  >
                    {channel.cta}
                  </a>
                </Button>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* AGENDADOR */}
      <section id="agendar" className="bg-white py-16">
        <Container>
          <AppointmentScheduler
            whatsappPhone={whatsappPhone}
            officeLocations={officeLocations}
          />
        </Container>
      </section>

      {/* FORMULARIO PARA ENVIAR DETALLES */}
      <section className="bg-[#F5F4F2] py-16">
        <Container>
          <ShareCaseForm whatsappPhone={whatsappPhone} />
        </Container>
      </section>

      {/* BLOQUE FINAL */}
      <section className="border-t border-[#152A42]/10 bg-white py-16 md:py-18">
        <Container className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">
              Seguimiento real
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#152A42] md:text-4xl">
              Te acompañamos desde el primer contacto hasta la estrategia completa
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-8 text-[#152A42]/75">
              Coordinamos reuniones de diagnóstico, revisamos historia laboral,
              dictámenes médicos o actos administrativos y definimos la ruta
              jurídica más adecuada. Antes de avanzar, te explicamos con claridad
              etapas, alcances y honorarios.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/servicios">Ver servicios</Link>
              </Button>

              <Button asChild>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  Atender por WhatsApp
                </a>
              </Button>
            </div>
          </div>

          <div className="border border-[#152A42]/10 bg-[#F5F4F2] p-8 shadow-sm">
            <ol className="space-y-6">
              {processSteps.map((item) => (
                <li
                  key={item.step}
                  className="flex gap-4 border-t border-[#152A42]/10 pt-5 first:border-t-0 first:pt-0"
                >
                  <span className="text-lg font-semibold text-[#A1805E]">
                    {item.step}
                  </span>
                  <div>
                    <p className="text-base font-semibold text-[#152A42]">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[#152A42]/72">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>
    </main>
  );
}