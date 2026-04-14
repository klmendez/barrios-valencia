"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
    image: "/images/methodology/documentos1.jpg",
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
    title: "Logramos el resultado",
    headline: "El éxito de su caso es nuestra meta",
    description:
      "Cuando se obtiene la resolución favorable, le explicamos el alcance de la decisión, el reconocimiento de derechos y los pasos para hacer efectivo el resultado: cobro de retroactivos, mesadas, indemnizaciones o la corrección definitiva de su situación.",
    image: "/images/methodology/resultado.jpg",
  },
];

export function SignalMatrixSection() {
  const [index, setIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const active = useMemo(() => PROCESS[index], [index]);

  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % PROCESS.length);
      setProgressKey((prev) => prev + 1);
    }, AUTO_MS);
  };

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startInterval();
        } else {
          stopInterval();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      stopInterval();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (i: number) => {
    setIndex(i);
    setProgressKey((prev) => prev + 1);
    startInterval();
  };

  const goPrev = () => goTo((index - 1 + PROCESS.length) % PROCESS.length);
  const goNext = () => goTo((index + 1) % PROCESS.length);

  return (
    <section ref={sectionRef} className="bg-[#152A42] py-8 text-[#F5F4F2] md:py-12">
      <Container>
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase text-[#A1805E]">
            Así llevamos su caso
          </p>
          <h2 className="mt-2 font-display text-4xl text-[#F5F4F2] sm:text-5xl">
            Metodología
          </h2>
          <p className="mx-auto mt-3 text-sm leading-6 text-[#F5F4F2]/65 md:text-base">
            Un proceso claro para analizar, preparar y gestionar cada caso con orden, estrategia y acompañamiento permanente.
          </p>
        </div>

        {/* Nav desktop */}
        <div className="mt-6 hidden md:block">
          <div className="relative">
            <div className="absolute left-0 right-0 top-5 h-px bg-[#F5F4F2]/10" />
            <div className="relative z-10 flex justify-between">
              {PROCESS.map((item, i) => {
                const isActive = i === index;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => goTo(i)}
                    className="flex max-w-[150px] flex-1 flex-col items-center gap-1.5 text-center"
                  >
                    <span className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-300 ${
                      isActive
                        ? "border-[#A1805E] bg-[#A1805E] text-white shadow-[0_0_0_5px_rgba(161,128,94,0.15)]"
                        : "border-[#F5F4F2]/20 bg-[#152A42] text-[#F5F4F2]/50 hover:border-[#A1805E]/60 hover:text-[#F5F4F2]"
                    }`}>
                      {item.step}
                    </span>
                    <span className={`text-[10px] font-semibold uppercase leading-4 transition-colors ${
                      isActive ? "text-[#A1805E]" : "text-[#F5F4F2]/40"
                    }`}>
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-3 overflow-hidden rounded-full bg-[#F5F4F2]/10">
            <div
              key={progressKey}
              className="h-1 bg-[#A1805E]"
              style={{ animation: `globalProgress ${AUTO_MS}ms linear` }}
            />
          </div>
        </div>

        {/* Nav mobile */}
        <div className="mt-5 md:hidden">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Paso anterior"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#F5F4F2]/20 text-lg text-[#F5F4F2] transition hover:border-[#A1805E] hover:text-[#A1805E]"
            >
              ‹
            </button>
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase text-[#A1805E]">
                Paso {active.step} / {String(PROCESS.length).padStart(2, "0")}
              </p>
              <p className="mt-1 text-sm font-medium text-[#F5F4F2]">{active.title}</p>
            </div>
            <button
              type="button"
              onClick={goNext}
              aria-label="Paso siguiente"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#F5F4F2]/20 text-lg text-[#F5F4F2] transition hover:border-[#A1805E] hover:text-[#A1805E]"
            >
              ›
            </button>
          </div>
          <div className="mt-2 flex justify-center gap-1.5">
            {PROCESS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir al paso ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-[#A1805E]" : "w-1.5 bg-[#F5F4F2]/20"}`}
              />
            ))}
          </div>
          <div className="mt-2 overflow-hidden rounded-full bg-[#F5F4F2]/10">
            <div
              key={progressKey}
              className="h-1 bg-[#A1805E]"
              style={{ animation: `globalProgress ${AUTO_MS}ms linear` }}
            />
          </div>
        </div>

        {/* Content mobile */}
        <div className="mt-4 md:hidden">
          <div className="overflow-hidden">
            <img
              src={active.image}
              alt={active.title}
              className="h-72 w-full object-cover"
            />
          </div>
          <div className="mt-3">
            <p className="text-[10px] font-semibold uppercase text-[#A1805E]">Paso {active.step}</p>
            <h3 className="mt-1 font-display text-2xl leading-tight text-[#F5F4F2]">{active.headline}</h3>
            <p className="mt-2 text-sm leading-6 text-[#F5F4F2]/75">{active.description}</p>
          </div>
        </div>

        {/* Content desktop */}
        <div className="mt-6 hidden md:grid md:grid-cols-[1fr_420px] md:items-center md:gap-8">
          <div>
            <p className="text-xs font-semibold uppercase text-[#A1805E]">Paso {active.step}</p>
            <h3 className="mt-2 font-display text-4xl leading-tight text-[#F5F4F2] xl:text-5xl">
              {active.headline}
            </h3>
            <p className="mt-3 text-base leading-7 text-[#F5F4F2]/75 xl:text-lg">
              {active.description}
            </p>
          </div>
          <div className="relative h-[520px] overflow-hidden shadow-2xl">
            <img
              src={active.image}
              alt={active.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#152A42]/50 via-transparent to-transparent" />
          </div>
        </div>
      </Container>

      <style jsx>{`
        @keyframes globalProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}