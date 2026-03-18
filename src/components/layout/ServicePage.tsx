"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { serviceSections } from "@/data/nav";
import type { PageCopy, PagePath } from "@/data/routes";

const DEFAULT_HERO_IMAGES = [
  { src: "/images/services/pensiones.jpg", alt: "Derecho pensional" },
  { src: "/images/services/pension-negada.jpg", alt: "Negación de pensión" },
  { src: "/images/services/sobrevivencia.jpg", alt: "Pensión de sobrevivientes" },
  { src: "/images/services/salud.jpg", alt: "Seguridad social y salud" },
  { src: "/images/services/despido.jpg", alt: "Despido injustificado" },
  { src: "/images/services/accidentes.jpg", alt: "Accidentes laborales" },
];

const SERVICE_HERO_IMAGES: Partial<
  Record<PagePath, { src: string; alt: string }[]>
> = {
  "/servicios/quiero-pensionarme": [
    { src: "/images/services/pensiones.jpg", alt: "Quiero pensionarme" },
  ],
  "/servicios/quiero-pensionarme/pension-de-vejez": [
    { src: "/images/services/pensiones.jpg", alt: "Pensión de vejez" },
  ],
  "/servicios/quiero-pensionarme/pension-anticipada-de-vejez": [
    { src: "/images/services/pensiones.jpg", alt: "Pensión anticipada de vejez" },
  ],
  "/servicios/quiero-pensionarme/pension-anticipada-por-hijo-con-discapacidad": [
    {
      src: "/images/services/pensiones.jpg",
      alt: "Pensión anticipada por hijo con discapacidad",
    },
  ],
  "/servicios/quiero-pensionarme/proyeccion-pensional": [
    { src: "/images/services/pensiones.jpg", alt: "Proyección pensional" },
  ],
  "/servicios/quiero-pensionarme/devolucion-de-saldos": [
    { src: "/images/services/pensiones.jpg", alt: "Devolución de saldos" },
  ],

  "/servicios/me-negaron-la-pension-o-me-pagan-mal": [
    {
      src: "/images/services/pension-negada.jpg",
      alt: "Me negaron la pensión o me pagan mal",
    },
  ],
  "/servicios/me-negaron-la-pension-o-me-pagan-mal/negacion-de-pension": [
    { src: "/images/services/pension-negada.jpg", alt: "Negación de pensión" },
  ],
  "/servicios/me-negaron-la-pension-o-me-pagan-mal/reliquidacion-de-pension": [
    { src: "/images/services/pension-negada.jpg", alt: "Reliquidación de pensión" },
  ],
  "/servicios/me-negaron-la-pension-o-me-pagan-mal/retroactivo-pensional": [
    { src: "/images/services/pension-negada.jpg", alt: "Retroactivo pensional" },
  ],
  "/servicios/me-negaron-la-pension-o-me-pagan-mal/correccion-de-historia-laboral": [
    {
      src: "/images/services/pension-negada.jpg",
      alt: "Corrección de historia laboral",
    },
  ],

  "/servicios/perdi-capacidad-laboral": [
    { src: "/images/services/salud.jpg", alt: "Pérdida de capacidad laboral" },
  ],
  "/servicios/perdi-capacidad-laboral/pension-de-invalidez": [
    { src: "/images/services/salud.jpg", alt: "Pensión de invalidez" },
  ],
  "/servicios/perdi-capacidad-laboral/calificacion-de-perdida-de-capacidad-laboral": [
    {
      src: "/images/services/salud.jpg",
      alt: "Calificación de pérdida de capacidad laboral",
    },
  ],
  "/servicios/perdi-capacidad-laboral/pension-anticipada-por-invalidez": [
    {
      src: "/images/services/salud.jpg",
      alt: "Pensión anticipada por invalidez",
    },
  ],
  "/servicios/perdi-capacidad-laboral/invalidez-para-victimas-de-violencia": [
    {
      src: "/images/services/salud.jpg",
      alt: "Invalidez para víctimas de violencia",
    },
  ],

  "/servicios/fallecio-un-familiar": [
    {
      src: "/images/services/sobrevivencia.jpg",
      alt: "Falleció un familiar",
    },
  ],
  "/servicios/fallecio-un-familiar/pension-de-sobrevivientes": [
    {
      src: "/images/services/sobrevivencia.jpg",
      alt: "Pensión de sobrevivientes",
    },
  ],
  "/servicios/fallecio-un-familiar/pension-familiar": [
    { src: "/images/services/sobrevivencia.jpg", alt: "Pensión familiar" },
  ],

  "/servicios/tuve-un-accidente": [
    { src: "/images/services/accidentes.jpg", alt: "Tuve un accidente" },
  ],
  "/servicios/tuve-un-accidente/accidentes-de-trabajo": [
    { src: "/images/services/accidentes.jpg", alt: "Accidentes de trabajo" },
  ],
  "/servicios/tuve-un-accidente/enfermedades-laborales": [
    { src: "/images/services/accidentes.jpg", alt: "Enfermedades laborales" },
  ],
  "/servicios/tuve-un-accidente/accidentes-de-transito": [
    { src: "/images/services/accidentes.jpg", alt: "Accidentes de tránsito" },
  ],
  "/servicios/tuve-un-accidente/seguros-e-indemnizaciones": [
    { src: "/images/services/accidentes.jpg", alt: "Seguros e indemnizaciones" },
  ],

  "/servicios/tengo-un-problema-laboral": [
    { src: "/images/services/despido.jpg", alt: "Problema laboral" },
  ],
  "/servicios/tengo-un-problema-laboral/despido-injustificado": [
    { src: "/images/services/despido.jpg", alt: "Despido injustificado" },
  ],
  "/servicios/tengo-un-problema-laboral/liquidacion-y-prestaciones-sociales": [
    {
      src: "/images/services/despido.jpg",
      alt: "Liquidación y prestaciones sociales",
    },
  ],
  "/servicios/tengo-un-problema-laboral/procesos-disciplinarios": [
    { src: "/images/services/despido.jpg", alt: "Procesos disciplinarios" },
  ],
  "/servicios/tengo-un-problema-laboral/demandas-laborales": [
    { src: "/images/services/despido.jpg", alt: "Demandas laborales" },
  ],
  "/servicios/tengo-un-problema-laboral/seguridad-y-salud-en-el-trabajo": [
    {
      src: "/images/services/salud.jpg",
      alt: "Seguridad y salud en el trabajo",
    },
  ],

  "/contacto": [
    { src: "/images/services/pensiones.jpg", alt: "Barrios Valencia Abogados" },
    {
      src: "/images/services/pension-negada.jpg",
      alt: "Asesoría pensional y laboral",
    },
    { src: "/images/services/despido.jpg", alt: "Atención jurídica" },
  ],
};

const whatsappUrl =
  "https://api.whatsapp.com/send?phone=573005687950&text=Hola%20Barrios%20Valencia%20Abogados,%20quiero%20asesor%C3%ADa.";

interface ServicePageProps {
  path: PagePath;
  copy: PageCopy;
}

function getRelatedServices(path: PagePath): { label: string; href: string }[] {
  for (const section of serviceSections) {
    if (path === section.href) return section.items;
    const match = section.items.find((item) => item.href === path);
    if (match) return section.items.filter((i) => i.href !== path);
  }
  return [];
}

function HorizontalScroll({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`-mx-4 overflow-x-auto px-4 ${className}`}>
      <div className="flex gap-5 pb-2">{children}</div>
    </div>
  );
}

export function ServicePage({ path, copy }: ServicePageProps) {
  const {
    title,
    subtitle,
    ctaLabel = "Agenda una consulta",
    ctaHref = "/consulta-gratuita",
    secondaryCtaLabel,
    secondaryCtaHref,
    heroImages,
    recognitionSection,
    intro,
    sections,
    faqs,
  } = copy;

  const resolvedHeroImages = useMemo(() => {
    if (heroImages && heroImages.length > 0) return heroImages;
    return SERVICE_HERO_IMAGES[path] ?? DEFAULT_HERO_IMAGES;
  }, [heroImages, path]);

  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = resolvedHeroImages.length;
  const relatedServices = getRelatedServices(path);

  useEffect(() => {
    setActiveSlide(0);
  }, [path, totalSlides]);

  useEffect(() => {
    if (totalSlides <= 1) return;
    const id = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(id);
  }, [totalSlides]);

  return (
    <main className="bg-[#F5F4F2] text-[#152A42]">
      <section className="relative overflow-hidden border-b border-[#152A42]/10 bg-[#152A42] text-[#F5F4F2]">
        <div className="absolute inset-0">
          <div
            className="flex h-full w-full transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {resolvedHeroImages.map((img) => (
              <div
                key={img.src}
                className="relative h-full min-h-[360px] w-full flex-none md:min-h-[420px]"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="100vw"
                  className="object-cover object-center opacity-20"
                  priority={activeSlide === 0}
                />
                <div className="absolute inset-0 bg-[#152A42]/82" aria-hidden />
              </div>
            ))}
          </div>
        </div>

        <Container className="relative z-10 py-14 md:py-16">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">
              Barrios Valencia Abogados
            </p>

            <div className="mt-4 h-px w-24 bg-[#A1805E]" />

            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-[#F5F4F2] md:text-6xl">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[#F5F4F2]/88">
                {subtitle}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                asChild
                className="rounded-none bg-[#A1805E] px-8 py-3 text-[#152A42] hover:bg-[#8e6f50]"
              >
                <Link href={ctaHref}>{ctaLabel}</Link>
              </Button>

              <Button
                asChild
                className="rounded-none border border-[#F5F4F2]/30 bg-transparent px-8 py-3 text-[#F5F4F2] hover:bg-[#F5F4F2]/8"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  Escribir por WhatsApp
                </a>
              </Button>

              {secondaryCtaLabel && secondaryCtaHref && (
                <Button
                  asChild
                  className="rounded-none border border-[#F5F4F2]/30 bg-transparent px-8 py-3 text-[#F5F4F2] hover:bg-[#F5F4F2]/8"
                >
                  <Link href={secondaryCtaHref}>{secondaryCtaLabel}</Link>
                </Button>
              )}
            </div>

            {totalSlides > 1 && (
              <div className="mt-8 flex gap-2">
                {resolvedHeroImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    className={`h-[3px] transition-all ${
                      idx === activeSlide
                        ? "w-10 bg-[#A1805E]"
                        : "w-6 bg-[#F5F4F2]/28 hover:bg-[#F5F4F2]/50"
                    }`}
                    aria-label={`Ir a imagen ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            {intro && (
              <div className="max-w-3xl border-l-2 border-[#A1805E] pl-6">
                <p className="text-lg leading-8 text-[#152A42]/80">{intro}</p>
              </div>
            )}

            {sections && sections.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2">
                {sections.slice(0, 4).map((section) => (
                  <article
                    key={section.title}
                    className="border border-[#152A42]/10 bg-white p-6 shadow-sm"
                  >
                    <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#152A42]">
                      {section.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[#152A42]/75">
                      {section.content}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>

          <aside className="h-fit border border-[#152A42]/10 bg-white p-8 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">
              Siguiente paso
            </p>

            <h3 className="mt-4 text-2xl font-semibold text-[#152A42]">
              Agenda una consulta
            </h3>

            <p className="mt-4 text-sm leading-7 text-[#152A42]/70">
              Recibe orientación jurídica personalizada y define con claridad la
              mejor ruta para tu caso.
            </p>

            <div className="mt-8 space-y-3">
              <Button
                asChild
                className="w-full rounded-none bg-[#152A42] text-white hover:bg-[#0f2236]"
              >
                <Link href={ctaHref}>{ctaLabel}</Link>
              </Button>

              <Button
                asChild
                className="w-full rounded-none border border-[#152A42] bg-transparent text-[#152A42] hover:bg-[#152A42] hover:text-white"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  Escribir por WhatsApp
                </a>
              </Button>
            </div>
          </aside>
        </Container>
      </section>

      {recognitionSection && (
        <section className="border-t border-[#152A42]/10 bg-white py-16 md:py-20">
          <Container>
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">
                Este espacio es para ti si necesitas
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#152A42] md:text-4xl">
                {recognitionSection.title}
              </h2>
              {recognitionSection.intro && (
                <p className="mt-4 text-base leading-8 text-[#152A42]/72">
                  {recognitionSection.intro}
                </p>
              )}
            </div>

            <HorizontalScroll className="mt-10">
              {recognitionSection.items.map((item) => (
                <article
                  key={item.title}
                  className="min-w-[280px] max-w-[280px] border-t-2 border-[#A1805E] bg-[#F5F4F2] p-7 shadow-sm md:min-w-[340px] md:max-w-[340px]"
                >
                  <h3 className="text-xl font-semibold text-[#152A42]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[#152A42]/72">
                    {item.description}
                  </p>
                </article>
              ))}
            </HorizontalScroll>
          </Container>
        </section>
      )}

      {faqs && faqs.length > 0 && (
        <section className="py-16 md:py-20">
          <Container>
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">
                Preguntas frecuentes
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#152A42] md:text-4xl">
                Resolvemos inquietudes comunes sobre este servicio
              </h2>
            </div>

            <div className="mt-10 space-y-4">
              {faqs.map((item) => (
                <details
                  key={item.question}
                  className="border border-[#152A42]/10 bg-white px-6 py-5 shadow-sm"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-left text-base font-medium text-[#152A42]">
                    <span>{item.question}</span>
                    <span className="text-[#A1805E]">+</span>
                  </summary>
                  <p className="mt-4 max-w-4xl text-sm leading-7 text-[#152A42]/72">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </Container>
        </section>
      )}

      {relatedServices.length > 0 && (
        <section className="border-t border-[#152A42]/10 bg-white py-16 md:py-20">
          <Container>
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">
                Servicios relacionados
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#152A42] md:text-4xl">
                Explora otras líneas de servicio que podrían interesarte
              </h2>
            </div>

            <HorizontalScroll className="mt-10">
              {relatedServices.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group min-w-[280px] max-w-[280px] border border-[#152A42]/10 bg-[#F5F4F2] p-6 transition hover:border-[#A1805E]/60 hover:shadow-md md:min-w-[320px] md:max-w-[320px]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-base font-medium text-[#152A42] group-hover:text-[#A1805E]">
                      {item.label}
                    </span>
                    <span className="text-[#A1805E] transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </HorizontalScroll>
          </Container>
        </section>
      )}

      <section className="bg-[#152A42] py-16 text-[#F5F4F2] md:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">
                ¿Listo para avanzar?
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
                Comparte tu situación y recibe orientación jurídica clara
              </h2>
              <p className="mt-4 text-base leading-8 text-[#F5F4F2]/78">
                Estudiaremos tu caso y te indicaremos la mejor forma de ayudarte.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                className="rounded-none bg-[#A1805E] px-8 py-3 text-[#152A42] hover:bg-[#8e6f50]"
              >
                <Link href={ctaHref}>{ctaLabel}</Link>
              </Button>

              <Button
                asChild
                className="rounded-none border border-[#F5F4F2]/30 bg-transparent px-8 py-3 text-[#F5F4F2] hover:bg-[#F5F4F2]/8"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  Escribir por WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}