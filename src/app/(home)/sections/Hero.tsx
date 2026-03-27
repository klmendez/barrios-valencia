"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  
  return (
    <section data-hero className="relative -mt-20 min-h-screen overflow-hidden pt-32 text-[#152A42]">
      {/* Fondo fijo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 sm:hidden">
          <Image
            src="/brand/mobile.jpg"
            alt="Fondo institucional versión móvil"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 hidden sm:block">
          <Image
            src="/brand/juanyluis1.png"
            alt="Fondo institucional"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </div>

      <Container className="relative z-40 flex min-h-[calc(100vh-5rem)] flex-col justify-between gap-4 pb-16 pt-0 max-w-none px-4 sm:gap-6 sm:justify-center sm:pb-12 sm:pt-32 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-none sm:ml-auto sm:max-w-3xl sm:text-right">
          <div className="sm:hidden">
            <p className="max-w-[20ch] text-[22px] font-semibold leading-snug tracking-tight text-[#152A42]">
              Abogados Especialistas en Pensiones y Derecho Laboral
            </p>
          </div>

          <div className="hidden sm:block">
            <h1 className="section-title text-[#152A42]">Abogados especialistas en pensiones</h1>
            <p className="section-subtitle text-[#152A42]/80">Defensa pensional y laboral con estrategia</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-start gap-4 sm:mt-12 sm:justify-end">
          <Button
            asChild
            className="[--btn-bg:#152A42] [--btn-fg:#F5F4F2] [--btn-hover-bg:#0b1726] [--btn-hover-fg:#F5F4F2]"
          >
            <Link href="/consulta-gratuita">Agenda tu consulta gratuita</Link>
          </Button>

          <Button
            asChild
            className="[--btn-bg:#F5F4F2] [--btn-fg:#152A42] [--btn-hover-bg:#152A42] [--btn-hover-fg:#F5F4F2] [--btn-border:#152A42] sm:[--btn-bg:transparent] sm:[--btn-fg:#152A42] sm:[--btn-hover-fg:#F5F4F2]"
          >
            <Link href="/casos-de-exito">Ver casos de éxito</Link>
          </Button>
        </div>

      </Container>
    </section>
  );
}