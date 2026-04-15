"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ctaLink, primaryNavLinks, serviceSections } from "@/data/nav";
import { Container } from "@/components/ui/Container";
import { Navbar } from "./Navbar";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isTransparentPage = pathname === "/" || pathname === "/sobre-nosotros";
  const isTransparent = isTransparentPage && !isScrolled;

  useEffect(() => {
    const evaluate = () => setIsScrolled(window.scrollY > 60);
    evaluate();
    window.addEventListener("scroll", evaluate, { passive: true });
    return () => window.removeEventListener("scroll", evaluate);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isTransparent
            ? "bg-transparent text-[#152A42]"
            : "bg-[#152A42] text-white shadow-md",
        )}
      >
        <Container className="flex h-20 items-center gap-6 px-5 sm:px-8 lg:px-40 xl:px-48 max-w-none">
          <Link href="/" className="flex items-center gap-3" aria-label="Barrios Valencia Abogados">
            <Image
              src={isTransparent ? "/brand/icono_fondoclaro.PNG" : "/brand/icono_fondooscuro.PNG"}
              alt="Barrios Valencia logo"
              width={200}
              height={90}
              priority
              className="h-14 w-auto object-contain"
            />
          </Link>
          <div className="flex flex-1 justify-end">
            <Navbar
              serviceSections={serviceSections}
              primaryLinks={primaryNavLinks}
              cta={ctaLink}
              tone={isTransparent ? "dark" : "light"}
              onOpenMobile={() => setMobileOpen(true)}
            />
          </div>
        </Container>
      </header>
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        serviceSections={serviceSections}
        primaryLinks={primaryNavLinks}
        cta={ctaLink}
      />
    </>
  );
}
