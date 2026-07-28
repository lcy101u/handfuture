import { describe, expect, it } from "vitest";
import { PUBLIC_PATHS, type GuidePath } from "@/config/public-routes";
import { SUPPORTED_LOCALES, type Locale } from "@/i18n/locales";
import { GUIDE_CONTENT, HOW_IT_WORKS_CONTENT, type EditorialPage } from "./guides";

const guidePaths = PUBLIC_PATHS.filter(
  (path): path is GuidePath => path.startsWith("/guides/"),
);
const establishedGuideLocales: Locale[] = ["zh-TW", "en"];

const unsafeClaims =
  /科學證明手相|科学证明手相|掌紋能預測|掌纹能预测|性格準確|性格准确|健康診斷|健康诊断|財富預測|财富预测|scientifically proven palm|predicts your future|diagnoses|guaranteed accuracy/i;

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

function allEditorialText(page: EditorialPage) {
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

function expectTranslatedStructure(page: EditorialPage, english: EditorialPage) {
  expect(page.title).not.toBe(english.title);
  expect(page.summary).not.toBe(english.summary);
  expect(page.sections).toHaveLength(english.sections.length);

  page.sections.forEach((section, sectionIndex) => {
    const englishSection = english.sections[sectionIndex];
    expect(section.heading).not.toBe(englishSection.heading);
    expect(section.paragraphs).toHaveLength(englishSection.paragraphs.length);
    section.paragraphs.forEach((paragraph, paragraphIndex) => {
      expect(paragraph).not.toBe(englishSection.paragraphs[paragraphIndex]);
      expect(paragraph.trim().length).toBeGreaterThan(40);
    });
    expect(section.bullets?.length ?? 0).toBe(englishSection.bullets?.length ?? 0);
    section.bullets?.forEach((bullet, bulletIndex) => {
      expect(bullet).not.toBe(englishSection.bullets?.[bulletIndex]);
    });
  });
}

const nativeText: Record<Exclude<Locale, "en">, RegExp> = {
  "zh-TW": /文化娛樂與自我對話/,
  "zh-CN": /文化娱乐与自我反思/,
  ja: /文化的な娯楽と自己省察/,
  ko: /문화적 오락과 자기 성찰/,
  es: /entretenimiento cultural y la autorreflexión/i,
  "pt-BR": /entretenimento cultural e a autorreflexão/i,
  fr: /destinée à l’exploration culturelle et à l’autoréflexion dans un cadre de divertissement culturel non scientifique/i,
};

describe("eight-locale guide editorial contract", () => {
  it.each(
    guidePaths.flatMap((path) =>
      SUPPORTED_LOCALES.map((locale) => [path, locale] as const),
    ),
  )("%s has substantial, sourced %s content without unsafe claims", (path, locale) => {
    const page = GUIDE_CONTENT[path][locale];
    const paragraphText = page.sections.flatMap(({ paragraphs }) => paragraphs).join("");

    expect(page.summary.trim()).not.toBe("");
    expect(page.updatedAt).toBe("2026-07-26");
    expect(page.sections.length).toBeGreaterThanOrEqual(4);
    expect(paragraphText.length).toBeGreaterThanOrEqual(550);
    if (establishedGuideLocales.includes(locale)) {
      expect(paragraphText.length).toBeGreaterThanOrEqual(700);
    }
    expect(page.sources.map(({ url }) => url)).toEqual(exactSources[path]);
    expect(page.sources.map(({ label }) => label)).toEqual(
      GUIDE_CONTENT[path].en.sources.map(({ label }) => label),
    );
    expect(page.sources.length).toBeGreaterThanOrEqual(2);
    expect(
      page.sources.every(
        ({ label, url }) => label.length > 0 && url.startsWith("https://"),
      ),
    ).toBe(true);
    expect(allEditorialText(page)).not.toMatch(unsafeClaims);
  });

  it.each(SUPPORTED_LOCALES.filter((locale) => locale !== "en"))(
    "translates every substantive guide field rather than falling back to English in %s",
    (locale) => {
      expectTranslatedStructure(HOW_IT_WORKS_CONTENT[locale], HOW_IT_WORKS_CONTENT.en);
      for (const path of guidePaths) {
        expectTranslatedStructure(GUIDE_CONTENT[path][locale], GUIDE_CONTENT[path].en);
      }
      expect(allEditorialText(HOW_IT_WORKS_CONTENT[locale])).toMatch(nativeText[locale]);
    },
  );

  it.each(establishedGuideLocales)(
    "preserves the established palmistry tradition/evidence boundary in %s",
    (locale) => {
      const basics = allEditorialText(
        GUIDE_CONTENT["/guides/palmistry-basics"][locale],
      );
      const science = allEditorialText(
        GUIDE_CONTENT["/guides/science-and-limitations"][locale],
      );

      expect(basics).toMatch(
        locale === "zh-TW"
          ? /占卜傳統.*不是.*實證|不是.*實證.*占卜傳統/
          : /divinatory tradition.*not an evidence-based|not an evidence-based.*divinatory tradition/i,
      );
      expect(basics).toMatch(
        locale === "zh-TW"
          ? /生命線.*不.*壽命/
          : /life line.*does not determine.*lifespan/i,
      );
      expect(science).toMatch(
        locale === "zh-TW" ? /沒有科學依據/ : /no scientific basis/i,
      );
      expect(science).toMatch(locale === "zh-TW" ? /巴納姆效應/ : /Barnum effect/i);
    },
  );
});

describe("how-it-works editorial contract", () => {
  it.each(SUPPORTED_LOCALES)(
    "documents the visible implementation facts in %s",
    (locale) => {
      const page = HOW_IT_WORKS_CONTENT[locale];
      const text = allEditorialText(page);

      expect(page.updatedAt).toBe("2026-07-26");
      expect(page.sections).toHaveLength(4);
      expect(text).toMatch(/JPEG/i);
      expect(text).toMatch(/PNG/i);
      expect(text).toMatch(/WebP/i);
      expect(text).toMatch(/FileReader/);
      expect(text).toMatch(/MediaPipe/);
      expect(text).toMatch(/21/);
      expect(page.sources.map(({ url }) => url)).toEqual([
        "https://developers.google.com/mediapipe/solutions/vision/hand_landmarker",
        "https://developer.mozilla.org/docs/Web/API/FileReader",
      ]);
      expect(page.sources.map(({ label }) => label)).toEqual(
        HOW_IT_WORKS_CONTENT.en.sources.map(({ label }) => label),
      );
      expect(text).not.toMatch(unsafeClaims);
    },
  );

  it.each(establishedGuideLocales)(
    "preserves the established implementation-detail assertions in %s",
    (locale) => {
      const text = allEditorialText(HOW_IT_WORKS_CONTENT[locale]);

      expect(text).toMatch(
        locale === "zh-TW"
          ? /不.*辨識.*(?:生命線|掌褶)/
          : /does not (?:identify|detect).*(?:life|palm) (?:line|crease)/i,
      );
      expect(text).toMatch(
        locale === "zh-TW" ? /四.*提示/ : /four general prompts/i,
      );
      expect(text).toMatch(
        locale === "zh-TW"
          ? /重新整理.*清除|關閉.*清除/
          : /closing or refreshing.*clears/i,
      );
    },
  );
});

const safetySemantics: Record<
  Locale,
  { entertainment: RegExp; decisions: RegExp; localPhoto: RegExp; jointsNotCreases: RegExp }
> = {
  "zh-TW": {
    entertainment: /非科學.*文化娛樂|文化娛樂.*非科學/,
    decisions: /醫療.*財務.*重大決定/,
    localPhoto: /照片.*不會上傳|影像.*不會傳送至 HandFuture/,
    jointsNotCreases: /21.*關節.*不.*(?:掌褶|掌紋)/,
  },
  "zh-CN": {
    entertainment: /非科学.*文化娱乐|文化娱乐.*非科学/,
    decisions: /医疗.*财务.*重大决定/,
    localPhoto: /照片.*不会上传|图像.*不会发送到 HandFuture/,
    jointsNotCreases: /21.*关节.*不.*(?:掌褶|掌纹)/,
  },
  en: {
    entertainment: /non-scientific.*cultural entertainment|cultural entertainment.*non-scientific/i,
    decisions: /medical.*financial.*(?:consequential|major).*decisions/i,
    localPhoto: /photo.*not uploaded|image is not sent to a HandFuture/i,
    jointsNotCreases: /21.*joints.*does not.*(?:palm )?creases/i,
  },
  ja: {
    entertainment: /非科学的.*文化的な娯楽|文化的な娯楽.*非科学的/,
    decisions: /医療.*金融.*重要な意思決定/,
    localPhoto: /写真.*アップロードされません|画像.*HandFuture.*送信されません/,
    jointsNotCreases: /21.*関節.*手相線.*(?:識別|読み取り)しません/,
  },
  ko: {
    entertainment: /비과학적.*문화적 오락|문화적 오락.*비과학적/,
    decisions: /의료.*재정.*중요한 결정/,
    localPhoto: /사진.*업로드되지 않습니다|이미지.*HandFuture.*전송되지 않습니다/,
    jointsNotCreases: /21개.*관절.*손금.*(?:식별|읽지)하지 않습니다/,
  },
  es: {
    entertainment: /no científic[oa].*entretenimiento cultural|entretenimiento cultural.*no científic[oa]/i,
    decisions: /médic[oa].*financier[oa].*decisiones importantes/i,
    localPhoto: /foto.*no se (?:carga|sube)|imagen.*no se envía.*HandFuture/i,
    jointsNotCreases: /21.*articulaciones.*no (?:identifica|lee).*(?:líneas|pliegues) de la palma/i,
  },
  "pt-BR": {
    entertainment: /não científic[oa].*entretenimento cultural|entretenimento cultural.*não científic[oa]/i,
    decisions: /médic[oa].*financeir[oa].*decisões importantes/i,
    localPhoto: /foto.*não (?:é enviada|é carregada)|imagem.*não é enviada.*HandFuture/i,
    jointsNotCreases: /21.*articulações.*não (?:identifica|lê).*(?:linhas|dobras) da palma/i,
  },
  fr: {
    entertainment: /non scientifique.*divertissement culturel|divertissement culturel.*non scientifique/i,
    decisions: /médical.*financi.*décisions importantes/i,
    localPhoto: /photo.*n’est pas (?:téléversée|envoyée)|image.*n’est pas envoyée.*HandFuture/i,
    jointsNotCreases: /21.*articulations.*n’identifie pas.*(?:lignes|plis) de la paume/i,
  },
};

describe("high-risk meaning audit", () => {
  it.each(SUPPORTED_LOCALES)(
    "retains entertainment, decision, photo, and detector boundaries in %s",
    (locale) => {
      const text = [
        allEditorialText(HOW_IT_WORKS_CONTENT[locale]),
        ...guidePaths.map((path) => allEditorialText(GUIDE_CONTENT[path][locale])),
      ].join(" ");
      const semantics = safetySemantics[locale];

      expect(text).toMatch(semantics.entertainment);
      expect(text).toMatch(semantics.decisions);
      expect(text).toMatch(semantics.localPhoto);
      expect(text).toMatch(semantics.jointsNotCreases);
    },
  );
});
