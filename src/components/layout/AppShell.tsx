"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPlatform = pathname.startsWith("/plataforma");

  return <main className={cn("flex-1", !isPlatform && "pt-20")}>{children}</main>;
}
