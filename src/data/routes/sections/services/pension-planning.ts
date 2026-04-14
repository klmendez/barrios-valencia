import type { PageCopy } from "../../types";

const serviceWhatsappUrl =
  "https://api.whatsapp.com/send?phone=573005687950&text=Hola%20Barrios%20Valencia%20Abogados,%20necesito%20asesor%C3%ADa.";

export const pensionPlanningPages = {
  "/servicios/quiero-pensionarme": {
    title: "Quiero pensionarme",
    subtitle: "Planeamos contigo el camino más seguro para lograr tu pensión",
    description:
      "Diseñamos estrategias para anticipar, proyectar y materializar tu pensión de la forma más eficiente y segura.",
    afterHeroTitle: "La pensión: qué tiene y toda la información correspondiente",
    ctaLabel: "Revisar mi caso",
    ctaHref: "/consulta-gratuita#compartir-caso",
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
    narrative: {
      problem: {
        label: "Definición del problema",
        headline: "La pensión de vejez no es un trámite automático",
        description:
          "Muchas personas llegan a este punto con errores en su historia laboral, dudas sobre su régimen o sin claridad sobre si realmente cumplen los requisitos.",
        context:
          "Antes de radicar debes confirmar con precisión semanas, edad, fondo y soportes. De lo contrario, el proceso puede detenerse durante meses o terminar en una negativa.",
      },
      issues: {
        label: "Problemas frecuentes",
        title: "Quizás te identificas con alguno de estos escenarios",
        items: [
          "Crees que ya cumples edad y semanas, pero no tienes confirmación",
          "No sabes qué régimen o traslado te aplica en este momento",
          "Tu historia laboral tiene inconsistencias o empleadores que no cotizaron",
          "Temes que te nieguen la pensión o que la liquiden con errores",
          "No tienes claro si estás recibiendo el valor correcto en simulaciones",
        ],
      },
      consequence: {
        title: "Si lo dejas pasar",
        description:
          "Un error en esta etapa puede retrasar tu pensión por años o reducir de forma permanente el valor que recibirás mes a mes.",
      },
      solution: {
        title: "Cómo te ayudamos",
        steps: [
          {
            title: "1. Revisión técnica completa",
            bullets: [
              "Semanas reales vs. registradas",
              "Identificación del régimen aplicable y beneficios",
              "Validación de requisitos legales y documentales",
            ],
          },
          {
            title: "2. Corrección de inconsistencias",
            bullets: [
              "Historia laboral depurada y soportes faltantes",
              "Requerimientos a empleadores o fondos",
              "Ajustes antes de radicar para disminuir riesgos",
            ],
          },
          {
            title: "3. Acompañamiento en el trámite",
            bullets: [
              "Radicación completa y ordenada",
              "Seguimiento a la respuesta de la entidad",
              "Acciones frente a negativas, demoras o liquidaciones erradas",
            ],
          },
        ],
      },
      differential: {
        title: "Nuestro diferencial",
        description:
          "Muchas pensiones en Colombia están mal liquidadas. No solo tramitamos: verificamos cada cifra y hacemos los ajustes necesarios para que recibas exactamente lo que te corresponde.",
        emphasis: "Revisión jurídica + matemática en un solo equipo",
      },
      cta: {
        title: "Evita errores antes de radicar tu pensión",
        description: "Solicita una revisión previa o escríbenos por WhatsApp para analizar tu caso paso a paso.",
        primaryLabel: "Solicitar revisión",
        primaryHref: "/consulta-gratuita",
        secondaryLabel: "WhatsApp",
        secondaryHref: serviceWhatsappUrl,
      },
    },
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
    ctaHref: "/consulta-gratuita#compartir-caso",
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
    ctaHref: "/consulta-gratuita#compartir-caso",
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
    ctaHref: "/consulta-gratuita#compartir-caso",
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
    ctaHref: "/consulta-gratuita#compartir-caso",
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
    ctaHref: "/consulta-gratuita#compartir-caso",
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
        {
          title: "Ya recibiste una devolución de saldos de Colpensiones",
          description:
            "Si Colpensiones ya te hizo una devolución de saldos, tienes derecho a exigir una reliquidación. En muchos casos el valor devuelto no está correctamente calculado y puedes reclamar la diferencia.",
        },
      ],
    },
    intro:
      "La devolución de saldos y los bonos pensionales exigen una revisión técnica del historial, del régimen aplicable y de la situación del afiliado para formular adecuadamente la solicitud. Si ya recibiste una devolución de Colpensiones, revisa si el valor fue liquidado correctamente: tienes derecho a exigir una reliquidación.",
    sections: [
      {
        title: "¿Ya te hicieron una devolución de saldos?",
        content:
          "Si Colpensiones ya realizó la devolución de tus saldos pensionales, eso no cierra la posibilidad de reclamar. Si el monto no fue calculado correctamente —considerando semanas, salarios base e intereses— tienes derecho a una reliquidación y al pago de la diferencia. Muchas devoluciones se hacen con errores que perjudican al afiliado.",
      },
      {
        title: "Cómo verificamos si la devolución fue correcta",
        content:
          "Revisamos tu historia laboral completa, los aportes registrados y el cálculo aplicado por Colpensiones para determinar si existe una diferencia a tu favor. Si la hay, gestionamos la reclamación administrativa o judicial correspondiente.",
      },
    ],
    seo: {
      title: "Devolución de saldos | Barrios Valencia Abogados",
      description:
        "Gestión legal de devolución de saldos y bonos pensionales en Colombia. Si ya recibiste una devolución de Colpensiones, puedes exigir reliquidación.",
    },
  },
} satisfies Record<string, PageCopy>;
