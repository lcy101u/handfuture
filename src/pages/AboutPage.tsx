import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Compass, Cpu, Users, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguageStore } from "@/store/language-store";

const aboutContent = {
  zh: {
    metaTitle: "關於掌相解讀AI｜掌紋資料科學與文化內容平台",
    metaDescription:
      "了解掌相解讀AI的成立背景、AI 模型訓練流程以及內容策展方針。我們致力於結合掌紋資料科學、心理學研究與文化故事，提供高價值的原創內容。",
    heroTitle: "我們的使命與故事",
    heroParagraphs: [
      "掌相解讀AI 由一群對東方掌紋文化、人工智慧與使用者體驗充滿熱情的成員組成。團隊在 2023 年啟動資料蒐集專案，結合公開掌紋研究、授權教材與自建拍攝工作坊，建立完整的掌紋標註與資料治理流程。",
      "我們相信掌紋閱讀可以是一種自我覺察與對話的媒介。因此，平台在研發互動式 AI 工具的同時，也提供大量文章、案例與練習，協助讀者理解身心狀態、生活節奏與人際溝通的多樣面向。",
    ],
    sections: [
      {
        icon: Compass,
        title: "從傳統文化出發，轉譯成現代語言",
        description:
          "團隊拜訪資深掌相老師蒐集語料，整理百年來中英文經典著作，並與人類學者合作，建立易於理解的解釋框架。文章中會標註歷史脈絡、常見爭議與文化差異，讓讀者在尊重傳統的前提下，用現代觀點重新思考掌紋意義。",
      },
      {
        icon: Cpu,
        title: "透明的 AI 模型與資料訓練流程",
        description:
          "我們的電腦視覺模型遵循嚴謹的資料標註、匿名化與品質審查準則。每一次功能更新都附有公開的模型評估報告，說明準確率、偏差偵測結果以及目前仍在努力的改進方向。",
      },
      {
        icon: Users,
        title: "跨領域顧問與社群回饋",
        description:
          "顧問團隊包含心理諮商師、文化研究者與產品設計師。我們定期舉辦線上沙龍與問答，將讀者提問整理成每月專題，確保內容持續回應真實需求。",
      },
      {
        icon: PenTool,
        title: "原創內容策展標準",
        description:
          "每一篇文章都經過事實查核與雙語審稿。除了傳統掌相分類，我們也撰寫情緒管理、職涯探索與生活儀式等延伸主題，提供讀者可操作的練習與反思工具。",
      },
    ],
    takeawaysTitle: "你會在這裡獲得",
    takeaways: [
      "長篇深度文章：解析掌紋背後的文化脈絡與現代應用",
      "互動式 AI 寫作：以客觀數據輔助自我對話，不鼓勵迷信",
      "可下載的練習表與工作坊教材，適合自學或社群分享",
      "公開透明的隱私政策與模型更新紀錄，確保資訊安全",
    ],
    cta: "回到首頁體驗 AI 手相分析",
  },
  en: {
    metaTitle: "About HandFuture | Publishing Quality Palmistry Insights",
    metaDescription:
      "Discover how HandFuture combines palmistry research, machine learning, and editorial best practices. Learn about our data pipeline, expert network, and content standards that deliver trustworthy experiences.",
    heroTitle: "Our Mission and Origin",
    heroParagraphs: [
      "HandFuture was founded by enthusiasts of East Asian palmistry, computer vision, and mindful product design. In 2023 we began a large-scale data curation initiative, synthesizing public studies, licensed teaching materials, and our own photography labs to create a governed dataset with precise palm annotations.",
      "We view palm reading as a reflective practice and conversation starter. Beyond the interactive AI tool, we publish essays, case studies, and exercises that help readers explore personal well-being, life planning, and communication styles without superstition.",
    ],
    sections: [
      {
        icon: Compass,
        title: "Translating Tradition Into Modern Language",
        description:
          "We collaborate with veteran palm readers and anthropologists to catalog canonical literature and oral histories. Each article highlights historical context, common debates, and cultural nuances so readers can respect tradition while forming balanced perspectives.",
      },
      {
        icon: Cpu,
        title: "Transparent AI and Data Stewardship",
        description:
          "Our computer vision models follow strict annotation, anonymization, and audit workflows. Every release ships with evaluation notes covering accuracy, bias detection, and the improvements we are actively pursuing.",
      },
      {
        icon: Users,
        title: "Cross-disciplinary Advisors and Community Feedback",
        description:
          "Advisors include counselors, cultural researchers, and product strategists. We host monthly salons and Q&A sessions, compiling user questions into editorial themes so the site always reflects real-world needs.",
      },
      {
        icon: PenTool,
        title: "Editorial Standards for Original Content",
        description:
          "Each publication undergoes fact checking and bilingual editing. Alongside classical palmistry categories we explore emotional resilience, career planning, and everyday rituals, providing actionable worksheets and prompts.",
      },
    ],
    takeawaysTitle: "What You Can Expect",
    takeaways: [
      "Long-form features that unpack the cultural context of palm lines",
      "Objective AI-generated interpretations that never promote superstition",
      "Downloadable exercises and workshop decks for self-learning or group sharing",
      "Transparent privacy commitments and release notes for every model update",
    ],
    cta: "Return to the homepage to try the AI reader",
  },
};

function AboutPage() {
  const { currentLanguage } = useLanguageStore();

  const content = useMemo(() => aboutContent[currentLanguage], [currentLanguage]);

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white dark:from-orange-950 dark:via-amber-950 dark:to-gray-950">
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
              ? "掌相解讀AI · 品牌與內容介紹"
              : "HandFuture · Brand and Content Overview"}
          </span>
        </div>

        <section className="mx-auto max-w-3xl space-y-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {content.heroTitle}
          </h1>
          {content.heroParagraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-base leading-7 text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
        </section>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {content.sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.title} className="h-full border-border/50">
                <CardHeader className="flex flex-row items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription className="text-xs uppercase tracking-wide">
                      {currentLanguage === "zh" ? "核心理念" : "Key Principle"}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {section.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-12 border-dashed border-primary/40 bg-primary/5">
          <CardHeader>
            <CardTitle>{content.takeawaysTitle}</CardTitle>
            <CardDescription>
              {currentLanguage === "zh"
                ? "無論是否上傳照片，以下資源皆可免費閱讀與下載"
                : "These resources are accessible even if you never upload an image."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm leading-7 text-muted-foreground">
              {content.takeaways.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl">
            {currentLanguage === "zh"
              ? "我們鼓勵所有讀者以開放的心態面對掌相，將其視為認識自己的工具，而非命定論。歡迎將文章分享給朋友或在社群留言，讓我們知道你想看到的下一個主題。"
              : "We invite readers to treat palmistry as a lens for self-discovery rather than determinism. Share the articles, join the discussion, and tell us which topics you would like to explore next."}
          </p>
          <Button asChild size="lg" className="px-6">
            <Link to="/">{content.cta}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
