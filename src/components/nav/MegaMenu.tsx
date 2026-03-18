"use client";

import { forwardRef, type HTMLAttributes } from "react";
import type { ServiceSection } from "@/data/nav";
import { cn } from "@/lib/utils";
import { MegaMenuSection } from "./MegaMenuSection";

interface MegaMenuProps extends HTMLAttributes<HTMLDivElement> {
  sections: ServiceSection[];
  open: boolean;
  menuId: string;
  labelledBy: string;
  onNavigate?: () => void;
}

export const MegaMenu = forwardRef<HTMLDivElement, MegaMenuProps>(
  ({
    sections,
    open,
    menuId,
    labelledBy,
    onNavigate,
    className,
    ...rest
  }, ref) => {
    return (
      <div
        ref={ref}
        id={menuId}
        role="menu"
        aria-labelledby={labelledBy}
        aria-hidden={!open}
        className={cn(
          "fixed left-1/2 z-40 w-[min(94vw,1150px)] -translate-x-1/2 border border-border bg-surface px-4 py-5 shadow-menu transition duration-200 sm:px-5 lg:px-6",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
          className,
        )}
        {...rest}
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {sections.map((section) => (
            <MegaMenuSection
              key={section.href}
              section={section}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    );
  },
);

MegaMenu.displayName = "MegaMenu";
