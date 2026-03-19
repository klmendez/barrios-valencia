import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { pageCopy } from "@/data/routes";

const copy = pageCopy["/sobre-nosotros"];

export default function AboutPage() {
  return (
    <main className="bg-[#F5F4F2] text-[#152A42]">
      <section className="relative -mt-20 overflow-hidden border-b border-[#152A42]/10 bg-[#152A42] pt-32 text-[#F5F4F2] md:pt-40">
        <div className="absolute inset-0">
          <Image src="/brand/bg.png" alt="Fondo corporativo" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-[#152A42]/85" />
        </div>
        <Container className="relative z-10 grid gap-10 pb-16 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">Barrios Valencia</p>
            <div className="mt-4 h-px w-24 bg-[#A1805E]" />
            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-[-0.04em] md:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#F5F4F2]/85">{copy.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild>
                <Link href={copy.ctaHref}>{copy.ctaLabel}</Link>
              </Button>
              <Button asChild>
                <Link href={copy.secondaryCtaHref!}>{copy.secondaryCtaLabel}</Link>
              </Button>
            </div>
          </div>
          <div className="space-y-4 border border-[#F5F4F2]/25 bg-[#f5f4f2]/5 p-6 text-sm text-[#F5F4F2]/80">
            {copy.highlights?.map((item) => (
              <p key={item} className="flex items-start gap-3">
                <span className="mt-1 block h-2 w-2 flex-none rounded-full bg-[#A1805E]" />
                <span>{item}</span>
              </p>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-[#152A42]/10 bg-white py-16 md:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div className="border-l-2 border-[#A1805E] pl-6 text-lg leading-8 text-[#152A42]/80">
              {copy.intro}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {copy.sections?.map((section) => (
                <article key={section.title} className="border border-[#152A42]/15 bg-[#FDFBF8] p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A1805E]">{section.title}</p>
                  <p className="mt-3 text-sm leading-7 text-[#152A42]/75">{section.content}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="space-y-6 rounded-3xl border border-[#152A42]/10 bg-[#F5F4F2] p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">
              ¿Por qué elegirnos?
            </p>
            <p className="text-2xl font-semibold leading-tight">{copy.recognitionSection?.title}</p>
            <p className="text-sm leading-7 text-[#152A42]/75">{copy.recognitionSection?.intro}</p>
            <div className="space-y-4">
              {copy.recognitionSection?.items.map((item) => (
                <div key={item.title} className="rounded-2xl border border-[#A1805E]/30 bg-white p-5">
                  <p className="text-base font-semibold text-[#152A42]">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#152A42]/75">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#152A42] py-16 text-[#F5F4F2] md:py-20">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">Nuestro enfoque</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em]">¿Qué diferencia nuestro trabajo?</h2>
            <p className="mt-4 text-base leading-8 text-[#F5F4F2]/80">
              Cada caso recibe investigación rigurosa, revisión documental y una estrategia clara para que los clientes sepan qué haremos
              en cada fase.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {["Investigación jurídica", "Litigio estratégico", "Comunicación clara", "Resultados medibles"].map((item) => (
              <div key={item} className="rounded-2xl border border-[#F5F4F2]/15 bg-white/5 p-5">
                <p className="text-lg font-semibold">{item}</p>
                <p className="mt-2 text-sm text-[#F5F4F2]/75">
                  Diseñamos procesos que combinan análisis técnico, seguimiento constante y reporting transparente.
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
