import type { HandLandmark } from "./hand-detector";
import type { Locale } from "@/i18n/locales";

export const REFLECTION_KEYS = [
  "balance",
  "curiosity",
  "connection",
  "rhythm",
] as const;

export type ReflectionKey = (typeof REFLECTION_KEYS)[number];

export interface ReflectionCardCopy {
  title: string;
  prompt: string;
  context: string;
  disclaimer: string;
}

export const REFLECTION_CARDS: Record<
  ReflectionKey,
  Record<Locale, ReflectionCardCopy>
> = {
  balance: {
    "zh-TW": {
      title: "平衡",
      prompt: "最近有哪些事情值得你重新分配時間與注意力？",
      context: "這張卡利用手部幾何產生固定選擇，適合作為停下來整理想法的起點。",
      disclaimer: "非科學推論，僅供文化娛樂與自我反思。",
    },
    "zh-CN": {
      title: "平衡",
      prompt: "最近有哪些事情值得你重新分配时间与注意力？",
      context: "这张卡利用手部几何信息产生固定选择，适合作为停下来整理想法的起点。",
      disclaimer: "非科学推论，仅供文化娱乐与自我反思。",
    },
    en: {
      title: "Balance",
      prompt: "What deserves a different share of your time and attention right now?",
      context: "This card is selected deterministically from hand geometry and is simply a starting point for reflection.",
      disclaimer: "A non-scientific prompt for cultural entertainment and reflection only.",
    },
    ja: {
      title: "バランス",
      prompt: "今、時間と注意の配分を見直したいことは何ですか？",
      context: "このカードは手の形状から一定の方法で選ばれ、立ち止まって考えを整理するきっかけにすぎません。",
      disclaimer: "文化的な娯楽と自己省察のみを目的とした非科学的なプロンプトです。",
    },
    ko: {
      title: "균형",
      prompt: "지금 시간과 관심을 다르게 배분할 만한 일은 무엇인가요?",
      context: "이 카드는 손의 기하 정보로 일관되게 선택되며, 잠시 멈춰 생각을 정리하기 위한 출발점일 뿐입니다.",
      disclaimer: "문화적 오락과 자기 성찰만을 위한 비과학적 질문입니다.",
    },
    es: {
      title: "Equilibrio",
      prompt: "¿Qué merece ahora una distribución diferente de tu tiempo y atención?",
      context: "Esta tarjeta se selecciona de forma determinista a partir de la geometría de la mano y solo sirve como punto de partida para reflexionar.",
      disclaimer: "Sugerencia no científica, solo para entretenimiento cultural y reflexión.",
    },
    "pt-BR": {
      title: "Equilíbrio",
      prompt: "O que merece uma distribuição diferente do seu tempo e atenção agora?",
      context: "Este cartão é selecionado de forma determinística pela geometria da mão e serve apenas como ponto de partida para reflexão.",
      disclaimer: "Sugestão não científica, apenas para entretenimento cultural e reflexão.",
    },
    fr: {
      title: "Équilibre",
      prompt: "Qu’est-ce qui mérite une autre part de votre temps et de votre attention en ce moment ?",
      context: "Cette carte est sélectionnée de manière déterministe à partir de la géométrie de la main et sert uniquement de point de départ à la réflexion.",
      disclaimer: "Invite non scientifique, uniquement pour le divertissement culturel et la réflexion.",
    },
  },
  curiosity: {
    "zh-TW": {
      title: "好奇",
      prompt: "哪一個你尚未深入了解的問題，值得用一個小實驗開始？",
      context: "手部座標只負責穩定選卡，不會測量你的性格或能力。",
      disclaimer: "非科學推論，僅供文化娛樂與自我反思。",
    },
    "zh-CN": {
      title: "好奇",
      prompt: "哪个你尚未深入了解的问题，值得用一个小实验开始？",
      context: "手部坐标只负责稳定选卡，不会衡量你的性格或能力。",
      disclaimer: "非科学推论，仅供文化娱乐与自我反思。",
    },
    en: {
      title: "Curiosity",
      prompt: "Which unanswered question could you explore through one small experiment?",
      context: "Hand coordinates only make the selection stable; they do not measure personality or ability.",
      disclaimer: "A non-scientific prompt for cultural entertainment and reflection only.",
    },
    ja: {
      title: "好奇心",
      prompt: "まだ答えのないどの問いを、小さな実験から探究できますか？",
      context: "手の座標は選択を安定させるだけで、性格や能力を測るものではありません。",
      disclaimer: "文化的な娯楽と自己省察のみを目的とした非科学的なプロンプトです。",
    },
    ko: {
      title: "호기심",
      prompt: "아직 답을 찾지 못한 어떤 질문을 작은 실험으로 탐구해 볼 수 있나요?",
      context: "손 좌표는 선택을 안정적으로 만들 뿐이며 성격이나 능력을 측정하지 않습니다.",
      disclaimer: "문화적 오락과 자기 성찰만을 위한 비과학적 질문입니다.",
    },
    es: {
      title: "Curiosidad",
      prompt: "¿Qué pregunta sin respuesta podrías explorar con un pequeño experimento?",
      context: "Las coordenadas de la mano solo estabilizan la selección; no miden la personalidad ni la capacidad.",
      disclaimer: "Sugerencia no científica, solo para entretenimiento cultural y reflexión.",
    },
    "pt-BR": {
      title: "Curiosidade",
      prompt: "Qual pergunta ainda sem resposta você poderia explorar com um pequeno experimento?",
      context: "As coordenadas da mão apenas estabilizam a escolha; elas não medem personalidade nem habilidade.",
      disclaimer: "Sugestão não científica, apenas para entretenimento cultural e reflexão.",
    },
    fr: {
      title: "Curiosité",
      prompt: "Quelle question sans réponse pourriez-vous explorer par une petite expérience ?",
      context: "Les coordonnées de la main rendent uniquement le choix stable ; elles ne mesurent ni la personnalité ni les aptitudes.",
      disclaimer: "Invite non scientifique, uniquement pour le divertissement culturel et la réflexion.",
    },
  },
  connection: {
    "zh-TW": {
      title: "連結",
      prompt: "這一週，你想更專心聆聽哪一段關係或對話？",
      context: "這是一般性的反思問題，不是對感情、相容性或未來的判斷。",
      disclaimer: "非科學推論，僅供文化娛樂與自我反思。",
    },
    "zh-CN": {
      title: "连接",
      prompt: "这一周，你想更专心倾听哪一段关系或对话？",
      context: "这是一般性的反思问题，不是对感情、相容性或未来的判断。",
      disclaimer: "非科学推论，仅供文化娱乐与自我反思。",
    },
    en: {
      title: "Connection",
      prompt: "Which relationship or conversation would you like to listen to more carefully this week?",
      context: "This is a general reflection question, not a judgment about relationships, compatibility, or the future.",
      disclaimer: "A non-scientific prompt for cultural entertainment and reflection only.",
    },
    ja: {
      title: "つながり",
      prompt: "今週、どの関係や会話にもっと注意深く耳を傾けたいですか？",
      context: "これは一般的な省察の問いであり、関係、相性、未来についての判断ではありません。",
      disclaimer: "文化的な娯楽と自己省察のみを目的とした非科学的なプロンプトです。",
    },
    ko: {
      title: "연결",
      prompt: "이번 주에 어떤 관계나 대화에 더 주의 깊게 귀 기울이고 싶나요?",
      context: "이는 일반적인 성찰 질문이며 관계, 궁합 또는 미래에 대한 판단이 아닙니다.",
      disclaimer: "문화적 오락과 자기 성찰만을 위한 비과학적 질문입니다.",
    },
    es: {
      title: "Conexión",
      prompt: "¿Qué relación o conversación te gustaría escuchar con más atención esta semana?",
      context: "Esta es una pregunta general de reflexión, no un juicio sobre relaciones, compatibilidad ni el futuro.",
      disclaimer: "Sugerencia no científica, solo para entretenimiento cultural y reflexión.",
    },
    "pt-BR": {
      title: "Conexão",
      prompt: "A qual relacionamento ou conversa você gostaria de ouvir com mais atenção esta semana?",
      context: "Esta é uma pergunta geral de reflexão, não um julgamento sobre relacionamentos, compatibilidade ou o futuro.",
      disclaimer: "Sugestão não científica, apenas para entretenimento cultural e reflexão.",
    },
    fr: {
      title: "Lien",
      prompt: "Quelle relation ou conversation aimeriez-vous écouter plus attentivement cette semaine ?",
      context: "Il s’agit d’une question générale de réflexion, et non d’un jugement sur les relations, la compatibilité ou l’avenir.",
      disclaimer: "Invite non scientifique, uniquement pour le divertissement culturel et la réflexion.",
    },
  },
  rhythm: {
    "zh-TW": {
      title: "節奏",
      prompt: "目前的生活節奏中，哪一個習慣可以變得更簡單？",
      context: "選卡結果不代表能量、健康或命運，只提供一個整理日常的角度。",
      disclaimer: "非科學推論，僅供文化娛樂與自我反思。",
    },
    "zh-CN": {
      title: "节奏",
      prompt: "目前的生活节奏中，哪个习惯可以变得更简单？",
      context: "选卡结果不代表能量、健康或命运，只提供一个整理日常生活的角度。",
      disclaimer: "非科学推论，仅供文化娱乐与自我反思。",
    },
    en: {
      title: "Rhythm",
      prompt: "Which habit in your current routine could become simpler?",
      context: "The card does not represent energy, health, or destiny; it only offers a way to review everyday routines.",
      disclaimer: "A non-scientific prompt for cultural entertainment and reflection only.",
    },
    ja: {
      title: "リズム",
      prompt: "今の日課の中で、もっとシンプルにできる習慣は何ですか？",
      context: "このカードはエネルギー、健康、運命を表すものではなく、日常を見直す視点を一つ示すだけです。",
      disclaimer: "文化的な娯楽と自己省察のみを目的とした非科学的なプロンプトです。",
    },
    ko: {
      title: "리듬",
      prompt: "현재 일상에서 더 단순하게 만들 수 있는 습관은 무엇인가요?",
      context: "카드는 에너지, 건강 또는 운명을 나타내지 않으며 일상을 돌아보는 관점만 제공합니다.",
      disclaimer: "문화적 오락과 자기 성찰만을 위한 비과학적 질문입니다.",
    },
    es: {
      title: "Ritmo",
      prompt: "¿Qué hábito de tu rutina actual podría simplificarse?",
      context: "La tarjeta no representa energía, salud ni destino; solo ofrece una forma de revisar las rutinas cotidianas.",
      disclaimer: "Sugerencia no científica, solo para entretenimiento cultural y reflexión.",
    },
    "pt-BR": {
      title: "Ritmo",
      prompt: "Qual hábito da sua rotina atual poderia ficar mais simples?",
      context: "O cartão não representa energia, saúde ou destino; ele apenas oferece uma forma de rever as rotinas diárias.",
      disclaimer: "Sugestão não científica, apenas para entretenimento cultural e reflexão.",
    },
    fr: {
      title: "Rythme",
      prompt: "Quelle habitude de votre routine actuelle pourrait devenir plus simple ?",
      context: "La carte ne représente ni l’énergie, ni la santé, ni le destin ; elle propose seulement une façon de revoir les habitudes quotidiennes.",
      disclaimer: "Invite non scientifique, uniquement pour le divertissement culturel et la réflexion.",
    },
  },
};

export function selectReflectionKey(landmarks: HandLandmark[]): ReflectionKey {
  if (landmarks.length !== 21) {
    throw new Error("Reflection selection requires exactly 21 hand landmarks.");
  }

  for (const landmark of landmarks) {
    if (
      !landmark ||
      !Number.isFinite(landmark.x) ||
      !Number.isFinite(landmark.y) ||
      !Number.isFinite(landmark.z)
    ) {
      throw new Error("Reflection selection requires finite hand landmarks.");
    }
  }

  const wrist = landmarks[0];
  const signature = landmarks.slice(1).reduce((sum, landmark, index) => {
    const distance = Math.hypot(
      landmark.x - wrist.x,
      landmark.y - wrist.y,
      landmark.z - wrist.z,
    );

    return sum + Math.round(distance * 10_000) * (index + 1);
  }, 0);

  return REFLECTION_KEYS[Math.abs(signature) % REFLECTION_KEYS.length];
}
