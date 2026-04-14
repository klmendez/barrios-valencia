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
            src="/brand/juanyluismobile.png"
            alt="Fondo institucional versión móvil"
            fill
            priority
            className="object-cover object-top"
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

      <Container className="relative z-40 flex min-h-[calc(100vh-5rem)] flex-col justify-end gap-4 pb-16 pt-0 max-w-none px-4 sm:gap-6 sm:justify-end sm:pb-24 sm:pt-32 sm:px-6 lg:px-10">
        <div className="flex flex-wrap justify-center gap-4 sm:justify-end">
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