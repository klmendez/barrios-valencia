export type HeroImage = { src: string; alt: string };

export type InfoSection = {
  title: string;
  content: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type RecognitionItem = {
  title: string;
  description: string;
};

export type ServiceNarrative = {
  problem: {
    label?: string;
    headline: string;
    description: string;
    context?: string;
  };
  issues: {
    label?: string;
    title: string;
    items: string[];
  };
  consequence: {
    title: string;
    description: string;
  };
  solution: {
    title: string;
    steps: {
      title: string;
      bullets: string[];
    }[];
  };
  differential: {
    title: string;
    description: string;
    emphasis?: string;
  };
  cta: {
    title: string;
    description: string;
    primaryLabel?: string;
    primaryHref?: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  };
};

export type PageCopy = {
  title: string;
  subtitle?: string;
  description: string;
  afterHeroTitle?: string;

  ctaLabel?: string;
  ctaHref?: string;

  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;

  /** Imágenes para el carrusel del hero (opcional). Si no se define, se usan las por defecto. */
  heroImages?: readonly HeroImage[];

  /** Mensajes cortos de autoridad o valor diferencial */
  highlights?: readonly string[];

  /** Bloque inmediatamente después del hero para que el usuario se identifique con su situación actual */
  recognitionSection?: {
    title: string;
    intro?: string;
    items: readonly RecognitionItem[];
  };

  /** Párrafo introductorio principal */
  intro?: string;

  /** Secciones de desarrollo del contenido */
  sections?: readonly InfoSection[];

  /** Preguntas frecuentes */
  faqs?: readonly FaqItem[];

  /** Estructura narrativa estratégica para páginas de servicio */
  narrative?: ServiceNarrative;

  /** Metadatos SEO */
  seo?: {
    title?: string;
    description?: string;
  };
};
