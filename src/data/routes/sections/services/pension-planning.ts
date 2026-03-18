import type { PageCopy } from "../../types";

export const pensionPlanningPages = {
  "/servicios/quiero-pensionarme": {
    title: "Quiero pensionarme",
    subtitle: "Planeamos contigo el camino más seguro para lograr tu pensión",
    description:
      "Diseñamos estrategias para anticipar, proyectar y materializar tu pensión de la forma más eficiente y segura.",
    ctaLabel: "Revisar mi caso",
    ctaHref: "/consulta-gratuita",
    highlights: [
      "Análisis de edad, semanas y régimen aplicable",
      "Proyección jurídica y financiera",
      "Acompañamiento hasta la radicación o defensa del derecho",
    ],
    recognitionSection: {
      title: "Puede que estés en este punto",
      intro:
        "La decisión de pensionarse exige revisar más que la edad. También es necesario validar semanas, historia laboral, régimen y conveniencia del momento en que se hace la solicitud.",
      items: [
        {
          title: "Estás cerca de cumplir requisitos",
          description:
            "Quieres saber si ya puedes iniciar el trámite o si conviene esperar y fortalecer tu situación pensional.",
        },
        {
          title: "Tienes dudas sobre semanas cotizadas",
          description:
            "No sabes si tu historia laboral está completa o si necesitas corregir omisiones antes de radicar.",
        },
        {
          title: "Quieres pensionarte con mejor planeación",
          description:
            "Buscas tomar decisiones informadas para evitar errores, devoluciones o una liquidación desfavorable.",
        },
      ],
    },
    intro:
      "Pensionarse no debería ser un salto al vacío. Por eso analizamos tu situación integralmente para definir el mejor momento, corregir riesgos y estructurar una estrategia sólida de reconocimiento pensional.",
    sections: [
      {
        title: "Planeación pensional",
        content:
          "Evaluamos edad, semanas, ingresos, régimen y antecedentes laborales para determinar la viabilidad actual del derecho y los ajustes necesarios para fortalecer la solicitud.",
      },
      {
        title: "Prevención de errores",
        content:
          "Detectamos inconsistencias en historia laboral, vacíos de información, periodos no reportados o aspectos normativos que podrían generar negativas o retrasos.",
      },
    ],
    seo: {
      title: "Quiero pensionarme | Barrios Valencia Abogados",
      description:
        "Asesoría jurídica para planear y obtener tu pensión de vejez o beneficios relacionados en Colombia.",
    },
  },

  "/servicios/quiero-pensionarme/pension-de-vejez": {
    title: "Pensión de vejez",
    description: "",
    ctaLabel: "Solicitar revisión",
    ctaHref: "/consulta-gratuita",
    highlights: [],
    recognitionSection: {
      title: "¿Te identificas con alguna de estas situaciones?",
      intro:
        "La pensión de vejez suele generar dudas cuando faltan pocos años o pocos meses para solicitarla.",
      items: [
        {
          title: "Crees que ya cumples edad y semanas",
          description:
            "Quieres confirmar que realmente puedes radicar y que tu historia laboral refleja lo necesario.",
        },
        {
          title: "No tienes claridad sobre tu régimen",
          description:
            "No sabes si te aplica transición, fondo privado o régimen general, y eso afecta tus decisiones.",
        },
        {
          title: "Temes una negativa o una devolución",
          description:
            "Quieres evitar errores documentales o inconsistencias que retrasen el reconocimiento de la pensión.",
        },
      ],
    },
    intro:
      "La pensión de vejez requiere una revisión técnica previa para confirmar requisitos, depurar la historia laboral y radicar con la mayor solidez posible ante la entidad correspondiente.",
    sections: [
      {
        title: "Revisión previa del expediente",
        content:
          "Antes de presentar la solicitud verificamos semanas cotizadas, inconsistencias registrales, soportes faltantes y condiciones normativas específicas de tu caso.",
      },
      {
        title: "Acompañamiento durante el trámite",
        content:
          "Hacemos seguimiento al proceso, atendemos requerimientos y evaluamos la respuesta emitida para actuar de manera oportuna si surge una negativa o una liquidación incorrecta.",
      },
    ],
    seo: {
      title: "Pensión de vejez | Barrios Valencia Abogados",
      description:
        "Asesoría especializada en pensión de vejez, revisión de semanas, régimen pensional e historia laboral en Colombia.",
    },
  },

  "/servicios/quiero-pensionarme/pension-anticipada-de-vejez": {
    title: "Pensión anticipada de vejez",
    subtitle: "Evaluamos si puedes acceder a una pensión antes del momento ordinario",
    description:
      "Evaluamos regímenes especiales y beneficios para adelantar tu pensión cuando cumples condiciones particulares.",
    ctaLabel: "Evaluar viabilidad",
    ctaHref: "/consulta-gratuita",
    highlights: [
      "Estudio de condiciones especiales",
      "Revisión normativa y jurisprudencial",
      "Planeación segura del retiro",
    ],
    recognitionSection: {
      title: "Esto puede estar ocurriéndote",
      intro:
        "Hay situaciones en las que una persona puede pensionarse antes del momento habitual, pero requieren análisis especializado.",
      items: [
        {
          title: "Crees que podrías pensionarte antes",
          description:
            "Has escuchado sobre beneficios, excepciones o reglas especiales y quieres saber si realmente te aplican.",
        },
        {
          title: "Tu caso tiene condiciones particulares",
          description:
            "Tu trayectoria laboral, tu régimen o ciertas circunstancias personales podrían permitir una salida anticipada.",
        },
      ],
    },
    intro:
      "La pensión anticipada exige revisar cuidadosamente las normas aplicables y las condiciones particulares del caso para establecer si existe realmente la posibilidad de adelantar el reconocimiento.",
    seo: {
      title: "Pensión anticipada de vejez | Barrios Valencia Abogados",
      description:
        "Estudio jurídico de viabilidad para pensión anticipada de vejez en Colombia.",
    },
  },

  "/servicios/quiero-pensionarme/pension-anticipada-por-hijo-con-discapacidad": {
    title: "Pensión anticipada por hijo con discapacidad",
    subtitle: "Defendemos este beneficio con enfoque técnico y humano",
    description:
      "Acompañamos la acreditación y defensa del beneficio para madres y padres con hijos en condición de discapacidad.",
    ctaLabel: "Consultar mi caso",
    ctaHref: "/consulta-gratuita",
    highlights: [
      "Acompañamiento en requisitos y pruebas",
      "Revisión de documentación médica y jurídica",
      "Defensa administrativa y judicial del beneficio",
    ],
    recognitionSection: {
      title: "Esta ruta puede ser para ti si",
      intro:
        "Este beneficio suele requerir una acreditación cuidadosa y muchas personas desconocen cómo demostrar adecuadamente las condiciones exigidas.",
      items: [
        {
          title: "Eres madre o padre de hijo con discapacidad",
          description:
            "Quieres saber si puedes acceder a la pensión anticipada conforme a las reglas aplicables.",
        },
        {
          title: "No sabes qué documentos debes reunir",
          description:
            "Tienes dudas sobre soportes médicos, dependencia, convivencia u otros requisitos relevantes.",
        },
      ],
    },
    intro:
      "Este tipo de pensión demanda un análisis especializado de las condiciones familiares, médicas y normativas, así como una adecuada presentación de las pruebas que sustentan el derecho.",
    seo: {
      title: "Pensión anticipada por hijo con discapacidad | Barrios Valencia Abogados",
      description:
        "Asesoría legal para pensión anticipada por hijo con discapacidad en Colombia.",
    },
  },

  "/servicios/quiero-pensionarme/proyeccion-pensional": {
    title: "Proyección pensional",
    subtitle: "Anticipa escenarios y toma decisiones informadas sobre tu retiro",
    description:
      "Simulamos escenarios financieros y normativos para tomar decisiones informadas sobre tu retiro.",
    ctaLabel: "Solicitar proyección",
    ctaHref: "/consulta-gratuita",
    highlights: [
      "Simulación de escenarios posibles",
      "Análisis de semanas, ingresos y tiempos",
      "Planeación de decisiones futuras",
    ],
    recognitionSection: {
      title: "Te conviene una proyección si",
      intro:
        "No siempre la mejor decisión es pensionarse apenas sea posible. A veces conviene proyectar distintos escenarios antes de actuar.",
      items: [
        {
          title: "Quieres saber cuándo te conviene pensionarte",
          description:
            "Buscas una visión más clara del momento ideal según tu situación jurídica y económica.",
        },
        {
          title: "Tienes dudas sobre el valor estimado de tu pensión",
          description:
            "Quieres comprender cómo pueden impactar tus ingresos, semanas y decisiones futuras en la mesada.",
        },
      ],
    },
    intro:
      "La proyección pensional permite evaluar con anticipación distintos caminos posibles, identificar riesgos y escoger la estrategia más conveniente para proteger el valor y oportunidad del retiro.",
    seo: {
      title: "Proyección pensional | Barrios Valencia Abogados",
      description:
        "Simulación y proyección jurídica de tu pensión en Colombia para tomar mejores decisiones de retiro.",
    },
  },

  "/servicios/quiero-pensionarme/devolucion-de-saldos": {
    title: "Devolución de saldos",
    subtitle: "Te acompañamos a reclamar saldos y bonos pensionales con trazabilidad total",
    description:
      "Gestionamos devoluciones y bonos pensionales en fondos privados y Colpensiones con trazabilidad total.",
    ctaLabel: "Revisar mi solicitud",
    ctaHref: "/consulta-gratuita",
    highlights: [
      "Análisis de viabilidad",
      "Gestión frente a fondos y entidades",
      "Seguimiento documental del trámite",
    ],
    recognitionSection: {
      title: "Esto puede estar pasándote",
      intro:
        "Cuando no se logra el acceso a una pensión, puede existir la posibilidad de recuperar recursos acumulados o bonos asociados.",
      items: [
        {
          title: "No cumpliste requisitos para pensionarte",
          description:
            "Quieres saber si tienes derecho a devolución de saldos o a otra figura sustitutiva.",
        },
        {
          title: "Tu trámite está detenido",
          description:
            "Has iniciado gestiones con la entidad, pero no recibes claridad o avance real sobre los recursos reclamados.",
        },
      ],
    },
    intro:
      "La devolución de saldos y los bonos pensionales exigen una revisión técnica del historial, del régimen aplicable y de la situación del afiliado para formular adecuadamente la solicitud.",
    seo: {
      title: "Devolución de saldos | Barrios Valencia Abogados",
      description:
        "Gestión legal de devolución de saldos y bonos pensionales en Colombia.",
    },
  },
} satisfies Record<string, PageCopy>;
