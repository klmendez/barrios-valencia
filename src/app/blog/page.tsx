import type { Metadata } from "next";
import { allPosts, allCategories } from "@/data/blog";
import { BlogExplorer } from "./_components/BlogExplorer";

export const metadata: Metadata = {
  title: "Blog | Barrios Valencia Abogados",
  description:
    "Guías y conceptos clave sobre pensiones, invalidez, derecho laboral y seguridad social en Colombia. Información clara para tomar mejores decisiones.",
};

export default function BlogPage() {
  return (
    <main className="bg-[#F5F4F2] text-[#152A42]">
      {/* Hero */}
      <section className="relative -mt-20 overflow-hidden border-b border-[#152A42]/10 bg-[#152A42] pt-24 pb-6 text-center text-[#F5F4F2] md:pt-28 md:pb-8">
        <div className="relative z-10 mx-auto max-w-2xl px-6">
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#F5F4F2] md:text-3xl">
            Blog de Pensiones
          </h1>
          <p className="mt-2 text-sm text-[#F5F4F2]/65">
            Conceptos clave sobre pensiones y seguridad social en Colombia.
          </p>
        </div>
      </section>

      <BlogExplorer posts={allPosts} categories={allCategories} />
    </main>
  );
}

