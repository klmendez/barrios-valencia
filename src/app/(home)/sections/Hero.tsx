"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const slides = [
  { src: "/brand/luis1.png", alt: "Juan - marca Barrios Valencia" },
  {src:"/brand/juan3.png",alt:"Juan-marca Barrios Valencia"},
];

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = slides.length;

  const goToSlide = (index: number) => {
    if (!totalSlides) return;
    const clamped = Math.max(0, Math.min(index, totalSlides - 1));
    setActiveSlide(clamped);
  };

  useEffect(() => {
    if (totalSlides <= 1) return;
    const id = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(id);
  }, [totalSlides]);

  const prevDisabled = activeSlide === 0;
  const nextDisabled = activeSlide === totalSlides - 1;

  return (
    <section data-hero className="relative -mt-20 min-h-screen overflow-hidden bg-[#152A42] pt-32 text-[#F5F4F2]">
      {/* Fondo fijo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 z-0">
          <Image src="/brand/bg.png" alt="Fondo institucional" fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-[#152A42]/85" aria-hidden="true" />
        </div>
        <div
          className="absolute inset-0 z-10 bg-gradient-to-br from-[#152A42]/25 via-[#152A42]/65 to-[#0b1726]/60"
          aria-hidden="true"
        />
        <div className="relative z-20 h-full w-full overflow-hidden" aria-hidden="true">
          <div
            className="flex h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(.4,0,.2,1)]"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {slides.map((s) => (
              <div key={s.src} className="relative h-full w-full flex-none">
                <div className="absolute inset-x-0 bottom-0 top-auto h-[82%] sm:h-[88%]">
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    priority
                    sizes="100vw"
                    className="object-contain object-left-bottom"
                    style={{ objectFit: "contain", objectPosition: "left bottom" }}
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1728]/45 via-transparent to-transparent" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>

      </div>

      <div
        className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-r from-[#f5f4f2]/8 via-[#0f1f33]/25 to-[#050b16]/75"
        aria-hidden="true"
      />

      <Container className="relative z-40 flex min-h-[calc(100vh-5rem)] flex-col justify-center pb-12 max-w-none px-4 sm:px-6 lg:px-10">
        <div className="ml-auto max-w-3xl space-y-6 text-right">
          <h1 className="section-title text-[#F5F4F2]">Abogados especialistas en pensiones</h1>
          <p className="section-subtitle text-[#F5F4F2]/85">Defensa pensional y laboral con estrategia</p>

          <div className="flex flex-wrap justify-end gap-4">
            <Button asChild>
              <Link href="/consulta-gratuita">Agenda tu consulta gratuita</Link>
            </Button>

            <Button asChild>
              <Link href="/casos-de-exito">Ver casos de éxito</Link>
            </Button>
          </div>
        </div>

        {/* Controles abajo (alineados a la derecha) */}
        {slides.length > 1 && (
          <div className="mt-10 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => goToSlide(activeSlide - 1)}
              disabled={prevDisabled}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#152A42]/55 text-[#F5F4F2] ring-1 ring-[#F5F4F2]/20 transition hover:bg-[#152A42]/75 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => goToSlide(activeSlide + 1)}
              disabled={nextDisabled}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#152A42]/55 text-[#F5F4F2] ring-1 ring-[#F5F4F2]/20 transition hover:bg-[#152A42]/75 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Siguiente"
            >
              ›
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}