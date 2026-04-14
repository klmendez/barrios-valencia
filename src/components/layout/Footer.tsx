import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { primaryNavLinks, ctaLink } from "@/data/nav";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#152A42] text-[#F5F4F2]">
      <Container className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between md:gap-8 md:py-10">
        <p className="text-sm font-semibold text-[#F5F4F2]/90 md:text-base">Barrios Valencia Abogados</p>
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-[#F5F4F2]/70 md:text-sm">
          {primaryNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[#A1805E] transition">
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-[11px] text-[#F5F4F2]/45">© {year} Barrios Valencia Abogados.</p>
      </Container>
    </footer>
  );
}
