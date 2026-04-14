import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { allPosts, getPostBySlug } from "@/data/blog";

const whatsappUrl =
  "https://api.whatsapp.com/send?phone=573005687950&text=Hola%20Barrios%20Valencia%20Abogados,%20quiero%20asesor%C3%ADa.";

export async function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seo?.title ?? `${post.title} | Barrios Valencia Abogados`,
    description: post.seo?.description ?? post.description,
  };
}

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderAnswer(answer: string) {
  return answer.split("\n\n").map((block, i) => {
    if (block.startsWith("•")) {
      const items = block
        .split("\n")
        .filter((l) => l.startsWith("•"))
        .map((l) => l.replace(/^•\s*/, ""));
      return (
        <ul key={i} className="mt-4 space-y-2 text-[#152A42]/80">
          {items.map((item, j) => (
            <li key={j} className="flex gap-3 text-base leading-7">
              <span className="mt-[10px] h-[5px] w-[5px] flex-none rounded-full bg-[#A1805E]" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }
    if (block.match(/^\d+\.°/)) {
      const items = block
        .split("\n")
        .filter((l) => l.match(/^\d+\.°/));
      return (
        <ol key={i} className="mt-4 space-y-3 text-[#152A42]/80">
          {items.map((item, j) => (
            <li key={j} className="flex gap-3 text-base leading-7">
              <span className="flex-none text-[#A1805E] font-semibold">{j + 1}.</span>
              <span>{item.replace(/^\d+\.°\s*/, "")}</span>
            </li>
          ))}
        </ol>
      );
    }
    return (
      <p key={i} className="mt-4 text-base leading-8 text-[#152A42]/80">
        {block}
      </p>
    );
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  const other = related.length < 3
    ? [
        ...related,
        ...allPosts
          .filter((p) => p.slug !== post.slug && p.category !== post.category)
          .slice(0, 3 - related.length),
      ]
    : related;

  return (
    <main className="bg-[#F5F4F2] text-[#152A42]">
      {/* Article hero */}
      <section className="relative -mt-20 overflow-hidden border-b border-[#152A42]/10 bg-[#152A42] pt-32 pb-14 text-[#F5F4F2] md:pt-40 md:pb-18">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#F5F4F2 0,#F5F4F2 1px,transparent 1px,transparent 60px),repeating-linear-gradient(90deg,#F5F4F2 0,#F5F4F2 1px,transparent 1px,transparent 60px)",
          }}
          aria-hidden
        />
        <Container className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E] hover:underline"
            >
              Blog
            </Link>
            <span className="text-[#F5F4F2]/30">/</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#F5F4F2]/50">
              {post.category}
            </span>
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-[#F5F4F2] md:text-5xl">
            {post.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-5 text-[11px] text-[#F5F4F2]/55">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span className="h-[3px] w-[3px] rounded-full bg-[#F5F4F2]/30" aria-hidden />
            <span>{post.readTime} min de lectura</span>
          </div>
        </Container>
      </section>

      {/* Body + sidebar */}
      <section className="py-16 md:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1fr_320px] lg:items-start">
          {/* Article body */}
          <article>
            <p className="text-lg leading-8 text-[#152A42]/75 border-l-2 border-[#A1805E] pl-5">
              {post.description}
            </p>

            <div className="mt-12 space-y-10">
              {post.sections.map((section, i) => (
                <div key={i} className="scroll-mt-28" id={`seccion-${i + 1}`}>
                  <h2 className="text-2xl font-semibold leading-snug tracking-[-0.025em] text-[#152A42] md:text-3xl">
                    {section.question}
                  </h2>
                  <div className="mt-1">{renderAnswer(section.answer)}</div>
                </div>
              ))}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2 border-t border-[#152A42]/10 pt-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-[#152A42]/15 bg-white px-3 py-1 text-[11px] font-medium text-[#152A42]/60 uppercase tracking-[0.15em]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* In-article CTA */}
            <div className="mt-12 border border-[#A1805E]/30 bg-[#A1805E]/5 p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">
                ¿Aplica a tu caso?
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-[#152A42]">
                Cuéntanos tu situación
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#152A42]/75">
                Cada caso tiene sus propias particularidades. Nuestro equipo puede revisar tu situación y orientarte sobre los pasos concretos a seguir.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/consulta-gratuita"
                  className="inline-flex items-center border border-[#152A42] bg-[#152A42] px-5 py-2.5 text-sm font-semibold text-[#F5F4F2] transition hover:bg-[#0f2236]"
                >
                  Solicitar consulta gratuita
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center border border-[#152A42]/30 px-5 py-2.5 text-sm font-semibold text-[#152A42] transition hover:border-[#152A42]"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-28">
            {/* Table of contents */}
            <div className="border border-[#152A42]/10 bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">
                En este artículo
              </p>
              <nav className="mt-4">
                <ol className="space-y-2">
                  {post.sections.map((section, i) => (
                    <li key={i}>
                      <a
                        href={`#seccion-${i + 1}`}
                        className="block text-sm leading-6 text-[#152A42]/65 hover:text-[#152A42] transition"
                      >
                        {section.question}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>

            {/* Service CTA */}
            {post.relatedServiceHref && (
              <div className="border border-[#152A42]/10 bg-[#152A42] p-6 text-[#F5F4F2]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">
                  Servicio relacionado
                </p>
                <h3 className="mt-3 text-xl font-semibold">{post.relatedServiceLabel}</h3>
                <p className="mt-3 text-sm leading-6 text-[#F5F4F2]/70">
                  Si este tema aplica a tu situación, te podemos ayudar con asesoría especializada.
                </p>
                <Link
                  href={post.relatedServiceHref}
                  className="mt-5 inline-flex w-full items-center justify-center border border-[#A1805E] bg-[#A1805E] px-4 py-2.5 text-sm font-semibold text-[#F5F4F2] transition hover:bg-[#8a6a4e]"
                >
                  Ver servicio →
                </Link>
              </div>
            )}

            {/* WhatsApp */}
            <div className="border border-[#152A42]/10 bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">
                Consulta directa
              </p>
              <p className="mt-3 text-sm leading-6 text-[#152A42]/70">
                ¿Tienes una pregunta específica? Escríbenos por WhatsApp.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center border border-[#152A42] px-4 py-2.5 text-sm font-semibold text-[#152A42] transition hover:bg-[#152A42] hover:text-[#F5F4F2]"
              >
                Escribir por WhatsApp
              </a>
            </div>
          </aside>
        </Container>
      </section>

      {/* Related articles */}
      {other.length > 0 && (
        <section className="border-t border-[#152A42]/10 bg-white py-16 md:py-20">
          <Container>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">
              Continúa leyendo
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#152A42]">
              Artículos relacionados
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {other.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col border border-[#152A42]/10 bg-[#F5F4F2] p-6 transition hover:border-[#A1805E]/50 hover:shadow-md"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A1805E]">
                    {p.category}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold leading-snug tracking-[-0.02em] text-[#152A42] group-hover:text-[#A1805E] transition">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#152A42]/60 line-clamp-2">{p.description}</p>
                  <span className="mt-4 text-sm font-medium text-[#A1805E] transition group-hover:translate-x-1">
                    Leer →
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Final CTA */}
      <section className="bg-[#152A42] py-16 text-[#F5F4F2] md:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">
                ¿Listo para actuar?
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
                Habla con nuestro equipo
              </h2>
              <p className="mt-4 text-base leading-8 text-[#F5F4F2]/75">
                La información es el primer paso. El segundo es contar con un abogado especializado que revise tu caso en detalle.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/consulta-gratuita"
                className="inline-flex items-center border border-[#A1805E] bg-[#A1805E] px-6 py-3 text-sm font-semibold text-[#F5F4F2] transition hover:bg-[#8a6a4e]"
              >
                Consulta gratuita
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center border border-[#F5F4F2]/30 px-6 py-3 text-sm font-semibold text-[#F5F4F2] transition hover:border-[#F5F4F2]/60"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
