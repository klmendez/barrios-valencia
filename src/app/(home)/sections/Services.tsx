"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { serviceSections } from "@/data/nav";

const AUTO_ADVANCE_MS = 5000;

const serviceContentMap: Record<string, { title: string; description: string; image: string }> = {
  "/servicios/quiero-pensionarme": {
    title: "Pensiones",
    description: "Te guiamos para consolidar semanas, proyectar montos y lograr tu pensión sin sorpresas.",
    image: "/images/services/pensiones.jpg",
  },
  "/servicios/me-negaron-la-pension-o-me-pagan-mal": {
    title: "Pensión Negada",
    description: "Impugnamos negaciones y reliquidamos pagos para recuperar lo que te corresponde.",
    image: "/images/services/pension-negada.jpg",
  },
  "/servicios/perdi-capacidad-laboral": {
    title: "Salud",
    description: "Coordinamos dictámenes, recursos y demandas para proteger tu ingreso cuando la salud falla.",
    image: "/images/services/salud.jpg",
  },
  "/servicios/fallecio-un-familiar": {
    title: "Sobrevivencia",
    description: "Acompañamos a tu familia en reclamaciones de pensión de sobrevivientes y retroactivos.",
    image: "/images/services/sobrevivencia.jpg",
  },
  "/servicios/tuve-un-accidente": {
    title: "Accidentes",
    description: "Atendemos accidentes de trabajo, tránsito y riesgos laborales que afectan tu salud o tu pensión. Activamos ARL, pólizas e indemnizaciones.",
    image: "/images/services/accidentes.jpg",
  },
  "/servicios/tengo-un-problema-laboral": {
    title: "Asuntos Laborales",
    description: "Defendemos tus derechos frente a despidos, sanciones y conflictos en el trabajo.",
    image: "/images/services/despido.jpg",
  },
};

type ServiceCard = { label: string; href: string; title: string; description: string; image: string };

const extraServices: ServiceCard[] = [
  {
    label: "Ya recibí una devolución de saldos",
    href: "/servicios/quiero-pensionarme/devolucion-de-saldos",
    title: "Reliquidación de Saldos",
    description: "Si Colpensiones ya te hizo una devolución de saldos, tienes derecho a exigir una reliquidación. En muchos casos el valor devuelto no está correctamente calculado y puedes reclamar la diferencia.",
    image: "/images/services/pension-negada.jpg",
  },
];

export function ServicesSection() {
  const services: ServiceCard[] = useMemo(() => {
    const base = serviceSections.map((section) => {
      const content = serviceContentMap[section.href];
      return {
        label: section.label,
        href: section.href,
        title: content?.title ?? section.label,
        description: content?.description ?? "Te acompañamos con una estrategia jurídica clara y enfocada en tu situación.",
        image: content?.image ?? "/images/services/default.jpg",
      };
    });
    return [...base, ...extraServices];
  }, []);

  const [cursor, setCursor] = useState(0);
  const total = services.length;
  const ACTIVE_POS = 3; // active card sits at index 3 (center of 7)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const orderedServices = useMemo(() => {
    return Array.from({ length: total }, (_, i) => {
      const idx = (cursor - ACTIVE_POS + i + total) % total;
      return { ...services[idx], isActive: i === ACTIVE_POS };
    });
  }, [cursor, services, total]);

  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCursor((prev) => (prev + 1) % total);
    }, AUTO_ADVANCE_MS);
  };

  const stopInterval = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => { entry.isIntersecting ? startInterval() : stopInterval(); },
      { threshold: 0.2 },
    );
    observer.observe(section);
    return () => { observer.disconnect(); stopInterval(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrev = () => { setCursor((prev) => (prev - 1 + total) % total); startInterval(); };
  const handleNext = () => { setCursor((prev) => (prev + 1) % total); startInterval(); };

  return (
    <section ref={sectionRef} className="overflow-hidden bg-[#F5F4F2]">
      {/* Carousel strip — desktop */}
      <div className="relative hidden md:flex h-[320px] bg-[#152A42] px-4 md:px-8 lg:px-12">
        {/* Title overlay */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 pt-5 text-center">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl">Servicios</h2>
        </div>
        {/* Top fade so title is readable over images */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-[#152A42]/80 to-transparent" />
        {orderedServices.map((service) => {
          const { isActive } = service;
          return (
            <Link
              key={`${service.href}-${service.isActive}`}
              href={service.href}
              className="group relative overflow-hidden transition-all duration-500 ease-in-out"
              style={{ flex: isActive ? "5 0 0%" : "1 0 0%" }}
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(min-width: 768px) 30vw, 100vw"
              />
              {/* Gradient / overlay */}
              {isActive ? (
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              ) : (
                <div className="absolute inset-0 bg-[#152A42]/90" />
              )}

              {/* Overlay content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                {isActive ? (
                  <>
                    <span className="inline-block bg-[#152A42] px-2 py-1 text-xs font-semibold uppercase text-white">{service.label}</span>
                    <h3 className="mt-1 text-2xl font-semibold leading-tight text-white">{service.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/75 line-clamp-2">{service.description}</p>
                    <span className="mt-3 inline-flex h-8 w-8 items-center justify-center bg-[#A1805E] text-white text-sm">
                      →
                    </span>
                  </>
                ) : (
                  <span className="inline-block bg-white/10 px-2 py-1 text-xs font-medium text-white/80 leading-snug">
                    {service.label}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Carousel mobile — single card */}
      <div className="md:hidden">
        <Link href={services[cursor].href} className="group relative block h-[220px] overflow-hidden">
          <Image
            src={services[cursor].image}
            alt={services[cursor].title}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-5">
            <p className="text-[10px] font-semibold uppercase text-[#A1805E]">{services[cursor].label}</p>
            <h3 className="mt-1 text-xl font-semibold text-white">{services[cursor].title}</h3>
            <p className="mt-2 text-xs leading-5 text-white/70">{services[cursor].description}</p>
            <span className="mt-3 inline-flex h-8 w-8 items-center justify-center bg-[#A1805E] text-white text-sm">→</span>
          </div>
        </Link>
        <div className="flex items-center justify-between px-4 py-4">
          <button type="button" onClick={handlePrev} aria-label="Anterior" className="flex h-9 w-9 items-center justify-center border border-[#152A42]/20 text-xl text-[#152A42]">‹</button>
          <div className="flex gap-1.5">
            {services.map((_, i) => (
              <button key={i} type="button" onClick={() => { setCursor(i); startInterval(); }} className={`h-1.5 rounded-full transition-all duration-300 ${i === cursor ? "w-5 bg-[#152A42]" : "w-1.5 bg-[#152A42]/25"}`} />
            ))}
          </div>
          <button type="button" onClick={handleNext} aria-label="Siguiente" className="flex h-9 w-9 items-center justify-center border border-[#152A42]/20 text-xl text-[#152A42]">›</button>
        </div>
      </div>

      {/* Dots + Arrows — desktop */}
      <Container>
        <div className="hidden items-center justify-between py-4 md:flex">
          <div className="flex gap-1.5">
            {services.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { setCursor(i); startInterval(); }}
                aria-label={`Ir al servicio ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === cursor ? "w-5 bg-[#152A42]" : "w-1.5 bg-[#152A42]/25"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Anterior"
              className="flex h-9 w-9 items-center justify-center bg-[#152A42] text-xl text-white transition hover:bg-[#0b1726]"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Siguiente"
              className="flex h-9 w-9 items-center justify-center bg-[#152A42] text-xl text-white transition hover:bg-[#0b1726]"
            >
              ›
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}