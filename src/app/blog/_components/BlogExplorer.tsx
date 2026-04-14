"use client";

import { useState } from "react";
import Link from "next/link";
import type { BlogPost, BlogCategory } from "@/data/blog/types";

const whatsappUrl =
  "https://api.whatsapp.com/send?phone=573005687950&text=Hola%20Barrios%20Valencia%20Abogados,%20quiero%20asesor%C3%ADa.";

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderAnswer(answer: string) {
  const blocks = answer.split("\n\n");
  return blocks.map((block, i) => {
    const lines = block.split("\n");
    const isBullet = lines.every((l) => l.startsWith("•") || l === "");
    const isNumbered = lines.some((l) => l.match(/^\d+\.°/));

    if (isBullet && lines.some((l) => l.startsWith("•"))) {
      const items = lines.filter((l) => l.startsWith("•")).map((l) => l.replace(/^•\s*/, ""));
      return (
        <ul key={i} className="mt-4 space-y-2">
          {items.map((item, j) => (
            <li key={j} className="flex gap-3 text-[15px] leading-7 text-[#152A42]/75">
              <span className="mt-[11px] h-[5px] w-[5px] flex-none rounded-full bg-[#A1805E]" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    if (isNumbered) {
      const items = lines.filter((l) => l.match(/^\d+\.°/));
      return (
        <ol key={i} className="mt-4 space-y-3">
          {items.map((item, j) => (
            <li key={j} className="flex gap-3 text-[15px] leading-7 text-[#152A42]/75">
              <span className="flex-none font-semibold text-[#A1805E]">{j + 1}.</span>
              <span>{item.replace(/^\d+\.°\s*/, "")}</span>
            </li>
          ))}
        </ol>
      );
    }

    return (
      <p key={i} className="mt-4 text-[15px] leading-8 text-[#152A42]/75">
        {block}
      </p>
    );
  });
}

type Props = {
  posts: BlogPost[];
  categories: BlogCategory[];
};

export function BlogExplorer({ posts }: Props) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(posts[0] ?? null);
  const [mobileOpen, setMobileOpen] = useState(false);

  function selectPost(post: BlogPost) {
    setSelectedPost(post);
    setMobileOpen(true);
  }

  function ArticleContent({ post }: { post: BlogPost }) {
    return (
      <div className="px-6 py-8 lg:pl-12 lg:pr-16 lg:py-10">
        <h1 className="text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-[#152A42] lg:text-4xl">
          {post.title}
        </h1>
        <time className="mt-3 block text-[11px] text-[#152A42]/45" dateTime={post.publishedAt}>
          {formatDate(post.publishedAt)}
        </time>
        <p className="mt-5 border-l-2 border-[#A1805E] pl-4 text-base leading-8 text-[#152A42]/70">
          {post.description}
        </p>
        <div className="mt-10 space-y-9">
          {post.sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-[#152A42] lg:text-xl">
                {section.question}
              </h2>
              <div>{renderAnswer(section.answer)}</div>
            </div>
          ))}
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-[#152A42]/10 pt-6">
            {post.tags.map((tag) => (
              <span key={tag} className="border border-[#152A42]/15 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-[#152A42]/55">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-10 border border-[#A1805E]/30 bg-[#A1805E]/5 p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">¿Aplica a tu caso?</p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[#152A42]">Cuéntanos tu situación</h3>
          <p className="mt-2 text-sm leading-7 text-[#152A42]/70">
            Cada caso es distinto. Nuestro equipo puede orientarte sobre los pasos concretos a seguir.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/consulta-gratuita" className="inline-flex items-center border border-[#152A42] bg-[#152A42] px-5 py-2.5 text-sm font-semibold text-[#F5F4F2] transition hover:bg-[#0f2236]">
              Consulta gratuita
            </Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center border border-[#152A42]/30 px-5 py-2.5 text-sm font-semibold text-[#152A42] transition hover:border-[#152A42]">
              WhatsApp
            </a>
          </div>
        </div>
        {post.relatedServiceHref && (
          <div className="mt-6 flex items-center justify-between border border-[#152A42]/10 bg-white p-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A1805E]">Servicio relacionado</p>
              <p className="mt-0.5 text-sm font-semibold text-[#152A42]">{post.relatedServiceLabel}</p>
            </div>
            <Link href={post.relatedServiceHref} className="flex-none border border-[#152A42]/20 px-4 py-2 text-xs font-semibold text-[#152A42] transition hover:bg-[#152A42] hover:text-[#F5F4F2]">
              Ver servicio →
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#F5F4F2]">
      {/* ── DESKTOP layout (lg+): left list + right reader, both static ── */}
      <div className="hidden lg:flex lg:min-h-[70vh]">
        {/* Left panel */}
        <nav className="mt-8 ml-28 w-[340px] shrink-0 self-start border border-[#152A42]/10 bg-white xl:w-[380px]" aria-label="Lista de artículos">
          <ul className="divide-y divide-[#152A42]/8">
            {posts.map((post) => {
              const isActive = selectedPost?.slug === post.slug;
              return (
                <li key={post.slug}>
                  <button
                    onClick={() => setSelectedPost(post)}
                    className={`group w-full py-4 pl-10 pr-6 text-left transition ${isActive ? "bg-[#152A42]" : "hover:bg-[#152A42]/4"}`}
                  >
                    <h3 className={`text-sm font-medium leading-snug transition ${isActive ? "text-[#F5F4F2]" : "text-[#152A42] group-hover:text-[#A1805E]"}`}>
                      {post.title}
                    </h3>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right reader */}
        <div className="flex-1 overflow-y-auto">
          {selectedPost ? (
            <ArticleContent post={selectedPost} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-[#152A42]/40">Selecciona un artículo para leerlo aquí</p>
            </div>
          )}
        </div>
      </div>

      {/* ── MOBILE layout: article list + drawer ── */}
      <div className="lg:hidden">
        <nav aria-label="Lista de artículos">
          <ul className="divide-y divide-[#152A42]/10 bg-white">
            {posts.map((post) => (
              <li key={post.slug}>
                <button
                  onClick={() => selectPost(post)}
                  className="group w-full px-6 py-4 text-left transition hover:bg-[#152A42]/4"
                >
                  <h3 className="text-sm font-medium leading-snug text-[#152A42] group-hover:text-[#A1805E] transition">
                    {post.title}
                  </h3>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setMobileOpen(false)} />
        )}
        <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-[92vw] overflow-y-auto bg-[#F5F4F2] shadow-2xl transition-transform duration-300 ease-out ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="sticky top-0 z-10 flex items-center border-b border-[#152A42]/10 bg-[#F5F4F2]/95 px-6 py-4 backdrop-blur">
            <button onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm text-[#152A42]/60 transition hover:text-[#152A42]">
              <span>←</span>
              <span>Volver</span>
            </button>
          </div>
          {selectedPost && <ArticleContent post={selectedPost} />}
        </div>
      </div>
    </div>
  );
}
