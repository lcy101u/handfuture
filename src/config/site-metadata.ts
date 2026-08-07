import type { Locale, PublicPath } from "./public-routes";
import { BREADCRUMB_COPY } from "../i18n/breadcrumbs";
import { buildLocalizedPath } from "../i18n/locales";

export const SITE_ORIGIN = "https://www.handfortune.com";
export const SITE_NAME = "HandFuture";
export const SOCIAL_IMAGE_URL = "https://www.handfortune.com/og-image.jpg";
export const PUBLISHER_ID = "ca-pub-3713047615080346";
export const ADS_TXT_RECORD = "google.com, pub-3713047615080346, DIRECT, f08c47fec0942fa0";
export const LAST_UPDATED = "2026-08-03";

export const OPEN_GRAPH_LOCALES = {
  "zh-TW": "zh_TW",
  "zh-CN": "zh_CN",
  en: "en_US",
  ja: "ja_JP",
  ko: "ko_KR",
  es: "es_ES",
  "pt-BR": "pt_BR",
  fr: "fr_FR",
} satisfies Record<Locale, string>;

export interface RouteMetadata {
  title: string;
  description: string;
  canonical: string;
  ogUrl: string;
  ogImage: string;
  ogImageAlt: string;
}

type LocalizedMetadata = Record<Locale, Pick<RouteMetadata, "title" | "description" | "ogImageAlt">>;

const metadata = {
  "/": {
    "zh-TW": { title: "HandFuture｜手部文化、21 點圖譜與證據思考", description: "跟著 Young LIN 製作的互動圖譜與有來源指南，分辨手部關節、掌褶、手相傳統與科學證據；照片示範只在瀏覽器內處理。", ogImageAlt: "HandFuture 手部文化、互動圖譜與證據學習" },
    "zh-CN": { title: "HandFuture｜手部文化、21 点图谱与证据思考", description: "通过 Young LIN 制作的互动图谱和有来源指南，区分手部关节、掌褶、手相传统与科学证据；照片演示只在浏览器内处理。", ogImageAlt: "HandFuture 手部文化、互动图谱与证据学习" },
    en: { title: "HandFuture | Hand Culture, 21-Point Atlas, and Evidence", description: "Use Young LIN’s original interactive atlas and sourced guides to separate hand joints, creases, palmistry tradition, and scientific evidence, with an optional browser-only photo demonstration.", ogImageAlt: "HandFuture hand culture, interactive atlas, and evidence learning" },
    ja: { title: "HandFuture｜手の文化・21点図鑑・証拠の考え方", description: "Young LIN によるインタラクティブ図鑑と出典付きガイドで、関節、しわ、手相文化、科学的証拠を区別します。写真デモはブラウザー内だけで処理されます。", ogImageAlt: "HandFuture 手の文化、インタラクティブ図鑑、証拠学習" },
    ko: { title: "HandFuture | 손 문화, 21점 지도와 증거 판단", description: "Young LIN의 인터랙티브 지도와 출처가 있는 가이드로 손 관절, 주름, 손금 전통과 과학 증거를 구분하세요. 선택적 사진 시연은 브라우저에서만 처리됩니다.", ogImageAlt: "HandFuture 손 문화, 인터랙티브 지도와 증거 학습" },
    es: { title: "HandFuture | Cultura de la mano, atlas y evidencia", description: "Usa el atlas interactivo original y las guías con fuentes de Young LIN para separar articulaciones, pliegues, tradición quiromántica y evidencia científica, con una demostración local opcional.", ogImageAlt: "Aprendizaje HandFuture sobre manos, atlas interactivo y evidencia" },
    "pt-BR": { title: "HandFuture | Cultura da mão, atlas e evidências", description: "Use o atlas interativo original e os guias com fontes de Young LIN para separar articulações, pregas, tradição da quiromancia e evidência científica, com demonstração local opcional.", ogImageAlt: "Aprendizado HandFuture sobre mãos, atlas interativo e evidências" },
    fr: { title: "HandFuture | Culture de la main, atlas et preuves", description: "Utilisez l’atlas interactif original et les guides sourcés de Young LIN pour séparer articulations, plis, tradition chiromantique et preuves scientifiques, avec une démonstration locale facultative.", ogImageAlt: "Apprentissage HandFuture sur la main, l’atlas interactif et les preuves" },
  },
  "/guides": {
    "zh-TW": { title: "手部文化與科學學習中心｜HandFuture", description: "從 21 點手部關節圖譜、掌褶與關節差異，到巴納姆效應與證據檢查，依主題探索 HandFuture 的原創互動指南。", ogImageAlt: "HandFuture 手部文化與科學學習中心" },
    "zh-CN": { title: "手部文化与科学学习中心｜HandFuture", description: "从 21 点手部关节图谱、掌褶与关节差异，到巴纳姆效应和证据检查，按主题探索 HandFuture 的原创互动指南。", ogImageAlt: "HandFuture 手部文化与科学学习中心" },
    en: { title: "Hand Culture and Science Learning Hub | HandFuture", description: "Explore original HandFuture learning paths covering the 21 hand landmarks, creases versus joints, the Barnum effect, palmistry history, and practical evidence checks.", ogImageAlt: "HandFuture hand culture and science learning hub" },
    ja: { title: "手の文化と科学 学習センター｜HandFuture", description: "21個の手のランドマーク、しわと関節の違い、バーナム効果、手相の歴史、証拠の確かめ方をテーマ別の独自ガイドで学べます。", ogImageAlt: "HandFuture 手の文化と科学の学習センター" },
    ko: { title: "손 문화와 과학 학습 센터 | HandFuture", description: "21개 손 랜드마크, 손바닥 주름과 관절의 차이, 바넘 효과, 손금의 역사와 증거 확인법을 HandFuture의 독창적인 학습 경로로 살펴보세요.", ogImageAlt: "HandFuture 손 문화와 과학 학습 센터" },
    es: { title: "Centro de aprendizaje sobre manos y cultura | HandFuture", description: "Explora rutas originales sobre los 21 puntos de la mano, pliegues y articulaciones, efecto Barnum, historia de la quiromancia y evaluación de pruebas.", ogImageAlt: "Centro de aprendizaje sobre manos, cultura y ciencia de HandFuture" },
    "pt-BR": { title: "Central de aprendizado sobre mãos e cultura | HandFuture", description: "Explore trilhas originais sobre os 21 pontos da mão, pregas e articulações, efeito Barnum, história da quiromancia e avaliação de evidências.", ogImageAlt: "Central de aprendizado sobre mãos, cultura e ciência do HandFuture" },
    fr: { title: "Centre d’apprentissage sur la main et la culture | HandFuture", description: "Explorez des parcours originaux sur les 21 repères de la main, plis et articulations, effet Barnum, histoire de la chiromancie et évaluation des preuves.", ogImageAlt: "Centre HandFuture d’apprentissage sur la main, la culture et la science" },
  },
  "/how-it-works": {
    "zh-TW": { title: "運作方式｜HandFuture", description: "了解 HandFuture 如何在瀏覽器內尋找 21 個手部關節座標、如何選出娛樂性反思卡，以及這項工具不能辨識掌紋或預測人生的原因。", ogImageAlt: "HandFuture 的瀏覽器內手部偵測流程" },
    "zh-CN": { title: "运作方式｜HandFuture", description: "了解 HandFuture 如何在浏览器内寻找 21 个手部关节坐标、如何选出娱乐性反思卡，以及这项工具为何不能识别掌纹或预测人生。", ogImageAlt: "HandFuture 的浏览器内手部检测流程" },
    en: { title: "How HandFuture Works", description: "Learn how HandFuture finds 21 hand landmarks in your browser, selects an entertainment reflection card, and why the tool cannot read palm creases or predict life outcomes.", ogImageAlt: "HandFuture in-browser hand detection flow" },
    ja: { title: "HandFutureの仕組み", description: "HandFuture がブラウザー内で21個の手の関節を検出し、娯楽用カードを選ぶ方法と、手相線を読んだり人生を予測したりできない理由を説明します。", ogImageAlt: "HandFuture のブラウザー内手検出の流れ" },
    ko: { title: "HandFuture 작동 방식", description: "HandFuture가 브라우저에서 손의 21개 관절을 찾고 오락용 성찰 카드를 선택하는 방식과 손금을 읽거나 인생을 예측할 수 없는 이유를 알아보세요.", ogImageAlt: "HandFuture 브라우저 내 손 감지 과정" },
    es: { title: "Cómo funciona HandFuture", description: "Descubre cómo HandFuture localiza 21 articulaciones en el navegador, selecciona una tarjeta de entretenimiento y por qué no puede leer líneas de la palma ni predecir la vida.", ogImageAlt: "Proceso de detección de manos de HandFuture en el navegador" },
    "pt-BR": { title: "Como o HandFuture funciona", description: "Saiba como o HandFuture encontra 21 articulações no navegador, escolhe um cartão de entretenimento e por que não consegue ler linhas da palma nem prever a vida.", ogImageAlt: "Fluxo de detecção de mãos do HandFuture no navegador" },
    fr: { title: "Comment fonctionne HandFuture", description: "Découvrez comment HandFuture repère 21 articulations dans le navigateur, choisit une carte de divertissement et pourquoi il ne peut ni lire les plis de la paume ni prédire la vie.", ogImageAlt: "Parcours de détection des mains HandFuture dans le navigateur" },
  },
  "/guides/palmistry-basics": {
    "zh-TW": { title: "手相文化入門：傳統名稱與歷史脈絡｜HandFuture", description: "以文化史角度認識手相、生命線、智慧線與感情線等傳統名稱，並清楚區分歷史信仰、娛樂用途與現代科學證據。", ogImageAlt: "手相文化入門指南" },
    "zh-CN": { title: "手相文化入门：传统名称与历史脉络｜HandFuture", description: "从文化史角度认识手相、生命线、智慧线与感情线等传统名称，并明确区分历史信念、娱乐用途与现代科学证据。", ogImageAlt: "手相文化入门指南" },
    en: { title: "Palmistry Basics: Traditional Names and Context | HandFuture", description: "A cultural introduction to palmistry and traditional names such as the life, head, and heart lines, clearly separated from modern scientific evidence and safe entertainment use.", ogImageAlt: "Palmistry basics cultural guide" },
    ja: { title: "手相入門：伝統的な名称と歴史的背景｜HandFuture", description: "生命線、知能線、感情線などの伝統的名称を文化史の視点で学び、歴史的信念、娯楽としての利用、現代の科学的証拠を明確に区別します。", ogImageAlt: "手相文化の入門ガイド" },
    ko: { title: "손금 입문: 전통 명칭과 역사적 맥락 | HandFuture", description: "생명선, 두뇌선, 감정선 같은 전통 명칭을 문화사 관점에서 살펴보고 역사적 믿음, 오락 용도, 현대 과학 증거를 분명히 구분합니다.", ogImageAlt: "손금 문화 입문 가이드" },
    es: { title: "Fundamentos de la quiromancia: nombres y contexto | HandFuture", description: "Introducción cultural a la quiromancia y a nombres tradicionales como las líneas de la vida, cabeza y corazón, claramente separados de la evidencia científica y el entretenimiento seguro.", ogImageAlt: "Guía cultural de fundamentos de la quiromancia" },
    "pt-BR": { title: "Fundamentos da quiromancia: nomes e contexto | HandFuture", description: "Introdução cultural à quiromancia e a nomes tradicionais como as linhas da vida, cabeça e coração, claramente separados das evidências científicas e do entretenimento seguro.", ogImageAlt: "Guia cultural de fundamentos da quiromancia" },
    fr: { title: "Notions de chiromancie : noms et contexte | HandFuture", description: "Introduction culturelle à la chiromancie et aux noms traditionnels comme les lignes de vie, de tête et de cœur, clairement séparés des preuves scientifiques et du divertissement sûr.", ogImageAlt: "Guide culturel des notions de chiromancie" },
  },
  "/guides/science-and-limitations": {
    "zh-TW": { title: "手相、科學與限制：如何安全看待解讀｜HandFuture", description: "說明手部關節偵測與掌紋解讀的差異、巴納姆效應如何影響感受，以及為何手相內容不應取代醫療、財務或人生決策。", ogImageAlt: "手相科學限制與安全使用指南" },
    "zh-CN": { title: "手相、科学与局限：如何安全看待解读｜HandFuture", description: "说明手部关节检测与掌纹解读的区别、巴纳姆效应如何影响感受，以及手相内容为何不应取代医疗、财务或人生决定。", ogImageAlt: "手相科学局限与安全使用指南" },
    en: { title: "Palmistry, Science, and Limitations | HandFuture", description: "Understand the difference between hand-landmark detection and palm reading, how the Barnum effect shapes impressions, and why palmistry should not guide medical, financial, or life decisions.", ogImageAlt: "Palmistry science and limitations guide" },
    ja: { title: "手相、科学、そして限界｜HandFuture", description: "手の関節検出と手相解釈の違い、バーナム効果が印象に与える影響、手相を医療・金融・人生の判断に使ってはいけない理由を解説します。", ogImageAlt: "手相の科学的限界と安全な利用ガイド" },
    ko: { title: "손금, 과학과 한계 | HandFuture", description: "손 관절 감지와 손금 해석의 차이, 바넘 효과가 인상에 미치는 영향, 손금이 의료·재정·인생 결정을 이끌어서는 안 되는 이유를 설명합니다.", ogImageAlt: "손금의 과학적 한계와 안전한 사용 가이드" },
    es: { title: "Quiromancia, ciencia y limitaciones | HandFuture", description: "Comprende la diferencia entre detectar articulaciones y leer la palma, cómo influye el efecto Barnum y por qué la quiromancia no debe guiar decisiones médicas, financieras o vitales.", ogImageAlt: "Guía sobre ciencia, límites y uso seguro de la quiromancia" },
    "pt-BR": { title: "Quiromancia, ciência e limitações | HandFuture", description: "Entenda a diferença entre detectar articulações e ler a palma, como o efeito Barnum influencia impressões e por que a quiromancia não deve orientar decisões médicas, financeiras ou de vida.", ogImageAlt: "Guia de ciência, limites e uso seguro da quiromancia" },
    fr: { title: "Chiromancie, science et limites | HandFuture", description: "Comprenez la différence entre détection des articulations et lecture de la paume, l’effet Barnum et pourquoi la chiromancie ne doit guider aucune décision médicale, financière ou de vie.", ogImageAlt: "Guide sur la science, les limites et l’usage sûr de la chiromancie" },
  },
  "/guides/hand-photo-guide": {
    "zh-TW": { title: "手部照片指南：光線、角度與隱私｜HandFuture", description: "用均勻光線、單手、素色背景與完整入鏡提高瀏覽器手部偵測的成功率，並了解照片只在目前瀏覽器工作階段處理。", ogImageAlt: "手部照片拍攝與隱私指南" },
    "zh-CN": { title: "手部照片指南：光线、角度与隐私｜HandFuture", description: "使用均匀光线、一只手、简单背景与完整取景提高浏览器手部检测的成功率，并了解照片只在当前浏览器会话中处理。", ogImageAlt: "手部照片拍摄与隐私指南" },
    en: { title: "Hand Photo Guide: Lighting, Framing, and Privacy | HandFuture", description: "Improve browser hand detection with even lighting, one fully visible hand, and a plain background, while understanding how the photo is processed during the current browser session.", ogImageAlt: "Hand photo and privacy guide" },
    ja: { title: "手の写真ガイド：照明、構図、プライバシー｜HandFuture", description: "均一な照明、全体が見える片手、無地の背景でブラウザー検出を改善し、写真が現在のブラウザーセッション内だけで処理される仕組みを理解します。", ogImageAlt: "手の写真撮影とプライバシーのガイド" },
    ko: { title: "손 사진 가이드: 조명, 구도와 개인정보 | HandFuture", description: "고른 조명, 온전히 보이는 한 손, 단순한 배경으로 브라우저 감지를 개선하고 사진이 현재 브라우저 세션에서만 처리되는 방식을 알아봅니다.", ogImageAlt: "손 사진 촬영과 개인정보 가이드" },
    es: { title: "Guía de foto de mano: luz, encuadre y privacidad | HandFuture", description: "Mejora la detección con luz uniforme, una mano completa y un fondo liso, y comprende cómo se procesa la foto únicamente durante la sesión actual del navegador.", ogImageAlt: "Guía de fotografía de manos y privacidad" },
    "pt-BR": { title: "Guia de foto da mão: luz, enquadramento e privacidade | HandFuture", description: "Melhore a detecção com luz uniforme, uma mão completa e fundo liso e entenda como a foto é processada somente durante a sessão atual do navegador.", ogImageAlt: "Guia de fotografia de mãos e privacidade" },
    fr: { title: "Guide de photo de main : lumière, cadrage et confidentialité | HandFuture", description: "Améliorez la détection avec une lumière uniforme, une main entière et un fond uni, et comprenez comment la photo est traitée uniquement pendant la session actuelle du navigateur.", ogImageAlt: "Guide de photographie des mains et de confidentialité" },
  },
  "/guides/hand-landmark-atlas": {
    "zh-TW": { title: "21 點手部關節互動圖譜｜HandFuture", description: "逐點認識 MediaPipe 從手腕到五指指尖的 21 個座標、各點所在位置與可觀察範圍，並了解它們為何不是掌紋或診斷資料。", ogImageAlt: "21 點手部關節互動圖譜" },
    "zh-CN": { title: "21 点手部关节互动图谱｜HandFuture", description: "逐点认识 MediaPipe 从手腕到五指指尖的 21 个坐标、各点所在位置与可观察范围，并了解它们为何不是掌纹或诊断数据。", ogImageAlt: "21 点手部关节互动图谱" },
    en: { title: "Interactive Atlas of the 21 Hand Landmarks | HandFuture", description: "Explore every MediaPipe coordinate from wrist to fingertips, learn where each landmark sits and what it can describe, and why these points are not palm creases or diagnostic data.", ogImageAlt: "Interactive atlas of 21 hand landmarks" },
    ja: { title: "21個の手のランドマーク インタラクティブ図鑑｜HandFuture", description: "手首から指先までの MediaPipe の21座標を一つずつ確認し、位置と観察できる範囲、掌線や診断情報ではない理由を学びます。", ogImageAlt: "21個の手のランドマーク図鑑" },
    ko: { title: "21개 손 랜드마크 인터랙티브 지도 | HandFuture", description: "손목부터 손가락 끝까지 MediaPipe의 21개 좌표를 살펴보고 각 위치와 관찰 범위, 손금이나 진단 정보가 아닌 이유를 알아보세요.", ogImageAlt: "21개 손 랜드마크 인터랙티브 지도" },
    es: { title: "Atlas interactivo de los 21 puntos de la mano | HandFuture", description: "Recorre las 21 coordenadas de MediaPipe desde la muñeca hasta las yemas, su ubicación y alcance, y entiende por qué no son líneas de la palma ni datos diagnósticos.", ogImageAlt: "Atlas interactivo de 21 puntos de la mano" },
    "pt-BR": { title: "Atlas interativo dos 21 pontos da mão | HandFuture", description: "Explore as 21 coordenadas do MediaPipe do punho às pontas dos dedos, sua posição e alcance, e entenda por que não são linhas da palma nem dados de diagnóstico.", ogImageAlt: "Atlas interativo de 21 pontos da mão" },
    fr: { title: "Atlas interactif des 21 repères de la main | HandFuture", description: "Parcourez les 21 coordonnées MediaPipe du poignet au bout des doigts, leur position et leurs limites, et comprenez pourquoi elles ne sont ni plis palmaires ni données diagnostiques.", ogImageAlt: "Atlas interactif des 21 repères de la main" },
  },
  "/guides/creases-vs-landmarks": {
    "zh-TW": { title: "掌褶、關節與偵測點有何不同？｜HandFuture", description: "用圖解與比較表分清皮膚掌褶、解剖關節、MediaPipe 座標與傳統手相名稱，避免把電腦視覺結果誤認成掌紋分析。", ogImageAlt: "掌褶、關節與偵測點比較圖" },
    "zh-CN": { title: "掌褶、关节与检测点有何不同？｜HandFuture", description: "通过图解和比较表分清皮肤掌褶、解剖关节、MediaPipe 坐标与传统手相名称，避免把计算机视觉结果误认为掌纹分析。", ogImageAlt: "掌褶、关节与检测点比较图" },
    en: { title: "Palm Creases, Joints, and Landmarks Compared | HandFuture", description: "Use an original diagram and comparison to separate skin creases, anatomical joints, MediaPipe coordinates, and traditional palmistry labels without mistaking computer vision for palm reading.", ogImageAlt: "Comparison of palm creases, joints, and detector landmarks" },
    ja: { title: "手のひらのしわ・関節・検出点の違い｜HandFuture", description: "皮膚のしわ、解剖学的な関節、MediaPipe 座標、伝統的な手相名を図と比較で分け、画像認識を掌線鑑定と誤解しないためのガイドです。", ogImageAlt: "手のひらのしわ、関節、検出点の比較" },
    ko: { title: "손바닥 주름·관절·감지점의 차이 | HandFuture", description: "피부 주름, 해부학적 관절, MediaPipe 좌표와 전통 손금 명칭을 그림과 표로 구분해 컴퓨터 비전 결과를 손금 해석으로 오해하지 않도록 돕습니다.", ogImageAlt: "손바닥 주름, 관절과 감지점 비교" },
    es: { title: "Pliegues, articulaciones y puntos de la mano | HandFuture", description: "Distingue con un diagrama los pliegues de la piel, articulaciones, coordenadas MediaPipe y nombres quirománticos sin confundir visión artificial con lectura de manos.", ogImageAlt: "Comparación de pliegues, articulaciones y puntos detectados" },
    "pt-BR": { title: "Pregas, articulações e pontos da mão | HandFuture", description: "Diferencie com um diagrama pregas da pele, articulações, coordenadas do MediaPipe e nomes da quiromancia sem confundir visão computacional com leitura de mãos.", ogImageAlt: "Comparação de pregas, articulações e pontos detectados" },
    fr: { title: "Plis, articulations et repères de la main | HandFuture", description: "Distinguez par un schéma les plis cutanés, articulations, coordonnées MediaPipe et noms chiromantiques sans confondre vision artificielle et lecture de la paume.", ogImageAlt: "Comparaison des plis, articulations et repères détectés" },
  },
  "/guides/barnum-effect-lab": {
    "zh-TW": { title: "巴納姆效應互動實驗室｜HandFuture", description: "比較兩段看似貼身的廣泛敘述，親自觀察模糊語句如何產生準確感，再用可重複的問題檢查占卜、人格描述與日常判斷。", ogImageAlt: "巴納姆效應互動實驗室" },
    "zh-CN": { title: "巴纳姆效应互动实验室｜HandFuture", description: "比较两段看似贴身的广泛描述，亲自观察模糊语句如何产生准确感，再用可重复的问题检查占卜、人格描述和日常判断。", ogImageAlt: "巴纳姆效应互动实验室" },
    en: { title: "Interactive Barnum Effect Lab | HandFuture", description: "Compare two broadly applicable statements that may feel personal, observe how vague wording creates an impression of accuracy, and learn repeatable questions for checking such claims.", ogImageAlt: "Interactive Barnum effect learning lab" },
    ja: { title: "バーナム効果 インタラクティブ実験室｜HandFuture", description: "自分向けに感じやすい二つの幅広い文章を比べ、曖昧な表現が正確さの印象を生む仕組みと、占いや性格記述を確かめる質問を学びます。", ogImageAlt: "バーナム効果のインタラクティブ実験室" },
    ko: { title: "바넘 효과 인터랙티브 실험실 | HandFuture", description: "개인적으로 느껴질 수 있는 두 가지 넓은 문장을 비교하고 모호한 표현이 정확하다는 인상을 만드는 방식과 주장을 확인할 질문을 배워 보세요.", ogImageAlt: "바넘 효과 인터랙티브 학습 실험실" },
    es: { title: "Laboratorio interactivo del efecto Barnum | HandFuture", description: "Compara dos frases amplias que pueden parecer personales, observa cómo lo vago produce sensación de acierto y aprende preguntas repetibles para evaluar afirmaciones similares.", ogImageAlt: "Laboratorio interactivo del efecto Barnum" },
    "pt-BR": { title: "Laboratório interativo do efeito Barnum | HandFuture", description: "Compare duas frases amplas que podem parecer pessoais, observe como a linguagem vaga gera sensação de acerto e aprenda perguntas repetíveis para avaliar afirmações.", ogImageAlt: "Laboratório interativo do efeito Barnum" },
    fr: { title: "Laboratoire interactif de l’effet Barnum | HandFuture", description: "Comparez deux phrases générales qui semblent personnelles, observez comment le flou produit une impression de justesse et apprenez des questions reproductibles pour évaluer ces affirmations.", ogImageAlt: "Laboratoire interactif de l’effet Barnum" },
  },
  "/guides/evaluating-palmistry-claims": {
    "zh-TW": { title: "如何檢查手相與占卜說法｜HandFuture", description: "用具體性、可否證性、基準率、替代解釋、來源品質與重複驗證七項檢查，分辨自我反思、模糊敘述與可檢驗的事實預測。", ogImageAlt: "檢查手相與占卜說法的證據清單" },
    "zh-CN": { title: "如何检查手相与占卜说法｜HandFuture", description: "通过具体性、可证伪性、基准率、替代解释、来源质量与重复验证七项检查，区分自我反思、模糊描述和可检验的事实预测。", ogImageAlt: "检查手相与占卜说法的证据清单" },
    en: { title: "How to Evaluate Palmistry and Divination Claims | HandFuture", description: "Use specificity, falsifiability, base rates, alternative explanations, source quality, and replication to separate a reflection prompt from a testable factual prediction.", ogImageAlt: "Evidence checklist for evaluating palmistry claims" },
    ja: { title: "手相や占いの主張を確かめる方法｜HandFuture", description: "具体性、反証可能性、基準率、別の説明、情報源の質、再現性を使い、内省のきっかけと検証可能な事実予測を区別します。", ogImageAlt: "手相の主張を確かめる証拠チェックリスト" },
    ko: { title: "손금과 점술 주장을 평가하는 방법 | HandFuture", description: "구체성, 반증 가능성, 기저율, 대안 설명, 출처의 질과 반복 검증을 통해 성찰 질문과 시험 가능한 사실 예측을 구분하세요.", ogImageAlt: "손금 주장을 평가하는 증거 점검표" },
    es: { title: "Cómo evaluar afirmaciones de quiromancia | HandFuture", description: "Usa especificidad, falsabilidad, tasas base, explicaciones alternativas, calidad de fuentes y replicación para separar reflexión de una predicción factual comprobable.", ogImageAlt: "Lista de pruebas para evaluar afirmaciones de quiromancia" },
    "pt-BR": { title: "Como avaliar afirmações de quiromancia | HandFuture", description: "Use especificidade, falseabilidade, taxas de base, explicações alternativas, qualidade das fontes e replicação para separar reflexão de previsão factual testável.", ogImageAlt: "Lista de evidências para avaliar afirmações de quiromancia" },
    fr: { title: "Comment évaluer les affirmations de chiromancie | HandFuture", description: "Utilisez précision, réfutabilité, taux de base, explications alternatives, qualité des sources et réplication pour séparer réflexion et prédiction factuelle testable.", ogImageAlt: "Liste de preuves pour évaluer les affirmations de chiromancie" },
  },
  "/about": {
    "zh-TW": { title: "關於 HandFuture", description: "HandFuture 是一個獨立網頁專案，透過手部偵測與有來源的文章，協助讀者以透明、非科學且僅供娛樂的方式探索手相文化。", ogImageAlt: "關於 HandFuture 獨立網頁專案" },
    "zh-CN": { title: "关于 HandFuture", description: "HandFuture 是一个独立网页项目，通过手部检测与有来源的文章，帮助读者以透明、非科学且仅供娱乐的方式探索手相文化。", ogImageAlt: "关于 HandFuture 独立网页项目" },
    en: { title: "About HandFuture", description: "HandFuture is an independent web project combining hand detection with sourced articles so readers can explore palmistry culture transparently as non-scientific entertainment.", ogImageAlt: "About the independent HandFuture web project" },
    ja: { title: "HandFutureについて", description: "HandFuture は、手の検出と出典付き記事を組み合わせ、手相文化を透明な非科学的娯楽として探るための独立ウェブプロジェクトです。", ogImageAlt: "独立ウェブプロジェクト HandFuture について" },
    ko: { title: "HandFuture 소개", description: "HandFuture는 손 감지와 출처를 밝힌 글을 결합해 손금 문화를 투명한 비과학적 오락으로 탐구하도록 돕는 독립 웹 프로젝트입니다.", ogImageAlt: "독립 웹 프로젝트 HandFuture 소개" },
    es: { title: "Acerca de HandFuture", description: "HandFuture es un proyecto web independiente que combina detección de manos y artículos con fuentes para explorar la quiromancia de forma transparente como entretenimiento no científico.", ogImageAlt: "Acerca del proyecto web independiente HandFuture" },
    "pt-BR": { title: "Sobre o HandFuture", description: "O HandFuture é um projeto web independente que combina detecção de mãos e artigos com fontes para explorar a quiromancia de forma transparente como entretenimento não científico.", ogImageAlt: "Sobre o projeto web independente HandFuture" },
    fr: { title: "À propos de HandFuture", description: "HandFuture est un projet web indépendant combinant détection des mains et articles sourcés pour explorer la chiromancie de façon transparente comme divertissement non scientifique.", ogImageAlt: "À propos du projet web indépendant HandFuture" },
  },
  "/privacy": {
    "zh-TW": { title: "隱私政策｜HandFuture", description: "查看 HandFuture 如何在瀏覽器內處理手部照片、使用本機儲存空間與 Vercel Analytics，以及 Google 廣告與同意選項如何運作。", ogImageAlt: "HandFuture 隱私政策" },
    "zh-CN": { title: "隐私政策｜HandFuture", description: "查看 HandFuture 如何在浏览器内处理手部照片、使用本地存储与 Vercel Analytics，以及 Google 广告和同意选项如何运作。", ogImageAlt: "HandFuture 隐私政策" },
    en: { title: "Privacy Policy | HandFuture", description: "See how HandFuture processes hand photos in the browser, uses local storage and Vercel Analytics, and how Google advertising and consent choices operate.", ogImageAlt: "HandFuture privacy policy" },
    ja: { title: "プライバシーポリシー｜HandFuture", description: "HandFuture が手の写真をブラウザー内で処理する方法、ローカルストレージと Vercel Analytics の利用、Google 広告と同意設定の仕組みを確認できます。", ogImageAlt: "HandFuture プライバシーポリシー" },
    ko: { title: "개인정보 처리방침 | HandFuture", description: "HandFuture가 손 사진을 브라우저에서 처리하는 방식, 로컬 저장소와 Vercel Analytics 사용, Google 광고와 동의 선택의 작동 방식을 확인하세요.", ogImageAlt: "HandFuture 개인정보 처리방침" },
    es: { title: "Política de privacidad | HandFuture", description: "Consulta cómo HandFuture procesa fotos en el navegador, usa almacenamiento local y Vercel Analytics, y cómo funcionan la publicidad de Google y las opciones de consentimiento.", ogImageAlt: "Política de privacidad de HandFuture" },
    "pt-BR": { title: "Política de Privacidade | HandFuture", description: "Veja como o HandFuture processa fotos no navegador, usa armazenamento local e Vercel Analytics e como funcionam a publicidade do Google e as escolhas de consentimento.", ogImageAlt: "Política de Privacidade do HandFuture" },
    fr: { title: "Politique de confidentialité | HandFuture", description: "Découvrez comment HandFuture traite les photos dans le navigateur, utilise le stockage local et Vercel Analytics, et comment fonctionnent la publicité Google et les choix de consentement.", ogImageAlt: "Politique de confidentialité de HandFuture" },
  },
  "/terms": {
    "zh-TW": { title: "使用條款｜HandFuture", description: "閱讀 HandFuture 的娛樂用途、年齡建議、禁止行為、智慧財產、服務可用性與責任限制，並了解本工具不提供專業建議。", ogImageAlt: "HandFuture 使用條款" },
    "zh-CN": { title: "使用条款｜HandFuture", description: "阅读 HandFuture 的娱乐用途、年龄建议、禁止行为、知识产权、服务可用性与责任限制，并了解本工具不提供专业建议。", ogImageAlt: "HandFuture 使用条款" },
    en: { title: "Terms of Use | HandFuture", description: "Read HandFuture's entertainment scope, age guidance, prohibited conduct, intellectual property, service availability, and limits, including that the tool provides no professional advice.", ogImageAlt: "HandFuture terms of use" },
    ja: { title: "利用規約｜HandFuture", description: "HandFuture の娯楽範囲、年齢案内、禁止行為、知的財産、サービスの可用性、責任の制限を読み、このツールが専門的助言を提供しないことを確認します。", ogImageAlt: "HandFuture 利用規約" },
    ko: { title: "이용 약관 | HandFuture", description: "HandFuture의 오락 범위, 연령 안내, 금지 행위, 지식재산권, 서비스 가용성과 책임 제한을 읽고 이 도구가 전문 조언을 제공하지 않음을 확인하세요.", ogImageAlt: "HandFuture 이용 약관" },
    es: { title: "Términos de uso | HandFuture", description: "Lee el ámbito de entretenimiento, la orientación de edad, las conductas prohibidas, la propiedad intelectual, la disponibilidad y los límites de HandFuture, incluida la ausencia de asesoramiento profesional.", ogImageAlt: "Términos de uso de HandFuture" },
    "pt-BR": { title: "Termos de Uso | HandFuture", description: "Leia o escopo de entretenimento, a orientação etária, as condutas proibidas, a propriedade intelectual, a disponibilidade e os limites do HandFuture, incluindo a ausência de orientação profissional.", ogImageAlt: "Termos de Uso do HandFuture" },
    fr: { title: "Conditions d’utilisation | HandFuture", description: "Lisez la portée de divertissement, l’indication d’âge, les conduites interdites, la propriété intellectuelle, la disponibilité et les limites de HandFuture, notamment l’absence de conseil professionnel.", ogImageAlt: "Conditions d’utilisation de HandFuture" },
  },
} satisfies Record<PublicPath, LocalizedMetadata>;

export function getRouteMetadata(path: PublicPath, locale: Locale): RouteMetadata {
  const localized = metadata[path][locale];
  const canonical = buildLocalizedPublicUrl(path, locale);
  return {
    ...localized,
    canonical,
    ogUrl: canonical,
    ogImage: SOCIAL_IMAGE_URL,
  };
}

export function buildLocalizedPublicUrl(path: PublicPath, locale: Locale): string {
  return `${SITE_ORIGIN}${buildLocalizedPath(locale, path)}`;
}

export function buildPublicGatewayUrl(): string {
  return `${SITE_ORIGIN}/`;
}

export function buildStructuredData(path: PublicPath, locale: Locale): Record<string, unknown> {
  const meta = getRouteMetadata(path, locale);
  const base = {
    "@context": "https://schema.org",
    name: meta.title,
    description: meta.description,
    url: meta.canonical,
    inLanguage: locale,
  };

  if (path === "/") {
    return {
      ...base,
      "@type": "WebApplication",
      applicationCategory: "EntertainmentApplication",
      operatingSystem: "Web Browser",
      offers: { "@type": "Offer", price: "0", priceCurrency: "TWD" },
    };
  }

  if (path === "/guides") {
    return {
      ...base,
      "@type": "CollectionPage",
      author: { "@type": "Person", name: "Young LIN" },
      publisher: { "@type": "Organization", name: SITE_NAME },
      breadcrumb: buildBreadcrumbData(path, locale),
    };
  }

  if (path.startsWith("/guides/")) {
    return {
      ...base,
      "@type": "Article",
      dateModified: LAST_UPDATED,
      author: { "@type": "Person", name: "Young LIN" },
      publisher: { "@type": "Organization", name: SITE_NAME },
      breadcrumb: buildBreadcrumbData(path as `/guides/${string}`, locale),
    };
  }

  return { ...base, "@type": "WebPage", publisher: { "@type": "Organization", name: SITE_NAME } };
}

const SITE_NAME_SUFFIX = /\s*[|｜]\s*HandFuture\s*$/;

function breadcrumbLeafName(path: PublicPath, locale: Locale): string {
  return getRouteMetadata(path, locale).title.replace(SITE_NAME_SUFFIX, "");
}

function buildBreadcrumbData(path: "/guides" | `/guides/${string}`, locale: Locale) {
  const copy = BREADCRUMB_COPY[locale];
  const trail: { path: PublicPath; name: string }[] = [
    { path: "/", name: copy.home },
    { path: "/guides", name: copy.learn },
  ];
  if (path !== "/guides") {
    trail.push({ path: path as PublicPath, name: breadcrumbLeafName(path as PublicPath, locale) });
  }

  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: buildLocalizedPublicUrl(entry.path, locale),
    })),
  };
}
