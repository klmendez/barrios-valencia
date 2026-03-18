import Link from "next/link";
import type { ServiceSection } from "@/data/nav";
import { cn } from "@/lib/utils";

interface MegaMenuSectionProps {
  section: ServiceSection;
  onNavigate?: () => void;
}

export function MegaMenuSection({ section, onNavigate }: MegaMenuSectionProps) {
  const formattedLabel = section.label.charAt(0).toUpperCase() + section.label.slice(1).toLowerCase();

  return (
    <div className="space-y-3">
      <Link
        href={section.href}
        className={cn(
          "block border-b border-gold/30 pb-2 font-display text-xs font-semibold tracking-[0.02em] text-navy sm:text-sm",
          "hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        )}
        onClick={onNavigate}
      >
        {formattedLabel}
      </Link>
      <ul className="space-y-1.5">
        {section.items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm leading-5 text-ink transition hover:bg-navy hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:text-base"
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
