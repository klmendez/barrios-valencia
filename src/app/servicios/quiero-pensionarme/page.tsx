import { makePlaceholderPage } from "@/app/_components/makePlaceholderPage";

export default makePlaceholderPage("/servicios/quiero-pensionarme", [
  { label: "Pensión de Vejez", href: "/servicios/quiero-pensionarme/pension-de-vejez", description: "Requisitos de edad y semanas cotizadas para acceder a tu pensión." },
  { label: "Pensión Anticipada de Vejez", href: "/servicios/quiero-pensionarme/pension-anticipada-de-vejez", description: "Cómo pensionarte antes de cumplir la edad mínima reglamentaria." },
  { label: "Pensión Anticipada por Hijo con Discapacidad", href: "/servicios/quiero-pensionarme/pension-anticipada-por-hijo-con-discapacidad", description: "Beneficio especial para padres o madres con hijos en condición de discapacidad." },
  { label: "Proyección Pensional", href: "/servicios/quiero-pensionarme/proyeccion-pensional", description: "Análisis de cuándo y cuánto recibirás como mesada pensional." },
  { label: "Devolución de Saldos", href: "/servicios/quiero-pensionarme/devolucion-de-saldos", description: "Recupera tus aportes si no alcanzas los requisitos mínimos de pensión." },
]);
