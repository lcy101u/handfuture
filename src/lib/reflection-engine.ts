import type { HandLandmark } from "./hand-detector";

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
  Record<"zh" | "en", ReflectionCardCopy>
> = {
  balance: {
    zh: {
      title: "平衡",
      prompt: "最近有哪些事情值得你重新分配時間與注意力？",
      context:
        "這張卡利用手部幾何產生固定選擇，適合作為停下來整理想法的起點。",
      disclaimer: "非科學推論，僅供文化娛樂與自我反思。",
    },
    en: {
      title: "Balance",
      prompt:
        "What deserves a different share of your time and attention right now?",
      context:
        "This card is selected deterministically from hand geometry and is simply a starting point for reflection.",
      disclaimer:
        "A non-scientific prompt for cultural entertainment and reflection only.",
    },
  },
  curiosity: {
    zh: {
      title: "好奇",
      prompt: "哪一個你尚未深入了解的問題，值得用一個小實驗開始？",
      context: "手部座標只負責穩定選卡，不會測量你的性格或能力。",
      disclaimer: "非科學推論，僅供文化娛樂與自我反思。",
    },
    en: {
      title: "Curiosity",
      prompt:
        "Which unanswered question could you explore through one small experiment?",
      context:
        "Hand coordinates only make the selection stable; they do not measure personality or ability.",
      disclaimer:
        "A non-scientific prompt for cultural entertainment and reflection only.",
    },
  },
  connection: {
    zh: {
      title: "連結",
      prompt: "這一週，你想更專心聆聽哪一段關係或對話？",
      context:
        "這是一般性的反思問題，不是對感情、相容性或未來的判斷。",
      disclaimer: "非科學推論，僅供文化娛樂與自我反思。",
    },
    en: {
      title: "Connection",
      prompt:
        "Which relationship or conversation would you like to listen to more carefully this week?",
      context:
        "This is a general reflection question, not a judgment about relationships, compatibility, or the future.",
      disclaimer:
        "A non-scientific prompt for cultural entertainment and reflection only.",
    },
  },
  rhythm: {
    zh: {
      title: "節奏",
      prompt: "目前的生活節奏中，哪一個習慣可以變得更簡單？",
      context:
        "選卡結果不代表能量、健康或命運，只提供一個整理日常的角度。",
      disclaimer: "非科學推論，僅供文化娛樂與自我反思。",
    },
    en: {
      title: "Rhythm",
      prompt: "Which habit in your current routine could become simpler?",
      context:
        "The card does not represent energy, health, or destiny; it only offers a way to review everyday routines.",
      disclaimer:
        "A non-scientific prompt for cultural entertainment and reflection only.",
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
