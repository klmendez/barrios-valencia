"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { serviceSections } from "@/data/nav";

const AUTO_ADVANCE_MS = 5000;
const VISIBLE_COUNT = 3;

const serviceContentMap: Record<
  string,
  {
    title: string;
    description: string;
    image: string;
  }
> = {
  "/servicios/quiero-pensionarme": {
    title: "Pensiones",
    description:
      "Te guiamos para consolidar semanas, proyectar montos y lograr tu pensión sin sorpresas.",
    image: "/images/services/pensiones.jpg",
  },
  "/servicios/me-negaron-la-pension-o-me-pagan-mal": {
    title: "Pensión Negada",
    description:
      "Impugnamos negaciones y reliquidamos pagos para recuperar lo que te corresponde.",
    image: "/images/services/pension-negada.jpg",
  },
  "/servicios/perdi-capacidad-laboral": {
    title: "Salud",
    description:
      "Coordinamos dictámenes, recursos y demandas para proteger tu ingreso cuando la salud falla.",
    image: "/images/services/salud.jpg",
  },
  "/servicios/fallecio-un-familiar": {
    title: "Sobrevivencia",
    description:
      "Acompañamos a tu familia en reclamaciones de pensión de sobrevivientes y retroactivos.",
    image: "/images/services/sobrevivencia.jpg",
  },
  "/servicios/tuve-un-accidente": {
    title: "Accidentes",
    description:
      "Activamos ARL, pólizas y procesos contra responsables para cubrir secuelas y gastos.",
    image: "/images/services/accidentes.jpg",
  },
  "/servicios/tengo-un-problema-laboral": {
    title: "Asuntos Laborales",
    description:
      "Defendemos tus derechos frente a despidos, sanciones y conflictos en el trabajo.",
    image: "/images/services/despido.jpg",
  },
};

type ServiceCard = {
  label: string;
  href: string;
  title: string;
  description: string;
  image: string;
};

export function ServicesSection() {
  const services: ServiceCard[] = useMemo(() => {
    return serviceSections.map((section) => {
      const content = serviceContentMap[section.href];

      return {
        label: section.label,
        href: section.href,
        title: content?.title ?? section.label,
        description:
          content?.description ??
          "Te acompañamos con una estrategia jurídica clara, precisa y enfocada en tu situación.",
        image: content?.image ?? "/images/services/default.jpg",
      };
    });
  }, []);

  const [cursor, setCursor] = useState(0);
  const total = services.length;
  const activeIndex = Math.floor(VISIBLE_COUNT / 2);

  const visibleServices = useMemo(() => {
    return Array.from({ length: VISIBLE_COUNT }, (_, idx) => {
      const position = (cursor + idx + total) % total;
      return services[position];
    });
  }, [cursor, services, total]);

  useEffect(() => {
    if (total <= 1) return;

    const interval = setInterval(() => {
      setCursor((prev) => (prev + 1) % total);
    }, AUTO_ADVANCE_MS);

    return () => clearInterval(interval);
  }, [total]);

  const handlePrev = () => {
    setCursor((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCursor((prev) => (prev + 1) % total);
  };

  return (
    <section className="bg-surface py-16 md:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start xl:gap-14">
          <div className="max-w-sm">
            <h2 className="section-title text-navy">Servicios</h2>

            <p className="section-subtitle mt-3 text-base text-[#A1805E]">
              Soluciones jurídicas según tu situación
            </p>

            <p className="section-lead mt-4 text-muted">
              Somos especialistas en pensiones, seguridad social y derecho
              laboral; organizamos los servicios por rutas claras para que
              identifiques rápido el camino jurídico más conveniente.
            </p>

            <Link
              href="/contacto"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] hover:opacity-95"
            >
              Consulta Gratis
            </Link>
          </div>

          <div className="space-y-6">
            <div className="hidden gap-6 md:grid md:grid-cols-3">
              {visibleServices.map((service, index) => {
                const isActive = index === activeIndex;

                return (
                  <Link
                    key={`${service.href}-${index}`}
                    href={service.href}
                    className={`group flex h-full flex-col rounded-[2rem] border border-border bg-white p-6 shadow-sm transition duration-300 ${
                      isActive
                        ? "scale-[1.02] border-gold/30 shadow-lg"
                        : "opacity-80 hover:opacity-100 hover:shadow-md"
                    }`}
                  >
                    <div className="relative mb-6 h-32 w-32 overflow-hidden rounded-full border-2 border-gold/80 sm:h-36 sm:w-36">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-110"
                      />
                    </div>

                    <h3 className="font-display text-2xl text-navy">
                      {service.title}
                    </h3>

                    <p className="mt-3 text-base leading-7 text-muted">
                      {service.description}
                    </p>

                    <span className="mt-4 inline-flex items-center text-sm font-semibold text-gold underline underline-offset-4">
                      Ver más
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="md:hidden">
              <Link
                href={visibleServices[activeIndex]?.href ?? "#"}
                className="group flex flex-col rounded-[2rem] border border-border bg-white p-6 shadow-sm transition duration-300"
              >
                <div className="relative mb-6 h-32 w-32 overflow-hidden rounded-full border-2 border-gold/80">
                  <Image
                    src={visibleServices[activeIndex]?.image ?? "/images/services/default.jpg"}
                    alt={visibleServices[activeIndex]?.title ?? "Servicio"}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>

                <h3 className="font-display text-2xl text-navy">
                  {visibleServices[activeIndex]?.title}
                </h3>

                <p className="mt-3 text-base leading-7 text-muted">
                  {visibleServices[activeIndex]?.description}
                </p>

                <span className="mt-4 inline-flex items-center text-sm font-semibold text-gold underline underline-offset-4">
                  Ver más
                </span>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-3 md:justify-end">
              <button
                type="button"
                onClick={handlePrev}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-navy shadow-sm transition hover:border-gold/50 hover:text-gold"
                aria-label="Anterior"
              >
                ‹
              </button>

              <div className="flex items-center gap-2">
                {services.map((_, index) => {
                  const isCurrent = index === (cursor + activeIndex) % total;

                  return (
                    <span
                      key={index}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isCurrent ? "w-6 bg-gold" : "w-2 bg-border"
                      }`}
                    />
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-navy shadow-sm transition hover:border-gold/50 hover:text-gold"
                aria-label="Siguiente"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}