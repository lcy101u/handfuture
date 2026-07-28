import { describe, expect, it } from "vitest";
import { SUPPORTED_LOCALES, type Locale } from "@/i18n/locales";
import {
  ABOUT_CONTENT,
  PRIVACY_CONTENT,
  TERMS_CONTENT,
} from "./policies";

const establishedLocales: Locale[] = ["zh-TW", "en"];

const requiredPrivacyLinks = [
  "https://vercel.com/docs/analytics/privacy-policy",
  "https://policies.google.com/privacy",
  "https://support.google.com/adsense/answer/13554116",
];

const localeSuggestionDisclosure: Record<
  Locale,
  {
    headings: string[];
    browser: RegExp;
    saved: RegExp;
    country: RegExp;
    minimization: RegExp;
  }
> = {
  "zh-TW": {
    headings: ["適用範圍與日期", "手部影像", "外部資源請求", "瀏覽器儲存", "語言建議", "Vercel 主機與分析", "Google 廣告", "區域同意", "Cloudflare DNS", "選擇與權利", "聯絡方式"],
    browser: /瀏覽器.*語言/,
    saved: /儲存.*語言偏好/,
    country: /Vercel.*IP.*國家代碼/,
    minimization: /不會.*(?:儲存.*完整.*IP|完整.*IP.*(?:儲存|保存)).*不會.*位置.*檔案/,
  },
  "zh-CN": {
    headings: ["适用范围与日期", "手部图像", "外部资源请求", "浏览器存储", "语言建议", "Vercel 托管与分析", "Google 广告", "区域同意", "Cloudflare DNS", "选择与权利", "联系方式"],
    browser: /浏览器.*语言/,
    saved: /保存.*语言偏好/,
    country: /Vercel.*IP.*国家代码/,
    minimization: /不会.*(?:存储.*完整.*IP|完整.*IP.*(?:存储|保存)).*不会.*位置.*档案/,
  },
  en: {
    headings: ["Scope and date", "Hand images", "External resource requests", "Browser storage", "Language suggestion", "Vercel hosting and analytics", "Google advertising", "Regional consent", "Cloudflare DNS", "Choices and rights", "Contact"],
    browser: /browser languages/i,
    saved: /saved language preference/i,
    country: /(?:Vercel.*IP-derived country code|IP-derived country code.*Vercel)/i,
    minimization: /does not.*store.*full IP.*(?:create|build).*location profile/i,
  },
  ja: {
    headings: ["適用範囲と日付", "手の画像", "外部リソースへの要求", "ブラウザー保存", "言語の提案", "Vercel のホスティングと分析", "Google 広告", "地域別の同意", "Cloudflare DNS", "選択肢と権利", "連絡先"],
    browser: /ブラウザー.*言語/,
    saved: /保存済み.*言語/,
    country: /Vercel.*IP.*国コード/,
    minimization: /完全な IP.*保存.*位置プロファイル.*作成/,
  },
  ko: {
    headings: ["범위와 날짜", "손 이미지", "외부 리소스 요청", "브라우저 저장", "언어 제안", "Vercel 호스팅과 분석", "Google 광고", "지역별 동의", "Cloudflare DNS", "선택과 권리", "연락처"],
    browser: /브라우저.*언어/,
    saved: /저장.*언어/,
    country: /Vercel.*IP.*국가 코드/,
    minimization: /전체 IP.*저장.*위치 프로필.*만들/,
  },
  es: {
    headings: ["Ámbito y fecha", "Imágenes de manos", "Solicitudes de recursos externos", "Almacenamiento del navegador", "Sugerencia de idioma", "Alojamiento y análisis de Vercel", "Publicidad de Google", "Consentimiento regional", "DNS de Cloudflare", "Opciones y derechos", "Contacto"],
    browser: /idiomas del navegador/i,
    saved: /preferencia de idioma guardada/i,
    country: /Vercel.*código de país.*derivado.*IP/i,
    minimization: /no.*guarda.*IP completa.*ni crea.*perfil de ubicación/i,
  },
  "pt-BR": {
    headings: ["Escopo e data", "Imagens de mãos", "Solicitações de recursos externos", "Armazenamento do navegador", "Sugestão de idioma", "Hospedagem e análises da Vercel", "Publicidade do Google", "Consentimento regional", "DNS da Cloudflare", "Escolhas e direitos", "Contato"],
    browser: /idiomas do navegador/i,
    saved: /preferência de idioma salva/i,
    country: /Vercel.*código de país.*derivado.*IP/i,
    minimization: /não.*armazena.*IP completo.*nem cria.*perfil de localização/i,
  },
  fr: {
    headings: ["Champ d’application et date", "Images de mains", "Requêtes de ressources externes", "Stockage du navigateur", "Suggestion de langue", "Hébergement et analyses Vercel", "Publicité Google", "Consentement régional", "DNS Cloudflare", "Choix et droits", "Contact"],
    browser: /langues du navigateur/i,
    saved: /préférence linguistique enregistrée/i,
    country: /Vercel.*code pays.*dérivé.*IP/i,
    minimization: /ne.*(?:stocke|ni ne stocke).*IP complète.*(?:ne crée|ni ne crée).*profil de localisation/i,
  },
};

// Matches any English or Chinese phrasing that attributes ownership of
// jsDelivr / cdn.jsdelivr.net to Google. jsDelivr is an independent CDN;
// @mediapipe/hands merely publishes its npm package assets there.
const jsDelivrOwnershipPattern =
  /Google(?:['’]s|-owned|\s+owned|\s+owns)(?:\s+the)?\s*(?:cdn\.jsdelivr\.net|jsDelivr)|Google\s*(?:的|擁有(?:的)?)\s*(?:cdn\.jsdelivr\.net|jsDelivr)/i;

// Table of concrete example phrases proving jsDelivrOwnershipPattern catches
// every named ownership form (English: 's / -owned / owned / owns; Chinese:
// 的 / 擁有), independent of whatever the actual policy prose says today.
const prohibitedJsDelivrOwnershipPhrases = [
  "Google's cdn.jsdelivr.net",
  "Google's jsDelivr",
  "Google-owned jsDelivr",
  "Google-owned cdn.jsdelivr.net",
  "Google owned jsDelivr",
  "Google owned the cdn.jsdelivr.net",
  "Google owns jsDelivr",
  "Google owns cdn.jsdelivr.net",
  "Google 的 cdn.jsdelivr.net",
  "Google 的 jsDelivr",
  "Google 擁有的 jsDelivr",
  "Google 擁有 cdn.jsdelivr.net",
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
  it.each(establishedLocales)("publishes the required factual sections in %s", (locale) => {
    const page = ABOUT_CONTENT[locale];
    const expectedHeadings = locale === "zh-TW"
      ? ["這個專案", "提供的內容", "不主張的事項", "編輯原則"]
      : ["This project", "What it provides", "What it does not claim", "Editorial principles"];

    expect(page.updatedAt).toBe("2026-07-26");
    expect(page.sections.map((section) => section.heading)).toEqual(expectedHeadings);
    expect(pageText(page)).toMatch(/HandFuture/);
    expect(pageText(page)).toMatch(locale === "zh-TW" ? /獨立網頁專案/ : /independent web project/i);
    expect(pageText(page)).toMatch(locale === "zh-TW" ? /瀏覽器內.*手部關節偵測/ : /in-browser hand-joint detector/i);
    expect(pageText(page)).toMatch(locale === "zh-TW" ? /不.*科學.*手相/ : /does not provide scientific palm reading/i);
  });

  it.each(establishedLocales)("does not invent an organization or track record in %s", (locale) => {
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
  it.each(SUPPORTED_LOCALES)(
    "discloses privacy-minimized locale suggestion without replacing sections in %s",
    (locale) => {
      const page = PRIVACY_CONTENT[locale];
      const expectation = localeSuggestionDisclosure[locale];
      const disclosure = page.sections[4]?.paragraphs.join(" ") ?? "";

      expect(page.sections.map(({ heading }) => heading)).toEqual(
        expectation.headings,
      );
      expect(disclosure).toMatch(expectation.browser);
      expect(disclosure).toMatch(expectation.saved);
      expect(disclosure).toMatch(expectation.country);
      expect(disclosure).toMatch(expectation.minimization);
      expect(page.sources.map(({ url }) => url)).toEqual(requiredPrivacyLinks);
    },
  );

  it.each(establishedLocales)("lists every observed browser-storage key and its purpose in %s", (locale) => {
    const text = pageText(PRIVACY_CONTENT[locale]);

    for (const key of ["palm-reading-storage", "language-store", "palm-theme"]) {
      expect(text).toContain(key);
    }
    expect(text).toMatch(locale === "zh-TW" ? /免責聲明.*接受/ : /disclaimer acceptance/i);
    expect(text).toMatch(locale === "zh-TW" ? /語言偏好/ : /language preference/i);
    expect(text).toMatch(locale === "zh-TW" ? /主題偏好/ : /theme preference/i);
    expect(text).toMatch(
      locale === "zh-TW"
        ? /瀏覽器.*網站資料.*隱私設定.*清除/
        : /clear .*through their browser's site-data or privacy settings/i,
    );
  });

  it.each(establishedLocales)("omits browser storage the current site never writes in %s", (locale) => {
    const text = pageText(PRIVACY_CONTENT[locale]);

    expect(text).not.toContain("image-filter-storage");
    expect(text).not.toMatch(locale === "zh-TW" ? /濾鏡/ : /filter settings/i);
  });

  it.each(establishedLocales)("describes local image handling without claiming upload or retention in %s", (locale) => {
    const text = pageText(PRIVACY_CONTENT[locale]);

    expect(text).toMatch(/FileReader/);
    expect(text).toMatch(/HTMLImageElement/);
    expect(text).toMatch(/MediaPipe/i);
    expect(text).toMatch(locale === "zh-TW" ? /目前頁面.*記憶體/ : /current page memory/i);
    expect(text).toMatch(locale === "zh-TW" ? /不會傳送至 HandFuture.*應用程式伺服器/ : /not sent to a HandFuture application server/i);
    expect(text).toMatch(locale === "zh-TW" ? /重設.*重新整理.*關閉分頁.*瀏覽器.*記憶體管理/ : /reset.*refresh.*tab close.*browser memory management/i);
  });

  it.each(establishedLocales)("does not claim canvas processing of the hand image in %s", (locale) => {
    const text = pageText(PRIVACY_CONTENT[locale]);

    expect(text).not.toMatch(/canvas/i);
  });

  it.each(establishedLocales)("discloses third-party asset requests without exposing the hand image in %s", (locale) => {
    const text = pageText(PRIVACY_CONTENT[locale]);

    expect(text).toContain("cdn.jsdelivr.net");
    expect(text).toContain("fonts.googleapis.com");
    expect(text).toContain("fonts.gstatic.com");
    expect(text).toMatch(locale === "zh-TW" ? /IP 位址/ : /IP address/i);
    expect(text).toMatch(/user agent/i);
    expect(text).toMatch(
      locale === "zh-TW"
        ? /不包含.*(?:所選的)?手部影像/
        : /do not include the selected hand image/i,
    );
  });

  it.each(establishedLocales)("does not attribute jsDelivr ownership to Google in %s", (locale) => {
    const text = pageText(PRIVACY_CONTENT[locale]);

    expect(text).toContain("cdn.jsdelivr.net");
    expect(text).not.toMatch(jsDelivrOwnershipPattern);
  });

  it.each(establishedLocales)("names the current providers and consent boundary in %s", (locale) => {
    const page = PRIVACY_CONTENT[locale];
    const text = pageText(page);

    expect(text).toMatch(/Vercel/);
    expect(text).toMatch(locale === "zh-TW" ? /主機託管.*傳遞記錄/ : /hosting.*delivery logs/i);
    expect(text).toMatch(locale === "zh-TW" ? /Web Analytics.*整體/ : /aggregate Vercel Web Analytics/i);
    expect(text).toMatch(locale === "zh-TW" ? /事件.*不包含.*手部照片/ : /events do not include the palm image/i);
    expect(text).toMatch(/Google AdSense/);
    expect(text).toMatch(locale === "zh-TW" ? /同意.*Google.*政策/ : /consent.*Google policy/i);
    expect(text).toMatch(locale === "zh-TW" ? /啟用 Google 認證.*CMP/ : /Google-certified CMP.*enabled/i);
    expect(text).toMatch(locale === "zh-TW" ? /Cloudflare.*權威 DNS.*不(?:是)?.*內容代理/ : /Cloudflare.*authoritative DNS.*not.*content proxy/i);
    expect(page.sources.map((source) => source.url)).toEqual(requiredPrivacyLinks);
  });

  it.each(establishedLocales)("gates the single privacy contact address on working email routing in %s", (locale) => {
    const text = pageText(PRIVACY_CONTENT[locale]);
    const matches = text.match(/privacy@handfortune\.com/g) ?? [];

    expect(matches).toHaveLength(1);
    expect(text).toContain(
      locale === "zh-TW"
        ? "此信箱僅在網域郵件轉寄啟用後使用。"
        : "This address is monitored only after domain email routing is enabled.",
    );
  });
});

describe("TERMS_CONTENT", () => {
  it.each(establishedLocales)("covers the complete entertainment-use terms in %s", (locale) => {
    const page = TERMS_CONTENT[locale];
    const text = pageText(page);
    const expectedHeadings = locale === "zh-TW"
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
    expect(text).toMatch(locale === "zh-TW" ? /醫療.*心理健康.*法律.*財務.*就業.*關係.*相容性.*未來/ : /medical.*mental-health.*legal.*financial.*employment.*relationship.*compatibility.*future/i);
    expect(text).toMatch(locale === "zh-TW" ? /成年年齡.*家長或監護人/ : /age of majority.*parent or guardian/i);
    expect(text).toMatch(locale === "zh-TW" ? /自動化流量.*操弄廣告/ : /automated traffic.*ad manipulation/i);
    expect(text).toMatch(locale === "zh-TW" ? /不主張.*所有權/ : /does not claim ownership/i);
    expect(text).toMatch(locale === "zh-TW" ? /不保證.*正常運作時間/ : /no uptime guarantee/i);
    expect(text).toMatch(locale === "zh-TW" ? /適用法律/ : /applicable law/i);
    expect(page.sources).toContainEqual({
      label: locale === "zh-TW" ? "隱私政策" : "Privacy Policy",
      url: "/privacy",
    });
  });
});

describe("jsDelivr ownership claim detection", () => {
  it.each(prohibitedJsDelivrOwnershipPhrases)(
    "flags the prohibited ownership phrase %j",
    (phrase) => {
      expect(phrase).toMatch(jsDelivrOwnershipPattern);
    },
  );

  it("does not flag neutral disclosure of the jsDelivr hostname", () => {
    expect("the cdn.jsdelivr.net content delivery network").not.toMatch(
      jsDelivrOwnershipPattern,
    );
    expect(
      "Google Fonts font files load from fonts.googleapis.com and fonts.gstatic.com, and MediaPipe model files load from the cdn.jsdelivr.net content delivery network",
    ).not.toMatch(jsDelivrOwnershipPattern);
    expect("cdn.jsdelivr.net 這個內容傳遞網路").not.toMatch(jsDelivrOwnershipPattern);
  });
});

describe("policy claim hygiene", () => {
  it.each(establishedLocales)("omits unsupported services and promises in %s", (locale) => {
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

const policyNativeTitles: Record<Exclude<Locale, "en">, [string, string, string]> = {
  "zh-TW": ["關於 HandFuture", "隱私政策", "使用條款"],
  "zh-CN": ["关于 HandFuture", "隐私政策", "使用条款"],
  ja: ["HandFutureについて", "プライバシーポリシー", "利用規約"],
  ko: ["HandFuture 소개", "개인정보 처리방침", "이용 약관"],
  es: ["Acerca de HandFuture", "Política de privacidad", "Términos de uso"],
  "pt-BR": ["Sobre o HandFuture", "Política de Privacidade", "Termos de Uso"],
  fr: ["À propos de HandFuture", "Politique de confidentialité", "Conditions d’utilisation"],
};

function expectPolicyTranslation(
  page: (typeof ABOUT_CONTENT)[Locale],
  english: (typeof ABOUT_CONTENT)["en"],
) {
  const isTranslation = page !== english;
  if (isTranslation) expect(page.summary).not.toBe(english.summary);
  expect(page.sections).toHaveLength(english.sections.length);
  page.sections.forEach((section, sectionIndex) => {
    const englishSection = english.sections[sectionIndex];
    if (
      isTranslation &&
      !["Cloudflare DNS", "Contact"].includes(englishSection.heading)
    ) {
      expect(section.heading).not.toBe(englishSection.heading);
    }
    expect(section.paragraphs).toHaveLength(englishSection.paragraphs.length);
    section.paragraphs.forEach((paragraph, paragraphIndex) => {
      if (isTranslation) {
        expect(paragraph).not.toBe(englishSection.paragraphs[paragraphIndex]);
      }
      expect(paragraph.trim().length).toBeGreaterThan(35);
    });
  });
  expect(page.sources.map(({ url }) => url)).toEqual(
    english.sources.map(({ url }) => url),
  );
}

const policySemantics: Record<
  Locale,
  { localPhoto: RegExp; decisions: RegExp; noAdManipulation: RegExp }
> = {
  "zh-TW": {
    localPhoto: /影像不會傳送至 HandFuture.*伺服器/,
    decisions: /醫療.*心理健康.*法律.*財務.*就業.*關係.*未來/,
    noAdManipulation: /不得.*操弄廣告曝光或點擊/,
  },
  "zh-CN": {
    localPhoto: /图像不会发送到 HandFuture.*服务器/,
    decisions: /医疗.*心理健康.*法律.*财务.*就业.*关系.*未来/,
    noAdManipulation: /不得.*操纵广告展示或点击/,
  },
  en: {
    localPhoto: /image is not sent to a HandFuture application server/i,
    decisions: /medical.*mental-health.*legal.*financial.*employment.*relationship.*future/i,
    noAdManipulation: /do not.*ad manipulation.*impressions or clicks/i,
  },
  ja: {
    localPhoto: /画像は HandFuture.*サーバーに送信されません/,
    decisions: /医療.*メンタルヘルス.*法律.*金融.*雇用.*人間関係.*将来/,
    noAdManipulation: /広告の表示回数やクリックを操作してはなりません/,
  },
  ko: {
    localPhoto: /이미지는 HandFuture.*서버로 전송되지 않습니다/,
    decisions: /의료.*정신 건강.*법률.*재정.*고용.*관계.*미래/,
    noAdManipulation: /광고 노출이나 클릭을 조작해서는 안 됩니다/,
  },
  es: {
    localPhoto: /imagen no se envía a un servidor.*HandFuture/i,
    decisions: /médic.*salud mental.*jurídic.*financier.*laboral.*relaciones.*futuro/i,
    noAdManipulation: /no.*manipul.*anuncios.*impresiones o clics/i,
  },
  "pt-BR": {
    localPhoto: /imagem não é enviada a um servidor.*HandFuture/i,
    decisions: /médic.*saúde mental.*jurídic.*financeir.*emprego.*relacionamento.*futuro/i,
    noAdManipulation: /não.*manipul.*anúncios.*impressões ou cliques/i,
  },
  fr: {
    localPhoto: /image n’est pas envoyée à un serveur.*HandFuture/i,
    decisions: /médical.*santé mentale.*juridique.*financier.*emploi.*relation.*avenir/i,
    noAdManipulation: /ne.*manipul.*publicit.*impressions ou clics/i,
  },
};

describe("complete eight-locale policy records", () => {
  it.each(SUPPORTED_LOCALES)(
    "matches the English page structure and preserves source URLs in %s",
    (locale) => {
      expectPolicyTranslation(ABOUT_CONTENT[locale], ABOUT_CONTENT.en);
      expectPolicyTranslation(PRIVACY_CONTENT[locale], PRIVACY_CONTENT.en);
      expectPolicyTranslation(TERMS_CONTENT[locale], TERMS_CONTENT.en);
      expect(PRIVACY_CONTENT[locale].sections).toHaveLength(
        PRIVACY_CONTENT.en.sections.length,
      );
      expect(TERMS_CONTENT[locale].sections).toHaveLength(
        TERMS_CONTENT.en.sections.length,
      );
      expect(PRIVACY_CONTENT[locale].sources.map(({ url }) => url)).toEqual(
        requiredPrivacyLinks,
      );
      expect(PRIVACY_CONTENT[locale].sources.map(({ label }) => label)).toEqual(
        PRIVACY_CONTENT.en.sources.map(({ label }) => label),
      );
    },
  );

  it.each(SUPPORTED_LOCALES.filter((locale) => locale !== "en"))(
    "uses representative native policy titles and no English substantive fallback in %s",
    (locale) => {
      const [about, privacy, terms] = policyNativeTitles[locale];
      expect(ABOUT_CONTENT[locale].title).toBe(about);
      expect(PRIVACY_CONTENT[locale].title).toBe(privacy);
      expect(TERMS_CONTENT[locale].title).toBe(terms);
    },
  );

  it.each(SUPPORTED_LOCALES)(
    "retains privacy, decision, and automated-ad boundaries in %s",
    (locale) => {
      const text = [pageText(PRIVACY_CONTENT[locale]), pageText(TERMS_CONTENT[locale])].join("\n");
      const semantics = policySemantics[locale];

      expect(text).toMatch(semantics.localPhoto);
      expect(text).toMatch(semantics.decisions);
      expect(text).toMatch(semantics.noAdManipulation);
      expect(text.match(/privacy@handfortune\.com/g) ?? []).toHaveLength(1);
      expect(text).toContain("FileReader");
      expect(text).toContain("HTMLImageElement");
      expect(text).toContain("MediaPipe");
      expect(text).toContain("Vercel");
      expect(text).toContain("Cloudflare");
      expect(text).toContain("Google AdSense");
    },
  );
});
