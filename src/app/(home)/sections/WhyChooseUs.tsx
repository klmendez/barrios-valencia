"use client";

import { Container } from "@/components/ui/Container";
import { useEffect, useRef, useState } from "react";

const STATS = [
  {
    value: 12,
    suffix: "+",
    title: "años de experiencia",
    description:
      "Trayectoria en derecho laboral, pensiones y seguridad social.",
  },
  {
    value: 300,
    suffix: "+",
    title: "casos estudiados",
    description:
      "Análisis jurídicos realizados con enfoque estratégico.",
  },
  {
    value: 100,
    suffix: "%",
    title: "acompañamiento directo",
    description:
      "Seguimiento claro durante cada etapa del proceso.",
  },
  {
    value: 1,
    suffix: "",
    title: "caso ante la Corte Suprema",
    description:
      "Proceso llevado hasta la Corte Suprema de Justicia.",
  },
];

function CountUp({
  end,
  suffix = "",
  start = false,
}: {
  end: number;
  suffix?: string;
  start?: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTimestamp: number | null = null;
    let frame: number;

    const duration = 1200;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;

      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * end);

      setCount(value);

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    frame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frame);
  }, [start, end]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export function WhyChooseUsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCount(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#F5F4F2] py-20 text-[#152A42]"
    >
      <Container>

        {/* Encabezado horizontal */}
        <div className="flex flex-col gap-6 border-b border-[#152A42]/15 pb-12 lg:flex-row lg:items-end lg:justify-between">

          <h2 className="font-[Montserrat] text-5xl font-semibold tracking-[-0.04em] lg:text-6xl">
            ¿Por qué elegirnos?
          </h2>

          <p className="max-w-xl font-[Montserrat] text-sm text-[#152A42]/70 lg:text-base">
            <span className="block font-semibold uppercase tracking-[0.25em] text-[#A1805E] mb-3">
              Defensa jurídica clara y estratégica
            </span>
            Nuestro trabajo combina experiencia, análisis técnico y acompañamiento cercano para asumir cada caso con seriedad, estructura y criterio jurídico.
          </p>
        </div>

        {/* Estadísticas horizontales */}
        <div className="grid gap-10 pt-14 md:grid-cols-2 lg:grid-cols-4">

          {STATS.map((stat, i) => (
            <div key={i} className="space-y-3">

              <div className="font-[Montserrat] text-5xl font-semibold tracking-[-0.05em]">
                <CountUp
                  end={stat.value}
                  suffix={stat.suffix}
                  start={startCount}
                />
              </div>

              <h3 className="font-[Montserrat] text-lg font-semibold">
                {stat.title}
              </h3>

              <p className="font-[Montserrat] text-sm leading-6 text-[#152A42]/70">
                {stat.description}
              </p>

            </div>
          ))}

        </div>

      </Container>
    </section>
  );
}