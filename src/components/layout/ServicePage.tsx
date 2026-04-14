"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import type { PageCopy, PagePath } from "@/data/routes";

const whatsappUrl =
  "https://api.whatsapp.com/send?phone=573005687950&text=Hola%20Barrios%20Valencia%20Abogados,%20quiero%20asesor%C3%ADa.";

export interface SubLink {
  label: string;
  href: string;
  description?: string;
}

interface ServicePageProps {
  path: PagePath;
  copy: PageCopy;
  subLinks?: SubLink[];
}

export function ServicePage({ copy, subLinks }: ServicePageProps) {
  const {
    title,
    subtitle,
    intro,
    recognitionSection,
    ctaLabel = "Agenda tu consulta gratuita",
    ctaHref = "/consulta-gratuita#compartir-caso",
  } = copy;

  return (
    <main className="bg-[#F5F4F2] text-[#152A42]">
      {/* Hero */}
      <section className="relative -mt-20 overflow-hidden bg-[#152A42] pt-28 pb-8 text-center text-[#F5F4F2] md:pt-32 md:pb-10">
        <Container className="max-w-2xl">
          <h1 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-[#F5F4F2] md:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-base leading-7 text-[#F5F4F2]/70">
              {subtitle}
            </p>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              className="[--btn-bg:#A1805E] [--btn-fg:#F5F4F2] [--btn-hover-bg:#8a6a4e] [--btn-hover-fg:#F5F4F2] [--btn-border:#A1805E]"
            >
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
            <Button
              asChild
              className="[--btn-bg:transparent] [--btn-fg:#F5F4F2] [--btn-hover-bg:#F5F4F2] [--btn-hover-fg:#152A42] [--btn-border:#F5F4F2]/40"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                Escribir por WhatsApp
              </a>
            </Button>
          </div>
        </Container>
      </section>

      {/* Intro + recognition items */}
      <section className="py-12 md:py-16">
        <Container className={subLinks && subLinks.length > 0 ? "max-w-5xl" : "max-w-3xl"}>
          <div className={subLinks && subLinks.length > 0 ? "flex flex-col gap-10 md:flex-row md:gap-12" : undefined}>
            {/* Main content */}
            <div className="min-w-0 flex-1 space-y-10">
              {intro && (
                <p className="border-l-2 border-[#A1805E] pl-5 text-lg leading-9 text-[#152A42]/80">
                  {intro}
                </p>
              )}
              {recognitionSection && recognitionSection.items.length > 0 && (
                <div className="space-y-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">
                    {recognitionSection.title ?? "Puede aplicar si"}
                  </p>
                  <div className="space-y-3">
                    {recognitionSection.items.map((item) => (
                      <div
                        key={item.title}
                        className="border border-[#152A42]/10 bg-white p-6"
                      >
                        <h2 className="text-base font-semibold text-[#152A42]">
                          {item.title}
                        </h2>
                        {item.description && (
                          <p className="mt-2 text-sm leading-7 text-[#152A42]/70">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky sidebar */}
            {subLinks && subLinks.length > 0 && (
              <aside className="w-full shrink-0 md:w-64 lg:w-72">
                <div className="sticky top-24 bg-white border border-[#152A42]/10">
                  <div className="border-b border-[#152A42]/10 px-5 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#A1805E]">
                      En esta sección
                    </p>
                  </div>
                  <ul className="divide-y divide-[#152A42]/08">
                    {subLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="group block px-5 py-4 transition hover:bg-[#152A42]/5"
                        >
                          <p className="text-sm font-semibold text-[#152A42] group-hover:text-[#A1805E] transition-colors">
                            {link.label}
                          </p>
                          {link.description && (
                            <p className="mt-1 text-xs leading-5 text-[#152A42]/55">
                              {link.description}
                            </p>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            )}
          </div>
        </Container>
      </section>

      {/* CTA final */}
      <section className="bg-[#152A42] py-14 text-[#F5F4F2] md:py-16">
        <Container className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">
              ¿Es tu caso?
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-[#F5F4F2] md:text-3xl">
              Cuéntanos tu situación
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#F5F4F2]/70">
              Revisamos tu caso y te orientamos sobre los pasos concretos a seguir.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              className="[--btn-bg:#A1805E] [--btn-fg:#F5F4F2] [--btn-hover-bg:#8a6a4e] [--btn-hover-fg:#F5F4F2] [--btn-border:#A1805E]"
            >
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
            <Button
              asChild
              className="[--btn-bg:transparent] [--btn-fg:#F5F4F2] [--btn-hover-bg:#F5F4F2] [--btn-hover-fg:#152A42] [--btn-border:#F5F4F2]/40"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
