import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  tone?: "light" | "dark";
}

export function NavLink({ children, className, tone = "dark", ...props }: NavLinkProps) {
  const baseToneClass =
    tone === "light"
      ? "text-[#F5F4F2]/85 hover:text-[#F5F4F2] focus-visible:outline-[#F5F4F2]"
      : "text-[#152A42]/80 hover:text-[#152A42] focus-visible:outline-[#152A42]";

  return (
    <Link
      className={cn(
        "font-display text-sm font-semibold capitalize transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4",
        baseToneClass,
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
