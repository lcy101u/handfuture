import { describe, expect, it } from "vitest";
import { INDEXABLE_CONTENT_PATHS, PUBLIC_PATHS, type PublicPath } from "./public-routes";
import { buildStructuredData } from "./site-metadata";
import { SUPPORTED_LOCALES } from "../i18n/locales";

interface ListItem {
  "@type": string;
  position: number;
  name: string;
  item: string;
}

function breadcrumbItems(path: PublicPath, locale: (typeof SUPPORTED_LOCALES)[number]) {
  const data = buildStructuredData(path, locale) as {
    breadcrumb?: { "@type": string; itemListElement: ListItem[] };
  };
  return data.breadcrumb?.itemListElement;
}

const breadcrumbPaths = PUBLIC_PATHS.filter(
  (path) => path === "/guides" || path.startsWith("/guides/"),
);

describe("breadcrumb structured data", () => {
  it("covers every guide route", () => {
    expect(breadcrumbPaths.length).toBeGreaterThan(1);
  });

  for (const locale of SUPPORTED_LOCALES) {
    for (const path of breadcrumbPaths) {
      it(`gives every ${locale} ListItem on ${path} a name`, () => {
        const items = breadcrumbItems(path, locale);
        expect(items).toBeDefined();
        items?.forEach((item) => {
          expect(item["@type"]).toBe("ListItem");
          expect(item.name).toBeTruthy();
          expect(item.name.trim()).toBe(item.name);
          expect(item.name).not.toMatch(/[|｜]\s*HandFuture$/);
          expect(item.item).toMatch(/^https:\/\/www\.handfortune\.com\//);
        });
        expect(items?.map((item) => item.position)).toEqual(
          items?.map((_, index) => index + 1),
        );
      });
    }
  }

  it("omits breadcrumbs on non-guide routes", () => {
    INDEXABLE_CONTENT_PATHS.filter(
      (path) => path !== "/guides" && !path.startsWith("/guides/"),
    ).forEach((path) => {
      expect(breadcrumbItems(path, "en")).toBeUndefined();
    });
  });
});
