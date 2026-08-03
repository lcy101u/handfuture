import { ArrowRight, BookOpen, FlaskConical, Hand, History } from "lucide-react";
import { Link } from "react-router-dom";
import { GUIDE_CONTENT } from "@/content/guides";
import type { GuidePath } from "@/config/public-routes";
import type { Locale } from "@/i18n/locales";
import { buildLocalizedPath } from "@/i18n/locales";
import { useLanguageStore } from "@/store/language-store";

const hubCopy: Record<Locale, { eyebrow: string; title: string; intro: string; note: string; byline: string }> = {
  "zh-TW": { eyebrow: "學習中心", title: "從手部結構、文化到證據思考", intro: "這裡不是用文章數量堆出的手相百科，而是一組能互相驗證的學習路徑：先看電腦實際偵測的 21 點，再分辨掌褶與傳統名稱，最後練習檢查看似準確的說法。", note: "所有指南都把文化敘事、技術輸出與科學證據分開；它們不提供診斷、人格評估或未來預測。", byline: "由 Young LIN 研究、撰寫與維護" },
  "zh-CN": { eyebrow: "学习中心", title: "从手部结构、文化到证据思考", intro: "这里不是靠文章数量堆砌的手相百科，而是一组能够相互验证的学习路径：先看计算机实际检测的 21 个点，再区分掌褶和传统名称，最后练习检查看似准确的说法。", note: "所有指南都把文化叙述、技术输出与科学证据分开；它们不提供诊断、人格评估或未来预测。", byline: "由 Young LIN 研究、撰写和维护" },
  en: { eyebrow: "Learning hub", title: "From hand structure and culture to evidence", intro: "This is not a palmistry encyclopedia padded with page count. It is a connected learning path: inspect the 21 points a computer actually detects, separate creases from traditional labels, then practise checking claims that appear accurate.", note: "Every guide separates cultural narrative, technical output, and scientific evidence. None provides diagnosis, personality assessment, or prediction.", byline: "Researched, written, and maintained by Young LIN" },
  ja: { eyebrow: "学習センター", title: "手の構造と文化から証拠の考え方へ", intro: "記事数を増やすための手相百科ではありません。コンピューターが実際に検出する21点を確認し、しわと伝統名を分け、正確に見える主張を検討する学習経路です。", note: "各ガイドは文化的物語、技術出力、科学的証拠を区別し、診断・性格評価・未来予測を提供しません。", byline: "Young LIN が調査・執筆・維持" },
  ko: { eyebrow: "학습 센터", title: "손의 구조와 문화에서 증거 판단까지", intro: "페이지 수를 늘리기 위한 손금 백과가 아닙니다. 컴퓨터가 실제로 감지하는 21개 점을 확인하고 주름과 전통 명칭을 나눈 뒤 정확해 보이는 주장을 점검하는 연결된 학습 경로입니다.", note: "모든 가이드는 문화 이야기, 기술 출력과 과학 증거를 구분하며 진단, 성격 평가나 미래 예측을 제공하지 않습니다.", byline: "Young LIN이 조사·작성·관리" },
  es: { eyebrow: "Centro de aprendizaje", title: "De la estructura y la cultura a la evidencia", intro: "No es una enciclopedia inflada para sumar páginas. Es un recorrido conectado: inspecciona los 21 puntos que detecta el ordenador, separa pliegues de etiquetas tradicionales y practica cómo evaluar afirmaciones que parecen exactas.", note: "Cada guía separa narración cultural, salida técnica y evidencia científica. Ninguna diagnostica, evalúa personalidad ni predice.", byline: "Investigado, escrito y mantenido por Young LIN" },
  "pt-BR": { eyebrow: "Central de aprendizado", title: "Da estrutura e cultura da mão às evidências", intro: "Não é uma enciclopédia inflada para aumentar páginas. É uma trilha conectada: inspecione os 21 pontos detectados pelo computador, separe pregas de rótulos tradicionais e pratique a avaliação de afirmações que parecem precisas.", note: "Cada guia separa narrativa cultural, saída técnica e evidência científica. Nenhum diagnostica, avalia personalidade ou prevê.", byline: "Pesquisado, escrito e mantido por Young LIN" },
  fr: { eyebrow: "Centre d’apprentissage", title: "De la structure et de la culture aux preuves", intro: "Ce n’est pas une encyclopédie gonflée pour multiplier les pages. Le parcours est relié : inspecter les 21 points détectés, séparer plis et étiquettes traditionnelles, puis évaluer les affirmations qui semblent précises.", note: "Chaque guide sépare récit culturel, sortie technique et preuve scientifique. Aucun ne diagnostique, n’évalue la personnalité ou ne prédit.", byline: "Recherché, rédigé et maintenu par Young LIN" },
};

const paths = Object.keys(GUIDE_CONTENT) as GuidePath[];
const icons = [History, FlaskConical, Hand, Hand, BookOpen, FlaskConical, BookOpen];

export default function GuideHubPage() {
  const locale = useLanguageStore((state) => state.currentLanguage);
  const copy = hubCopy[locale];

  return (
    <div className="container mx-auto max-w-6xl space-y-10 px-4 py-10 md:py-14">
      <header className="max-w-4xl space-y-4">
        <p className="text-sm font-semibold text-primary">{copy.eyebrow}</p>
        <h1 className="text-3xl font-bold leading-tight md:text-5xl">{copy.title}</h1>
        <p className="text-lg leading-8 text-muted-foreground">{copy.intro}</p>
        <p className="text-sm font-medium">{copy.byline}</p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {paths.map((path, index) => {
          const content = GUIDE_CONTENT[path][locale];
          const Icon = icons[index % icons.length];
          return (
            <article key={path} className="flex flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
              <Icon className="mb-5 h-7 w-7 text-primary" aria-hidden="true" />
              <h2 className="text-xl font-semibold leading-tight">{content.title}</h2>
              <p className="mt-3 flex-1 leading-7 text-muted-foreground">{content.summary}</p>
              <Link className="mt-5 inline-flex items-center gap-2 font-medium text-primary underline-offset-4 hover:underline" to={buildLocalizedPath(locale, path)}>
                <span>{content.title}</span><ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          );
        })}
      </div>

      <aside className="rounded-2xl border border-primary/30 bg-primary/5 p-6 leading-7">
        {copy.note}
      </aside>
    </div>
  );
}
