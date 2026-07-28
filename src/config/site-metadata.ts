import type { Locale, PublicPath } from "./public-routes";
import { buildLocalizedPath } from "../i18n/locales";

export const SITE_ORIGIN = "https://www.handfortune.com";
export const SITE_NAME = "HandFuture";
export const SOCIAL_IMAGE_URL = "https://www.handfortune.com/og-image.jpg";
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
    "zh-TW": { title: "HandFuture｜手相文化探索與手部偵測體驗", description: "從文化角度認識手相傳統，使用瀏覽器內的手部偵測完成一張非科學、僅供娛樂與自我反思的提示卡；照片不會上傳到 HandFuture 伺服器。", ogImageAlt: "HandFuture 手相文化探索與手部偵測體驗" },
    "zh-CN": { title: "HandFuture｜手相文化探索与手部检测体验", description: "从文化角度认识手相传统，使用浏览器内的手部检测获得一张非科学、仅供娱乐与自我反思的提示卡；照片不会上传到 HandFuture 服务器。", ogImageAlt: "HandFuture 手相文化探索与手部检测体验" },
    en: { title: "HandFuture | Palmistry Culture and Hand Detection", description: "Explore palmistry as a cultural tradition and use in-browser hand detection to receive a non-scientific reflection prompt for entertainment; your photo is not uploaded to a HandFuture server.", ogImageAlt: "HandFuture palmistry culture and hand detection experience" },
    ja: { title: "HandFuture｜手相文化と手の検出", description: "手相文化を歴史的な伝統として学び、ブラウザー内の手の検出で非科学的な娯楽用リフレクションカードを受け取ります。写真は HandFuture のサーバーへ送信されません。", ogImageAlt: "HandFuture の手相文化と手の検出体験" },
    ko: { title: "HandFuture | 손금 문화와 손 감지", description: "손금 문화를 전통의 맥락에서 살펴보고 브라우저 내 손 감지로 비과학적 오락용 성찰 카드를 받아 보세요. 사진은 HandFuture 서버로 업로드되지 않습니다.", ogImageAlt: "HandFuture 손금 문화와 손 감지 체험" },
    es: { title: "HandFuture | Cultura de la quiromancia y detección de manos", description: "Explora la cultura de la quiromancia como tradición y usa la detección en el navegador para recibir una pregunta no científica de entretenimiento; la foto no se carga en un servidor de HandFuture.", ogImageAlt: "Experiencia cultural de quiromancia y detección de manos de HandFuture" },
    "pt-BR": { title: "HandFuture | Cultura da quiromancia e detecção de mãos", description: "Explore a cultura da quiromancia como tradição e use a detecção no navegador para receber uma pergunta não científica de entretenimento; a foto não é enviada a um servidor do HandFuture.", ogImageAlt: "Experiência de cultura da quiromancia e detecção de mãos do HandFuture" },
    fr: { title: "HandFuture | Culture de la chiromancie et détection des mains", description: "Explorez la culture de la chiromancie comme tradition et utilisez la détection dans le navigateur pour recevoir une question de divertissement non scientifique ; la photo n’est pas envoyée à HandFuture.", ogImageAlt: "Expérience HandFuture de culture de la chiromancie et de détection des mains" },
  },
  "/how-it-works": {
    "zh-TW": { title: "運作方式｜HandFuture", description: "了解 HandFuture 如何在瀏覽器內尋找 21 個手部關節座標、如何選出娛樂性反思卡，以及這項工具不能辨識掌紋或預測人生的原因。", ogImageAlt: "HandFuture 的瀏覽器內手部偵測流程" },
    "zh-CN": { title: "运作方式｜HandFuture", description: "了解 HandFuture 如何在浏览器内寻找 21 个手部关节坐标、如何选出娱乐性反思卡，以及这项工具为何不能识别掌纹或预测人生。", ogImageAlt: "HandFuture 的浏览器内手部检测流程" },
    en: { title: "How HandFuture Works", description: "Learn how HandFuture finds 21 hand landmarks in your browser, selects an entertainment reflection card, and why the tool cannot read palm creases or predict life outcomes.", ogImageAlt: "HandFuture in-browser hand detection flow" },
    ja: { title: "HandFutureの仕組み", description: "HandFuture がブラウザー内で21個の手の関節を検出し、娯楽用カードを選ぶ方法と、手相線を読んだり人生を予測したりできない理由を説明します。", ogImageAlt: "HandFuture のブラウザー内手検出の流れ" },
    ko: { title: "HandFuture 작동 방식", description: "HandFuture가 브라우저에서 손의 21개 관절을 찾고 오락용 성찰 카드를 선택하는 방식과 손금을 읽거나 인생을 예측할 수 없는 이유를 알아보세요.", ogImageAlt: "HandFuture 브라우저 내 손 감지 과정" },
    es: { title: "Cómo funciona HandFuture", description: "Descubre cómo HandFuture localiza 21 articulaciones en el navegador, selecciona una tarjeta de entretenimiento y por qué no puede leer líneas de la palma ni predecir la vida.", ogImageAlt: "Proceso de detección de manos de HandFuture en el navegador" },
    "pt-BR": { title: "Como o HandFuture funciona", description: "Saiba como o HandFuture encontra 21 articulações no navegador, escolhe um cartão de entretenimento e por que não consegue ler linhas da palma nem prever a vida.", ogImageAlt: "Fluxo de detecção de mãos do HandFuture no navegador" },
    fr: { title: "Comment fonctionne HandFuture", description: "Découvrez comment HandFuture repère 21 articulations dans le navigateur, choisit une carte de divertissement et pourquoi il ne peut ni lire les plis de la paume ni prédire la vie.", ogImageAlt: "Parcours de détection des mains HandFuture dans le navigateur" },
  },
  "/guides/palmistry-basics": {
    "zh-TW": { title: "手相文化入門：傳統名稱與歷史脈絡｜HandFuture", description: "以文化史角度認識手相、生命線、智慧線與感情線等傳統名稱，並清楚區分歷史信仰、娛樂用途與現代科學證據。", ogImageAlt: "手相文化入門指南" },
    "zh-CN": { title: "手相文化入门：传统名称与历史脉络｜HandFuture", description: "从文化史角度认识手相、生命线、智慧线与感情线等传统名称，并明确区分历史信念、娱乐用途与现代科学证据。", ogImageAlt: "手相文化入门指南" },
    en: { title: "Palmistry Basics: Traditional Names and Context | HandFuture", description: "A cultural introduction to palmistry and traditional names such as the life, head, and heart lines, clearly separated from modern scientific evidence and safe entertainment use.", ogImageAlt: "Palmistry basics cultural guide" },
    ja: { title: "手相入門：伝統的な名称と歴史的背景｜HandFuture", description: "生命線、知能線、感情線などの伝統的名称を文化史の視点で学び、歴史的信念、娯楽としての利用、現代の科学的証拠を明確に区別します。", ogImageAlt: "手相文化の入門ガイド" },
    ko: { title: "손금 입문: 전통 명칭과 역사적 맥락 | HandFuture", description: "생명선, 두뇌선, 감정선 같은 전통 명칭을 문화사 관점에서 살펴보고 역사적 믿음, 오락 용도, 현대 과학 증거를 분명히 구분합니다.", ogImageAlt: "손금 문화 입문 가이드" },
    es: { title: "Fundamentos de la quiromancia: nombres y contexto | HandFuture", description: "Introducción cultural a la quiromancia y a nombres tradicionales como las líneas de la vida, cabeza y corazón, claramente separados de la evidencia científica y el entretenimiento seguro.", ogImageAlt: "Guía cultural de fundamentos de la quiromancia" },
    "pt-BR": { title: "Fundamentos da quiromancia: nomes e contexto | HandFuture", description: "Introdução cultural à quiromancia e a nomes tradicionais como as linhas da vida, cabeça e coração, claramente separados das evidências científicas e do entretenimento seguro.", ogImageAlt: "Guia cultural de fundamentos da quiromancia" },
    fr: { title: "Notions de chiromancie : noms et contexte | HandFuture", description: "Introduction culturelle à la chiromancie et aux noms traditionnels comme les lignes de vie, de tête et de cœur, clairement séparés des preuves scientifiques et du divertissement sûr.", ogImageAlt: "Guide culturel des notions de chiromancie" },
  },
  "/guides/science-and-limitations": {
    "zh-TW": { title: "手相、科學與限制：如何安全看待解讀｜HandFuture", description: "說明手部關節偵測與掌紋解讀的差異、巴納姆效應如何影響感受，以及為何手相內容不應取代醫療、財務或人生決策。", ogImageAlt: "手相科學限制與安全使用指南" },
    "zh-CN": { title: "手相、科学与局限：如何安全看待解读｜HandFuture", description: "说明手部关节检测与掌纹解读的区别、巴纳姆效应如何影响感受，以及手相内容为何不应取代医疗、财务或人生决定。", ogImageAlt: "手相科学局限与安全使用指南" },
    en: { title: "Palmistry, Science, and Limitations | HandFuture", description: "Understand the difference between hand-landmark detection and palm reading, how the Barnum effect shapes impressions, and why palmistry should not guide medical, financial, or life decisions.", ogImageAlt: "Palmistry science and limitations guide" },
    ja: { title: "手相、科学、そして限界｜HandFuture", description: "手の関節検出と手相解釈の違い、バーナム効果が印象に与える影響、手相を医療・金融・人生の判断に使ってはいけない理由を解説します。", ogImageAlt: "手相の科学的限界と安全な利用ガイド" },
    ko: { title: "손금, 과학과 한계 | HandFuture", description: "손 관절 감지와 손금 해석의 차이, 바넘 효과가 인상에 미치는 영향, 손금이 의료·재정·인생 결정을 이끌어서는 안 되는 이유를 설명합니다.", ogImageAlt: "손금의 과학적 한계와 안전한 사용 가이드" },
    es: { title: "Quiromancia, ciencia y limitaciones | HandFuture", description: "Comprende la diferencia entre detectar articulaciones y leer la palma, cómo influye el efecto Barnum y por qué la quiromancia no debe guiar decisiones médicas, financieras o vitales.", ogImageAlt: "Guía sobre ciencia, límites y uso seguro de la quiromancia" },
    "pt-BR": { title: "Quiromancia, ciência e limitações | HandFuture", description: "Entenda a diferença entre detectar articulações e ler a palma, como o efeito Barnum influencia impressões e por que a quiromancia não deve orientar decisões médicas, financeiras ou de vida.", ogImageAlt: "Guia de ciência, limites e uso seguro da quiromancia" },
    fr: { title: "Chiromancie, science et limites | HandFuture", description: "Comprenez la différence entre détection des articulations et lecture de la paume, l’effet Barnum et pourquoi la chiromancie ne doit guider aucune décision médicale, financière ou de vie.", ogImageAlt: "Guide sur la science, les limites et l’usage sûr de la chiromancie" },
  },
  "/guides/hand-photo-guide": {
    "zh-TW": { title: "手部照片指南：光線、角度與隱私｜HandFuture", description: "用均勻光線、單手、素色背景與完整入鏡提高瀏覽器手部偵測的成功率，並了解照片只在目前瀏覽器工作階段處理。", ogImageAlt: "手部照片拍攝與隱私指南" },
    "zh-CN": { title: "手部照片指南：光线、角度与隐私｜HandFuture", description: "使用均匀光线、一只手、简单背景与完整取景提高浏览器手部检测的成功率，并了解照片只在当前浏览器会话中处理。", ogImageAlt: "手部照片拍摄与隐私指南" },
    en: { title: "Hand Photo Guide: Lighting, Framing, and Privacy | HandFuture", description: "Improve browser hand detection with even lighting, one fully visible hand, and a plain background, while understanding how the photo is processed during the current browser session.", ogImageAlt: "Hand photo and privacy guide" },
    ja: { title: "手の写真ガイド：照明、構図、プライバシー｜HandFuture", description: "均一な照明、全体が見える片手、無地の背景でブラウザー検出を改善し、写真が現在のブラウザーセッション内だけで処理される仕組みを理解します。", ogImageAlt: "手の写真撮影とプライバシーのガイド" },
    ko: { title: "손 사진 가이드: 조명, 구도와 개인정보 | HandFuture", description: "고른 조명, 온전히 보이는 한 손, 단순한 배경으로 브라우저 감지를 개선하고 사진이 현재 브라우저 세션에서만 처리되는 방식을 알아봅니다.", ogImageAlt: "손 사진 촬영과 개인정보 가이드" },
    es: { title: "Guía de foto de mano: luz, encuadre y privacidad | HandFuture", description: "Mejora la detección con luz uniforme, una mano completa y un fondo liso, y comprende cómo se procesa la foto únicamente durante la sesión actual del navegador.", ogImageAlt: "Guía de fotografía de manos y privacidad" },
    "pt-BR": { title: "Guia de foto da mão: luz, enquadramento e privacidade | HandFuture", description: "Melhore a detecção com luz uniforme, uma mão completa e fundo liso e entenda como a foto é processada somente durante a sessão atual do navegador.", ogImageAlt: "Guia de fotografia de mãos e privacidade" },
    fr: { title: "Guide de photo de main : lumière, cadrage et confidentialité | HandFuture", description: "Améliorez la détection avec une lumière uniforme, une main entière et un fond uni, et comprenez comment la photo est traitée uniquement pendant la session actuelle du navigateur.", ogImageAlt: "Guide de photographie des mains et de confidentialité" },
  },
  "/about": {
    "zh-TW": { title: "關於 HandFuture", description: "HandFuture 是一個獨立網頁專案，透過手部偵測與有來源的文章，協助讀者以透明、非科學且僅供娛樂的方式探索手相文化。", ogImageAlt: "關於 HandFuture 獨立網頁專案" },
    "zh-CN": { title: "关于 HandFuture", description: "HandFuture 是一个独立网页项目，通过手部检测与有来源的文章，帮助读者以透明、非科学且仅供娱乐的方式探索手相文化。", ogImageAlt: "关于 HandFuture 独立网页项目" },
    en: { title: "About HandFuture", description: "HandFuture is an independent web project combining hand detection with sourced articles so readers can explore palmistry culture transparently as non-scientific entertainment.", ogImageAlt: "About the independent HandFuture web project" },
    ja: { title: "HandFutureについて", description: "HandFuture は、手の検出と出典付き記事を組み合わせ、手相文化を透明な非科学的娯楽として探るための独立ウェブプロジェクトです。", ogImageAlt: "独立ウェブプロジェクト HandFuture について" },
    ko: { title: "HandFuture 소개", description: "HandFuture는 손 감지와 출처를 밝힌 글을 결합해 손금 문화를 투명한 비과학적 오락으로 탐구하도록 돕는 독립 웹 프로젝트입니다.", ogImageAlt: "독립 웹 프로젝트 HandFuture 소개" },
    es: { title: "Acerca de HandFuture", description: "HandFuture es un proyecto web independiente que combina detección de manos y artículos con fuentes para explorar la quiromancia de forma transparente como entretenimiento no científico.", ogImageAlt: "Acerca del proyecto web independiente HandFuture" },
    "pt-BR": { title: "Sobre o HandFuture", description: "O HandFuture é um projeto web independente que combina detecção de mãos e artigos com fontes para explorar a quiromancia de forma transparente como entretenimento não científico.", ogImageAlt: "Sobre o projeto web independente HandFuture" },
    fr: { title: "À propos de HandFuture", description: "HandFuture est un projet web indépendant combinant détection des mains et articles sourcés pour explorer la chiromancie de façon transparente comme divertissement non scientifique.", ogImageAlt: "À propos du projet web indépendant HandFuture" },
  },
  "/privacy": {
    "zh-TW": { title: "隱私政策｜HandFuture", description: "查看 HandFuture 如何在瀏覽器內處理手部照片、使用本機儲存空間與 Vercel Analytics，以及 Google 廣告與同意選項如何運作。", ogImageAlt: "HandFuture 隱私政策" },
    "zh-CN": { title: "隐私政策｜HandFuture", description: "查看 HandFuture 如何在浏览器内处理手部照片、使用本地存储与 Vercel Analytics，以及 Google 广告和同意选项如何运作。", ogImageAlt: "HandFuture 隐私政策" },
    en: { title: "Privacy Policy | HandFuture", description: "See how HandFuture processes hand photos in the browser, uses local storage and Vercel Analytics, and how Google advertising and consent choices operate.", ogImageAlt: "HandFuture privacy policy" },
    ja: { title: "プライバシーポリシー｜HandFuture", description: "HandFuture が手の写真をブラウザー内で処理する方法、ローカルストレージと Vercel Analytics の利用、Google 広告と同意設定の仕組みを確認できます。", ogImageAlt: "HandFuture プライバシーポリシー" },
    ko: { title: "개인정보 처리방침 | HandFuture", description: "HandFuture가 손 사진을 브라우저에서 처리하는 방식, 로컬 저장소와 Vercel Analytics 사용, Google 광고와 동의 선택의 작동 방식을 확인하세요.", ogImageAlt: "HandFuture 개인정보 처리방침" },
    es: { title: "Política de privacidad | HandFuture", description: "Consulta cómo HandFuture procesa fotos en el navegador, usa almacenamiento local y Vercel Analytics, y cómo funcionan la publicidad de Google y las opciones de consentimiento.", ogImageAlt: "Política de privacidad de HandFuture" },
    "pt-BR": { title: "Política de Privacidade | HandFuture", description: "Veja como o HandFuture processa fotos no navegador, usa armazenamento local e Vercel Analytics e como funcionam a publicidade do Google e as escolhas de consentimento.", ogImageAlt: "Política de Privacidade do HandFuture" },
    fr: { title: "Politique de confidentialité | HandFuture", description: "Découvrez comment HandFuture traite les photos dans le navigateur, utilise le stockage local et Vercel Analytics, et comment fonctionnent la publicité Google et les choix de consentement.", ogImageAlt: "Politique de confidentialité de HandFuture" },
  },
  "/terms": {
    "zh-TW": { title: "使用條款｜HandFuture", description: "閱讀 HandFuture 的娛樂用途、年齡建議、禁止行為、智慧財產、服務可用性與責任限制，並了解本工具不提供專業建議。", ogImageAlt: "HandFuture 使用條款" },
    "zh-CN": { title: "使用条款｜HandFuture", description: "阅读 HandFuture 的娱乐用途、年龄建议、禁止行为、知识产权、服务可用性与责任限制，并了解本工具不提供专业建议。", ogImageAlt: "HandFuture 使用条款" },
    en: { title: "Terms of Use | HandFuture", description: "Read HandFuture's entertainment scope, age guidance, prohibited conduct, intellectual property, service availability, and limits, including that the tool provides no professional advice.", ogImageAlt: "HandFuture terms of use" },
    ja: { title: "利用規約｜HandFuture", description: "HandFuture の娯楽範囲、年齢案内、禁止行為、知的財産、サービスの可用性、責任の制限を読み、このツールが専門的助言を提供しないことを確認します。", ogImageAlt: "HandFuture 利用規約" },
    ko: { title: "이용 약관 | HandFuture", description: "HandFuture의 오락 범위, 연령 안내, 금지 행위, 지식재산권, 서비스 가용성과 책임 제한을 읽고 이 도구가 전문 조언을 제공하지 않음을 확인하세요.", ogImageAlt: "HandFuture 이용 약관" },
    es: { title: "Términos de uso | HandFuture", description: "Lee el ámbito de entretenimiento, la orientación de edad, las conductas prohibidas, la propiedad intelectual, la disponibilidad y los límites de HandFuture, incluida la ausencia de asesoramiento profesional.", ogImageAlt: "Términos de uso de HandFuture" },
    "pt-BR": { title: "Termos de Uso | HandFuture", description: "Leia o escopo de entretenimento, a orientação etária, as condutas proibidas, a propriedade intelectual, a disponibilidade e os limites do HandFuture, incluindo a ausência de orientação profissional.", ogImageAlt: "Termos de Uso do HandFuture" },
    fr: { title: "Conditions d’utilisation | HandFuture", description: "Lisez la portée de divertissement, l’indication d’âge, les conduites interdites, la propriété intellectuelle, la disponibilité et les limites de HandFuture, notamment l’absence de conseil professionnel.", ogImageAlt: "Conditions d’utilisation de HandFuture" },
  },
} satisfies Record<PublicPath, LocalizedMetadata>;

export function getRouteMetadata(path: PublicPath, locale: Locale): RouteMetadata {
  const localized = metadata[path][locale];
  const canonical = buildLocalizedPublicUrl(path, locale);
  return {
    ...localized,
    canonical,
    ogUrl: canonical,
    ogImage: SOCIAL_IMAGE_URL,
  };
}

export function buildLocalizedPublicUrl(path: PublicPath, locale: Locale): string {
  return `${SITE_ORIGIN}${buildLocalizedPath(locale, path)}`;
}

export function buildPublicGatewayUrl(path: PublicPath): string {
  return `${SITE_ORIGIN}${path === "/" ? "/" : path}`;
}

export function buildStructuredData(path: PublicPath, locale: Locale): Record<string, unknown> {
  const meta = getRouteMetadata(path, locale);
  const base = {
    "@context": "https://schema.org",
    name: meta.title,
    description: meta.description,
    url: meta.canonical,
    inLanguage: locale,
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
