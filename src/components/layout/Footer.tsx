import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { primaryNavLinks, ctaLink } from "@/data/nav";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#152A42] text-[#F5F4F2]">
      <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between">
        <div className="max-w-md">
          <h2 className="section-title text-[#F5F4F2] text-3xl md:text-4xl">Barrios Valencia Abogados</h2>
          <p className="section-lead mt-3 text-[#F5F4F2]/75">
            Defensa pensional y laboral con investigación estratégica y atención humana.
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm font-semibold text-[#F5F4F2]/85">
          {primaryNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[#A1805E]">
              {link.label}
            </Link>
          ))}
          <Link href={ctaLink.href} className="rounded-full border border-[#A1805E] px-4 py-2 text-[#A1805E]">
            {ctaLink.label}
          </Link>
        </nav>
        <p className="text-xs text-[#F5F4F2]/60">© {year} Barrios Valencia Abogados. Todos los derechos reservados.</p>
      </Container>
    </footer>
  );
}
