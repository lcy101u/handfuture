import type { Locale, PublicPath } from "./public-routes";

export const SITE_ORIGIN = "https://www.handfortune.com";
export const SITE_NAME = "HandFuture";
export const PUBLISHER_ID = "ca-pub-3713047615080346";
export const ADS_TXT_RECORD = "google.com, pub-3713047615080346, DIRECT, f08c47fec0942fa0";
export const LAST_UPDATED = "2026-07-26";

export interface RouteMetadata {
  title: string;
  description: string;
  canonical: string;
  ogUrl: string;
  ogImage: string;
  ogImageAlt: string;
}

type LocalizedMetadata = Record<Locale, Pick<RouteMetadata, "title" | "description" | "ogImageAlt">>;

const metadata = {
  "/": {
    zh: { title: "HandFuture｜手相文化探索與手部偵測體驗", description: "從文化角度認識手相傳統，使用瀏覽器內的手部偵測完成一張非科學、僅供娛樂與自我反思的提示卡；照片不會上傳到 HandFuture 伺服器。", ogImageAlt: "HandFuture 手相文化探索與手部偵測體驗" },
    en: { title: "HandFuture | Palmistry Culture and Hand Detection", description: "Explore palmistry as a cultural tradition and use in-browser hand detection to receive a non-scientific reflection prompt for entertainment; your photo is not uploaded to a HandFuture server.", ogImageAlt: "HandFuture palmistry culture and hand detection experience" },
  },
  "/how-it-works": {
    zh: { title: "運作方式｜HandFuture", description: "了解 HandFuture 如何在瀏覽器內尋找 21 個手部關節座標、如何選出娛樂性反思卡，以及這項工具不能辨識掌紋或預測人生的原因。", ogImageAlt: "HandFuture 的瀏覽器內手部偵測流程" },
    en: { title: "How HandFuture Works", description: "Learn how HandFuture finds 21 hand landmarks in your browser, selects an entertainment reflection card, and why the tool cannot read palm creases or predict life outcomes.", ogImageAlt: "HandFuture in-browser hand detection flow" },
  },
  "/guides/palmistry-basics": {
    zh: { title: "手相文化入門：傳統名稱與歷史脈絡｜HandFuture", description: "以文化史角度認識手相、生命線、智慧線與感情線等傳統名稱，並清楚區分歷史信仰、娛樂用途與現代科學證據。", ogImageAlt: "手相文化入門指南" },
    en: { title: "Palmistry Basics: Traditional Names and Context | HandFuture", description: "A cultural introduction to palmistry and traditional names such as the life, head, and heart lines, clearly separated from modern scientific evidence and safe entertainment use.", ogImageAlt: "Palmistry basics cultural guide" },
  },
  "/guides/science-and-limitations": {
    zh: { title: "手相、科學與限制：如何安全看待解讀｜HandFuture", description: "說明手部關節偵測與掌紋解讀的差異、巴納姆效應如何影響感受，以及為何手相內容不應取代醫療、財務或人生決策。", ogImageAlt: "手相科學限制與安全使用指南" },
    en: { title: "Palmistry, Science, and Limitations | HandFuture", description: "Understand the difference between hand-landmark detection and palm reading, how the Barnum effect shapes impressions, and why palmistry should not guide medical, financial, or life decisions.", ogImageAlt: "Palmistry science and limitations guide" },
  },
  "/guides/hand-photo-guide": {
    zh: { title: "手部照片指南：光線、角度與隱私｜HandFuture", description: "用均勻光線、單手、素色背景與完整入鏡提高瀏覽器手部偵測的成功率，並了解照片只在目前瀏覽器工作階段處理。", ogImageAlt: "手部照片拍攝與隱私指南" },
    en: { title: "Hand Photo Guide: Lighting, Framing, and Privacy | HandFuture", description: "Improve browser hand detection with even lighting, one fully visible hand, and a plain background, while understanding how the photo is processed during the current browser session.", ogImageAlt: "Hand photo and privacy guide" },
  },
  "/about": {
    zh: { title: "關於 HandFuture", description: "HandFuture 是一個獨立網頁專案，透過手部偵測與有來源的文章，協助讀者以透明、非科學且僅供娛樂的方式探索手相文化。", ogImageAlt: "關於 HandFuture 獨立網頁專案" },
    en: { title: "About HandFuture", description: "HandFuture is an independent web project combining hand detection with sourced articles so readers can explore palmistry culture transparently as non-scientific entertainment.", ogImageAlt: "About the independent HandFuture web project" },
  },
  "/privacy": {
    zh: { title: "隱私政策｜HandFuture", description: "查看 HandFuture 如何在瀏覽器內處理手部照片、使用本機儲存空間與 Vercel Analytics，以及 Google 廣告與同意選項如何運作。", ogImageAlt: "HandFuture 隱私政策" },
    en: { title: "Privacy Policy | HandFuture", description: "See how HandFuture processes hand photos in the browser, uses local storage and Vercel Analytics, and how Google advertising and consent choices operate.", ogImageAlt: "HandFuture privacy policy" },
  },
  "/terms": {
    zh: { title: "使用條款｜HandFuture", description: "閱讀 HandFuture 的娛樂用途、年齡建議、禁止行為、智慧財產、服務可用性與責任限制，並了解本工具不提供專業建議。", ogImageAlt: "HandFuture 使用條款" },
    en: { title: "Terms of Use | HandFuture", description: "Read HandFuture's entertainment scope, age guidance, prohibited conduct, intellectual property, service availability, and limits, including that the tool provides no professional advice.", ogImageAlt: "HandFuture terms of use" },
  },
} satisfies Record<PublicPath, LocalizedMetadata>;

export function getRouteMetadata(path: PublicPath, locale: Locale): RouteMetadata {
  const localized = metadata[path][locale];
  const canonical = `${SITE_ORIGIN}${path === "/" ? "/" : path}`;
  return {
    ...localized,
    canonical,
    ogUrl: canonical,
    ogImage: `${SITE_ORIGIN}/og-image.jpg`,
  };
}

export function buildStructuredData(path: PublicPath, locale: Locale): Record<string, unknown> {
  const meta = getRouteMetadata(path, locale);
  const base = {
    "@context": "https://schema.org",
    name: meta.title,
    description: meta.description,
    url: meta.canonical,
    inLanguage: locale === "zh" ? "zh-TW" : "en",
  };

  if (path === "/") {
    return {
      ...base,
      "@type": "WebApplication",
      applicationCategory: "EntertainmentApplication",
      operatingSystem: "Web Browser",
      offers: { "@type": "Offer", price: "0", priceCurrency: "TWD" },
    };
  }

  if (path.startsWith("/guides/")) {
    return {
      ...base,
      "@type": "Article",
      dateModified: LAST_UPDATED,
      publisher: { "@type": "Organization", name: SITE_NAME },
    };
  }

  return { ...base, "@type": "WebPage", publisher: { "@type": "Organization", name: SITE_NAME } };
}
