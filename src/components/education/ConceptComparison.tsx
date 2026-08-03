import type { Locale } from "@/i18n/locales";
import { useLanguageStore } from "@/store/language-store";

interface ComparisonCopy {
  caption: string;
  headers: [string, string, string, string];
  rows: Array<[string, string, string, string]>;
}

const copy: Record<Locale, ComparisonCopy> = {
  "zh-TW": { caption: "掌褶、關節、模型點與文化名稱比較", headers: ["概念", "照片中", "本模型輸出", "應如何理解"], rows: [["皮膚掌褶", "可能看得到", "不會回傳", "自然皮膚折痕，不等於預測"], ["解剖關節", "表面位置可估計", "以附近座標表示", "身體結構；照片不是診斷"], ["模型 Landmark", "畫面疊加點", "本模型會回傳", "座標估計，不是掌褶"], ["傳統手相線名", "可能標在掌褶上", "不會回傳", "文化標籤，不是科學測量"]] },
  "zh-CN": { caption: "掌褶、关节、模型点和文化名称比较", headers: ["概念", "照片中", "本模型输出", "怎样理解"], rows: [["皮肤掌褶", "可能看见", "不会返回", "自然皮肤折痕，不等于预测"], ["解剖关节", "可估计表面位置", "用附近坐标表示", "身体结构；照片不是诊断"], ["模型 Landmark", "画面叠加点", "本模型会返回", "坐标估计，不是掌褶"], ["传统手相线名", "可能标在掌褶上", "不会返回", "文化标签，不是科学测量"]] },
  en: { caption: "Creases, joints, landmarks, and cultural labels", headers: ["Concept", "In a photo", "This model", "Responsible meaning"], rows: [["Skin crease", "May be visible", "Not returned", "Natural skin fold, not a prediction"], ["Anatomical joint", "Surface location can be estimated", "Nearby coordinate", "Body structure; a photo is not diagnosis"], ["Model landmark", "Overlay point", "Returned by this model", "Coordinate estimate, not a crease"], ["Palmistry line name", "May label a crease", "Not returned", "Cultural label, not scientific measurement"]] },
  ja: { caption: "しわ・関節・モデル点・文化名の比較", headers: ["概念", "写真", "モデル出力", "適切な理解"], rows: [["皮膚のしわ", "見える場合がある", "返さない", "自然な折れ目、予測ではない"], ["解剖学的関節", "表面位置を推定", "付近の座標", "身体構造；写真は診断ではない"], ["モデル点", "重ね合わせる点", "返す", "座標推定、掌線ではない"], ["手相線名", "しわに付ける場合", "返さない", "文化ラベル、科学測定ではない"]] },
  ko: { caption: "주름·관절·모델 점·문화 명칭 비교", headers: ["개념", "사진", "모델 출력", "책임 있는 의미"], rows: [["피부 주름", "보일 수 있음", "반환하지 않음", "자연스러운 접힘, 예측 아님"], ["해부 관절", "표면 위치 추정", "인접 좌표", "신체 구조; 사진은 진단 아님"], ["모델 랜드마크", "오버레이 점", "반환함", "좌표 추정, 손금 주름 아님"], ["손금 선 이름", "주름에 붙일 수 있음", "반환하지 않음", "문화 표지, 과학 측정 아님"]] },
  es: { caption: "Comparación de pliegues, articulaciones, puntos y etiquetas", headers: ["Concepto", "En foto", "Modelo", "Significado responsable"], rows: [["Pliegue cutáneo", "Puede verse", "No se devuelve", "Doblez natural, no predicción"], ["Articulación", "Se estima la superficie", "Coordenada cercana", "Estructura; una foto no diagnostica"], ["Punto del modelo", "Punto superpuesto", "Devuelto", "Coordenada, no pliegue"], ["Nombre quiromántico", "Puede etiquetar un pliegue", "No se devuelve", "Etiqueta cultural, no medición"]] },
  "pt-BR": { caption: "Comparação entre pregas, articulações, pontos e rótulos", headers: ["Conceito", "Na foto", "Modelo", "Significado responsável"], rows: [["Prega da pele", "Pode aparecer", "Não retorna", "Dobra natural, não previsão"], ["Articulação", "Superfície estimada", "Coordenada próxima", "Estrutura; foto não diagnostica"], ["Ponto do modelo", "Ponto sobreposto", "Retornado", "Coordenada, não prega"], ["Nome da quiromancia", "Pode rotular prega", "Não retorna", "Rótulo cultural, não medição"]] },
  fr: { caption: "Comparaison plis, articulations, repères et étiquettes", headers: ["Notion", "Photo", "Modèle", "Sens responsable"], rows: [["Pli cutané", "Peut être visible", "Non renvoyé", "Repli naturel, pas prédiction"], ["Articulation", "Surface estimable", "Coordonnée proche", "Structure ; photo non diagnostique"], ["Repère du modèle", "Point superposé", "Renvoyé", "Coordonnée, pas un pli"], ["Nom chiromantique", "Peut étiqueter un pli", "Non renvoyé", "Étiquette culturelle, pas mesure"]] },
};

export default function ConceptComparison() {
  const locale = useLanguageStore((state) => state.currentLanguage);
  const table = copy[locale];
  return (
    <div className="overflow-x-auto rounded-2xl border border-border/70">
      <table className="w-full min-w-[44rem] border-collapse text-left text-sm" aria-label={table.caption}>
        <caption className="bg-primary/5 px-5 py-4 text-left text-lg font-semibold">{table.caption}</caption>
        <thead><tr>{table.headers.map((header) => <th key={header} scope="col" className="border-t border-border bg-muted/40 px-4 py-3">{header}</th>)}</tr></thead>
        <tbody>{table.rows.map((row) => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th key={cell} scope="row" className="border-t border-border px-4 py-3 font-semibold">{cell}</th> : <td key={cell} className="border-t border-border px-4 py-3 text-muted-foreground">{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
