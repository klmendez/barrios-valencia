import type { Metadata } from "next";

export const siteConfig = {
  name: "Barrios Valencia Abogados",
  description:
    "Firma boutique especializada en derecho pensional y laboral que acompaña a trabajadores, familias y empresas en todo Colombia.",
  url: "https://barrios-valencia.example.com",
  locale: "es_CO",
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/brand/icono.png",
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
};
