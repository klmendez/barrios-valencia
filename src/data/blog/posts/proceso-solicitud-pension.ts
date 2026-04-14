import type { BlogPost } from "../types";

export const procesoSolicitudPension: BlogPost = {
  slug: "proceso-solicitud-pension",
  title: "¿Cómo es el proceso de solicitud y qué errores debes evitar?",
  description:
    "Tiempos del trámite pensional, cálculo de la mesada y los errores más frecuentes al solicitar la pensión sin asesoría jurídica.",
  category: "Pensión de vejez",
  publishedAt: "2025-01-21",
  readTime: 4,
  relatedServiceHref: "/servicios/quiero-pensionarme/pension-de-vejez",
  relatedServiceLabel: "Pensión de vejez",
  tags: ["trámite pensional", "mesada", "IBL", "Colpensiones", "errores"],
  sections: [
    {
      question: "¿Cuánto tiempo tarda el proceso de reconocimiento pensional?",
      answer:
        "Colpensiones tiene legalmente cuatro meses para resolver una solicitud de pensión de vejez una vez radicada. Sin embargo, en la práctica el trámite puede extenderse significativamente por solicitudes de documentos adicionales, glosas a la historia laboral o demoras internas de la entidad.\n\nSi Colpensiones no responde en el plazo establecido o emite una negativa, existen mecanismos jurídicos para exigir el cumplimiento: recurso de reposición y en subsidio apelación, acción de tutela por vulneración de derechos fundamentales, o demanda ordinaria laboral.",
    },
    {
      question: "¿Cómo se calcula el valor de mi pensión de vejez?",
      answer:
        "En Colpensiones, la mesada pensional se calcula aplicando un porcentaje (tasa de reemplazo) sobre el Ingreso Base de Liquidación (IBL), que corresponde al promedio del salario sobre el que cotizaste durante los últimos 10 años anteriores al reconocimiento.\n\nEsa tasa de reemplazo oscila entre el 55 % y el 80 % del IBL, dependiendo del número de semanas cotizadas: a mayor número de semanas, mayor porcentaje. La pensión mínima equivale a un salario mínimo mensual legal vigente.\n\nEn fondos privados, el valor depende del capital acumulado en la cuenta individual, los rendimientos y el tipo de modalidad de pensión elegida.",
    },
    {
      question: "¿Qué errores frecuentes cometen quienes solicitan la pensión sin asesoría?",
      answer:
        "Los errores más comunes que generan negativas o liquidaciones incorrectas son:\n\n• Radicar sin haber depurado la historia laboral, lo que resulta en un número de semanas inferior al real.\n• No advertir que aplica el régimen de transición (Ley 100, Acto Legislativo 01 de 2005) y perder sus beneficios.\n• Trasladarse de fondo sin consultar si eso les perjudica cerca de la edad de pensión.\n• Aceptar una liquidación sin verificar si el IBL y la tasa de reemplazo aplicados son correctos.\n• No impugnar una negativa dentro de los plazos legales, perdiendo el derecho a recurrir.",
    },
  ],
  seo: {
    title: "Proceso de solicitud de pensión de vejez: errores y tiempos | Barrios Valencia Abogados",
    description:
      "Conoce cuánto tarda Colpensiones, cómo se calcula tu mesada y los errores que debes evitar al solicitar la pensión de vejez.",
  },
};
