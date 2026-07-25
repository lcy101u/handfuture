import { describe, expect, it } from "vitest";
import { PUBLIC_PATHS, type GuidePath, type Locale } from "@/config/public-routes";
import { GUIDE_CONTENT, HOW_IT_WORKS_CONTENT } from "./guides";

const locales: Locale[] = ["zh", "en"];
const guidePaths = PUBLIC_PATHS.filter(
  (path): path is GuidePath => path.startsWith("/guides/"),
);

const unsafeClaims =
  /科學證明手相|掌紋能預測|性格準確|健康診斷|財富預測|scientifically proven palm|predicts your future|diagnoses|guaranteed accuracy/i;

const exactSources: Record<GuidePath, string[]> = {
  "/guides/palmistry-basics": [
    "https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/Palmistry",
    "https://www.merriam-webster.com/dictionary/palmistry",
  ],
  "/guides/science-and-limitations": [
    "https://dictionary.apa.org/barnum-effect",
    "https://developers.google.com/mediapipe/solutions/vision/hand_landmarker",
  ],
  "/guides/hand-photo-guide": [
    "https://developers.google.com/mediapipe/solutions/vision/hand_landmarker",
    "https://developer.mozilla.org/docs/Web/API/FileReader",
  ],
};

function allEditorialText(page: {
  title: string;
  summary: string;
  sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>;
}) {
  return [
    page.title,
    page.summary,
    ...page.sections.flatMap(({ heading, paragraphs, bullets = [] }) => [
      heading,
      ...paragraphs,
      ...bullets,
    ]),
  ].join(" ");
}

describe("bilingual guide editorial contract", () => {
  it.each(guidePaths.flatMap((path) => locales.map((locale) => [path, locale] as const)))(
    "%s has substantial, sourced %s content without unsafe claims",
    (path, locale) => {
      const page = GUIDE_CONTENT[path][locale];
      const paragraphText = page.sections.flatMap(({ paragraphs }) => paragraphs).join("");

      expect(page.summary.trim()).not.toBe("");
      expect(page.updatedAt).toBe("2026-07-26");
      expect(page.sections.length).toBeGreaterThanOrEqual(4);
      expect(paragraphText.length).toBeGreaterThanOrEqual(700);
      expect(page.sources.map(({ url }) => url)).toEqual(exactSources[path]);
      expect(page.sources.length).toBeGreaterThanOrEqual(2);
      expect(page.sources.every(({ label, url }) => label.length > 0 && url.startsWith("https://"))).toBe(true);
      expect(allEditorialText(page)).not.toMatch(unsafeClaims);
    },
  );

  it.each(locales)("makes the palmistry tradition/evidence boundary explicit in %s", (locale) => {
    const basics = allEditorialText(GUIDE_CONTENT["/guides/palmistry-basics"][locale]);
    const science = allEditorialText(GUIDE_CONTENT["/guides/science-and-limitations"][locale]);

    expect(basics).toMatch(
      locale === "zh"
        ? /占卜傳統.*不是.*實證|不是.*實證.*占卜傳統/
        : /divinatory tradition.*not an evidence-based|not an evidence-based.*divinatory tradition/i,
    );
    expect(basics).toMatch(locale === "zh" ? /生命線.*不.*壽命/ : /life line.*does not determine.*lifespan/i);
    expect(science).toMatch(locale === "zh" ? /沒有科學依據/ : /no scientific basis/i);
    expect(science).toMatch(locale === "zh" ? /巴納姆效應/ : /Barnum effect/i);
  });
});

describe("how-it-works editorial contract", () => {
  it.each(locales)("documents the visible implementation facts in %s", (locale) => {
    const page = HOW_IT_WORKS_CONTENT[locale];
    const text = allEditorialText(page);

    expect(page.updatedAt).toBe("2026-07-26");
    expect(page.sections).toHaveLength(4);
    expect(text).toMatch(/JPEG/i);
    expect(text).toMatch(/PNG/i);
    expect(text).toMatch(/WebP/i);
    expect(text).toMatch(/FileReader/);
    expect(text).toMatch(/21/);
    expect(text).toMatch(locale === "zh" ? /不.*辨識.*(?:生命線|掌褶)/ : /does not (?:identify|detect).*(?:life|palm) (?:line|crease)/i);
    expect(text).toMatch(locale === "zh" ? /四.*提示/ : /four general prompts/i);
    expect(text).toMatch(locale === "zh" ? /重新整理.*清除|關閉.*清除/ : /closing or refreshing.*clears/i);
    expect(page.sources.map(({ url }) => url)).toEqual([
      "https://developers.google.com/mediapipe/solutions/vision/hand_landmarker",
      "https://developer.mozilla.org/docs/Web/API/FileReader",
    ]);
    expect(allEditorialText(page)).not.toMatch(unsafeClaims);
  });
});
