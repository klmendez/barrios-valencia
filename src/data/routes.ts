import type { PageCopy } from "./routes/types";

import { generalPages } from "./routes/sections/general";
import { pensionPlanningPages } from "./routes/sections/services/pension-planning";
import { pensionDefensePages } from "./routes/sections/services/pension-defense";
import { capacityLossPages } from "./routes/sections/services/capacity-loss";
import { survivorSupportPages } from "./routes/sections/services/survivor-support";
import { accidentSupportPages } from "./routes/sections/services/accident-support";
import { laborIssuesPages } from "./routes/sections/services/labor-issues";

const pageCopy = {
  ...generalPages,
  ...pensionPlanningPages,
  ...pensionDefensePages,
  ...capacityLossPages,
  ...survivorSupportPages,
  ...accidentSupportPages,
  ...laborIssuesPages,
} satisfies Record<string, PageCopy>;

export type PagePath = keyof typeof pageCopy;

export function getPageCopy(path: PagePath): PageCopy {
  return pageCopy[path];
}

export type { PageCopy } from "./routes/types";
export type { HeroImage, InfoSection, FaqItem, RecognitionItem } from "./routes/types";

export { pageCopy };
