"use client";

import { useState } from "react";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

/* ================= DATA ================= */

const partners = [
  {
    name: "Luis Hernando Barrios Hernández",
    title: "Socio director | Derecho pensional y litigios estratégicos",
    bio: "Más de 20 años acompañando reclamaciones pensionales complejas.",
    email: "lbarrios@barriosvalencia.com",
    image: "/team/luis.jpg",
    highlights: [
      "Magíster en Derecho - Universidad ICESI",
      "Especialista en Derecho Laboral y Seguridad Social - ICESI",
      "Especialista en Derecho Administrativo - Universidad Libre",
      "Más de 20 años de experiencia y más de 1000 casos atendidos",
      "Ex abogado del Seguro Social y Colpensiones",
      "Conjuez de la Sala Laboral del Tribunal de Popayán",
    ],
  },
  {
    name: "Juan Pablo Valencia Giraldo",
    title: "Socio | Seguridad social y asesoría corporativa",
    bio: "Abogado de la Universidad Cooperativa, cursa especialización en Derecho Laboral y Relaciones Industriales en la Universidad Externado de Colombia.",
    email: "jvalencia@barriosvalencia.com",
    image: "/team/juan1.jpg",
    highlights: [
      "Abogado Universidad Cooperativa de Colombia",
      "Cursando especialización en Derecho Laboral y Relaciones Industriales – Universidad Externado",
      "Consultor senior en planeación financiera",
      "Ponente en derecho laboral comparado",
      "Lidera litigios estratégicos",
    ],
  },
];

const paralegals = [
  {
    name: "Juliana Valencia Giraldo",
    role: "Paralegal",
    focus: "Profesional en Mercadeo y Negocios Internacionales - Universidad Autónoma de Occidente.",
    email: "juliana@barriosvalencia.com",
    image: "/team/juliana.jpg",
    highlights: [
      "Profesional en Mercadeo y Negocios Internacionales - Universidad Autónoma de Occidente",
      "Apoyo en derecho laboral y seguridad social",
      "Gestión ante Colpensiones y UGPP",
      "Vinculada desde 2021",
    ],
  },
];

const supportTeam = [
  {
    name: "Erinson Girón Montenegro",
    role: "Equipo de apoyo | Radicaciones y asesoría",
    focus: "Gestiona radicaciones, asesora personas y canaliza oportunidades con posibles clientes.",
    email: "info@barriosvalencia.com",
    image: "/team/erinson.jpg",
    highlights: [
      "Especialista en atención inicial y acompañamiento de clientes",
      "Coordinación de radicaciones y seguimiento documental",
      "Informes recurrentes a las áreas jurídicas",
    ],
  },
];

/* ================= CARD ================= */

interface TeamCardProps {
  name: string;
  title: string;
  description: string;
  email: string;
  image: string;
  highlights?: string[];
}

function TeamCard({
  name,
  title,
  description,
  email,
  image,
  highlights = [],
}: TeamCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="group w-full">
      <div className="rounded-none border border-[#152A42]/50 bg-[#152A42] text-[#F5F4F2] transition-colors duration-300 group-hover:bg-[#E6ECEF] group-hover:text-[#152A42]">
        <div className="relative min-h-[640px] md:min-h-[600px] md:perspective">
          <div
            className={cn(
              "flex flex-col bg-inherit md:absolute md:inset-0 md:transition-opacity md:duration-500",
              isFlipped ? "hidden" : "flex",
              "md:pointer-events-auto md:opacity-100 md:group-hover:opacity-0 md:group-hover:pointer-events-none",
            )}
            aria-hidden={isFlipped}
          >
            <div className="border-b border-current/20 bg-transparent p-3">
              <div className="relative h-[300px] w-full sm:h-[360px]">
                <Image
                  src={image}
                  alt={name}
                  fill
                  sizes="(min-width: 1024px) 460px, (min-width: 768px) 50vw, 100vw"
                  className="object-contain object-top"
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-5">
              <div>
                <h3 className="text-[24px] font-light leading-snug">{name}</h3>
                <p className="mt-2 text-xs uppercase tracking-[0.08em] text-current/75">
                  {title}
                </p>
              </div>

              <p className="text-[13px] leading-5 text-current/85">{description}</p>

              <div className="mt-auto space-y-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-current/50">
                    Contacto
                  </p>
                  <a
                    href={`mailto:${email}`}
                    className="mt-2 inline-flex items-center gap-2 font-semibold text-current"
                  >
                    <span className="inline-block h-2 w-2 bg-current" aria-hidden="true" />
                    {email}
                  </a>
                </div>

                {highlights.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setIsFlipped(true)}
                    className="inline-flex w-full items-center justify-center border border-current px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-200 hover:bg-current hover:text-[#152A42] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current md:hidden"
                    aria-expanded={isFlipped}
                    aria-label={`Ver trayectoria de ${name}`}
                  >
                    Ver trayectoria
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <div
            className={cn(
              "border-t border-current/15 bg-inherit md:absolute md:inset-0 md:border-t-0 md:transition-opacity md:duration-500",
              isFlipped ? "flex flex-col" : "hidden",
              "md:flex md:pointer-events-none md:opacity-0 md:group-hover:opacity-100 md:group-hover:pointer-events-auto",
            )}
            aria-hidden={!isFlipped}
          >
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div>
                <h3 className="text-[22px] font-light">{name}</h3>
                <p className="mt-1 text-[12px] uppercase tracking-[0.12em] text-current/60">
                  Trayectoria
                </p>
              </div>

              <div className="relative h-[180px] w-full border border-current/15 bg-white/10 p-2">
                <Image
                  src={image}
                  alt={`${name} referencia`}
                  fill
                  className="object-contain object-top"
                  sizes="(min-width: 1024px) 320px, (min-width: 768px) 40vw, 80vw"
                />
              </div>

              <div className="space-y-1.5 text-[14px] leading-[1.4] text-current/85">
                {highlights.map((item, index) => (
                  <div key={`${email}-${index}`} className="flex items-start gap-3">
                    <span className="mt-[7px] h-[5px] w-[5px] bg-current" aria-hidden="true" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-2 border-t border-current/20 pt-2.5">
                <a
                  href={`mailto:${email}`}
                  className="text-sm font-semibold text-current underline underline-offset-4"
                >
                  {email}
                </a>

                <button
                  type="button"
                  onClick={() => setIsFlipped(false)}
                  className="inline-flex w-full items-center justify-center border border-current px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-200 hover:bg-current hover:text-[#152A42] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current md:hidden"
                  aria-expanded={isFlipped}
                  aria-label={`Volver a la tarjeta principal de ${name}`}
                >
                  Volver
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= PAGE ================= */

export default function AboutPage() {
  return (
    <main className={cn(montserrat.className, "bg-[#F5F4F2] text-[#152A42]")}>
      {/* HERO */}
      <section className="border-b border-[#152A42]/10 py-20">
        <Container className="grid items-end gap-10 lg:grid-cols-2">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#152A42]/50">
              Nuestro equipo
            </p>

            <h1 className="mt-4 text-3xl font-light leading-tight tracking-[-0.04em] md:text-5xl">
              Equipo con amplia experiencia en la resolución de asuntos complejos
            </h1>
          </div>

          <div>
            <Image
              src="/brand/b.png"
              alt="Icono de Barrios Valencia"
              width={80}
              height={60}
              className="mb-4"
            />

            <p className="max-w-md text-[14px] leading-7 text-[#152A42]/70">
              Hemos construido un equipo que combina estrategia jurídica,
              rigurosidad técnica y cercanía con el cliente.
            </p>
          </div>
        </Container>
      </section>

      {/* SOCIOS */}
      <section className="bg-[#152A42] py-16 text-[#F5F4F2]">
        <Container className="grid gap-6 lg:grid-cols-[120px_1fr]">
          <h2 className="text-3xl font-light">Socios</h2>

          <div className="flex justify-end">
            <div className="grid w-full max-w-[1000px] gap-6 md:grid-cols-2">
              {partners.map((p) => (
                <TeamCard
                  key={p.email}
                  name={p.name}
                  title={p.title}
                  description={p.bio}
                  email={p.email}
                  image={p.image}
                  highlights={p.highlights}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* PARALEGALES */}
      <section className="bg-[#152A42] py-16 text-[#F5F4F2]">
        <Container className="grid gap-6 lg:grid-cols-[120px_1fr]">
          <h2 className="text-3xl font-light">Paralegales</h2>

          <div className="flex justify-end">
            <div className="w-full max-w-[500px]">
              {paralegals.map((p) => (
                <TeamCard
                  key={p.email}
                  name={p.name}
                  title={p.role}
                  description={p.focus}
                  email={p.email}
                  image={p.image}
                  highlights={p.highlights}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* EQUIPO DE APOYO */}
      <section className="bg-[#152A42] py-16 text-[#F5F4F2]">
        <Container className="grid gap-6 lg:grid-cols-[120px_1fr]">
          <h2 className="text-3xl font-light">Equipo de apoyo</h2>

          <div className="flex justify-end">
            <div className="w-full max-w-[500px]">
              {supportTeam.map((member) => (
                <TeamCard
                  key={member.email}
                  name={member.name}
                  title={member.role}
                  description={member.focus}
                  email={member.email}
                  image={member.image}
                  highlights={member.highlights}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
