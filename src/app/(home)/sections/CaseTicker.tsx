"use client";

import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";

const CASES = [
  {
    tag: "Reliquidación",
    title: "Mesada ajustada",
    headline: "Aumentamos 28% el ingreso mensual",
    description:
      "Identificamos factores salariales omitidos, depuramos más de 200 semanas y logramos que Colpensiones reliquidara la pensión con el valor correcto.",
    metrics: [
      { label: "Semanas depuradas", value: "+220" },
      { label: "Retroactivo", value: "$84 M" },
      { label: "Tiempo de respuesta", value: "4 meses" },
    ],
    quote: "No sabíamos por qué la mesada era tan baja. Encontraron el error y hoy recibimos lo justo.",
    location: "Medellín",
  },
  {
    tag: "Sobrevivencia",
    title: "Ingreso familiar protegido",
    headline: "Reconocimos pensión para madre e hija",
    description:
      "Estructuramos la reclamación de pensión de sobrevivientes tras la negativa inicial, demostrando dependencia económica y prioridad de beneficiarios.",
    metrics: [
      { label: "Beneficiarios", value: "2" },
      { label: "Mesadas recuperadas", value: "18" },
      { label: "Entidad", value: "Colpensiones" },
    ],
    quote: "Todo iba en contra. Con acompañamiento claro ganamos la pensión que sostenía la casa.",
    location: "Bogotá",
  },
  {
    tag: "Invalidez",
    title: "Dictamen corregido",
    headline: "Subimos la calificación al 57%",
    description:
      "Rebatimos el dictamen médico, presentamos peritajes propios y obtuvimos el porcentaje que abrió la puerta a la pensión de invalidez.",
    metrics: [
      { label: "Calificación inicial", value: "39%" },
      { label: "Calificación final", value: "57%" },
      { label: "Resultado", value: "Pensión vitalicia" },
    ],
    quote: "Pasé de vivir incapacidades interminables a tener un ingreso estable y respaldo real.",
    location: "Cali",
  },
];

const AUTOPLAY_MS = 6500;
const PROGRESS_TICK_MS = 150;

export function CaseTickerSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const activeCase = useMemo(() => CASES[activeIndex], [activeIndex]);

  useEffect(() => {
    if (CASES.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CASES.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (CASES.length <= 1) return;
    setProgress(0);
    const id = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (PROGRESS_TICK_MS / AUTOPLAY_MS) * 100;
        if (next >= 100) {
          clearInterval(id);
          return 100;
        }
        return next;
      });
    }, PROGRESS_TICK_MS);
    return () => clearInterval(id);
  }, [activeIndex]);

  return (
    <section className="bg-[#152A42] py-20 text-[#F5F4F2]">
      <Container className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <div className="space-y-3">
          <h2 className="section-title text-[#F5F4F2]">Casos reales</h2>
          <p className="section-subtitle text-base text-[#A1805E]">
            Historias que se mueven con evidencia y estrategia
          </p>
          <div className="border border-[#F5F4F2]/20" aria-label="Lista de casos destacados">
            {CASES.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={isActive}
                  className={`flex w-full items-center justify-between border-b border-[#F5F4F2]/10 px-4 py-3 text-left text-sm uppercase tracking-[0.16em] transition-colors last:border-b-0 ${
                    isActive ? "bg-[#F5F4F2]/10 text-[#F5F4F2]" : "text-[#F5F4F2]/60 hover:text-[#F5F4F2]"
                  }`}
                >
                  <span>{item.tag}</span>
                  <span className="text-[0.6rem] font-semibold tracking-[0.3em] text-[#A1805E]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border border-[#F5F4F2]/15 bg-[#F5F4F2]/5 p-8">
          <div className="flex flex-col gap-2 text-[0.7rem] uppercase tracking-[0.35em] text-[#F5F4F2]/70">
            <span>{activeCase.location}</span>
            <span>{activeCase.title}</span>
          </div>

          <h3 className="mt-4 font-display text-4xl text-[#F5F4F2]">{activeCase.headline}</h3>
          <p className="mt-4 text-base leading-relaxed text-[#F5F4F2]/85">{activeCase.description}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {activeCase.metrics.map((metric) => (
              <div key={metric.label} className="border border-[#F5F4F2]/15 p-4 text-left">
                <p className="text-[0.6rem] uppercase tracking-[0.3em] text-[#F5F4F2]/60">{metric.label}</p>
                <p className="mt-2 text-2xl font-semibold text-[#F5F4F2]">{metric.value}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 border-l-2 border-[#A1805E] pl-4 text-sm italic text-[#F5F4F2]/85">“{activeCase.quote}”</p>

          <div className="mt-8 h-[2px] w-full bg-[#F5F4F2]/10">
            <div className="h-full bg-[#A1805E] transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </Container>
    </section>
  );
}
