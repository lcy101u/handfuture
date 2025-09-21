import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ShieldCheck,
  Database,
  Cloud,
  FileSearch,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguageStore } from "@/store/language-store";

interface PolicySection {
  icon: LucideIcon;
  title: string;
  description: string;
  items: string[];
}

const policyContent = {
  zh: {
    metaTitle: "隱私政策｜掌相解讀AI",
    metaDescription:
      "掌相解讀AI 對於相片處理、資料保存與第三方服務的隱私政策。了解我們如何保護個人資訊、Cookies 使用方式以及您的資料權益。",
    heroTitle: "隱私政策",
    heroIntro:
      "我們重視您的隱私與資料自主權。掌相解讀AI 所有影像分析皆於瀏覽器端完成，照片不會上傳至伺服器。以下列出我們的資料蒐集與使用原則。",
    effectiveDate: "生效日期：2025年1月1日",
    sections: [
      {
        icon: Database,
        title: "我們蒐集的資料",
        description:
          "平台僅於必要範圍內蒐集資訊，以提供基本服務與網站安全維護。",
        items: [
          "使用者主動提供的電子郵件或留言內容（用於訂閱電子報或回覆問題）",
          "匿名化的操作紀錄，例如瀏覽裝置類型、互動按鈕點擊次數，僅用於改善使用體驗",
          "Cookies 與本地儲存資料，用於記錄語言偏好與是否已同意免責聲明",
        ],
      },
      {
        icon: ShieldCheck,
        title: "照片與掌紋資料處理方式",
        description:
          "為確保安全與保密，我們採取下列作法來處理您提供的影像資料。",
        items: [
          "影像處理完全在本地瀏覽器執行，AI 模型於裝置端推論，不會將照片上傳",
          "在得到您的明確同意之前，我們不會保存或分享任何影像、掌紋特徵資料",
          "若您開啟批次模式並選擇雲端匯出，系統會事先顯示檔案內容與儲存位置供確認",
        ],
      },
      {
        icon: Cloud,
        title: "資料保存期間與安全措施",
        description:
          "我們僅在提供服務所需的合理期間內保留必要資訊，並採取加密與存取控管。",
        items: [
          "訂閱電子報的電子郵件會於取消訂閱後 30 天內刪除",
          "伺服器存取紀錄保留 90 天，用於資安監控與法規遵循",
          "所有內部系統皆啟用多因子驗證與最小權限原則，避免未授權的資料存取",
        ],
      },
      {
        icon: FileSearch,
        title: "第三方服務與分析工具",
        description:
          "為提供穩定的網站功能與統計報表，我們會使用部分第三方服務。",
        items: [
          "使用 Google Analytics 4 匿名化分析流量，僅保留整體指標，不追蹤個人身分",
          "使用 Vercel 與 Cloudflare 提供內容傳遞與安全防護，可能依需求暫存匿名化的連線資訊",
          "使用電子報服務供應商寄送更新，並遵循其隱私政策與資料處理條款",
        ],
      },
      {
        icon: UserCheck,
        title: "您的權利",
        description:
          "您可以隨時與我們聯絡以行使個人資料相關權利。",
        items: [
          "查詢與請求閱覽：您可要求我們提供所持有的個人資料副本",
          "請求更正或刪除：若資料有誤或您不再使用服務，可以要求更正或刪除",
          "撤回同意：您可以隨時取消訂閱、關閉 Cookies 或撤回其他使用授權",
        ],
      },
    ] as PolicySection[],
    closing:
      "若您對本政策或資料保護有任何疑問，請寄信至 privacy@handfortune.com，我們將於 7 個工作天內回覆。",
  },
  en: {
    metaTitle: "Privacy Policy | HandFuture",
    metaDescription:
      "Understand how HandFuture processes palm images, stores analytics data, and collaborates with third-party providers. Learn about cookies, local storage, and how to exercise your data rights.",
    heroTitle: "Privacy Policy",
    heroIntro:
      "Your privacy and data choices matter. All palm analyses run directly in your browser, and images are never uploaded to our servers. The following sections explain what information we collect and how it is protected.",
    effectiveDate: "Effective date: January 1, 2025",
    sections: [
      {
        icon: Database,
        title: "Information We Collect",
        description:
          "We only gather the minimum data required to deliver the service and maintain platform security.",
        items: [
          "Email addresses or messages you voluntarily submit for newsletters or support",
          "Aggregated interaction logs such as device type and button clicks, used to improve usability",
          "Cookies and local storage values that remember language preferences and disclaimer consent",
        ],
      },
      {
        icon: ShieldCheck,
        title: "Handling of Photos and Palm Features",
        description:
          "We adopt strict safeguards to ensure the palm images you upload remain private.",
        items: [
          "Image processing occurs entirely on-device; inference runs locally and no photos are sent to our servers",
          "We never retain or share palm landmarks or image data without your explicit opt-in",
          "When cloud exports are enabled in batch mode, the system previews the files and storage destination before uploading",
        ],
      },
      {
        icon: Cloud,
        title: "Retention and Security",
        description:
          "Data is stored only as long as necessary and protected with encryption and access controls.",
        items: [
          "Newsletter subscriptions are removed within 30 days after you unsubscribe",
          "Server access logs are retained for 90 days to support security monitoring and compliance",
          "Internal dashboards require multi-factor authentication and least-privilege permissions",
        ],
      },
      {
        icon: FileSearch,
        title: "Third-Party Services and Analytics",
        description:
          "We rely on selected third parties to deliver hosting, analytics, and email communications.",
        items: [
          "Google Analytics 4 collects anonymized usage metrics without storing personally identifiable information",
          "Vercel and Cloudflare provide hosting and security layers that may temporarily store anonymized connection metadata",
          "Our email provider distributes newsletters in accordance with its own privacy commitments and processing terms",
        ],
      },
      {
        icon: UserCheck,
        title: "Your Rights",
        description:
          "You have full control over your personal information and can contact us at any time.",
        items: [
          "Access: request a copy of the personal data we store about you",
          "Rectification or deletion: ask us to correct inaccurate data or remove it entirely",
          "Withdraw consent: opt out of newsletters, disable cookies, or revoke other permissions whenever you wish",
        ],
      },
    ] as PolicySection[],
    closing:
      "If you have questions about this policy or data protection, contact privacy@handfortune.com and we will respond within seven business days.",
  },
};

function PrivacyPolicyPage() {
  const { currentLanguage } = useLanguageStore();
  const content = useMemo(() => policyContent[currentLanguage], [currentLanguage]);

  useEffect(() => {
    document.title = content.metaTitle;
    const descriptionTag = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;
    if (descriptionTag) {
      descriptionTag.content = content.metaDescription;
    }
  }, [content]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white dark:from-slate-950 dark:via-blue-950 dark:to-gray-950">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentLanguage === "zh" ? "返回首頁" : "Back to Home"}
            </Link>
          </Button>
          <span className="text-sm text-muted-foreground">
            {content.effectiveDate}
          </span>
        </div>

        <section className="mx-auto max-w-3xl space-y-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {content.heroTitle}
          </h1>
          <p className="text-base leading-7 text-muted-foreground">
            {content.heroIntro}
          </p>
        </section>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {content.sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.title} className="h-full border-border/60">
                <CardHeader className="flex flex-row items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription className="text-xs uppercase tracking-wide">
                      {currentLanguage === "zh" ? "政策重點" : "Policy Highlight"}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm leading-6 text-muted-foreground">
                    {section.description}
                  </p>
                  <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 rounded-3xl bg-secondary/10 p-8 text-center text-sm text-muted-foreground">
          {content.closing}
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
