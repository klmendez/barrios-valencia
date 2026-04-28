import type { Metadata } from "next";

export const siteConfig = {
  name: "Barrios Valencia Abogados",
  description:
    "Abogados expertos en derecho pensional y laboral. Acompañamos a trabajadores, familias y empresas en Colombia con asesoría clara, cercana y estratégica.",
  url: "https://www.barriosvalencia.com",
  locale: "es_CO",
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Abogados Laborales y Pensionales en Colombia | Barrios Valencia",
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/brand/icono.png",
  },
  openGraph: {
    title: "Barrios Valencia Abogados | Derecho Laboral y Pensional",
    description:
      "Firma de abogados especializada en derecho pensional y laboral. Te acompañamos con asesoría jurídica clara, humana y estratégica en Colombia.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
};