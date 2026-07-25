import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "zh" | "en";

export interface LanguageState {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  zh: {
    "app.title": "HandFuture",
    "app.subtitle": "手相文化探索與手部偵測",
    "nav.home": "首頁",
    "nav.about": "關於",
    "nav.privacy": "隱私政策",
    "nav.terms": "使用條款",
    "language.switch": "切換語言",

    "hero.title": "從一張手部照片，開始一段文化探索",
    "hero.description":
      "照片會在你的瀏覽器內進行手部關節偵測；結果是一張用於文化探索與自我反思的非科學娛樂提示卡。",

    "disclaimer.prompt": "開始分析前請先閱讀並同意免責聲明。",
    "button.viewDisclaimer": "閱讀免責聲明",

    "tool.uploadTitle": "選擇手部照片",
    "tool.uploadDescription": "請使用單純背景，讓一隻手完整出現在畫面中。",
    "tool.previewTitle": "手部關節偵測",
    "tool.previewDescription": "偵測成功後，你可以主動選擇一張反思卡。",
    "tool.reset": "更換照片",
    "tool.choose": "選擇反思卡",

    "upload.drag": "拖放照片至此處，或點擊選擇檔案",
    "upload.formats": "支援 JPG、PNG、WebP 格式",
    "upload.open_camera": "開啟相機",
    "upload.select_file": "選擇檔案",
    "upload.tip1": "讓一隻手完整出現在畫面中",
    "upload.tip2": "使用均勻且充足的光線",
    "upload.tip3": "選擇單純背景並避免模糊",

    "home.feature.browser.title": "瀏覽器內偵測",
    "home.feature.browser.description":
      "模型定位 21 個手部關節，不會辨識或解讀掌褶。",
    "home.feature.reflection.title": "文化反思卡",
    "home.feature.reflection.description":
      "偵測成功後，由你主動選擇固定題庫中的一張非科學反思提示。",
    "home.feature.privacy.title": "照片不會上傳",
    "home.feature.privacy.description":
      "照片只由這項功能在目前的瀏覽器工作階段處理。",

    "home.continue.title": "繼續閱讀",
    "guide.basics.title": "手相文化入門",
    "guide.basics.summary": "從文化與歷史脈絡認識手相傳統的常見名稱。",
    "guide.science.title": "科學與限制",
    "guide.science.summary": "了解手部關節偵測能做什麼，以及手相缺乏哪些科學證據。",
    "guide.photo.title": "手部照片指南",
    "guide.photo.summary": "用光線、背景與取景提高瀏覽器偵測成功率。",

    "faq.title": "常見問題",
    "faq.detected.q": "這項工具會偵測什麼？",
    "faq.detected.a": "它只定位一隻手的 21 個關節座標，不會讀取掌褶。",
    "faq.scientific.q": "反思卡是科學結果嗎？",
    "faq.scientific.a": "不是。反思卡是非科學的文化娛樂與自我反思提示。",
    "faq.upload.q": "照片會上傳嗎？",
    "faq.upload.a": "不會。這項功能只在目前的瀏覽器工作階段處理照片。",
    "faq.decisions.q": "我應該依照結果做決定嗎？",
    "faq.decisions.a": "不應該。請勿用反思卡取代可靠資訊或合格專業意見。",

    "footer.explore": "探索",
    "footer.guides": "指南",
    "footer.project": "網站資訊",
    "footer.howItWorks": "運作方式",

    "theme.light": "淺色模式",
    "theme.dark": "深色模式",
    "theme.system": "跟隨系統",
    "theme.toggle": "切換主題",
  },
  en: {
    "app.title": "HandFuture",
    "app.subtitle": "Palmistry culture and hand detection",
    "nav.home": "Home",
    "nav.about": "About",
    "nav.privacy": "Privacy",
    "nav.terms": "Terms",
    "language.switch": "Switch language",

    "hero.title": "Start a cultural exploration with one hand photo",
    "hero.description":
      "Your photo is used for hand-joint detection in your browser. The result is a non-scientific entertainment prompt for cultural exploration and self-reflection.",

    "disclaimer.prompt":
      "Please review and accept the disclaimer before starting an analysis.",
    "button.viewDisclaimer": "View Disclaimer",

    "tool.uploadTitle": "Choose a hand photo",
    "tool.uploadDescription":
      "Use a plain background and keep one full hand visible in the frame.",
    "tool.previewTitle": "Hand-joint detection",
    "tool.previewDescription":
      "After detection succeeds, you can explicitly choose a reflection card.",
    "tool.reset": "Choose another photo",
    "tool.choose": "Choose reflection card",

    "upload.drag": "Drop a photo here, or click to choose a file",
    "upload.formats": "Supports JPG, PNG, and WebP",
    "upload.open_camera": "Open Camera",
    "upload.select_file": "Select File",
    "upload.tip1": "Keep one full hand visible in the frame",
    "upload.tip2": "Use bright, even lighting",
    "upload.tip3": "Choose a plain background and avoid blur",

    "home.feature.browser.title": "In-browser detection",
    "home.feature.browser.description":
      "The model locates 21 hand joints; it does not identify or interpret palm creases.",
    "home.feature.reflection.title": "Cultural reflection card",
    "home.feature.reflection.description":
      "After successful detection, you explicitly select one non-scientific prompt from a fixed set.",
    "home.feature.privacy.title": "Photo stays on your device",
    "home.feature.privacy.description":
      "This feature processes the photo only in the current browser session.",

    "home.continue.title": "Continue reading",
    "guide.basics.title": "Palmistry as culture",
    "guide.basics.summary":
      "Meet common palmistry terms in their cultural and historical context.",
    "guide.science.title": "Science and limitations",
    "guide.science.summary":
      "Learn what hand-joint detection can do and what scientific evidence palmistry lacks.",
    "guide.photo.title": "Hand photo guide",
    "guide.photo.summary":
      "Use lighting, background, and framing to improve browser detection.",

    "faq.title": "Frequently asked questions",
    "faq.detected.q": "What does this tool detect?",
    "faq.detected.a":
      "It locates only 21 joint coordinates on one hand; it does not read palm creases.",
    "faq.scientific.q": "Is the reflection card scientific?",
    "faq.scientific.a":
      "No. It is a non-scientific prompt for cultural entertainment and self-reflection.",
    "faq.upload.q": "Is my photo uploaded?",
    "faq.upload.a":
      "No. This feature processes it only in the current browser session.",
    "faq.decisions.q": "Should the result guide my decisions?",
    "faq.decisions.a":
      "No. Do not use a reflection card in place of reliable information or qualified professional advice.",

    "footer.explore": "Explore",
    "footer.guides": "Guides",
    "footer.project": "Project",
    "footer.howItWorks": "How it works",

    "theme.light": "Light Mode",
    "theme.dark": "Dark Mode",
    "theme.system": "System",
    "theme.toggle": "Toggle Theme",
  },
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: "zh",

      setLanguage: (language) => {
        set({ currentLanguage: language });
        document.documentElement.lang = language;
        document.title = translations[language]["app.title"];
      },

      t: (key) => {
        const { currentLanguage } = get();
        return translations[currentLanguage][key] ?? key;
      },
    }),
    { name: "language-store" },
  ),
);
