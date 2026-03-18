export type ServiceItem = {
  label: string;
  href: string;
};

export type ServiceSection = {
  label: string;
  href: string;
  items: ServiceItem[];
};

export const serviceSections: ServiceSection[] = [
  {
    label: "Quiero pensionarme",
    href: "/servicios/quiero-pensionarme",
    items: [
      { label: "Pensión de Vejez", href: "/servicios/quiero-pensionarme/pension-de-vejez" },
      { label: "Pensión Anticipada de Vejez", href: "/servicios/quiero-pensionarme/pension-anticipada-de-vejez" },
      {
        label: "Pensión Anticipada por Hijo con Discapacidad",
        href: "/servicios/quiero-pensionarme/pension-anticipada-por-hijo-con-discapacidad",
      },
      { label: "Proyección Pensional", href: "/servicios/quiero-pensionarme/proyeccion-pensional" },
      { label: "Devolución de Saldos", href: "/servicios/quiero-pensionarme/devolucion-de-saldos" },
    ],
  },
  {
    label: "Me negaron la pensión o me pagan mal",
    href: "/servicios/me-negaron-la-pension-o-me-pagan-mal",
    items: [
      { label: "Negación de Pensión", href: "/servicios/me-negaron-la-pension-o-me-pagan-mal/negacion-de-pension" },
      {
        label: "Reliquidación de Pensión",
        href: "/servicios/me-negaron-la-pension-o-me-pagan-mal/reliquidacion-de-pension",
      },
      {
        label: "Retroactivo Pensional",
        href: "/servicios/me-negaron-la-pension-o-me-pagan-mal/retroactivo-pensional",
      },
      {
        label: "Corrección de Historia Laboral",
        href: "/servicios/me-negaron-la-pension-o-me-pagan-mal/correccion-de-historia-laboral",
      },
    ],
  },
  {
    label: "Perdí capacidad laboral",
    href: "/servicios/perdi-capacidad-laboral",
    items: [
      { label: "Pensión de Invalidez", href: "/servicios/perdi-capacidad-laboral/pension-de-invalidez" },
      {
        label: "Calificación de Pérdida de Capacidad Laboral",
        href: "/servicios/perdi-capacidad-laboral/calificacion-de-perdida-de-capacidad-laboral",
      },
      {
        label: "Pensión Anticipada por Invalidez",
        href: "/servicios/perdi-capacidad-laboral/pension-anticipada-por-invalidez",
      },
      {
        label: "Invalidez para Víctimas de Violencia",
        href: "/servicios/perdi-capacidad-laboral/invalidez-para-victimas-de-violencia",
      },
    ],
  },
  {
    label: "Falleció un familiar",
    href: "/servicios/fallecio-un-familiar",
    items: [
      { label: "Pensión de Sobrevivientes", href: "/servicios/fallecio-un-familiar/pension-de-sobrevivientes" },
      { label: "Pensión Familiar", href: "/servicios/fallecio-un-familiar/pension-familiar" },
    ],
  },
  {
    label: "Tuve un accidente",
    href: "/servicios/tuve-un-accidente",
    items: [
      { label: "Accidentes de Trabajo", href: "/servicios/tuve-un-accidente/accidentes-de-trabajo" },
      { label: "Enfermedades Laborales", href: "/servicios/tuve-un-accidente/enfermedades-laborales" },
      { label: "Accidentes de Tránsito", href: "/servicios/tuve-un-accidente/accidentes-de-transito" },
      { label: "Seguros e Indemnizaciones", href: "/servicios/tuve-un-accidente/seguros-e-indemnizaciones" },
    ],
  },
  {
    label: "Tengo un problema laboral",
    href: "/servicios/tengo-un-problema-laboral",
    items: [
      { label: "Despido Injustificado", href: "/servicios/tengo-un-problema-laboral/despido-injustificado" },
      {
        label: "Liquidación y Prestaciones Sociales",
        href: "/servicios/tengo-un-problema-laboral/liquidacion-y-prestaciones-sociales",
      },
      { label: "Procesos Disciplinarios", href: "/servicios/tengo-un-problema-laboral/procesos-disciplinarios" },
      { label: "Demandas Laborales", href: "/servicios/tengo-un-problema-laboral/demandas-laborales" },
      {
        label: "Seguridad y Salud en el Trabajo",
        href: "/servicios/tengo-un-problema-laboral/seguridad-y-salud-en-el-trabajo",
      },
    ],
  },
];

export const primaryNavLinks = [
  { label: "Inicio", href: "/" },
  { label: "Casos de éxito", href: "/casos-de-exito" },
  { label: "Sobre nosotros", href: "/sobre-nosotros" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "/contacto" },
];

export const ctaLink = { label: "Consulta Gratuita", href: "/consulta-gratuita" };
