import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

interface PlaceholderPageProps {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function PlaceholderPage({
  title,
  description,
  ctaLabel = "Agenda una consulta",
  ctaHref = "/consulta-gratuita",
}: PlaceholderPageProps) {
  return (
    <section className="relative overflow-hidden bg-[#F5F4F2] py-20 text-[#152A42] md:py-28">
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(21,42,66,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(21,42,66,0.03)_1px,transparent_1px)] bg-[size:48px_48px]"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <div className="grid items-stretch gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">
              Barrios Valencia Abogados
            </p>

            <div className="mt-5 h-px w-24 bg-[#A1805E]" />

            <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-[#152A42] md:text-6xl">
              {title}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#152A42]/75">
              {description}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                asChild
                className="rounded-none bg-[#152A42] px-8 py-3 text-white hover:bg-[#0f2236]"
              >
                <Link href={ctaHref}>{ctaLabel}</Link>
              </Button>

              <Link
                href="/contacto"
                className="inline-flex items-center border-b border-[#A1805E] pb-1 text-sm font-medium uppercase tracking-[0.18em] text-[#152A42] transition hover:text-[#A1805E]"
              >
                Solicitar información
              </Link>
            </div>
          </div>

          <aside className="flex h-full">
            <div className="flex w-full flex-col justify-between border border-[#152A42]/10 bg-white p-8 shadow-[0_20px_50px_rgba(21,42,66,0.08)] rounded-none">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#A1805E]">
                  Atención jurídica
                </p>

                <h2 className="mt-4 text-2xl font-semibold leading-tight text-[#152A42]">
                  Asesoría clara, estratégica y personalizada
                </h2>

                <p className="mt-4 text-sm leading-7 text-[#152A42]/70">
                  Analizamos su caso, definimos la ruta jurídica adecuada y le
                  acompañamos con una atención profesional, cercana y rigurosa.
                </p>
              </div>

              <div className="mt-8 space-y-4 border-t border-[#152A42]/10 pt-6">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-[#152A42]/70">Consulta inicial</span>
                  <span className="text-sm font-medium text-[#152A42]">Disponible</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-[#152A42]/70">Atención personalizada</span>
                  <span className="text-sm font-medium text-[#152A42]">Sí</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-[#152A42]/70">Acompañamiento</span>
                  <span className="text-sm font-medium text-[#152A42]">Integral</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}