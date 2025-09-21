import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  Scale,
  ClipboardList,
  AlertTriangle,
  MessageSquare,
  Globe,
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

interface TermsSection {
  icon: LucideIcon;
  title: string;
  description: string;
  clauses: string[];
}

const termsContent = {
  zh: {
    metaTitle: "使用條款｜掌相解讀AI",
    metaDescription:
      "閱讀掌相解讀AI 的使用條款，了解使用者義務、禁止行為、免責聲明、準據法與申訴管道。",
    heroTitle: "使用條款",
    heroIntro:
      "感謝您使用掌相解讀AI。為確保所有訪客皆能享有安全、透明的體驗，請在使用服務與分享內容前，詳細閱讀以下條款。",
    sections: [
      {
        icon: ClipboardList,
        title: "服務使用規範",
        description:
          "使用本網站即表示您同意遵守相關法律並依據本條款進行操作。",
        clauses: [
          "您須年滿 16 歲方可使用互動式分析工具，未成年者需在法定監護人同意下使用",
          "不得利用本服務進行任何非法、誤導或具歧視性的用途",
          "不得於未經授權的情況下擷取、重製或重新發佈平台上的程式碼、模型或文章內容",
        ],
      },
      {
        icon: AlertTriangle,
        title: "免責聲明",
        description:
          "掌相分析僅供娛樂參考，我們不對任何決策或結果負責。",
        clauses: [
          "平台提供的分析與建議不構成醫療、法律、財務或任何專業意見",
          "我們無法保證分析結果完全準確或符合您的主觀期待",
          "若您因信賴分析內容而產生損失，需自行承擔相關風險",
        ],
      },
      {
        icon: MessageSquare,
        title: "使用者內容與互動",
        description:
          "若您提交回饋、留言或其他內容，即視為授權我們進行展示與編輯。",
        clauses: [
          "您應確保所提供的內容不侵害第三人權益，且不含侵犯隱私或惡意言論",
          "我們保留審稿、編輯、刪除使用者投稿的權利，並可用於推廣網站",
          "若投稿涉及商業合作，雙方將另行簽署授權或合作協議",
        ],
      },
      {
        icon: Scale,
        title: "條款更新與終止",
        description:
          "我們可能因功能調整或法規要求更新條款。請定期查看最新版本。",
        clauses: [
          "條款更新後將公布於網站首頁或以電子郵件通知，修正後立即生效",
          "若您不同意更新內容，應立即停止使用本服務並刪除相關資料",
          "我們得因資安疑慮或違反使用規範而暫停或終止您的使用權",
        ],
      },
      {
        icon: Globe,
        title: "準據法與爭議處理",
        description:
          "本條款以臺灣法律為準據法。若發生爭議，雙方應優先協商。",
        clauses: [
          "若協商不成，雙方同意以臺灣臺北地方法院為第一審管轄法院",
          "跨境使用者應遵循當地法規，並自行確保使用本服務不違反所在地法律",
          "如對條款內容有疑問，可寄信至 legal@handfortune.com 取得協助",
        ],
      },
    ] as TermsSection[],
    closing:
      "透過持續閱讀文章、留下建議或分享故事，您即表示已理解並接受以上條款。我們期待與您共同打造健康的掌相內容社群。",
  },
  en: {
    metaTitle: "Terms of Service | HandFuture",
    metaDescription:
      "Review HandFuture's Terms of Service covering user responsibilities, prohibited activities, disclaimers, governing law, and dispute resolution.",
    heroTitle: "Terms of Service",
    heroIntro:
      "Thank you for exploring HandFuture. To keep the experience safe and transparent for everyone, please read these terms before using the interactive tools or sharing content.",
    sections: [
      {
        icon: ClipboardList,
        title: "Acceptable Use",
        description:
          "By accessing the site you agree to comply with applicable laws and these terms.",
        clauses: [
          "You must be at least 16 years old to use the interactive analysis; minors need guardian consent",
          "Do not employ the service for illegal, misleading, or discriminatory purposes",
          "Do not extract, repackage, or republish our code, models, or articles without written permission",
        ],
      },
      {
        icon: AlertTriangle,
        title: "Disclaimer",
        description:
          "Palm insights are for entertainment only; you remain responsible for your decisions.",
        clauses: [
          "Our results do not constitute medical, legal, financial, or other professional advice",
          "We cannot guarantee that interpretations are fully accurate or aligned with your expectations",
          "You acknowledge that any reliance on the analysis is at your own risk",
        ],
      },
      {
        icon: MessageSquare,
        title: "User Contributions",
        description:
          "Content you submit—such as feedback or testimonials—may be displayed or edited by us.",
        clauses: [
          "Ensure that submissions respect third-party rights and avoid privacy violations or abusive language",
          "We may review, edit, or remove user-generated content and repurpose it for promotional material",
          "Commercial collaborations require a separate written agreement",
        ],
      },
      {
        icon: Scale,
        title: "Updates and Termination",
        description:
          "We may modify the terms to reflect new features or regulatory requirements.",
        clauses: [
          "Revisions will be announced on the homepage or via email and take effect immediately",
          "If you disagree with changes you must stop using the service and delete stored data",
          "We may suspend or terminate access when security risks or policy violations are detected",
        ],
      },
      {
        icon: Globe,
        title: "Governing Law and Disputes",
        description:
          "These terms are governed by the laws of Taiwan, R.O.C. Disputes should be resolved amicably first.",
        clauses: [
          "If negotiations fail, both parties agree to the exclusive jurisdiction of the Taipei District Court",
          "International users must comply with local regulations and ensure the service is lawful",
          "For inquiries contact legal@handfortune.com",
        ],
      },
    ] as TermsSection[],
    closing:
      "By continuing to read, comment, or share your story, you acknowledge and accept these terms. Let’s build a respectful, high-quality palmistry community together.",
  },
};

function TermsPage() {
  const { currentLanguage } = useLanguageStore();
  const content = useMemo(() => termsContent[currentLanguage], [currentLanguage]);

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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white dark:from-rose-950 dark:via-pink-950 dark:to-gray-950">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentLanguage === "zh" ? "返回首頁" : "Back to Home"}
            </Link>
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentLanguage === "zh"
              ? "請詳閱以下使用條款"
              : "Please review the terms below"}
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
                      {currentLanguage === "zh" ? "條款重點" : "Key Term"}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm leading-6 text-muted-foreground">
                    {section.description}
                  </p>
                  <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
                    {section.clauses.map((item) => (
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

export default TermsPage;
