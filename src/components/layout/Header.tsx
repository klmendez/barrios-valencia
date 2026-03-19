"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ctaLink, primaryNavLinks, serviceSections } from "@/data/nav";
import { Container } from "@/components/ui/Container";
import { Navbar } from "./Navbar";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const logoSrc = isScrolled ? "/brand/icono_fondoclaro.PNG" : "/brand/icono_fondooscuro.PNG";
  const logoAlt = "Barrios Valencia logo";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          isScrolled ? "bg-[#F5F4F2]/95 text-[#152A42] shadow-sm backdrop-blur" : "bg-transparent text-white",
        )}
      >
        <Container className="flex h-20 items-center gap-6 px-6 sm:px-8 lg:px-48 xl:px- max-w-none">
          <Link href="/" className="flex items-center gap-3" aria-label="Barrios Valencia Abogados">
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={200}
              height={90}
              priority
              className="h-14 w-auto object-contain"
            />
          </Link>
          <div className="flex flex-1 justify-center">
            <Navbar
              serviceSections={serviceSections}
              primaryLinks={primaryNavLinks}
              cta={ctaLink}
              tone={isScrolled ? "dark" : "light"}
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
