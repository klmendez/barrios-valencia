"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function SiteFooter() {
  const pathname = usePathname();
  return pathname.startsWith("/plataforma") ? null : <Footer />;
}
