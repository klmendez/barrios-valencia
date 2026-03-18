"use client";

import Link from "next/link";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import type { ServiceSection } from "@/data/nav";
import { Button } from "@/components/ui/Button";

interface SimpleLink {
  label: string;
  href: string;
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  serviceSections: ServiceSection[];
  primaryLinks: SimpleLink[];
  cta?: SimpleLink;
}

export function MobileMenu({ open, onClose, serviceSections, primaryLinks, cta }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const sectionIds = useMemo(
    () =>
      serviceSections.reduce<Record<string, string>>((acc, section, index) => {
        acc[section.href] = `mobile-section-${index}`;
        return acc;
      }, {}),
    [serviceSections],
  );

  useEffect(() => {
    if (!open) return;

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    function handlePointer(event: MouseEvent) {
      if (panelRef.current?.contains(event.target as Node)) return;
      onClose();
    }

    document.addEventListener("keydown", handleKey);
    document.addEventListener("pointerdown", handlePointer);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("pointerdown", handlePointer);
    };
  }, [onClose, open]);

  useEffect(() => {
    if (!open) {
      setOpenSection(null);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <div className="absolute inset-0 bg-ink/70" aria-hidden onClick={onClose} />
      <div
        ref={panelRef}
        className="relative ml-auto flex h-full w-full max-w-sm flex-col bg-navy text-surface shadow-[0_0_40px_rgba(0,0,0,0.45)]"
        role="dialog"
        aria-modal="true"
        aria-label="Panel de navegación"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <span className="font-display text-sm font-semibold uppercase tracking-[0.3em]">Menú</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/70 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-label="Cerrar menú"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Navegación principal</p>
              <nav className="mt-3 space-y-4">
                {primaryLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-base font-medium text-white/90 transition hover:text-gold"
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Servicios</p>
              <div className="mt-4 space-y-3">
                {serviceSections.map((section) => {
                  const id = sectionIds[section.href];
                  const expanded = openSection === section.href;
                  return (
                    <div key={section.href} className="rounded-xl border border-white/10">
                      <button
                        type="button"
                        aria-expanded={expanded}
                        aria-controls={id}
                        className="flex w-full items-center justify-between px-4 py-3 text-left font-display text-sm font-semibold uppercase tracking-[0.2em] text-white"
                        onClick={() => setOpenSection(expanded ? null : section.href)}
                      >
                        {section.label}
                        <svg
                          className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : "rotate-0"}`}
                          viewBox="0 0 10 6"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M1 1.5 5 5l4-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <div
                        id={id}
                        role="region"
                        className={`space-y-2 border-t border-white/10 px-4 pb-4 pt-3 text-sm transition-[max-height,opacity] ${expanded ? "max-h-80 opacity-100" : "max-h-0 overflow-hidden opacity-0"}`}
                      >
                        <Link
                          href={section.href}
                          className="block text-white/90 transition hover:text-gold"
                          onClick={onClose}
                        >
                          Ver servicio
                        </Link>
                        {section.items.map((item) => (
                          <Fragment key={item.href}>
                            <Link
                              href={item.href}
                              className="block text-white/70 transition hover:text-gold"
                              onClick={onClose}
                            >
                              {item.label}
                            </Link>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {cta && (
          <div className="border-t border-white/10 px-6 py-6">
            <Button asChild className="w-full bg-gold text-ink">
              <Link href={cta.href} onClick={onClose}>
                {cta.label}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
