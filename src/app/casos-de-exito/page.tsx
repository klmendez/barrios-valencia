"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const whatsappUrl =
  "https://api.whatsapp.com/send?phone=573005687950&text=Hola%20Barrios%20Valencia%20Abogados,%20necesito%20asesor%C3%ADa.";

const impactNumbers = [
  { value: "17+", label: "Años de experiencia", sub: "Derecho laboral, pensiones y seguridad social" },
  { value: "1000+", label: "Casos estudiados", sub: "Con enfoque jurídico estratégico" },
  { value: "100%", label: "Acompañamiento directo", sub: "En cada etapa del proceso" },
];

type CaseCategory =
  | "Todos"
  | "Pensión de vejez"
  | "Reliquidación"
  | "Pensión de invalidez"
  | "Pensión de sobrevivientes"
  | "Historia laboral"
  | "Problema laboral"
  | "Accidente";

const categories: CaseCategory[] = [
  "Todos",
  "Pensión de vejez",
  "Reliquidación",
  "Pensión de invalidez",
  "Pensión de sobrevivientes",
  "Historia laboral",
  "Problema laboral",
  "Accidente",
];

const cases = [
  {
    category: "Pensión de vejez" as CaseCategory,
    situation: "Cliente con 1.300 semanas cotizadas a quien Colpensiones negó la pensión por inconsistencias en su historia laboral.",
    result: "Pensión reconocida con retroactivo de 18 meses",
    time: "7 meses",
    city: "Popayán",
  },
  {
    category: "Pensión de invalidez" as CaseCategory,
    situation: "Trabajador con enfermedad degenerativa al que le asignaron una fecha de estructuración anterior a sus últimas semanas cotizadas.",
    result: "Pensión de invalidez reconocida con fecha de estructuración corregida",
    time: "5 meses",
    city: "Bogotá",
  },
  {
    category: "Pensión de sobrevivientes" as CaseCategory,
    situation: "Cónyuge a quien la entidad negó la pensión de sobrevivientes por no acreditar convivencia suficiente.",
    result: "Pensión reconocida tras proceso judicial con pruebas de convivencia",
    time: "9 meses",
    city: "Cali",
  },
  {
    category: "Historia laboral" as CaseCategory,
    situation: "Afiliado con 14 años de aportes en el sector público que no habían sido trasladados al sistema de prima media.",
    result: "260 semanas recuperadas, pensión habilitada",
    time: "4 meses",
    city: "Popayán",
  },
  {
    category: "Problema laboral" as CaseCategory,
    situation: "Trabajador despedido sin justa causa después de 11 años en la empresa, sin liquidación correcta.",
    result: "Indemnización completa + liquidación reliquidada + intereses",
    time: "6 meses",
    city: "Medellín",
  },
  {
    category: "Pensión de vejez" as CaseCategory,
    situation: "Mujer beneficiaria del régimen de transición a quien el fondo privado intentó negar el traslado a Colpensiones.",
    result: "Traslado forzado y pensión liquidada bajo el régimen de transición",
    time: "8 meses",
    city: "Popayán",
  },
  {
    category: "Accidente" as CaseCategory,
    situation: "Trabajador con accidente de trabajo que la ARL calificó como de origen común para evadir responsabilidades.",
    result: "Origen laboral reconocido, prestaciones ARL + indemnización",
    time: "5 meses",
    city: "Pasto",
  },
  {
    category: "Pensión de invalidez" as CaseCategory,
    situation: "Persona con diagnóstico de enfermedad mental a quien le negaron la pensión por no cumplir semanas según la entidad.",
    result: "Amparo de tutela, pensión reconocida en 3 semanas",
    time: "3 semanas",
    city: "Bogotá",
  },
  {
    category: "Historia laboral" as CaseCategory,
    situation: "Empleado cuyo empleador cotizó incorrectamente durante 6 años, reduciendo artificialmente sus semanas registradas.",
    result: "Semanas corregidas, solicitud de pensión radicada exitosamente",
    time: "3 meses",
    city: "Popayán",
  },
  {
    category: "Pensión de sobrevivientes" as CaseCategory,
    situation: "Hijos mayores con discapacidad que no habían sido reconocidos como beneficiarios de la pensión del padre fallecido.",
    result: "Reconocimiento como beneficiarios, mesadas retroactivas pagadas",
    time: "6 meses",
    city: "Cali",
  },
  {
    category: "Problema laboral" as CaseCategory,
    situation: "Docente afectado por proceso disciplinario que buscaba terminar con su vinculación sin garantías de defensa.",
    result: "Proceso archivado, docente continúa en su cargo",
    time: "4 meses",
    city: "Popayán",
  },
  {
    category: "Reliquidación" as CaseCategory,
    situation: "Afiliado que no alcanzó las semanas para pensionarse y recibió de Colpensiones una devolución de saldos por lo aportado, pero el valor liquidado no incluía correctamente los rendimientos ni todos los periodos cotizados.",
    result: "Devolución reliquidada, diferencia reconocida con intereses",
    time: "4 meses",
    city: "Popayán",
  },
  {
    category: "Reliquidación" as CaseCategory,
    situation: "Pensionado de Colpensiones que recibía una mesada basada en un ingreso base de liquidación que excluía bonificaciones habituales pagadas durante años.",
    result: "Mesada incrementada en un 38%, con retroactivo de 22 meses",
    time: "6 meses",
    city: "Popayán",
  },
  {
    category: "Reliquidación" as CaseCategory,
    situation: "Docente pensionada cuya liquidación excluyó el factor prima de servicios, reduciendo artificialmente su ingreso base ante Colpensiones.",
    result: "Reliquidación aprobada, aumento de mesada más retroactivo de 14 meses",
    time: "5 meses",
    city: "Cali",
  },
  {
    category: "Reliquidación" as CaseCategory,
    situation: "Ex trabajador del sector privado pensionado con un IBL calculado solo sobre salario básico, dejando por fuera horas extras y comisiones permanentes.",
    result: "IBL corregido judicialmente, diferencia pagada con intereses moratorios",
    time: "8 meses",
    city: "Bogotá",
  },
];

export default function CasosDeExitoPage() {
  const [activeCategory, setActiveCategory] = useState<CaseCategory>("Todos");

  const filtered =
    activeCategory === "Todos"
      ? cases
      : cases.filter((c) => c.category === activeCategory);

  return (
    <main className="bg-[#F5F4F2] text-[#152A42]">
      {/* Hero */}
      <section className="relative -mt-20 overflow-hidden bg-[#152A42] pt-28 pb-8 text-center text-[#F5F4F2] md:pt-32 md:pb-10">
        <Container className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#F5F4F2] md:text-4xl">
            Casos de Éxito
          </h1>
          <p className="mt-3 text-base text-[#F5F4F2]/70">
            Resultados reales para personas reales. Todos los casos son anónimos por protección de datos.
          </p>
        </Container>
      </section>

      {/* Números de impacto */}
      <section className="border-b border-[#152A42]/10 bg-white py-10">
        <Container>
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-16">
            {impactNumbers.map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-4xl font-semibold tracking-[-0.03em] text-[#152A42]">
                  {item.value}
                </p>
                <p className="mt-1 text-sm font-medium text-[#152A42]">{item.label}</p>
                <p className="mt-0.5 text-xs text-[#152A42]/45">{item.sub}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonio en video */}
      <section className="bg-white py-14 md:py-20">
        <Container className="max-w-5xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-center lg:gap-16">
            <div className="space-y-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#A1805E]">
                Caso real · Testimonio en video
              </p>
              <h2 className="text-2xl font-semibold leading-snug tracking-[-0.03em] text-[#152A42] md:text-3xl">
                De 75% a 90%: la reliquidación que Colpensiones negó y ganamos en demanda
              </h2>
              <p className="text-sm leading-7 text-[#152A42]/70">
                Reinaldo Muñoz fue pensionado en 1988 bajo la ley 71 con una tasa de reemplazo del 75%, cuando tenía derecho al 90%. Colpensiones negó la reliquidación, argumentando el promedio de los últimos 10 años. Iniciamos una demanda laboral, y tras el proceso judicial logramos primero el 85% y luego el 90% — acompañado de un retroactivo pensional completo.
              </p>
              <div className="grid grid-cols-3 gap-4 border-t border-[#152A42]/10 pt-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A1805E]">Tasa inicial</p>
                  <p className="mt-1.5 text-2xl font-semibold text-[#152A42]">75%</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A1805E]">Tasa final</p>
                  <p className="mt-1.5 text-2xl font-semibold text-[#152A42]">90%</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A1805E]">Resultado</p>
                  <p className="mt-1.5 text-sm font-semibold text-[#152A42]">Retroactivo pensional</p>
                </div>
              </div>
              <p className="border-l-2 border-[#A1805E] pl-4 text-xs italic text-[#152A42]/65">
                "Del 75% brinqué al 85% y luego al 90%, quedé pensionado con el 90%." — Reinaldo Muñoz
              </p>
            </div>

            <div className="overflow-hidden border border-[#152A42]/10 bg-[#F5F4F2]">
              <div className="aspect-[4/5] w-full">
                <iframe
                  src="https://www.instagram.com/p/DXITEBGDYJe/embed"
                  className="h-full w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  title="Testimonio Reinaldo Muñoz — Reliquidación pensional Barrios Valencia"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Filtros + Grid + CTA sticky */}
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:flex lg:items-start lg:gap-0 lg:px-8 py-14 md:py-20">

        {/* Izquierda: filtro + cards */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <label htmlFor="categoria" className="text-[11px] font-semibold uppercase text-[#152A42]/50">
              Filtrar por
            </label>
            <select
              id="categoria"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value as CaseCategory)}
              className="border border-[#152A42]/20 bg-white px-4 py-2 text-sm font-medium text-[#152A42] focus:border-[#152A42] focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="mt-8 grid gap-4">
            {filtered.map((c, i) => (
              <article
                key={i}
                className="flex flex-col gap-4 border border-[#152A42]/10 bg-white p-5 md:flex-row md:items-center md:gap-0"
              >
                <div className="flex shrink-0 flex-col gap-1 md:w-48 md:pr-6">
                  <span className="self-start border border-[#152A42]/30 bg-[#152A42]/8 px-2 py-1 text-[10px] font-semibold uppercase text-[#152A42]">
                    {c.category}
                  </span>
                  <span className="text-[11px] text-[#152A42]/40">{c.city} · {c.time}</span>
                </div>
                <p className="flex-1 border-[#152A42]/10 text-sm leading-7 text-[#152A42]/75 md:border-x md:px-6">
                  {c.situation}
                </p>
                <div className="shrink-0 md:w-56 md:pl-6">
                  <p className="text-[10px] font-semibold uppercase text-[#A1805E]">Resultado</p>
                  <p className="mt-1 text-sm font-semibold text-[#152A42]">{c.result}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Derecha: CTA sticky */}
        <aside className="hidden lg:block w-[300px] shrink-0 border-l border-[#152A42]/10">
          <div className="sticky top-24 py-10 pl-10">
            <p className="text-[11px] font-semibold uppercase text-[#A1805E]">
              ¿Tu situación es similar?
            </p>
            <h2 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-[#152A42]">
              Cuéntanos tu caso
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#152A42]/65">
              Revisamos tu situación y te orientamos sobre los pasos concretos a seguir.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button
                asChild
                className="[--btn-bg:#152A42] [--btn-fg:#F5F4F2] [--btn-hover-bg:#0F2236] [--btn-hover-fg:#F5F4F2] [--btn-border:#152A42]"
              >
                <Link href="/consulta-gratuita">Compartir mi caso</Link>
              </Button>
              <Button
                asChild
                className="[--btn-bg:transparent] [--btn-fg:#152A42] [--btn-hover-bg:#152A42] [--btn-hover-fg:#F5F4F2] [--btn-border:#152A42]/30"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {/* CTA mobile (al final) */}
      <section className="border-t border-[#152A42]/10 bg-[#152A42] px-4 py-12 text-center text-[#F5F4F2] sm:px-6 lg:hidden">
        <p className="text-[11px] font-semibold uppercase text-[#A1805E]">¿Tu situación es similar?</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em]">Cuéntanos tu caso</h2>
        <p className="mt-3 text-sm leading-7 text-[#F5F4F2]/70">
          Revisamos tu situación y te orientamos sobre los pasos concretos a seguir.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Button asChild className="[--btn-bg:#A1805E] [--btn-fg:#F5F4F2] [--btn-hover-bg:#8a6a4e] [--btn-hover-fg:#F5F4F2] [--btn-border:#A1805E]">
            <Link href="/consulta-gratuita">Compartir mi caso</Link>
          </Button>
          <Button asChild className="[--btn-bg:transparent] [--btn-fg:#F5F4F2] [--btn-hover-bg:#F5F4F2] [--btn-hover-fg:#152A42] [--btn-border:#F5F4F2]/40">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </Button>
        </div>
      </section>
    </main>
  );
}
