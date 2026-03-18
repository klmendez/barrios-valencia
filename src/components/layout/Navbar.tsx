  "use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { ServiceSection } from "@/data/nav";
import { Button } from "@/components/ui/Button";
import { MegaMenu } from "@/components/nav/MegaMenu";
import { NavLink } from "@/components/nav/NavLink";
import { cn } from "@/lib/utils";

interface SimpleLink {
  label: string;
  href: string;
}

interface NavbarProps {
  serviceSections: ServiceSection[];
  primaryLinks: SimpleLink[];
  cta?: SimpleLink;
  onOpenMobile: () => void;
  tone?: "light" | "dark";
}

export function Navbar({ serviceSections, primaryLinks, cta, onOpenMobile, tone = "dark" }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const homeLink = primaryLinks.find((link) => link.href === "/");
  const otherLinks = primaryLinks.filter((link) => link.href !== "/");
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const idBase = useId();
  const menuId = `${idBase}-menu`;
  const triggerId = `${idBase}-trigger`;
  const [menuTop, setMenuTop] = useState(0);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    setMenuOpen(true);
  }, []);

  const scheduleClose = useCallback(() => {
    hoverTimeout.current = setTimeout(() => {
      setMenuOpen(false);
    }, 120);
  }, []);

  const clearHoverTimeout = useCallback(() => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
  }, []);

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    if (!trigger || !menu) return;

    const triggerRect = trigger.getBoundingClientRect();
    const spacing = 8;
    const top = triggerRect.bottom + spacing;
    setMenuTop(top);
  }, []);

  useEffect(() => {
    function handlePointer(event: MouseEvent) {
      if (!menuOpen) return;
      if (containerRef.current?.contains(event.target as Node)) return;
      if (menuRef.current?.contains(event.target as Node)) return;
      closeMenu();
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [closeMenu, menuOpen]);

  useLayoutEffect(() => {
    if (!menuOpen) return;
    updateMenuPosition();
    const handler = () => updateMenuPosition();
    window.addEventListener("resize", handler);
    window.addEventListener("scroll", handler, true);
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("scroll", handler, true);
    };
  }, [menuOpen, updateMenuPosition]);

  const handleBlur = useCallback(() => {
    requestAnimationFrame(() => {
      const active = document.activeElement;
      const focusInsideNav = containerRef.current?.contains(active);
      const focusInsideMenu = menuRef.current?.contains(active as Node);
      if (!focusInsideNav && !focusInsideMenu) {
        closeMenu();
      }
    });
  }, [closeMenu]);

  return (
    <>
      <button
        type="button"
        className={cn(
          "inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold transition lg:hidden",
          tone === "light"
            ? "border border-white/60 text-[#F5F4F2] hover:bg-white/10"
            : "border border-[#152A42]/30 text-[#152A42] hover:bg-[#152A42]/5",
        )}
        onClick={onOpenMobile}
        aria-label="Abrir menú"
      >
        <span className="sr-only">Abrir menú</span>
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div
        className={cn(
          "hidden flex-1 items-center justify-center gap-6 px-2 font-display lg:flex",
          tone === "light" ? "text-[#F5F4F2]" : "text-[#152A42]",
        )}
        ref={containerRef}
      >
        {homeLink && (
          <NavLink href={homeLink.href} tone={tone}>
            {homeLink.label}
          </NavLink>
        )}

        <div
          className="relative"
          onMouseEnter={() => {
            clearHoverTimeout();
            openMenu();
          }}
          onMouseLeave={() => {
            clearHoverTimeout();
            scheduleClose();
          }}
          onBlurCapture={handleBlur}
        >
          <button
            ref={triggerRef}
            id={triggerId}
            className={cn(
              "flex items-center gap-2 text-sm font-semibold capitalize transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4",
              tone === "light"
                ? "text-[#F5F4F2]/85 hover:text-[#F5F4F2] focus-visible:outline-[#F5F4F2]"
                : "text-[#152A42]/85 hover:text-[#152A42] focus-visible:outline-[#152A42]",
            )}
            aria-haspopup="true"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((prev) => !prev)}
            onFocus={() => {
              clearHoverTimeout();
              openMenu();
            }}
          >
            Servicios
            <svg
              className={`h-3 w-3 transition-transform ${menuOpen ? "rotate-180" : "rotate-0"}`}
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1.5 5 5l4-3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <MegaMenu
            ref={menuRef}
            sections={serviceSections}
            open={menuOpen}
            menuId={menuId}
            labelledBy={triggerId}
            onNavigate={closeMenu}
            onMouseEnter={clearHoverTimeout}
            onMouseLeave={scheduleClose}
            onFocusCapture={clearHoverTimeout}
            onBlurCapture={handleBlur}
            style={{ top: menuTop }}
          />
        </div>

        <nav className="flex items-center gap-5">
          {otherLinks.map((link: SimpleLink) => (
            <NavLink key={link.href} href={link.href} tone={tone}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {cta && (
          <Button
            asChild
            className={
              tone === "light"
                ? "border border-white/60 bg-transparent text-[#F5F4F2] hover:bg-white/10"
                : "bg-[#A1805E] text-[#152A42] hover:bg-[#A1805E]/90"
            }
          >
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        )}
      </div>
    </>
  );
}
