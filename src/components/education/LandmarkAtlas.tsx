import { useState } from "react";
import { HAND_CONNECTIONS, HAND_LANDMARKS } from "@/content/landmarks";
import type { Locale } from "@/i18n/locales";
import { useLanguageStore } from "@/store/language-store";

const ui: Record<Locale, { title: string; instruction: string; reset: string; diagram: string; estimate: string; limit: string }> = {
  "zh-TW": { title: "選擇一個關節點", instruction: "可使用圖上的圓點或下方清單；選取狀態會同步。", reset: "重設圖譜", diagram: "21 點手部關節示意圖", estimate: "模型估計位置", limit: "此座標不包含掌褶、健康、性格或未來資訊。" },
  "zh-CN": { title: "选择一个关节点", instruction: "可使用图上的圆点或下方列表；选择状态会同步。", reset: "重置图谱", diagram: "21 点手部关节示意图", estimate: "模型估计位置", limit: "此坐标不包含掌褶、健康、性格或未来信息。" },
  en: { title: "Choose a landmark", instruction: "Use a point on the diagram or the list below; selection stays synchronized.", reset: "Reset atlas", diagram: "Diagram of 21 hand landmarks", estimate: "Model estimate", limit: "This coordinate contains no crease, health, personality, or future information." },
  ja: { title: "ランドマークを選択", instruction: "図の点または一覧を使えます。選択状態は同期します。", reset: "図鑑をリセット", diagram: "21個の手のランドマーク図", estimate: "モデル推定位置", limit: "座標に掌線、健康、性格、未来の情報は含まれません。" },
  ko: { title: "랜드마크 선택", instruction: "그림의 점 또는 아래 목록을 사용하면 선택 상태가 동기화됩니다.", reset: "지도 재설정", diagram: "21개 손 랜드마크 그림", estimate: "모델 추정 위치", limit: "좌표에는 손금, 건강, 성격 또는 미래 정보가 없습니다." },
  es: { title: "Elige un punto", instruction: "Usa el diagrama o la lista; la selección permanece sincronizada.", reset: "Restablecer atlas", diagram: "Diagrama de 21 puntos de la mano", estimate: "Estimación del modelo", limit: "La coordenada no contiene pliegues, salud, personalidad ni futuro." },
  "pt-BR": { title: "Escolha um ponto", instruction: "Use o diagrama ou a lista; a seleção permanece sincronizada.", reset: "Redefinir atlas", diagram: "Diagrama de 21 pontos da mão", estimate: "Estimativa do modelo", limit: "A coordenada não contém pregas, saúde, personalidade nem futuro." },
  fr: { title: "Choisissez un repère", instruction: "Utilisez le schéma ou la liste ; la sélection reste synchronisée.", reset: "Réinitialiser l’atlas", diagram: "Schéma des 21 repères de la main", estimate: "Estimation du modèle", limit: "La coordonnée ne contient ni pli, santé, personnalité ni avenir." },
};

const fingers: Record<Locale, Record<string, string>> = {
  "zh-TW": { wrist: "手腕", thumb: "拇指", index: "食指", middle: "中指", ring: "無名指", pinky: "小指" },
  "zh-CN": { wrist: "手腕", thumb: "拇指", index: "食指", middle: "中指", ring: "无名指", pinky: "小指" },
  en: { wrist: "wrist", thumb: "thumb", index: "index finger", middle: "middle finger", ring: "ring finger", pinky: "little finger" },
  ja: { wrist: "手首", thumb: "親指", index: "人差し指", middle: "中指", ring: "薬指", pinky: "小指" },
  ko: { wrist: "손목", thumb: "엄지", index: "검지", middle: "중지", ring: "약지", pinky: "새끼손가락" },
  es: { wrist: "muñeca", thumb: "pulgar", index: "dedo índice", middle: "dedo medio", ring: "dedo anular", pinky: "meñique" },
  "pt-BR": { wrist: "punho", thumb: "polegar", index: "dedo indicador", middle: "dedo médio", ring: "dedo anelar", pinky: "dedo mínimo" },
  fr: { wrist: "poignet", thumb: "pouce", index: "index", middle: "majeur", ring: "annulaire", pinky: "auriculaire" },
};

const segments: Record<Locale, Record<string, string>> = {
  "zh-TW": { wrist: "靠近手腕中央", cmc: "腕掌關節附近", mcp: "掌指關節附近", pip: "近端指間關節附近", dip: "遠端指間關節附近", ip: "指間關節附近", tip: "指尖" },
  "zh-CN": { wrist: "靠近手腕中央", cmc: "腕掌关节附近", mcp: "掌指关节附近", pip: "近端指间关节附近", dip: "远端指间关节附近", ip: "指间关节附近", tip: "指尖" },
  en: { wrist: "near the wrist", cmc: "near the carpometacarpal joint", mcp: "near the metacarpophalangeal joint", pip: "near the proximal interphalangeal joint", dip: "near the distal interphalangeal joint", ip: "near the interphalangeal joint", tip: "tip of the" },
  ja: { wrist: "手首中央付近", cmc: "手根中手関節付近", mcp: "中手指節関節付近", pip: "近位指節間関節付近", dip: "遠位指節間関節付近", ip: "指節間関節付近", tip: "指先" },
  ko: { wrist: "손목 중앙 부근", cmc: "손목손허리관절 부근", mcp: "손허리손가락관절 부근", pip: "몸쪽손가락뼈사이관절 부근", dip: "먼쪽손가락뼈사이관절 부근", ip: "손가락뼈사이관절 부근", tip: "손끝" },
  es: { wrist: "cerca de la muñeca", cmc: "cerca de la articulación carpometacarpiana", mcp: "cerca de la metacarpofalángica", pip: "cerca de la interfalángica proximal", dip: "cerca de la interfalángica distal", ip: "cerca de la interfalángica", tip: "punta del" },
  "pt-BR": { wrist: "perto do punho", cmc: "perto da articulação carpometacarpal", mcp: "perto da metacarpofalângica", pip: "perto da interfalângica proximal", dip: "perto da interfalângica distal", ip: "perto da interfalângica", tip: "ponta do" },
  fr: { wrist: "près du poignet", cmc: "près de l’articulation carpo-métacarpienne", mcp: "près de la métacarpo-phalangienne", pip: "près de l’interphalangienne proximale", dip: "près de l’interphalangienne distale", ip: "près de l’interphalangienne", tip: "bout du" },
};

function location(locale: Locale, landmark: (typeof HAND_LANDMARKS)[number]): string {
  if (locale === "en") {
    if (landmark.segment === "wrist") return "Model estimate near the wrist.";
    if (landmark.segment === "tip") return `Model estimate at the tip of the ${fingers.en[landmark.finger]}.`;
    return `Model estimate ${segments.en[landmark.segment]} of the ${fingers.en[landmark.finger]}.`;
  }
  return `${fingers[locale][landmark.finger]}：${segments[locale][landmark.segment]}。`;
}

export default function LandmarkAtlas() {
  const locale = useLanguageStore((state) => state.currentLanguage);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = HAND_LANDMARKS[selectedIndex];
  const copy = ui[locale];

  return (
    <section className="space-y-6 rounded-2xl border border-border/70 bg-card p-5 md:p-8" aria-labelledby="landmark-atlas-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h2 id="landmark-atlas-title" className="text-2xl font-semibold">{copy.title}</h2><p className="mt-2 text-muted-foreground">{copy.instruction}</p></div>
        <button type="button" className="rounded-md border px-3 py-2 text-sm font-medium hover:border-primary" onClick={() => setSelectedIndex(0)}>{copy.reset}</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(17rem,.9fr)]">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-xl rounded-2xl bg-gradient-to-b from-primary/5 to-accent/10" role="img" aria-label={copy.diagram}>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
            {HAND_CONNECTIONS.map(([from, to]) => <line key={`${from}-${to}`} x1={HAND_LANDMARKS[from].x} y1={HAND_LANDMARKS[from].y} x2={HAND_LANDMARKS[to].x} y2={HAND_LANDMARKS[to].y} className="stroke-primary/35" strokeWidth="1.1" />)}
          </svg>
          {HAND_LANDMARKS.map((landmark) => (
            <button key={landmark.index} type="button" data-testid="atlas-point" aria-label={`Diagram point ${landmark.index}: ${landmark.name}`} aria-pressed={selectedIndex === landmark.index} onClick={() => setSelectedIndex(landmark.index)} className={`absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border text-xs font-bold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${selectedIndex === landmark.index ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary"}`} style={{ left: `${landmark.x}%`, top: `${landmark.y}%` }}>{landmark.index}</button>
          ))}
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5" aria-live="polite">
            <p className="font-mono text-sm text-primary">{selected.index} · {selected.name}</p>
            <p className="mt-2 font-semibold">{copy.estimate}</p>
            <p className="mt-1 leading-7">{location(locale, selected)}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.limit}</p>
          </div>
          <div className="grid max-h-[28rem] gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {HAND_LANDMARKS.map((landmark) => (
              <button key={landmark.index} type="button" data-testid="atlas-list-item" aria-label={`${landmark.index} · ${landmark.name}`} aria-pressed={selectedIndex === landmark.index} onClick={() => setSelectedIndex(landmark.index)} className={`rounded-lg border px-3 py-2 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${selectedIndex === landmark.index ? "border-primary bg-primary/10" : "border-border hover:border-primary/70"}`}>
                <span className="font-mono font-semibold">{landmark.index} · {landmark.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
