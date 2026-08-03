import { useState } from "react";
import type { Locale } from "@/i18n/locales";
import { useLanguageStore } from "@/store/language-store";

interface LabCopy {
  title: string;
  instruction: string;
  labels: [string, string];
  statements: [string, string];
  neither: string;
  reveal: string;
  explanation: string;
  questions: string[];
  reset: string;
  privacy: string;
}

const copyByLocale: Record<Locale, LabCopy> = {
  "zh-TW": { title: "哪一段比較像你？", instruction: "先依直覺選擇，再閱讀設計說明。沒有標準答案。", labels: ["敘述 A", "敘述 B"], statements: ["你重視他人的看法，但在重要時刻也希望依自己的判斷行動。你有尚未完全發揮的能力。", "你喜歡與人連結，同時也需要自己的空間。有些決定很快，有些則會反覆考慮。"], neither: "兩段都不像", reveal: "設計揭曉", explanation: "兩段文字都刻意寫成能廣泛適用：它們結合常見願望、相反傾向與難以明確判錯的語句。覺得貼身並不表示系統取得了你的個人資料。", questions: ["這段話是否同時容納相反傾向？", "多數人能否找到一個吻合例子？", "不吻合時，這項說法會被判錯嗎？"], reset: "重設實驗", privacy: "你的選擇只存在目前元件的記憶體，不會上傳或保存。" },
  "zh-CN": { title: "哪一段更像你？", instruction: "先按直觉选择，再阅读设计说明。没有标准答案。", labels: ["描述 A", "描述 B"], statements: ["你重视他人的看法，但在重要时刻也希望按自己的判断行动。你有尚未完全发挥的能力。", "你喜欢与人连接，同时也需要自己的空间。有些决定很快，有些会反复考虑。"], neither: "两段都不像", reveal: "设计揭晓", explanation: "两段文字都故意写成广泛适用：它们结合常见愿望、相反倾向和难以明确判错的语句。觉得贴身并不表示系统取得了你的个人资料。", questions: ["文字是否同时容纳相反倾向？", "多数人能否找到吻合例子？", "不吻合时，这项说法会被判错吗？"], reset: "重置实验", privacy: "你的选择只存在当前组件内存，不会上传或保存。" },
  en: { title: "Which statement feels more like you?", instruction: "Choose by first impression, then read how the statements were designed. There is no correct answer.", labels: ["Statement A", "Statement B"], statements: ["You value other people’s opinions, yet at important moments you want to act on your own judgment. You have abilities that are not always fully used.", "You enjoy connection with others and also need space of your own. Some decisions come quickly, while others receive repeated thought."], neither: "Neither statement", reveal: "Design revealed", explanation: "Both statements were written to apply broadly. They combine common aspirations, opposite tendencies, and wording that is difficult to mark clearly wrong. A personal feeling does not mean the page obtained personal information about you.", questions: ["Does the sentence accommodate opposite tendencies?", "Could most people retrieve at least one matching example?", "Would a mismatch ever count against the claim?"], reset: "Reset lab", privacy: "Your choice exists only in this component’s memory. It is not uploaded or saved." },
  ja: { title: "どちらが自分らしく感じますか？", instruction: "第一印象で選び、設計の説明を読んでください。正解はありません。", labels: ["文章 A", "文章 B"], statements: ["他人の意見を大切にしながら、重要な場面では自分の判断で動きたいと考えます。まだ十分に使っていない力があります。", "人とのつながりを楽しむ一方で、自分だけの空間も必要です。すぐ決めることも、何度も考えることもあります。"], neither: "どちらでもない", reveal: "設計の説明", explanation: "二つとも広く当てはまるよう、一般的な願い、反対傾向、誤りと判定しにくい表現を組み合わせています。個人的に感じても、個人情報を取得した証拠ではありません。", questions: ["反対の傾向を同時に含むか？", "多くの人が一致例を思い出せるか？", "不一致が主張の誤りになるか？"], reset: "実験をリセット", privacy: "選択はこの画面のメモリだけにあり、送信・保存されません。" },
  ko: { title: "어느 문장이 더 나와 같나요?", instruction: "첫인상으로 선택한 뒤 설계 설명을 읽어 보세요. 정답은 없습니다.", labels: ["문장 A", "문장 B"], statements: ["다른 사람의 의견을 중요하게 여기지만 중요한 순간에는 자신의 판단으로 행동하고 싶어 합니다. 아직 충분히 쓰지 않은 능력이 있습니다.", "사람들과 연결되기를 좋아하면서도 자신만의 공간이 필요합니다. 어떤 결정은 빠르고 어떤 결정은 여러 번 생각합니다."], neither: "둘 다 아님", reveal: "설계 공개", explanation: "두 문장 모두 넓게 적용되도록 일반적인 바람, 반대 성향과 명확히 틀렸다고 하기 어려운 표현을 섞었습니다. 개인적으로 느껴져도 페이지가 개인 정보를 얻었다는 뜻은 아닙니다.", questions: ["반대 성향을 함께 담고 있나요?", "대부분이 일치 사례를 찾을 수 있나요?", "불일치가 주장을 틀렸다고 만들 수 있나요?"], reset: "실험 재설정", privacy: "선택은 이 구성요소 메모리에만 있고 업로드하거나 저장하지 않습니다." },
  es: { title: "¿Qué frase se parece más a ti?", instruction: "Elige por primera impresión y después lee el diseño. No hay respuesta correcta.", labels: ["Frase A", "Frase B"], statements: ["Valoras la opinión ajena, pero en momentos importantes quieres actuar según tu propio juicio. Tienes capacidades que no siempre aprovechas por completo.", "Disfrutas la conexión con otras personas y también necesitas espacio propio. Algunas decisiones son rápidas y otras reciben muchas vueltas."], neither: "Ninguna", reveal: "Diseño revelado", explanation: "Ambas frases fueron escritas para aplicarse ampliamente. Combinan deseos comunes, tendencias opuestas y texto difícil de declarar erróneo. Sentirlas personales no significa que la página obtuviera datos sobre ti.", questions: ["¿Incluye tendencias opuestas?", "¿Puede casi cualquiera recordar una coincidencia?", "¿Un desacuerdo contaría contra la afirmación?"], reset: "Restablecer laboratorio", privacy: "Tu elección solo existe en la memoria de este componente; no se envía ni se guarda." },
  "pt-BR": { title: "Qual frase parece mais com você?", instruction: "Escolha pela primeira impressão e depois leia o projeto. Não há resposta correta.", labels: ["Frase A", "Frase B"], statements: ["Você valoriza a opinião alheia, mas em momentos importantes quer agir pelo próprio julgamento. Há capacidades que nem sempre usa plenamente.", "Você gosta de se conectar com outras pessoas e também precisa de espaço próprio. Algumas decisões são rápidas e outras recebem muita reflexão."], neither: "Nenhuma", reveal: "Projeto revelado", explanation: "As duas frases foram escritas para se aplicar amplamente. Combinam desejos comuns, tendências opostas e texto difícil de declarar errado. Sentir algo pessoal não significa que a página obteve dados sobre você.", questions: ["Inclui tendências opostas?", "Quase todos podem lembrar uma coincidência?", "Uma discordância contaria contra a afirmação?"], reset: "Redefinir laboratório", privacy: "Sua escolha existe apenas na memória deste componente; não é enviada nem salva." },
  fr: { title: "Quelle phrase vous ressemble le plus ?", instruction: "Choisissez selon la première impression, puis lisez la conception. Il n’y a pas de bonne réponse.", labels: ["Phrase A", "Phrase B"], statements: ["Vous accordez de l’importance à l’avis des autres, mais souhaitez suivre votre jugement aux moments importants. Certaines capacités ne sont pas toujours pleinement utilisées.", "Vous appréciez les liens avec autrui et avez aussi besoin de votre espace. Certaines décisions sont rapides, d’autres longuement réfléchies."], neither: "Aucune", reveal: "Conception révélée", explanation: "Les deux phrases sont conçues pour s’appliquer largement. Elles associent aspirations communes, tendances opposées et texte difficile à déclarer faux. Une impression personnelle ne signifie pas que la page a obtenu vos données.", questions: ["La phrase accueille-t-elle des tendances opposées ?", "Presque tout le monde peut-il trouver un accord ?", "Un écart pourrait-il réfuter l’affirmation ?"], reset: "Réinitialiser le laboratoire", privacy: "Votre choix reste seulement en mémoire de ce composant ; il n’est ni envoyé ni enregistré." },
};

export default function BarnumLab() {
  const locale = useLanguageStore((state) => state.currentLanguage);
  const copy = copyByLocale[locale];
  const [choice, setChoice] = useState<0 | 1 | "neither" | null>(null);
  const [reversed, setReversed] = useState(() => Math.random() >= 0.5);
  const order: Array<0 | 1> = reversed ? [1, 0] : [0, 1];

  const reset = () => {
    setChoice(null);
    setReversed((value) => !value);
  };

  return (
    <section className="space-y-6 rounded-2xl border border-border/70 bg-card p-5 md:p-8" aria-labelledby="barnum-lab-title">
      <div><h2 id="barnum-lab-title" className="text-2xl font-semibold">{copy.title}</h2><p className="mt-2 leading-7 text-muted-foreground">{copy.instruction}</p></div>
      <div className="grid gap-4 md:grid-cols-2">
        {order.map((statementIndex, position) => (
          <button key={statementIndex} type="button" aria-label={`${copy.labels[position]}: ${copy.statements[statementIndex]}`} aria-pressed={choice === statementIndex} onClick={() => setChoice(statementIndex)} className={`rounded-xl border p-5 text-left leading-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${choice === statementIndex ? "border-primary bg-primary/10" : "border-border hover:border-primary/70"}`}>
            <span className="mb-2 block text-sm font-semibold text-primary">{copy.labels[position]}</span>{copy.statements[statementIndex]}
          </button>
        ))}
      </div>
      <button type="button" aria-pressed={choice === "neither"} onClick={() => setChoice("neither")} className={`rounded-md border px-4 py-2 font-medium ${choice === "neither" ? "border-primary bg-primary/10" : "border-border hover:border-primary"}`}>{copy.neither}</button>

      {choice !== null && (
        <div role="status" className="space-y-4 rounded-xl border border-primary/30 bg-primary/5 p-5">
          <h3 className="text-xl font-semibold">{copy.reveal}</h3>
          <p className="leading-7">{copy.explanation}</p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">{copy.questions.map((question) => <li key={question}>{question}</li>)}</ul>
          <p className="text-sm text-muted-foreground">{copy.privacy}</p>
        </div>
      )}

      <button type="button" onClick={reset} className="rounded-md border px-4 py-2 text-sm font-medium hover:border-primary">{copy.reset}</button>
    </section>
  );
}
