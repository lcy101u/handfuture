import type { Locale } from "./locales";

export const BREADCRUMB_COPY: Record<
  Locale,
  { ariaLabel: string; home: string; learn: string }
> = {
  "zh-TW": { ariaLabel: "麵包屑導覽", home: "首頁", learn: "學習中心" },
  "zh-CN": { ariaLabel: "面包屑导航", home: "首页", learn: "学习中心" },
  en: { ariaLabel: "Breadcrumbs", home: "Home", learn: "Learn" },
  ja: { ariaLabel: "パンくずリスト", home: "ホーム", learn: "学ぶ" },
  ko: { ariaLabel: "이동 경로", home: "홈", learn: "학습" },
  es: { ariaLabel: "Ruta de navegación", home: "Inicio", learn: "Aprender" },
  "pt-BR": { ariaLabel: "Caminho de navegação", home: "Início", learn: "Aprender" },
  fr: { ariaLabel: "Fil d’Ariane", home: "Accueil", learn: "Apprendre" },
};
