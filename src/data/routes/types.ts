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

export type PageCopy = {
  title: string;
  subtitle?: string;
  description: string;

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

  /** Metadatos SEO */
  seo?: {
    title?: string;
    description?: string;
  };
};
