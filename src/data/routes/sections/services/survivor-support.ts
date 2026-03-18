import type { PageCopy } from "../../types";

export const survivorSupportPages = {
  "/servicios/fallecio-un-familiar": {
    title: "Falleció un familiar",
    subtitle: "Protegemos el ingreso y los derechos económicos de la familia sobreviviente",
    description:
      "Protegemos el ingreso de tu familia gestionando pensiones de sobrevivientes y prestaciones sustitutivas.",
    ctaLabel: "Revisar mi caso",
    ctaHref: "/consulta-gratuita",
    highlights: [
      "Acompañamiento a beneficiarios",
      "Defensa de pensiones y sustituciones",
      "Orientación clara en un momento sensible",
    ],
    recognitionSection: {
      title: "Esta ruta puede ayudarte si",
      intro:
        "Tras el fallecimiento de un ser querido suelen surgir dudas sobre mesadas, beneficiarios, documentos y continuidad de ingresos para la familia.",
      items: [
        {
          title: "No sabes si tienes derecho a pensión de sobrevivientes",
          description:
            "Quieres confirmar tu calidad de beneficiario y entender qué soportes necesitas.",
        },
        {
          title: "La entidad niega o retrasa el trámite",
          description:
            "Ya presentaste documentos o reclamación, pero no obtienes respuesta clara o favorable.",
        },
      ],
    },
    intro:
      "En estos casos brindamos una orientación jurídica respetuosa y firme, enfocada en garantizar que la familia acceda a los derechos económicos que la ley reconoce tras el fallecimiento del afiliado o pensionado.",
    seo: {
      title: "Falleció un familiar | Barrios Valencia Abogados",
      description:
        "Asesoría legal en pensión de sobrevivientes, sustitución pensional y derechos de beneficiarios en Colombia.",
    },
  },

  "/servicios/fallecio-un-familiar/pension-de-sobrevivientes": {
    title: "Pensión de sobrevivientes",
    subtitle: "Representamos a quienes deben continuar recibiendo el ingreso del afiliado o pensionado fallecido",
    description:
      "Representamos a beneficiarios para que la pensión continúe y no se pierdan mesadas ya causadas.",
    ctaLabel: "Solicitar revisión",
    ctaHref: "/consulta-gratuita",
    highlights: [
      "Validación de calidad de beneficiario",
      "Defensa frente a negativas",
      "Reclamación de mesadas y retroactivos",
    ],
    recognitionSection: {
      title: "Puede ser tu caso si",
      intro:
        "La pensión de sobrevivientes busca evitar que la familia quede desprotegida económicamente tras el fallecimiento del afiliado o pensionado.",
      items: [
        {
          title: "Dependías económicamente del fallecido",
          description:
            "Necesitas saber si cumples requisitos para ser reconocido como beneficiario.",
        },
        {
          title: "Te negaron el derecho o hay disputa entre beneficiarios",
          description:
            "La entidad rechazó la solicitud o existe controversia sobre quién debe recibir la prestación.",
        },
      ],
    },
    intro:
      "La pensión de sobrevivientes requiere acreditar vínculo, dependencia y condiciones legales específicas, por lo que un acompañamiento jurídico adecuado puede ser decisivo para obtener el reconocimiento.",
    seo: {
      title: "Pensión de sobrevivientes | Barrios Valencia Abogados",
      description:
        "Reclamación legal de pensión de sobrevivientes y defensa de beneficiarios en Colombia.",
    },
  },

  "/servicios/fallecio-un-familiar/pension-familiar": {
    title: "Pensión familiar",
    subtitle: "Asesoramos parejas que pueden sumar esfuerzos para acceder a una pensión",
    description:
      "Asesoramos parejas que desean sumar semanas y conformar una pensión familiar estable.",
    ctaLabel: "Evaluar viabilidad",
    ctaHref: "/consulta-gratuita",
    highlights: [
      "Revisión de requisitos de pareja",
      "Análisis de semanas y condiciones",
      "Acompañamiento en estructuración del trámite",
    ],
    recognitionSection: {
      title: "Puede aplicar si",
      intro:
        "La pensión familiar puede ser una alternativa cuando individualmente no se cumplen requisitos, pero en conjunto sí existe una opción real.",
      items: [
        {
          title: "Tú y tu pareja no alcanzan solos la pensión",
          description:
            "Quieren saber si es posible sumar condiciones para acceder a esta figura.",
        },
      ],
    },
    intro:
      "La pensión familiar exige revisar cuidadosamente la situación de ambos integrantes de la pareja, la afiliación, las semanas y las reglas específicas del régimen aplicable.",
    seo: {
      title: "Pensión familiar | Barrios Valencia Abogados",
      description:
        "Asesoría en pensión familiar, requisitos y viabilidad para parejas en Colombia.",
    },
  },
} satisfies Record<string, PageCopy>;
