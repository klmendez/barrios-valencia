import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const baseUrl = new URL("../src/app/", import.meta.url);
const basePath = fileURLToPath(baseUrl);

const entries = {
  "servicios/page.tsx": "/servicios",
  "servicios/quiero-pensionarme/page.tsx": "/servicios/quiero-pensionarme",
  "servicios/quiero-pensionarme/pension-de-vejez/page.tsx": "/servicios/quiero-pensionarme/pension-de-vejez",
  "servicios/quiero-pensionarme/pension-anticipada-de-vejez/page.tsx": "/servicios/quiero-pensionarme/pension-anticipada-de-vejez",
  "servicios/quiero-pensionarme/pension-anticipada-por-hijo-con-discapacidad/page.tsx":
    "/servicios/quiero-pensionarme/pension-anticipada-por-hijo-con-discapacidad",
  "servicios/quiero-pensionarme/proyeccion-pensional/page.tsx": "/servicios/quiero-pensionarme/proyeccion-pensional",
  "servicios/quiero-pensionarme/devolucion-de-saldos/page.tsx": "/servicios/quiero-pensionarme/devolucion-de-saldos",
  "servicios/me-negaron-la-pension-o-me-pagan-mal/page.tsx": "/servicios/me-negaron-la-pension-o-me-pagan-mal",
  "servicios/me-negaron-la-pension-o-me-pagan-mal/negacion-de-pension/page.tsx":
    "/servicios/me-negaron-la-pension-o-me-pagan-mal/negacion-de-pension",
  "servicios/me-negaron-la-pension-o-me-pagan-mal/reliquidacion-de-pension/page.tsx":
    "/servicios/me-negaron-la-pension-o-me-pagan-mal/reliquidacion-de-pension",
  "servicios/me-negaron-la-pension-o-me-pagan-mal/retroactivo-pensional/page.tsx":
    "/servicios/me-negaron-la-pension-o-me-pagan-mal/retroactivo-pensional",
  "servicios/me-negaron-la-pension-o-me-pagan-mal/correccion-de-historia-laboral/page.tsx":
    "/servicios/me-negaron-la-pension-o-me-pagan-mal/correccion-de-historia-laboral",
  "servicios/perdi-capacidad-laboral/page.tsx": "/servicios/perdi-capacidad-laboral",
  "servicios/perdi-capacidad-laboral/pension-de-invalidez/page.tsx": "/servicios/perdi-capacidad-laboral/pension-de-invalidez",
  "servicios/perdi-capacidad-laboral/calificacion-de-perdida-de-capacidad-laboral/page.tsx":
    "/servicios/perdi-capacidad-laboral/calificacion-de-perdida-de-capacidad-laboral",
  "servicios/perdi-capacidad-laboral/pension-anticipada-por-invalidez/page.tsx":
    "/servicios/perdi-capacidad-laboral/pension-anticipada-por-invalidez",
  "servicios/perdi-capacidad-laboral/invalidez-para-victimas-de-violencia/page.tsx":
    "/servicios/perdi-capacidad-laboral/invalidez-para-victimas-de-violencia",
  "servicios/fallecio-un-familiar/page.tsx": "/servicios/fallecio-un-familiar",
  "servicios/fallecio-un-familiar/pension-de-sobrevivientes/page.tsx": "/servicios/fallecio-un-familiar/pension-de-sobrevivientes",
  "servicios/fallecio-un-familiar/pension-familiar/page.tsx": "/servicios/fallecio-un-familiar/pension-familiar",
  "servicios/tuve-un-accidente/page.tsx": "/servicios/tuve-un-accidente",
  "servicios/tuve-un-accidente/accidentes-de-trabajo/page.tsx": "/servicios/tuve-un-accidente/accidentes-de-trabajo",
  "servicios/tuve-un-accidente/enfermedades-laborales/page.tsx": "/servicios/tuve-un-accidente/enfermedades-laborales",
  "servicios/tuve-un-accidente/accidentes-de-transito/page.tsx": "/servicios/tuve-un-accidente/accidentes-de-transito",
  "servicios/tuve-un-accidente/seguros-e-indemnizaciones/page.tsx": "/servicios/tuve-un-accidente/seguros-e-indemnizaciones",
  "servicios/tengo-un-problema-laboral/page.tsx": "/servicios/tengo-un-problema-laboral",
  "servicios/tengo-un-problema-laboral/despido-injustificado/page.tsx": "/servicios/tengo-un-problema-laboral/despido-injustificado",
  "servicios/tengo-un-problema-laboral/liquidacion-y-prestaciones-sociales/page.tsx":
    "/servicios/tengo-un-problema-laboral/liquidacion-y-prestaciones-sociales",
  "servicios/tengo-un-problema-laboral/procesos-disciplinarios/page.tsx": "/servicios/tengo-un-problema-laboral/procesos-disciplinarios",
  "servicios/tengo-un-problema-laboral/demandas-laborales/page.tsx": "/servicios/tengo-un-problema-laboral/demandas-laborales",
  "servicios/tengo-un-problema-laboral/seguridad-y-salud-en-el-trabajo/page.tsx":
    "/servicios/tengo-un-problema-laboral/seguridad-y-salud-en-el-trabajo",
  "casos-de-exito/page.tsx": "/casos-de-exito",
  "sobre-nosotros/page.tsx": "/sobre-nosotros",
  "blog/page.tsx": "/blog",
  "contacto/page.tsx": "/contacto",
  "consulta-gratuita/page.tsx": "/consulta-gratuita",
};

const template = (route) => `import { makePlaceholderPage } from "@/app/_components/makePlaceholderPage";

export default makePlaceholderPage("${route}");
`;

for (const [relativePath, route] of Object.entries(entries)) {
  const filePath = fileURLToPath(new URL(relativePath, baseUrl));
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, template(route), "utf8");
}

console.log(`Generated ${Object.keys(entries).length} placeholder pages.`);
