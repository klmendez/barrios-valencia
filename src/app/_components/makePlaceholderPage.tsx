import { ServicePage, type SubLink } from "@/components/layout/ServicePage";
import { getPageCopy, type PagePath } from "@/data/routes";

export function makePlaceholderPage(path: PagePath, subLinks?: SubLink[]) {
  const Page = () => {
    const copy = getPageCopy(path);
    return (
      <ServicePage
        path={path}
        copy={copy}
        subLinks={subLinks}
      />
    );
  };

  return Page;
}
