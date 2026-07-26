import { describe, expect, it } from "vitest";
import type { Locale } from "@/config/public-routes";
import {
  ABOUT_CONTENT,
  PRIVACY_CONTENT,
  TERMS_CONTENT,
} from "./policies";

const locales: Locale[] = ["zh", "en"];

const requiredPrivacyLinks = [
  "https://vercel.com/docs/analytics/privacy-policy",
  "https://policies.google.com/privacy",
  "https://support.google.com/adsense/answer/13554116",
];

function pageText(page: (typeof ABOUT_CONTENT)[Locale]) {
  return [
    page.title,
    page.summary,
    ...page.sections.flatMap((section) => [
      section.heading,
      ...section.paragraphs,
      ...(section.bullets ?? []),
    ]),
    ...page.sources.map((source) => source.label),
  ].join("\n");
}

describe("ABOUT_CONTENT", () => {
  it.each(locales)("publishes the required factual sections in %s", (locale) => {
    const page = ABOUT_CONTENT[locale];
    const expectedHeadings = locale === "zh"
      ? ["這個專案", "提供的內容", "不主張的事項", "編輯原則"]
      : ["This project", "What it provides", "What it does not claim", "Editorial principles"];

    expect(page.updatedAt).toBe("2026-07-26");
    expect(page.sections.map((section) => section.heading)).toEqual(expectedHeadings);
    expect(pageText(page)).toMatch(/HandFuture/);
    expect(pageText(page)).toMatch(locale === "zh" ? /獨立網頁專案/ : /independent web project/i);
    expect(pageText(page)).toMatch(locale === "zh" ? /瀏覽器內.*手部關節偵測/ : /in-browser hand-joint detector/i);
    expect(pageText(page)).toMatch(locale === "zh" ? /不.*科學.*手相/ : /does not provide scientific palm reading/i);
  });

  it.each(locales)("does not invent an organization or track record in %s", (locale) => {
    const text = pageText(ABOUT_CONTENT[locale]);

    expect(text).not.toMatch(
      /team of|expert network|our experts|advisors?|photography labs?|workshops?|model (?:evaluation )?reports?|newsletters?|founded|founding|awards?|user totals?|members?|團隊|專家團隊|顧問|自建拍攝|工作坊|模型評估報告|電子報|創辦|成立背景|獎項|使用者人數/i,
    );
    expect(text).not.toMatch(
      /(?:our|proprietary|自有|專有).{0,20}(?:palm )?(?:dataset|model)|(?:dataset|model).{0,20}(?:our|proprietary|自有|專有)/i,
    );
  });
});

describe("PRIVACY_CONTENT", () => {
  it.each(locales)("lists every observed browser-storage key and its purpose in %s", (locale) => {
    const text = pageText(PRIVACY_CONTENT[locale]);

    for (const key of ["palm-reading-storage", "language-store", "palm-theme"]) {
      expect(text).toContain(key);
    }
    expect(text).toMatch(locale === "zh" ? /免責聲明.*接受/ : /disclaimer acceptance/i);
    expect(text).toMatch(locale === "zh" ? /語言偏好/ : /language preference/i);
    expect(text).toMatch(locale === "zh" ? /主題偏好/ : /theme preference/i);
    expect(text).toMatch(
      locale === "zh"
        ? /瀏覽器.*網站資料.*隱私設定.*清除/
        : /clear .*through their browser's site-data or privacy settings/i,
    );
  });

  it.each(locales)("omits browser storage the current site never writes in %s", (locale) => {
    const text = pageText(PRIVACY_CONTENT[locale]);

    expect(text).not.toContain("image-filter-storage");
    expect(text).not.toMatch(locale === "zh" ? /濾鏡/ : /filter settings/i);
  });

  it.each(locales)("describes local image handling without claiming upload or retention in %s", (locale) => {
    const text = pageText(PRIVACY_CONTENT[locale]);

    expect(text).toMatch(/FileReader/);
    expect(text).toMatch(locale === "zh" ? /HTMLImageElement/ : /HTMLImageElement/);
    expect(text).toMatch(locale === "zh" ? /MediaPipe/ : /MediaPipe/i);
    expect(text).toMatch(locale === "zh" ? /目前頁面.*記憶體/ : /current page memory/i);
    expect(text).toMatch(locale === "zh" ? /不會傳送至 HandFuture.*應用程式伺服器/ : /not sent to a HandFuture application server/i);
    expect(text).toMatch(locale === "zh" ? /重設.*重新整理.*關閉分頁.*瀏覽器.*記憶體管理/ : /reset.*refresh.*tab close.*browser memory management/i);
  });

  it.each(locales)("does not claim canvas processing of the hand image in %s", (locale) => {
    const text = pageText(PRIVACY_CONTENT[locale]);

    expect(text).not.toMatch(/canvas/i);
  });

  it.each(locales)("discloses third-party asset requests without exposing the hand image in %s", (locale) => {
    const text = pageText(PRIVACY_CONTENT[locale]);

    expect(text).toContain("cdn.jsdelivr.net");
    expect(text).toContain("fonts.googleapis.com");
    expect(text).toContain("fonts.gstatic.com");
    expect(text).toMatch(locale === "zh" ? /IP 位址/ : /IP address/i);
    expect(text).toMatch(locale === "zh" ? /user agent/i : /user agent/i);
    expect(text).toMatch(
      locale === "zh"
        ? /不包含.*(?:所選的)?手部影像/
        : /do not include the selected hand image/i,
    );
  });

  it.each(locales)("names the current providers and consent boundary in %s", (locale) => {
    const page = PRIVACY_CONTENT[locale];
    const text = pageText(page);

    expect(text).toMatch(/Vercel/);
    expect(text).toMatch(locale === "zh" ? /主機託管.*傳遞記錄/ : /hosting.*delivery logs/i);
    expect(text).toMatch(locale === "zh" ? /Web Analytics.*整體/ : /aggregate Vercel Web Analytics/i);
    expect(text).toMatch(locale === "zh" ? /事件.*不包含.*手部照片/ : /events do not include the palm image/i);
    expect(text).toMatch(/Google AdSense/);
    expect(text).toMatch(locale === "zh" ? /同意.*Google.*政策/ : /consent.*Google policy/i);
    expect(text).toMatch(locale === "zh" ? /啟用 Google 認證.*CMP/ : /Google-certified CMP.*enabled/i);
    expect(text).toMatch(locale === "zh" ? /Cloudflare.*權威 DNS.*不(?:是)?.*內容代理/ : /Cloudflare.*authoritative DNS.*not.*content proxy/i);
    expect(page.sources.map((source) => source.url)).toEqual(requiredPrivacyLinks);
  });

  it.each(locales)("gates the single privacy contact address on working email routing in %s", (locale) => {
    const text = pageText(PRIVACY_CONTENT[locale]);
    const matches = text.match(/privacy@handfortune\.com/g) ?? [];

    expect(matches).toHaveLength(1);
    expect(text).toContain(
      locale === "zh"
        ? "此信箱僅在網域郵件轉寄啟用後使用。"
        : "This address is monitored only after domain email routing is enabled.",
    );
  });
});

describe("TERMS_CONTENT", () => {
  it.each(locales)("covers the complete entertainment-use terms in %s", (locale) => {
    const page = TERMS_CONTENT[locale];
    const text = pageText(page);
    const expectedHeadings = locale === "zh"
      ? [
          "接受條款與服務說明",
          "僅供娛樂",
          "年齡指引",
          "可接受的使用方式",
          "使用者影像",
          "智慧財產與授權",
          "可用性與變更",
          "免責聲明與責任限制",
          "聯絡方式",
        ]
      : [
          "Acceptance and service description",
          "Entertainment only",
          "Age guidance",
          "Acceptable use",
          "User images",
          "Intellectual property and licenses",
          "Availability and changes",
          "Disclaimer and limitation of liability",
          "Contact",
        ];

    expect(page.updatedAt).toBe("2026-07-26");
    expect(page.sections.map((section) => section.heading)).toEqual(expectedHeadings);
    expect(text).toMatch(locale === "zh" ? /醫療.*心理健康.*法律.*財務.*就業.*關係.*相容性.*未來/ : /medical.*mental-health.*legal.*financial.*employment.*relationship.*compatibility.*future/i);
    expect(text).toMatch(locale === "zh" ? /成年年齡.*家長或監護人/ : /age of majority.*parent or guardian/i);
    expect(text).toMatch(locale === "zh" ? /自動化流量.*操弄廣告/ : /automated traffic.*ad manipulation/i);
    expect(text).toMatch(locale === "zh" ? /不主張.*所有權/ : /does not claim ownership/i);
    expect(text).toMatch(locale === "zh" ? /不保證.*正常運作時間/ : /no uptime guarantee/i);
    expect(text).toMatch(locale === "zh" ? /適用法律/ : /applicable law/i);
    expect(page.sources).toContainEqual({
      label: locale === "zh" ? "隱私政策" : "Privacy Policy",
      url: "/privacy",
    });
  });
});

describe("policy claim hygiene", () => {
  it.each(locales)("omits unsupported services and promises in %s", (locale) => {
    const text = [PRIVACY_CONTENT[locale], TERMS_CONTENT[locale]]
      .map(pageText)
      .join("\n");

    expect(text).not.toMatch(
      /GA4|Google Analytics 4|cloud exports?|雲端匯出|90 days|90 天|MFA|multi-factor|多因子|seven business days|7 個工作天|legal@handfortune\.com|dontsp\.am/i,
    );
    expect(text).not.toMatch(/Taiwan|臺灣|Taipei|台北|universal age|年滿\s*1[368]\s*歲/i);
    expect(text).not.toMatch(/canvas/i);
  });
});
