import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { pageCopy } from "@/data/routes";
import { cn } from "@/lib/utils";

const copy = pageCopy["/sobre-nosotros"];

const partners = [
  {
    name: "Luis Hernando Barrios Hernández",
    title: "Socio director | Derecho pensional y litigios estratégicos",
    bio: "Más de 20 años acompañando reclamaciones pensionales complejas, litigios contra fondos públicos y privados y estrategias de reliquidación.",
    email: "lbarrios@barriosvalencia.com",
    featured: true,
  },
  {
    name: "Juan Pablo Valencia Giraldo",
    title: "Socio | Seguridad social, conflictos laborales y asesoría corporativa",
    bio: "Integra la investigación jurídica con la planeación financiera de cada caso y lidera la comunicación con clientes nacionales e internacionales.",
    email: "jvalencia@barriosvalencia.com",
    featured: false,
  },
];

const supportTeam = [
  {
    name: "Juliana Valencia Giraldo",
    role: "Asistente jurídica",
    focus: "Apoya la investigación normativa, prepara borradores y coordina las comunicaciones con entidades administrativas y judiciales.",
    highlighted: true,
  },
];

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

      <section className="bg-[#152A42] py-14 text-[#F5F4F2] md:py-16">
        <Container className="grid gap-6 lg:grid-cols-[220px_1fr] lg:gap-8">
          <div>
            <h2 className="text-5xl leading-none text-[#F5F4F2]/95 md:text-6xl lg:sticky lg:top-24">Socios</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {partners.map((partner) => (
              <article
                key={partner.email}
                className={cn(
                  "flex min-h-[440px] flex-col border border-[#F5F4F2]/8 bg-[#111F33] p-4",
                  partner.featured && "bg-[#F5F4F2] text-[#152A42]",
                )}
              >
                <div className="mb-4 flex h-32 w-24 items-center justify-center bg-[#F5F4F2]/12 text-2xl font-semibold">
                  {partner.name
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")}
                </div>
                <p className={cn("text-[42px] leading-[0.92] tracking-[-0.02em]", partner.featured ? "text-[#152A42]" : "text-[#F5F4F2]")}>{partner.name}</p>
                <p className={cn("mt-3 text-base font-semibold leading-7", partner.featured ? "text-[#152A42]" : "text-[#F5F4F2]")}>{partner.title}</p>
                <p className={cn("mt-2 text-base leading-7", partner.featured ? "text-[#152A42]/90" : "text-[#F5F4F2]/90")}>{partner.bio}</p>
                <a href={`mailto:${partner.email}`} className={cn("mt-3 text-base font-semibold", partner.featured ? "text-[#152A42]" : "text-[#F5F4F2]")}>
                  {partner.email}
                </a>
              </article>
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

      <section className="bg-[#152A42] py-14 text-[#F5F4F2] md:py-16">
        <Container className="grid gap-6 lg:grid-cols-[220px_1fr] lg:gap-8">
          <div>
            <h2 className="text-4xl leading-none text-[#F5F4F2]/95 md:text-5xl lg:sticky lg:top-24">Equipo de apoyo</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {supportTeam.map((member) => (
              <article
                key={member.name}
                className={cn(
                  "flex min-h-[380px] flex-col border border-[#F5F4F2]/8 bg-[#111F33] p-4",
                  member.highlighted && "bg-[#F5F4F2] text-[#152A42]",
                )}
              >
                <div className="mb-4 flex h-32 w-24 items-center justify-center bg-[#F5F4F2]/12 text-2xl font-semibold">
                  {member.name
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")}
                </div>
                <p className={cn("text-4xl leading-[0.95] tracking-[-0.02em]", member.highlighted ? "text-[#152A42]" : "text-[#F5F4F2]")}>{member.name}</p>
                <p className={cn("mt-3 text-base font-semibold", member.highlighted ? "text-[#152A42]" : "text-[#F5F4F2]")}>{member.role}</p>
                <p className={cn("mt-2 text-base leading-7", member.highlighted ? "text-[#152A42]/90" : "text-[#F5F4F2]/90")}>{member.focus}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
