import type { BlogPost, BlogCategory } from "./types";

import { queEsUnaPension } from "./posts/que-es-una-pension";
import { quienTieneDerechoAPension } from "./posts/quien-tiene-derecho-a-pension";
import { comoAplicarPensionDeVejez } from "./posts/como-aplicar-pension-de-vejez";
import { procesoSolicitudPension } from "./posts/proceso-solicitud-pension";
import { queEsPensionDeInvalidez } from "./posts/que-es-pension-de-invalidez";
import { fechaEstructuracionInvalidez } from "./posts/fecha-estructuracion-invalidez";
import { pensionDeSobrevivientes } from "./posts/pension-de-sobrevivientes";
import { documentosPensionSobrevivientes } from "./posts/documentos-pension-sobrevivientes";
import { queEsLaHistoriaLaboral } from "./posts/que-es-la-historia-laboral";
import { corregirHistoriaLaboral } from "./posts/corregir-historia-laboral";

export const allPosts: BlogPost[] = [
  queEsUnaPension,
  quienTieneDerechoAPension,
  comoAplicarPensionDeVejez,
  procesoSolicitudPension,
  queEsPensionDeInvalidez,
  fechaEstructuracionInvalidez,
  pensionDeSobrevivientes,
  documentosPensionSobrevivientes,
  queEsLaHistoriaLaboral,
  corregirHistoriaLaboral,
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((post) => post.slug === slug);
}

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return allPosts.filter((post) => post.category === category);
}

export const allCategories: BlogCategory[] = [
  ...new Set(allPosts.map((p) => p.category)),
];

export type { BlogPost, BlogCategory } from "./types";
