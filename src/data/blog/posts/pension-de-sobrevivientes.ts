import type { BlogPost } from "../types";

export const pensionDeSobrevivientes: BlogPost = {
  slug: "pension-de-sobrevivientes",
  title: "¿Qué es la pensión de sobrevivientes y quién puede reclamarla?",
  description:
    "Guía completa sobre la pensión de sobrevivientes en Colombia: beneficiarios, requisitos, documentos y qué hacer cuando la entidad la niega.",
  category: "Pensión de sobrevivientes",
  publishedAt: "2025-02-18",
  readTime: 4,
  relatedServiceHref: "/servicios/fallecio-un-familiar/pension-de-sobrevivientes",
  relatedServiceLabel: "Pensión de sobrevivientes",
  tags: ["pensión de sobrevivientes", "fallecimiento", "beneficiarios", "cónyuge", "Colombia"],
  sections: [
    {
      question: "¿Qué es la pensión de sobrevivientes?",
      answer:
        "La pensión de sobrevivientes es la prestación económica que el sistema pensional colombiano reconoce a los familiares que dependían económicamente de un trabajador afiliado o de un pensionado que falleció. Su objetivo es proteger el ingreso del grupo familiar ante la pérdida del sostén económico. Está regulada por la Ley 100 de 1993 y sus modificaciones (en especial la Ley 797 de 2003).",
    },
    {
      question: "¿Quiénes son los beneficiarios de la pensión de sobrevivientes?",
      answer:
        "La ley establece un orden de beneficiarios:\n\n1.° Cónyuge o compañero(a) permanente e hijos: tienen prioridad. El cónyuge o compañero(a) debe acreditar convivencia mínima de cinco años continuos antes del fallecimiento. Los hijos menores de 18 años o hasta 25 años si estudian, y los hijos inválidos sin límite de edad.\n\n2.° Padres del causante: solo acceden si no existen beneficiarios de primer orden y deben demostrar dependencia económica.\n\n3.° Hermanos inválidos: acceden en ausencia de los anteriores, acreditando dependencia económica.\n\nEl estado civil registrado no es el único criterio: la convivencia real y la dependencia económica son determinantes en los conflictos entre beneficiarios.",
    },
    {
      question: "¿Qué requisitos debe cumplir el causante para que se genere la pensión?",
      answer:
        "Depende de si el fallecido era pensionado o era simplemente afiliado activo:\n\n• Si era pensionado: la pensión de sobrevivientes se genera automáticamente, independientemente del tiempo que llevaba pensionado.\n\n• Si era afiliado activo: debe haber cotizado al menos 50 semanas dentro de los tres años anteriores a su muerte. Si el fallecimiento ocurrió por enfermedad crónica, la jurisprudencia ha matizado este requisito en casos especiales.",
    },
  ],
  seo: {
    title: "¿Qué es la pensión de sobrevivientes en Colombia? | Barrios Valencia Abogados",
    description:
      "Aprende quiénes son los beneficiarios de la pensión de sobrevivientes y cuáles son los requisitos para reclamarla.",
  },
};
