import type { BlogPost } from "../types";

export const quienTieneDerechoAPension: BlogPost = {
  slug: "quien-tiene-derecho-a-pension",
  title: "¿Quién tiene derecho a una pensión y cuántas semanas necesita?",
  description:
    "Requisitos de semanas cotizadas, quién puede acceder al sistema pensional en Colombia y qué pasa si no se alcanzan las semanas mínimas.",
  category: "Pensión de vejez",
  publishedAt: "2025-01-11",
  readTime: 4,
  relatedServiceHref: "/servicios/quiero-pensionarme",
  relatedServiceLabel: "Quiero pensionarme",
  tags: ["pensión", "semanas cotizadas", "requisitos", "devolución de saldos"],
  sections: [
    {
      question: "¿Quién tiene derecho a una pensión en Colombia?",
      answer:
        "Tiene derecho a una pensión de vejez cualquier persona que haya cotizado al sistema de seguridad social y cumpla con los requisitos de edad y semanas establecidos en la ley. También existen regímenes especiales para ciertos trabajadores (maestros, fuerzas militares, entre otros) con condiciones diferentes. Quienes no alcanzan los requisitos para pensionarse pueden acceder a la devolución de saldos o la indemnización sustitutiva, según el régimen.",
    },
    {
      question: "¿Cuántas semanas de cotización se necesitan para pensionarse?",
      answer:
        "En Colpensiones (régimen de prima media) se requieren 1.300 semanas cotizadas. En los fondos privados (RAIS) no hay un número mínimo de semanas para pensionarse, sino que se requiere capital acumulado suficiente para financiar una pensión equivalente al 110 % del salario mínimo mensual vigente. Si no se alcanza ese umbral, el fondo puede solicitar garantía de pensión mínima con 1.150 semanas cotizadas.",
    },
    {
      question: "¿Qué pasa si nunca me pensiono?",
      answer:
        "Si al momento de cumplir la edad de pensión no se cumplen los requisitos de semanas, la persona tiene dos alternativas:\n\n• En Colpensiones: recibir una indemnización sustitutiva equivalente a una parte proporcional de los aportes realizados.\n\n• En fondos privados: solicitar la devolución de saldos con sus rendimientos.\n\nEn ambos casos, es recomendable contar con asesoría jurídica para verificar si se perdió algún periodo cotizado y si existe la posibilidad de recuperarlo antes de optar por estas alternativas.",
    },
  ],
  seo: {
    title: "¿Quién tiene derecho a una pensión en Colombia? | Barrios Valencia Abogados",
    description:
      "Conoce los requisitos de semanas cotizadas, quién puede pensionarse y qué opciones existen si no se alcanzan las semanas mínimas.",
  },
};
