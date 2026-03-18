"use client";

import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";

const AUTO_MS = 6000;

const PROCESS = [
  {
    step: "01",
    slug: "escuchamos",
    title: "Escuchamos su caso",
    headline: "Primero entendemos su situación",
    description:
      "Analizamos su caso, revisamos los antecedentes y le orientamos sobre la viabilidad jurídica del proceso antes de iniciar cualquier actuación.",
    image: "/images/methodology/escuchamos1.jpeg",
  },
  {
    step: "02",
    slug: "documentos",
    title: "Definimos los documentos necesarios",
    headline: "Le indicamos exactamente qué debe reunir",
    description:
      "Le explicamos qué documentos son necesarios para su caso: historia laboral, resoluciones, radicados, dictámenes, soportes médicos o administrativos.",
    image: "/images/methodology/documentos1.png",
  },
  {
    step: "03",
    slug: "tramite",
    title: "Preparamos el trámite jurídico",
    headline: "Construimos el proceso correctamente",
    description:
      "Elaboramos poderes, solicitudes, recursos o demandas según corresponda. También organizamos la documentación y orientamos sobre las autenticaciones necesarias.",
    image: "/images/methodology/tramite2.jpeg",
  },
  {
    step: "04",
    slug: "radicacion",
    title: "Radicamos y activamos el proceso",
    headline: "Presentamos la actuación ante la entidad",
    description:
      "Radicamos el trámite ante Colpensiones, fondos, juntas médicas, juzgados o tribunales según el caso, dejando formalmente iniciado el proceso.",
    image: "/images/methodology/colpensiones.jpeg",
  },
  {
    step: "05",
    slug: "seguimiento",
    title: "Hacemos seguimiento constante",
    headline: "Controlamos cada movimiento del expediente",
    description:
      "Supervisamos requerimientos, términos legales, respuestas y actuaciones del proceso para evitar retrasos y asegurar que el caso avance correctamente.",
    image: "/images/methodology/seguimiento.png",
  },
  {
    step: "06",
    slug: "resultado",
    title: "Lo acompañamos hasta el resultado",
    headline: "Le explicamos cada decisión del proceso",
    description:
      "Le mantenemos informado sobre avances, audiencias, decisiones o sentencias y le acompañamos hasta la resolución final de su caso.",
    image: "/images/methodology/resultado.jpg",
  },
];

export function SignalMatrixSection() {
  const [index, setIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  const active = useMemo(() => PROCESS[index], [index]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % PROCESS.length);
      setProgressKey((prev) => prev + 1);
    }, AUTO_MS);

    return () => clearInterval(interval);
  }, []);

  const goTo = (i: number) => {
    setIndex(i);
    setProgressKey((prev) => prev + 1);
  };

  const goPrev = () => {
    setIndex((prev) => (prev - 1 + PROCESS.length) % PROCESS.length);
    setProgressKey((prev) => prev + 1);
  };

  const goNext = () => {
    setIndex((prev) => (prev + 1) % PROCESS.length);
    setProgressKey((prev) => prev + 1);
  };

  return (
    <section className="bg-[#152A42] py-16 text-[#F5F4F2] md:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl text-[#F5F4F2] sm:text-5xl md:text-6xl">
            Metodología
          </h2>

          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A1805E] sm:mt-4 sm:text-sm sm:tracking-[0.28em]">
            Así llevamos su caso paso a paso
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-[#F5F4F2]/80 sm:text-base sm:leading-7 md:mt-6 md:text-lg">
            Nuestro equipo sigue un proceso claro para analizar, preparar y
            gestionar cada caso jurídico con orden, estrategia y acompañamiento
            permanente.
          </p>
        </div>

        <div className="mt-12 md:mt-16">
          <div className="relative hidden md:block">
            <div className="absolute left-0 right-0 top-6 h-px bg-[#F5F4F2]/15" />

            <div className="relative z-10 flex justify-between gap-4">
              {PROCESS.map((item, i) => {
                const isActive = i === index;

                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => goTo(i)}
                    className="flex max-w-[160px] flex-1 flex-col items-center text-center"
                  >
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? "border-[#A1805E] bg-[#A1805E] text-white shadow-[0_0_0_6px_rgba(161,128,94,0.15)]"
                          : "border-[#F5F4F2]/30 bg-[#152A42] text-[#F5F4F2]/70 hover:border-[#A1805E]/70 hover:text-white"
                      }`}
                    >
                      {item.step}
                    </span>

                    <span
                      className={`mt-4 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
                        isActive ? "text-[#A1805E]" : "text-[#F5F4F2]/60"
                      }`}
                    >
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="md:hidden">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={goPrev}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#F5F4F2]/20 bg-white/5 text-lg text-[#F5F4F2] transition hover:border-[#A1805E] hover:text-[#A1805E]"
                aria-label="Paso anterior"
              >
                ‹
              </button>

              <div className="min-w-0 flex-1 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A1805E]">
                  Paso {active.step} / {String(PROCESS.length).padStart(2, "0")}
                </p>
                <p className="mt-2 text-base font-medium text-[#F5F4F2]">
                  {active.title}
                </p>
              </div>

              <button
                type="button"
                onClick={goNext}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#F5F4F2]/20 bg-white/5 text-lg text-[#F5F4F2] transition hover:border-[#A1805E] hover:text-[#A1805E]"
                aria-label="Paso siguiente"
              >
                ›
              </button>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2">
              {PROCESS.map((_, i) => {
                const isActive = i === index;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Ir al paso ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isActive ? "w-6 bg-[#A1805E]" : "w-2 bg-[#F5F4F2]/25"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-full bg-[#F5F4F2]/10 md:mt-8">
            <div
              key={progressKey}
              className="h-1.5 bg-[#A1805E]"
              style={{
                animation: `globalProgress ${AUTO_MS}ms linear`,
              }}
            />
          </div>
        </div>

        {/* MOBILE */}
        <div className="mt-10 md:hidden">
          <div className="grid grid-cols-[minmax(0,1fr)_110px] items-start gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A1805E]">
                Paso {active.step}
              </p>

              <h3 className="mt-3 font-display text-2xl leading-tight text-[#F5F4F2]">
                {active.headline}
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#F5F4F2]/85">
                {active.description}
              </p>
            </div>

            <div className="relative h-[120px] overflow-hidden shadow-xl">
              <img
                src={active.image}
                alt={active.title}
                className="h-full w-full object-cover shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#152A42]/30 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="mt-14 hidden gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#A1805E]">
              Paso {active.step}
            </p>

            <h3 className="mt-4 font-display text-4xl leading-tight text-[#F5F4F2] lg:text-5xl">
              {active.headline}
            </h3>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#F5F4F2]/85 lg:text-lg">
              {active.description}
            </p>
          </div>

          <div className="relative h-[360px] overflow-hidden shadow-2xl">
            <img
              src={active.image}
              alt={active.title}
              className="h-full w-full object-cover shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#152A42]/40 via-transparent to-transparent" />
          </div>
        </div>
      </Container>

      <style jsx>{`
        @keyframes globalProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}