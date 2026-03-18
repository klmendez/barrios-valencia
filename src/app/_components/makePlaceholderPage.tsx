import { ServicePage } from "@/components/layout/ServicePage";
import { getPageCopy, type PagePath } from "@/data/routes";

export function makePlaceholderPage(path: PagePath) {
  const Page = () => {
    const copy = getPageCopy(path);
    return (
      <ServicePage
        path={path}
        copy={copy}
      />
    );
  };

  return Page;
}
