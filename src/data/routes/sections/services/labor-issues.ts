import type { PageCopy } from "../../types";

export const laborIssuesPages = {
  "/servicios/tengo-un-problema-laboral": {
    title: "Tengo un problema laboral",
    subtitle: "Representamos trabajadores y directivos frente a conflictos que afectan su estabilidad y derechos",
    description:
      "Representamos trabajadores y directivos en conflictos disciplinarios, despidos y reclamaciones salariales.",
    ctaLabel: "Solicitar orientación",
    ctaHref: "/consulta-gratuita",
    highlights: [
      "Defensa en conflictos laborales individuales",
      "Acompañamiento preventivo y contencioso",
      "Reclamación de salarios, prestaciones e indemnizaciones",
    ],
    recognitionSection: {
      title: "Esto puede estar ocurriéndote en el trabajo",
      intro:
        "No todos los problemas laborales comienzan con una demanda. Muchas veces empiezan con señales que conviene atender a tiempo.",
      items: [
        {
          title: "Te despidieron o te están presionando a salir",
          description:
            "Sientes que la terminación fue injusta o que te empujan a renunciar sin garantías.",
        },
        {
          title: "No te pagaron correctamente",
          description:
            "Hay dudas sobre liquidación, prestaciones, vacaciones, primas, cesantías o salarios adeudados.",
        },
        {
          title: "Te abrieron un proceso disciplinario",
          description:
            "Necesitas responder con estrategia para proteger tu nombre, tu cargo y tus derechos.",
        },
      ],
    },
    intro:
      "Los conflictos laborales deben abordarse con estrategia, oportunidad y conocimiento técnico, porque una mala decisión temprana puede afectar de forma importante la estabilidad laboral y económica del trabajador.",
    sections: [
      {
        title: "Diagnóstico del conflicto",
        content:
          "Analizamos la relación laboral, los documentos disponibles, la conducta del empleador y la etapa exacta del problema para definir la mejor respuesta jurídica.",
      },
      {
        title: "Defensa y reclamación",
        content:
          "Dependiendo del caso, intervenimos en negociaciones, reclamaciones formales, descargos, conciliaciones o demandas judiciales para exigir el restablecimiento de derechos.",
      },
    ],
    seo: {
      title: "Problemas laborales | Barrios Valencia Abogados",
      description:
        "Abogados para despido injustificado, liquidación, procesos disciplinarios y demandas laborales en Colombia.",
    },
  },

  "/servicios/tengo-un-problema-laboral/despido-injustificado": {
    title: "Despido injustificado",
    subtitle: "Impugnamos terminaciones abusivas y reclamamos la reparación correspondiente",
    description:
      "Impugnamos despidos sin causa, negociamos indemnizaciones y reinstalaciones con respaldo probatorio.",
    ctaLabel: "Revisar despido",
    ctaHref: "/consulta-gratuita",
    highlights: [
      "Revisión de causa y procedimiento",
      "Defensa del trabajador",
      "Reclamación de indemnización o reintegro",
    ],
    recognitionSection: {
      title: "Podrías estar ante un despido injustificado si",
      intro:
        "No toda terminación laboral está jurídicamente bien sustentada, incluso si el empleador la presenta como válida.",
      items: [
        {
          title: "Te despidieron sin una razón clara",
          description:
            "La empresa terminó tu contrato sin explicaciones suficientes o sin el procedimiento debido.",
        },
        {
          title: "Sospechas discriminación o represalia",
          description:
            "El despido ocurrió después de incapacidades, reclamaciones, denuncias o situaciones protegidas.",
        },
      ],
    },
    intro:
      "El análisis del despido debe revisar la causa alegada, la prueba disponible, la forma en que se produjo la terminación y la eventual procedencia de indemnización o reintegro.",
    seo: {
      title: "Despido injustificado | Barrios Valencia Abogados",
      description:
        "Asesoría legal en despido injustificado, indemnización y reintegro laboral en Colombia.",
    },
  },

  "/servicios/tengo-un-problema-laboral/liquidacion-y-prestaciones-sociales": {
    title: "Liquidación y prestaciones sociales",
    subtitle: "Auditamos pagos finales y exigimos lo que legalmente corresponde",
    description:
      "Auditamos liquidaciones finales y exigimos el pago correcto de primas, cesantías y vacaciones.",
    ctaLabel: "Revisar liquidación",
    ctaHref: "/consulta-gratuita",
    highlights: [
      "Revisión integral de liquidación",
      "Validación de prestaciones sociales",
      "Reclamación de diferencias adeudadas",
    ],
    recognitionSection: {
      title: "Esta revisión es útil si",
      intro:
        "Muchas liquidaciones parecen correctas a primera vista, pero contienen errores en conceptos, base salarial o tiempos reconocidos.",
      items: [
        {
          title: "Recibiste una liquidación y tienes dudas",
          description:
            "Quieres verificar si vacaciones, cesantías, intereses, primas e indemnizaciones fueron calculados correctamente.",
        },
        {
          title: "Crees que te quedaron debiendo valores",
          description:
            "Sospechas que no te pagaron todo lo correspondiente al terminar la relación laboral.",
        },
      ],
    },
    intro:
      "Una revisión técnica de la liquidación final permite detectar errores que muchas veces pasan inadvertidos y reclamar oportunamente las sumas que el empleador debe pagar.",
    seo: {
      title: "Liquidación y prestaciones sociales | Barrios Valencia Abogados",
      description:
        "Revisión legal de liquidación laboral, primas, cesantías, vacaciones y demás prestaciones sociales en Colombia.",
    },
  },

  "/servicios/tengo-un-problema-laboral/procesos-disciplinarios": {
    title: "Procesos disciplinarios",
    subtitle: "Te acompañamos a responder con estrategia y proteger tu trayectoria profesional",
    description:
      "Acompañamos descargos y negociaciones para proteger tu buen nombre y trayectoria profesional.",
    ctaLabel: "Preparar descargos",
    ctaHref: "/consulta-gratuita",
    highlights: [
      "Acompañamiento preventivo y reactivo",
      "Preparación de descargos",
      "Protección del buen nombre y estabilidad laboral",
    ],
    recognitionSection: {
      title: "Puede que necesites defensa disciplinaria si",
      intro:
        "Un proceso disciplinario mal manejado puede terminar afectando tu permanencia en el cargo y tu reputación profesional.",
      items: [
        {
          title: "Te citaron a descargos",
          description:
            "Necesitas preparar una respuesta sólida frente a señalamientos o imputaciones del empleador.",
        },
        {
          title: "Sientes que el proceso no es imparcial",
          description:
            "Percibes que ya existe una decisión previa o que no están respetando tus garantías mínimas.",
        },
      ],
    },
    intro:
      "La defensa disciplinaria no solo consiste en responder acusaciones, sino en revisar la legalidad del procedimiento y anticipar sus impactos laborales y reputacionales.",
    seo: {
      title: "Procesos disciplinarios laborales | Barrios Valencia Abogados",
      description:
        "Defensa legal en procesos disciplinarios, citaciones a descargos y protección del buen nombre en Colombia.",
    },
  },

  "/servicios/tengo-un-problema-laboral/demandas-laborales": {
    title: "Demandas laborales",
    subtitle: "Litigamos reclamaciones laborales con estrategia probatoria y procesal",
    description:
      "Litigamos reclamaciones individuales y colectivas ante jueces laborales y tribunales de arbitramento.",
    ctaLabel: "Evaluar demanda",
    ctaHref: "/consulta-gratuita",
    highlights: [
      "Construcción técnica de la demanda",
      "Estrategia procesal y probatoria",
      "Representación ante jueces laborales",
    ],
    recognitionSection: {
      title: "La vía judicial puede ser necesaria si",
      intro:
        "Cuando no hay solución directa con el empleador o ya existe una vulneración consolidada, puede ser necesario acudir a demanda.",
      items: [
        {
          title: "Tus reclamaciones no fueron atendidas",
          description:
            "Agotaste conversaciones o solicitudes y el empleador no reconoció los derechos reclamados.",
        },
        {
          title: "El conflicto tiene impacto económico importante",
          description:
            "Están en juego salarios, prestaciones, indemnizaciones o reintegros que requieren defensa formal.",
        },
      ],
    },
    intro:
      "La demanda laboral debe construirse con rigor desde el inicio, identificando correctamente pretensiones, pruebas, riesgos y objetivos procesales.",
    seo: {
      title: "Demandas laborales | Barrios Valencia Abogados",
      description:
        "Representación en demandas laborales individuales y colectivas en Colombia.",
    },
  },

  "/servicios/tengo-un-problema-laboral/seguridad-y-salud-en-el-trabajo": {
    title: "Seguridad y salud en el trabajo",
    subtitle: "Diseñamos defensas y medidas jurídicas frente a riesgos, sanciones y obligaciones en SST",
    description:
      "Implementamos defensas frente a sanciones del Ministerio y diseñamos políticas preventivas.",
    ctaLabel: "Solicitar orientación",
    ctaHref: "/consulta-gratuita",
    highlights: [
      "Acompañamiento frente a sanciones y requerimientos",
      "Análisis preventivo de cumplimiento",
      "Soporte jurídico en SST",
    ],
    recognitionSection: {
      title: "Este servicio es útil si",
      intro:
        "Los asuntos de seguridad y salud en el trabajo pueden involucrar sanciones, investigaciones o necesidad de fortalecimiento preventivo.",
      items: [
        {
          title: "Recibiste un requerimiento o sanción",
          description:
            "Necesitas una defensa jurídica frente a observaciones del Ministerio u otras autoridades.",
        },
        {
          title: "Quieres prevenir contingencias",
          description:
            "Buscas fortalecer políticas, soportes y actuación empresarial en materia de SST.",
        },
      ],
    },
    intro:
      "La seguridad y salud en el trabajo exige no solo cumplimiento técnico, sino también una estructura jurídica sólida que permita prevenir conflictos y responder adecuadamente ante investigaciones o sanciones.",
    seo: {
      title: "Seguridad y salud en el trabajo | Barrios Valencia Abogados",
      description:
        "Asesoría legal en seguridad y salud en el trabajo, sanciones y cumplimiento normativo en Colombia.",
    },
  },
} satisfies Record<string, PageCopy>;
