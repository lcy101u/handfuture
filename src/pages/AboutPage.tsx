import { ABOUT_CONTENT } from "@/content/policies";
import { getTranslation } from "@/i18n/catalogs";
import { useLanguageStore } from "@/store/language-store";
import { EditorialArticle } from "./GuidePage";

const authorProfile = {
  "zh-TW": { heading: "作者與編輯責任", role: "Young LIN 是 HandFuture 的獨立開發者與內容編輯，負責查閱公開來源、撰寫文章、設計互動並維護程式。", limit: "Young LIN 不是醫師、治療師、科學家或認證手相專家；網站不以個人資格取代可核實來源或合格專業意見。", method: "編輯流程會先核對實際程式輸出，再把文化說法、技術能力與實證證據分開，並在內容有實質變更時更新日期。", update: "2026-08-03：新增 21 點互動圖譜、掌褶比較、巴納姆效應實驗與證據檢查指南，並更新偵測結果說明。" },
  "zh-CN": { heading: "作者与编辑责任", role: "Young LIN 是 HandFuture 的独立开发者和内容编辑，负责查阅公开来源、撰写文章、设计互动并维护程序。", limit: "Young LIN 不是医生、治疗师、科学家或认证手相专家；网站不会用个人资格替代可核实来源或合格专业意见。", method: "编辑流程先核对实际程序输出，再区分文化说法、技术能力与实证证据，并在内容实质变更时更新日期。", update: "2026-08-03：新增 21 点互动图谱、掌褶比较、巴纳姆效应实验和证据检查指南，并更新检测结果说明。" },
  en: { heading: "Author and editorial responsibility", role: "Young LIN is the independent developer and content editor behind HandFuture, responsible for reviewing public sources, writing articles, designing interactions, and maintaining the code.", limit: "Young LIN is not a doctor, therapist, scientist, or certified palmistry professional. The site does not use personal credentials as a substitute for verifiable sources or qualified professional advice.", method: "The editorial process checks the implemented output first, separates cultural accounts from technical capability and empirical evidence, and updates dates when material changes are made.", update: "2026-08-03: Added the 21-point atlas, crease comparison, Barnum effect lab, evidence checklist, and an updated detector-result explanation." },
  ja: { heading: "著者と編集責任", role: "Young LIN は HandFuture の個人開発者・コンテンツ編集者として、公開資料の確認、執筆、インタラクション設計、コード保守を担当します。", limit: "医師、治療者、科学者、認定手相専門家ではなく、個人資格を検証可能な資料や専門家の助言の代わりにしません。", method: "実装された出力を先に確認し、文化的説明、技術能力、実証的証拠を分け、重要な変更時に日付を更新します。", update: "2026-08-03：21点図鑑、しわ比較、バーナム効果実験、証拠チェックガイド、検出結果の説明を追加・更新しました。" },
  ko: { heading: "저자와 편집 책임", role: "Young LIN은 HandFuture의 독립 개발자이자 콘텐츠 편집자로 공개 자료 검토, 글 작성, 상호작용 설계와 코드 관리를 담당합니다.", limit: "의사, 치료사, 과학자 또는 공인 손금 전문가가 아니며 개인 자격을 검증 가능한 출처나 전문가 조언 대신 사용하지 않습니다.", method: "실제 구현 출력을 먼저 확인하고 문화 설명, 기술 능력과 실증 증거를 구분하며 중요한 변경 시 날짜를 갱신합니다.", update: "2026-08-03: 21점 지도, 주름 비교, 바넘 효과 실험, 증거 점검 가이드와 감지 결과 설명을 추가·갱신했습니다." },
  es: { heading: "Autoría y responsabilidad editorial", role: "Young LIN es el desarrollador independiente y editor de contenido de HandFuture; revisa fuentes públicas, escribe, diseña interacciones y mantiene el código.", limit: "No es médico, terapeuta, científico ni profesional certificado de quiromancia. El sitio no sustituye fuentes verificables o asesoramiento cualificado por credenciales personales.", method: "El proceso comprueba primero la salida implementada, separa cultura, capacidad técnica y evidencia empírica, y actualiza las fechas tras cambios sustanciales.", update: "2026-08-03: Se añadieron el atlas de 21 puntos, la comparación de pliegues, el laboratorio Barnum, la guía de evidencias y una explicación actualizada del detector." },
  "pt-BR": { heading: "Autoria e responsabilidade editorial", role: "Young LIN é o desenvolvedor independente e editor de conteúdo do HandFuture, responsável por fontes públicas, textos, interações e manutenção do código.", limit: "Não é médico, terapeuta, cientista nem profissional certificado de quiromancia. O site não substitui fontes verificáveis ou orientação qualificada por credenciais pessoais.", method: "O processo confere primeiro a saída implementada, separa cultura, capacidade técnica e evidência empírica e atualiza datas após mudanças substanciais.", update: "2026-08-03: Foram adicionados o atlas de 21 pontos, a comparação de pregas, o laboratório Barnum, o guia de evidências e uma explicação atualizada do detector." },
  fr: { heading: "Auteur et responsabilité éditoriale", role: "Young LIN est le développeur indépendant et éditeur de contenu de HandFuture ; il vérifie les sources publiques, rédige, conçoit les interactions et maintient le code.", limit: "Il n’est ni médecin, thérapeute, scientifique ni professionnel certifié de chiromancie. Le site ne remplace pas les sources vérifiables ou les conseils qualifiés par des titres personnels.", method: "Le processus vérifie d’abord la sortie réelle, sépare culture, capacité technique et preuve empirique, puis met les dates à jour lors de changements importants.", update: "2026-08-03 : ajout de l’atlas des 21 repères, de la comparaison des plis, du laboratoire Barnum, du guide des preuves et d’une explication actualisée du détecteur." },
} as const;

export default function AboutPage() {
  const locale = useLanguageStore((state) => state.currentLanguage);
  const profile = authorProfile[locale];

  return (
    <EditorialArticle
      content={ABOUT_CONTENT[locale]}
      locale={locale}
      relatedPaths={["/how-it-works", "/guides/palmistry-basics"]}
      eyebrow={getTranslation(locale, "editorial.eyebrow.about")}
      interactive={
        <section className="space-y-3 rounded-2xl border border-primary/30 bg-primary/5 p-6">
          <h2 className="text-2xl font-semibold">{profile.heading}</h2>
          <p className="leading-7">{profile.role}</p>
          <p className="leading-7 text-muted-foreground">{profile.limit}</p>
          <p className="leading-7 text-muted-foreground">{profile.method}</p>
          <p className="border-t border-primary/20 pt-3 text-sm leading-6 text-muted-foreground">{profile.update}</p>
        </section>
      }
    />
  );
}
