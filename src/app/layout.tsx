import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WhatsappBubble } from "@/components/ui/WhatsappBubble";
import { defaultMetadata } from "@/lib/seo";
import { AppShell } from "@/components/layout/AppShell";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  ...defaultMetadata,
  icons: {
    icon: "/barriosvalencia.png",
    shortcut: "/barriosvalencia.png",
    apple: "/barriosvalencia.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} bg-surface text-ink antialiased flex min-h-screen flex-col`}>
        <Header />
        <AppShell>{children}</AppShell>
        <WhatsappBubble />
        <SiteFooter />
      </body>
    </html>
  );
}
