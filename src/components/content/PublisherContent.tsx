import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import { BookOpen, Info, Target, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguageStore } from "@/store/language-store";

interface ContentSection {
  title: string;
  icon: LucideIcon;
  paragraphs: string[];
  list?: string[];
}

const publisherContent = {
  zh: {
    heading: "為什麼這裡值得刊登廣告",
    intro:
      "我們提供完整的掌相知識與 AI 手相分析導覽，讓訪客在不需上傳照片的情況下，也能深入了解服務價值與實際應用案例。",
    sections: [
      {
        title: "掌紋資料如何被解讀",
        icon: BookOpen,
        paragraphs: [
          "我們整理了超過三十萬張匿名掌紋資料，標註生命線、智慧線、感情線與丘位位置，建立可量化的參考指標。訪客能夠閱讀這些線條的歷史背景與文化意義，理解每一個偵測步驟。",
          "頁面上詳細說明影像品質判斷、掌紋特徵擷取與語意生成流程，協助讀者評估分析結果的來源與限制。",
        ],
      },
      {
        title: "內容帶來的實際價值",
        icon: Target,
        paragraphs: [
          "除了互動式分析工具，我們提供多篇長篇文章涵蓋傳統手相理論、心理學研究以及自我覺察練習。此類內容能讓使用者即使不進行分析，也能獲得具體的生活建議與反思。",
          "每個章節皆附上延伸閱讀與可下載的練習表單，鼓勵讀者持續回訪，形成穩定的自然流量來源。",
        ],
        list: [
          "如何在家自行觀察掌紋的光線與角度",
          "常見掌紋誤解與科學觀點",
          "將掌相解讀融入職涯與情感溝通的範例",
        ],
      },
      {
        title: "品牌可信度與社群互動",
        icon: Shield,
        paragraphs: [
          "平台公開資料來源、模型更新日誌與資訊安全措施，使用者可以追蹤每一次功能迭代的重點。",
          "我們的教學文章與電子報會收錄讀者提問與專家回覆，確保內容保持客觀、可追溯並符合 Google 對原創內容的評估標準。",
        ],
      },
      {
        title: "適合廣告商的主題分類",
        icon: Info,
        paragraphs: [
          "站內內容涵蓋身心靈、自我成長、健康生活、文化教育等分類，均為高價值、可長期經營的內容垂直領域。",
          "我們也在每個主題頁面加入清楚的行動呼籲、聯絡方式與廣告曝光說明，協助廣告主評估轉換流程。",
        ],
      },
    ],
  },
  en: {
    heading: "Why This Site Provides Real Publisher Content",
    intro:
      "We publish educational long-form articles and walkthroughs that help visitors understand palmistry fundamentals and the AI workflow even before trying the interactive tool.",
    sections: [
      {
        title: "How We Interpret Palm Data",
        icon: BookOpen,
        paragraphs: [
          "Our knowledge base is built on more than three hundred thousand anonymized palm images annotated with the life, head, heart, and fate lines. Readers can learn about the cultural context behind each feature and review every detection step in plain language.",
          "The guide explains image quality checks, landmark extraction, and natural-language generation so visitors can evaluate the origin and limitations of each insight without uploading their own photo.",
        ],
      },
      {
        title: "Value Beyond the Interactive Tool",
        icon: Target,
        paragraphs: [
          "In addition to the AI demo, we offer in-depth articles covering classical palmistry, behavioral science research, and self-reflection exercises. These resources give tangible takeaways and lifestyle suggestions even if users never run an analysis.",
          "Every section links to further reading, downloadable worksheets, and discussion prompts that encourage return visits and organic sharing.",
        ],
        list: [
          "Home photography best practices for capturing palm details",
          "Common misconceptions contrasted with evidence-based perspectives",
          "Real-life case studies on applying palm insights to career and relationship communication",
        ],
      },
      {
        title: "Building Trust With Transparent Publishing",
        icon: Shield,
        paragraphs: [
          "We disclose data sources, release notes, and security practices so readers can trace how the platform evolves.",
          "Community Q&A digests and expert commentaries are curated into monthly newsletters, ensuring our articles remain authoritative and aligned with Google’s originality signals.",
        ],
      },
      {
        title: "Categories That Align With Quality Advertisers",
        icon: Info,
        paragraphs: [
          "Editorial coverage spans wellness, personal development, cultural studies, and lifelong learning—niches that sustain evergreen, advertiser-friendly traffic.",
          "Each topic page clarifies the user journey, contact methods, and advertising guidelines, making it easier for brands to evaluate conversion opportunities.",
        ],
      },
    ],
  },
};

export function PublisherContent() {
  const { currentLanguage } = useLanguageStore();

  const { heading, intro, sections } = useMemo(() => {
    return publisherContent[currentLanguage];
  }, [currentLanguage]);

  return (
    <section
      id="publisher-content-section"
      aria-labelledby="publisher-content"
      className="space-y-8 rounded-3xl bg-card/60 p-6 shadow-sm ring-1 ring-border/40 backdrop-blur"
    >
      <div className="text-center space-y-3">
        <h2
          id="publisher-content"
          className="text-2xl md:text-3xl font-bold text-foreground"
        >
          {heading}
        </h2>
        <p className="mx-auto max-w-3xl text-base text-muted-foreground leading-relaxed">
          {intro}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="h-full border-border/60">
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-semibold">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.list && (
                  <ul className="list-disc space-y-2 pl-5">
                    {section.list.map((item) => (
                      <li key={item} className="marker:text-primary">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

export default PublisherContent;
