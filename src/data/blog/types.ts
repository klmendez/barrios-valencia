export type BlogCategory =
  | "Pensión de vejez"
  | "Pensión de invalidez"
  | "Pensión de sobrevivientes"
  | "Historia laboral"
  | "Derecho laboral"
  | "Accidentes y seguros"
  | "General";

export type BlogSection = {
  question: string;
  answer: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  publishedAt: string;
  readTime: number;
  sections: BlogSection[];
  relatedServiceHref?: string;
  relatedServiceLabel?: string;
  tags?: string[];
  seo?: {
    title?: string;
    description?: string;
  };
};
