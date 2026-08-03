import type { GuidePath } from "@/config/public-routes";
import type { Locale } from "@/i18n/locales";
import type { EditorialPage, SourceLink } from "./guides";

type NewGuidePath = Extract<
  GuidePath,
  | "/guides/hand-landmark-atlas"
  | "/guides/creases-vs-landmarks"
  | "/guides/barnum-effect-lab"
  | "/guides/evaluating-palmistry-claims"
>;

interface LocalizedPageCopy {
  title: string;
  summary: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }>;
}

const landmarkSources: SourceLink[] = [
  {
    label: "Google AI for Developers: the 21 hand landmarks",
    url: "https://ai.google.dev/edge/api/mediapipe/python/mp/tasks/vision/drawing_styles/hand_landmarker/HandLandmark",
  },
  {
    label: "MediaPipe Hand Landmarker overview",
    url: "https://developers.google.com/mediapipe/solutions/vision/hand_landmarker",
  },
];

const creaseSources: SourceLink[] = [
  {
    label: "MedlinePlus Medical Encyclopedia: Single palmar crease",
    url: "https://medlineplus.gov/ency/article/003290.htm",
  },
  {
    label: "PubMed Central: Palmar creases and deeper structures",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4061464/",
  },
  ...landmarkSources,
];

const barnumSources: SourceLink[] = [
  {
    label: "APA Dictionary of Psychology: Barnum effect",
    url: "https://dictionary.apa.org/barnum-effect",
  },
  {
    label: "Forer (1949): The fallacy of personal validation",
    url: "https://doi.org/10.1037/h0059240",
  },
];

const evaluationSources: SourceLink[] = [
  ...barnumSources,
  {
    label: "Understanding Science, UC Berkeley: How science works",
    url: "https://undsci.berkeley.edu/understanding-science-101/how-science-works/",
  },
  {
    label: "Stanford Encyclopedia of Philosophy: Science and pseudo-science",
    url: "https://plato.stanford.edu/entries/pseudo-science/",
  },
];

function page(copy: LocalizedPageCopy, sources: SourceLink[]): EditorialPage {
  return { ...copy, updatedAt: "2026-08-03", sources };
}

const atlas: Record<Locale, LocalizedPageCopy> = {
  "zh-TW": {
    title: "21 點手部關節互動圖譜",
    summary: "從手腕到五指指尖逐點認識 MediaPipe 的座標地圖，了解電腦視覺能定位什麼、不能從這些點推論什麼。",
    sections: [
      {
        heading: "這 21 點從哪裡來",
        paragraphs: [
          "MediaPipe 將一隻手表示成 21 個標準化座標：0 是手腕，1–4 沿著拇指排列，5–8 是食指，9–12 是中指，13–16 是無名指，17–20 是小指。每一點包含相對於影像寬高的位置；它們是模型對關節位置的估計，不是皮膚上實際存在的標記。",
          "下方圖譜把索引、英文標準名稱與白話位置放在一起。可點選圖上的圓點或清單，也能用鍵盤移動。這比只看到一串座標更容易檢查程式究竟使用了什麼資料。",
          "索引順序不是對手指重要性的排名，而是模型介面的固定約定。理解這項約定，可以讓開發者、讀者與無障礙使用者指向同一個位置，也能在偵測看起來不正確時具體說明是哪一點偏離。",
        ],
      },
      {
        heading: "關節名稱怎麼讀",
        paragraphs: [
          "MCP 大致對應手指與手掌交界的掌指關節，PIP 與 DIP 是手指中段與末段的指間關節，TIP 是指尖。拇指結構不同，使用 CMC、MCP、IP 與 TIP。這些名稱描述解剖位置附近的模型點，但照片中的二維估計不能取代臨床檢查。",
          "把相鄰點連線，可以形成手部骨架的視覺提示。連線有助於看出模型是否把手指順序抓對，也可用於手勢或姿勢介面；它不會描出生命線、智慧線、感情線或其他掌褶。",
        ],
      },
      {
        heading: "能觀察與不能推論的界線",
        paragraphs: [
          "座標可描述同一張影像中的相對位置，例如指尖是否位於手腕上方、兩個關節相距多遠，或偵測到左手還是右手。拍攝角度、透視、鏡頭與遮擋都會改變數值，因此不同照片之間不能直接當成精密身體測量。",
          "21 點本身不含年齡、性格、健康、職業、財富或未來資料。任何從這些座標延伸出的反思文字，都是程式另外設計的娛樂內容，不是模型發現的個人事實。",
        ],
        bullets: ["可用：呈現位置、連線與偵測狀態。", "不可用：掌褶辨識、診斷、人格評估或命運預測。", "遇到疼痛或健康疑問，應由合格醫療人員評估。"],
      },
    ],
  },
  "zh-CN": {
    title: "21 点手部关节互动图谱",
    summary: "从手腕到五指指尖逐点认识 MediaPipe 的坐标地图，了解计算机视觉能够定位什么、不能从这些点推断什么。",
    sections: [
      { heading: "这 21 点从哪里来", paragraphs: ["MediaPipe 用 21 个标准化坐标表示一只手：0 是手腕，1–4 沿拇指排列，5–8 是食指，9–12 是中指，13–16 是无名指，17–20 是小指。每一点是模型对关节位置的估计，并不是皮肤上真实存在的标记。", "下方图谱把索引、英文标准名称和通俗位置放在一起。你可以点击圆点或列表，也能用键盘操作，从而检查程序实际使用的数据，而不只是看到一串数字。", "索引顺序不是重要性排名，而是模型接口的固定约定。理解约定有助于读者和开发者准确指向同一位置，并在检测偏离时说明具体是哪一点。"] },
      { heading: "怎样阅读关节名称", paragraphs: ["MCP 大致对应手指与手掌交界的掌指关节，PIP 和 DIP 是手指中段与末段的指间关节，TIP 是指尖。拇指使用 CMC、MCP、IP 和 TIP。二维照片的估计不能代替临床检查。", "连接相邻点可以形成手部骨架，帮助判断模型是否正确排列手指，也可用于手势界面；这些线不会描出生命线、智慧线、感情线或其他掌褶。"] },
      { heading: "观察与推断的边界", paragraphs: ["坐标可以描述同一张图片里的相对位置，例如指尖是否位于手腕上方。拍摄角度、透视和遮挡都会改变数值，因此不同照片不能直接作为精密身体测量。", "这 21 点不含年龄、性格、健康、职业、财富或未来数据。任何反思文字都是程序另外设计的娱乐内容，不是模型发现的个人事实。"], bullets: ["可以：显示位置、连线和检测状态。", "不可以：掌褶识别、诊断、人格评估或命运预测。", "疼痛或健康疑问应由合格医疗人员评估。"] },
    ],
  },
  en: {
    title: "Interactive atlas of the 21 hand landmarks",
    summary: "Inspect MediaPipe’s coordinate map from wrist to fingertips and learn what computer vision can locate—and what those points cannot tell you about a person.",
    sections: [
      { heading: "Where the 21 points come from", paragraphs: ["MediaPipe represents one hand with 21 standard landmark indices. Index 0 is the wrist; 1–4 follow the thumb; 5–8 the index finger; 9–12 the middle finger; 13–16 the ring finger; and 17–20 the little finger. Each result contains positions normalized to image dimensions. These are model estimates, not physical dots present on the skin.", "The atlas below pairs each index with its standard English name and a plain-language location. Select a point on the diagram or in the list, using a pointer or keyboard. The synchronized explanation makes the program’s input inspectable instead of reducing it to an unexplained set of numbers."] },
      { heading: "Reading the joint abbreviations", paragraphs: ["MCP refers to the metacarpophalangeal area where a finger meets the palm. PIP and DIP describe the middle and end interphalangeal joints; TIP is the fingertip. The thumb has a different arrangement labeled CMC, MCP, IP, and TIP. A two-dimensional estimate near these anatomical locations is not a clinical examination.", "Connecting neighboring landmarks creates a skeleton-like visual check. It can reveal whether the model ordered the fingers plausibly and can support gesture interfaces. The connections do not trace the life, head, heart, fate, or any other palm crease."] },
      { heading: "Observation is not personal inference", paragraphs: ["Coordinates can describe relative geometry within one image: whether a fingertip sits above the wrist, how far apart two estimated points are, or which handedness the model reports. Camera angle, perspective, lens characteristics, and occlusion all change the values, so separate photos are not automatically comparable body measurements.", "No landmark contains age, personality, health, occupation, wealth, relationship, or future-event information. Any reflection text selected after detection is a separately authored entertainment prompt. It is not a personal fact discovered by the model."], bullets: ["Appropriate: showing positions, connections, and detection status.", "Not appropriate: crease reading, diagnosis, personality scoring, or prediction.", "Pain or health concerns require assessment by a qualified health professional."] },
    ],
  },
  ja: {
    title: "21個の手のランドマーク インタラクティブ図鑑",
    summary: "手首から指先までの MediaPipe 座標を確認し、画像認識が位置を推定できる範囲と、人について推論できないことを学びます。",
    sections: [
      { heading: "21点の並び方", paragraphs: ["MediaPipe は手を21個の標準点で表します。0が手首、1〜4が親指、5〜8が人差し指、9〜12が中指、13〜16が薬指、17〜20が小指です。各点は画像に対する推定座標で、皮膚に実在する印ではありません。", "図または一覧から点を選ぶと、標準名と位置の説明が同期します。ポインターだけでなくキーボードでも操作でき、プログラムが使う入力を確認できます。"] },
      { heading: "関節名と接続線", paragraphs: ["MCP は指と手のひらの境目、PIP と DIP は指の中間と末端の関節、TIP は指先を示します。親指は CMC、MCP、IP、TIP という別の並びです。二次元画像の推定は診察ではありません。", "隣接点を結ぶ線は骨格のような確認図になりますが、生命線・知能線・感情線などの掌線を描くものではありません。"] },
      { heading: "観察と推論の境界", paragraphs: ["同じ画像内の相対位置は観察できますが、角度、遠近、遮蔽で数値は変わります。別々の写真を精密な身体測定として直接比較することはできません。", "21点に年齢、性格、健康、仕事、財産、未来の情報は含まれません。表示される内省文は別に作られた娯楽用の文章で、モデルが発見した個人情報ではありません。"], bullets: ["できること：位置、接続、検出状態の表示。", "できないこと：掌線解析、診断、性格評価、未来予測。", "痛みや健康上の疑問は医療専門家へ相談してください。"] },
    ],
  },
  ko: {
    title: "21개 손 랜드마크 인터랙티브 지도",
    summary: "손목부터 손끝까지 MediaPipe 좌표를 살펴보고 컴퓨터 비전이 찾을 수 있는 위치와 사람에 대해 추론할 수 없는 정보를 구분합니다.",
    sections: [
      { heading: "21개 점의 순서", paragraphs: ["MediaPipe는 한 손을 21개 표준 점으로 나타냅니다. 0은 손목, 1–4는 엄지, 5–8은 검지, 9–12는 중지, 13–16은 약지, 17–20은 새끼손가락입니다. 각 점은 이미지 속 관절 위치에 대한 모델의 추정이며 피부에 실제로 찍힌 표식이 아닙니다.", "그림이나 목록에서 점을 선택하면 표준 이름과 쉬운 위치 설명이 함께 바뀝니다. 포인터와 키보드를 모두 사용할 수 있어 프로그램이 이용하는 입력을 직접 확인할 수 있습니다."] },
      { heading: "관절 이름과 연결선", paragraphs: ["MCP는 손가락과 손바닥이 만나는 곳, PIP와 DIP는 중간과 끝마디, TIP은 손끝을 뜻합니다. 엄지는 CMC, MCP, IP, TIP 순서입니다. 2차원 사진의 추정은 임상 검사가 아닙니다.", "인접한 점을 이은 뼈대 모양은 손가락 순서를 확인하는 데 유용하지만 생명선, 두뇌선, 감정선 같은 손바닥 주름을 그리지 않습니다."] },
      { heading: "관찰과 추론의 경계", paragraphs: ["한 이미지 안의 상대 위치는 볼 수 있지만 촬영 각도, 원근, 가림에 따라 값이 달라집니다. 서로 다른 사진을 정밀한 신체 측정처럼 직접 비교할 수 없습니다.", "21개 점에는 나이, 성격, 건강, 직업, 재산이나 미래 정보가 없습니다. 성찰 문장은 별도로 작성된 오락용 문구이며 모델이 찾아낸 개인 사실이 아닙니다."], bullets: ["가능: 위치, 연결과 감지 상태 표시.", "불가능: 손금 판독, 진단, 성격 점수나 미래 예측.", "통증이나 건강 문제는 자격 있는 의료인에게 문의하세요."] },
    ],
  },
  es: {
    title: "Atlas interactivo de los 21 puntos de la mano",
    summary: "Examina el mapa de coordenadas de MediaPipe desde la muñeca hasta las yemas y distingue lo que la visión artificial localiza de lo que no puede inferir.",
    sections: [
      { heading: "Cómo se ordenan los 21 puntos", paragraphs: ["MediaPipe representa una mano con 21 índices: 0 es la muñeca; 1–4 siguen el pulgar; 5–8 el índice; 9–12 el medio; 13–16 el anular; y 17–20 el meñique. Son estimaciones del modelo, no marcas físicas sobre la piel.", "Selecciona un punto en el diagrama o la lista con ratón, toque o teclado. El nombre estándar y la ubicación sencilla permiten inspeccionar los datos reales que usa el programa."] },
      { heading: "Nombres articulares y conexiones", paragraphs: ["MCP corresponde aproximadamente a la unión del dedo con la palma; PIP y DIP a articulaciones intermedias y finales; TIP a la yema. El pulgar usa CMC, MCP, IP y TIP. Una estimación bidimensional no sustituye una evaluación clínica.", "Las líneas entre puntos vecinos forman una guía similar a un esqueleto. Ayudan a comprobar el orden de los dedos, pero no trazan líneas de vida, cabeza, corazón ni otros pliegues."] },
      { heading: "Observar no es inferir", paragraphs: ["Puede observarse geometría relativa dentro de una imagen, pero ángulo, perspectiva y oclusión cambian los valores. Dos fotos no son mediciones corporales directamente comparables.", "Los puntos no contienen edad, personalidad, salud, profesión, riqueza ni futuro. Cualquier texto de reflexión es entretenimiento escrito aparte, no un hecho descubierto por el modelo."], bullets: ["Adecuado: posiciones, conexiones y estado de detección.", "No adecuado: leer pliegues, diagnosticar, puntuar personalidad o predecir.", "El dolor o las dudas de salud requieren un profesional cualificado."] },
    ],
  },
  "pt-BR": {
    title: "Atlas interativo dos 21 pontos da mão",
    summary: "Examine o mapa de coordenadas do MediaPipe do punho às pontas dos dedos e diferencie o que a visão computacional localiza do que ela não pode inferir.",
    sections: [
      { heading: "Como os 21 pontos são organizados", paragraphs: ["O MediaPipe representa uma mão com 21 índices: 0 é o punho; 1–4 seguem o polegar; 5–8 o indicador; 9–12 o médio; 13–16 o anelar; e 17–20 o mínimo. São estimativas do modelo, não marcas físicas na pele.", "Selecione um ponto no diagrama ou na lista com mouse, toque ou teclado. O nome padrão e a localização simples tornam os dados usados pelo programa verificáveis."] },
      { heading: "Nomes das articulações e conexões", paragraphs: ["MCP corresponde aproximadamente à junção do dedo com a palma; PIP e DIP às articulações intermediária e final; TIP à ponta. O polegar usa CMC, MCP, IP e TIP. Uma estimativa em duas dimensões não substitui avaliação clínica.", "Linhas entre pontos vizinhos formam um guia semelhante a um esqueleto. Elas ajudam a conferir a ordem dos dedos, mas não traçam linhas da vida, cabeça, coração ou outras pregas."] },
      { heading: "Observar não é inferir", paragraphs: ["É possível observar geometria relativa dentro de uma imagem, mas ângulo, perspectiva e oclusão alteram os valores. Fotos diferentes não são medidas corporais diretamente comparáveis.", "Os pontos não contêm idade, personalidade, saúde, profissão, riqueza nem futuro. Qualquer texto de reflexão é entretenimento escrito separadamente, não um fato descoberto pelo modelo."], bullets: ["Adequado: posições, conexões e estado de detecção.", "Inadequado: ler pregas, diagnosticar, pontuar personalidade ou prever.", "Dor ou dúvidas de saúde exigem profissional qualificado."] },
    ],
  },
  fr: {
    title: "Atlas interactif des 21 repères de la main",
    summary: "Examinez la carte de coordonnées MediaPipe du poignet au bout des doigts et distinguez ce que la vision artificielle localise de ce qu’elle ne peut déduire.",
    sections: [
      { heading: "Ordre des 21 repères", paragraphs: ["MediaPipe représente une main par 21 indices : 0 pour le poignet, 1–4 pour le pouce, 5–8 l’index, 9–12 le majeur, 13–16 l’annulaire et 17–20 l’auriculaire. Ce sont des estimations du modèle, pas des marques physiques sur la peau.", "Sélectionnez un point dans le schéma ou la liste avec souris, toucher ou clavier. Le nom standard et l’emplacement courant rendent les données réellement utilisées par le programme inspectables."] },
      { heading: "Noms articulaires et connexions", paragraphs: ["MCP correspond approximativement à la jonction du doigt et de la paume ; PIP et DIP aux articulations intermédiaire et finale ; TIP au bout du doigt. Le pouce utilise CMC, MCP, IP et TIP. Une estimation en deux dimensions ne remplace pas un examen clinique.", "Les traits reliant des points voisins forment un guide proche d’un squelette. Ils aident à vérifier l’ordre des doigts, mais ne tracent aucune ligne de vie, de tête, de cœur ni aucun pli palmaire."] },
      { heading: "Observer n’est pas déduire", paragraphs: ["La géométrie relative peut être décrite dans une image, mais angle, perspective et occultation changent les valeurs. Deux photos ne constituent pas des mesures corporelles directement comparables.", "Les repères ne contiennent aucune donnée sur l’âge, la personnalité, la santé, le métier, la richesse ou l’avenir. Tout texte de réflexion est un divertissement rédigé séparément, pas un fait découvert par le modèle."], bullets: ["Approprié : positions, connexions et état de détection.", "Inapproprié : lecture des plis, diagnostic, score de personnalité ou prédiction.", "Douleur ou question de santé : consultez un professionnel qualifié."] },
    ],
  },
};

const creases: Record<Locale, LocalizedPageCopy> = {
  "zh-TW": { title: "掌褶、關節與偵測點有何不同？", summary: "把照片中容易混淆的四種概念拆開：皮膚掌褶、解剖關節、模型座標，以及手相傳統加上的象徵名稱。", sections: [
    { heading: "四種名稱指向不同東西", paragraphs: ["掌褶是手掌皮膚表面可見的折痕，主要橫向掌褶與拇指側褶皺在人與人之間有自然差異。關節則位於皮膚下方，是骨骼相接並容許動作的結構。皮膚折痕可能靠近關節，卻不等於關節中心。", "MediaPipe 的 landmark 是模型估計的影像座標，常放在手腕與手指關節附近。手相中的生命線、智慧線等名稱，則是文化傳統替部分掌褶建立的象徵分類。四者不能互換。", "醫學資料偶爾會描述掌褶變異，但那不代表一般人能憑線條自行診斷。臨床判斷需要病史、檢查與專業訓練；同一個可見特徵也可能出現在沒有相關疾病的人身上。HandFuture 因此不替照片做健康標記。"] },
    { heading: "為什麼畫面會讓人誤會", paragraphs: ["把圓點與線疊在手部照片上，看起來像程式『讀取手掌』，但連線只是依固定索引把關節點接起來。模型輸出沒有掌褶像素、線名或象徵意義。", "光線會讓掌褶變深或消失，彎手也會改變折痕外觀；模型點則會隨姿勢移動。若把兩種變化混在一起，就可能把一個關節定位工具誤認成掌紋分析器。"] },
    { heading: "安全閱讀比較結果", paragraphs: ["本網站用圖表標示『可見於照片』『模型有回傳』『傳統使用』『可做醫療判斷』四個欄位。只有合格專業人員在適當情境中才能做醫療評估；一張消費型照片或掌褶名稱都不夠。", "如果你是為文化興趣閱讀手相，可以保留歷史名稱，同時把它標示成傳統說法。若目的是了解程式，就回到 21 點索引與實際程式輸出，不把象徵故事塞進座標。", "遇到網站或影片把關節骨架圖直接改稱掌紋圖時，可以要求查看原始模型文件與回傳欄位。若沒有任何線段偵測、像素分割或掌褶分類輸出，就不應把畫面效果包裝成已分析掌紋。"], bullets: ["掌褶：皮膚折痕，照片可能看得到。", "關節：解剖結構，不等於表面折痕。", "Landmark：模型估計座標，不含掌紋意義。", "手相線名：文化標籤，不是科學測量。"] },
  ] },
  "zh-CN": { title: "掌褶、关节与检测点有何不同？", summary: "把照片中容易混淆的四种概念拆开：皮肤掌褶、解剖关节、模型坐标和手相传统赋予的象征名称。", sections: [
    { heading: "四种名称指向不同事物", paragraphs: ["掌褶是手掌皮肤表面的折痕，人与人之间存在自然差异。关节位于皮肤下，是骨骼相接并允许动作的结构；皮肤折痕可能靠近关节，却不等于关节中心。", "MediaPipe landmark 是模型估计的图像坐标，通常位于手腕和手指关节附近。生命线、智慧线等则是文化传统对部分掌褶的象征分类，四者不能互换。", "医学资料有时描述掌褶变异，但这不意味着普通人能凭线条自行诊断。临床结论需要病史、检查和专业训练，HandFuture 不会给照片添加健康标签。"] },
    { heading: "画面为何容易造成误解", paragraphs: ["圆点和连线叠在照片上，看起来像程序在“读取手掌”，但连线只是按照固定索引连接关节点。模型输出没有掌褶像素、线名或象征意义。", "光线会让掌褶变深或消失，弯手也会改变折痕外观；模型点随姿势移动。混淆两种变化会把关节定位工具误认为掌纹分析器。"] },
    { heading: "安全阅读比较结果", paragraphs: ["本页比较“照片可见”“模型返回”“传统使用”“能否医疗判断”四个方面。医疗评估需要合格专业人员和适当情境，一张普通照片或掌褶名称都不够。", "文化阅读可以保留历史名称，但应标明是传统说法。理解程序时则回到 21 点索引和实际输出，不把象征故事放进坐标。"], bullets: ["掌褶：皮肤折痕，照片可能看见。", "关节：解剖结构，不等于表面折痕。", "Landmark：模型估计坐标，不含掌纹意义。", "手相线名：文化标签，不是科学测量。"] },
  ] },
  en: { title: "Palm creases, joints, and detector landmarks compared", summary: "Separate four concepts that are easily confused in a hand photo: skin creases, anatomical joints, model coordinates, and symbolic names added by palmistry traditions.", sections: [
    { heading: "Four labels, four different things", paragraphs: ["Palmar creases are visible folds in the skin surface. Major transverse and thumb-side creases vary naturally between people. Joints are deeper anatomical structures where bones meet and movement occurs. A surface fold can lie near a joint without marking the joint center.", "A MediaPipe landmark is an estimated image coordinate placed near the wrist or a finger joint. Names such as life line or head line are symbolic classifications that palmistry traditions assign to selected creases. A crease, joint, coordinate, and cultural label are not interchangeable evidence."] },
    { heading: "Why an overlay can be misleading", paragraphs: ["Dots and connections over a hand photo can look like the program is ‘reading the palm.’ In fact, each connection follows a fixed landmark index map. The detector output contains no crease pixels, palmistry line names, or symbolic interpretations.", "Lighting can deepen or hide a crease, and bending a hand changes the surface folds. Landmark coordinates also move with the pose. Combining those separate changes can turn a joint-localization interface into the false impression of a crease-reading system."] },
    { heading: "A practical comparison", paragraphs: ["The comparison asks four questions: can it be visible in the photo, does this model return it, is the term used by a tradition, and can it support a medical conclusion? Only qualified professionals using an appropriate clinical context can assess health; a consumer photograph and a crease label are not sufficient.", "For cultural study, keep historical palmistry names clearly attributed to a tradition. For technical study, return to the 21 indices and the program’s actual output. Do not insert a symbolic story into a coordinate that never contained it."], bullets: ["Crease: a skin fold that may be visible in a photo.", "Joint: an anatomical structure, not the same as a surface fold.", "Landmark: an estimated model coordinate with no palmistry meaning.", "Palmistry line name: a cultural label, not a scientific measurement."] },
  ] },
  ja: { title: "手のひらのしわ・関節・検出点の違い", summary: "写真で混同されやすい皮膚のしわ、解剖学的関節、モデル座標、手相文化の象徴名を分けて理解します。", sections: [
    { heading: "四つの言葉は別の対象", paragraphs: ["掌のしわは皮膚表面の折れ目で、形には自然な個人差があります。関節は皮膚の下で骨が接して動く構造です。しわが関節の近くにあっても中心を示すとは限りません。", "MediaPipe のランドマークは関節付近に置かれる推定画像座標です。生命線などは伝統が一部のしわに付けた象徴名で、四つを同じ証拠として扱えません。"] },
    { heading: "オーバーレイが誤解を招く理由", paragraphs: ["写真上の点と線は『手のひらを読む』ように見えますが、線は固定された索引順に点を結ぶだけです。出力にしわの画素、手相線名、象徴的意味はありません。", "光や手の曲げ方でしわの見え方は変わり、姿勢で座標も動きます。別々の変化を混ぜると関節位置検出を掌線解析と誤認します。"] },
    { heading: "安全な比較", paragraphs: ["写真で見えるか、モデルが返すか、伝統が用いるか、医療判断に使えるかを分けます。健康評価には適切な状況と専門家が必要で、一般写真や名称だけでは足りません。", "文化として読む場合は伝統名であることを示し、技術を理解する場合は21点の実出力へ戻ります。座標に象徴物語を追加しないことが大切です。"], bullets: ["しわ：写真に見える皮膚の折れ目。", "関節：表面のしわとは別の解剖構造。", "ランドマーク：意味を持たない推定座標。", "手相線名：科学測定ではなく文化ラベル。"] },
  ] },
  ko: { title: "손바닥 주름·관절·감지점의 차이", summary: "손 사진에서 혼동하기 쉬운 피부 주름, 해부학적 관절, 모델 좌표와 손금 전통의 상징 명칭을 나누어 봅니다.", sections: [
    { heading: "네 용어는 서로 다른 대상", paragraphs: ["손바닥 주름은 피부 표면의 접힘이며 사람마다 자연스럽게 다릅니다. 관절은 피부 아래에서 뼈가 만나 움직이는 구조입니다. 주름이 관절 가까이에 있어도 관절 중심과 같지는 않습니다.", "MediaPipe 랜드마크는 손목과 손가락 관절 부근의 추정 이미지 좌표입니다. 생명선 같은 이름은 일부 주름에 전통이 붙인 상징 분류이므로 네 개념을 바꿔 쓸 수 없습니다."] },
    { heading: "오버레이가 오해를 만드는 이유", paragraphs: ["사진 위 점과 선은 손바닥을 읽는 것처럼 보이지만 선은 고정된 색인 순서대로 관절점을 이을 뿐입니다. 출력에는 주름 픽셀, 손금 선 이름이나 상징 의미가 없습니다.", "빛과 손의 굽힘에 따라 주름이 달라 보이고 자세에 따라 좌표도 움직입니다. 이 변화를 섞으면 관절 위치 도구를 손금 분석기로 오해하게 됩니다."] },
    { heading: "안전한 비교 방법", paragraphs: ["사진에서 보이는지, 모델이 반환하는지, 전통에서 쓰는지, 의료 판단이 가능한지를 따로 묻습니다. 건강 평가는 적절한 상황과 자격 있는 전문가가 필요하며 일반 사진이나 주름 이름만으로는 부족합니다.", "문화로 읽을 때는 전통 명칭임을 표시하고, 기술을 이해할 때는 21개 색인과 실제 출력으로 돌아가세요. 좌표에 상징 이야기를 넣지 마세요."], bullets: ["주름: 사진에 보일 수 있는 피부 접힘.", "관절: 표면 주름과 다른 해부 구조.", "랜드마크: 손금 의미가 없는 추정 좌표.", "손금 선 이름: 과학 측정이 아닌 문화 표지."] },
  ] },
  es: { title: "Pliegues, articulaciones y puntos detectados", summary: "Separa cuatro conceptos que se confunden en una foto: pliegues cutáneos, articulaciones anatómicas, coordenadas del modelo y nombres simbólicos de la quiromancia.", sections: [
    { heading: "Cuatro etiquetas distintas", paragraphs: ["Los pliegues palmares son dobleces visibles de la piel y varían naturalmente. Las articulaciones son estructuras profundas donde se unen los huesos. Un pliegue puede estar cerca sin señalar el centro articular.", "Un landmark de MediaPipe es una coordenada estimada cerca de la muñeca o una articulación. Línea de vida o de cabeza son nombres simbólicos de tradiciones quirománticas. No son pruebas intercambiables."] },
    { heading: "Por qué engaña una superposición", paragraphs: ["Los puntos y conexiones pueden parecer una lectura, pero cada línea solo sigue un mapa fijo de índices. La salida no contiene píxeles de pliegues, nombres quirománticos ni significados.", "La luz y la flexión cambian el aspecto de los pliegues; la postura cambia las coordenadas. Mezclar ambos cambios convierte visualmente un localizador de articulaciones en un falso lector de palma."] },
    { heading: "Comparar con seguridad", paragraphs: ["Pregunta si algo es visible, si el modelo lo devuelve, si una tradición lo usa y si permite una conclusión médica. La salud requiere contexto clínico y profesionales; una foto corriente o un nombre no bastan.", "Para estudiar cultura, atribuye los nombres a la tradición. Para estudiar tecnología, vuelve a los 21 índices y la salida real, sin insertar historias simbólicas."], bullets: ["Pliegue: doblez de piel visible.", "Articulación: estructura anatómica distinta.", "Landmark: coordenada estimada sin significado quiromántico.", "Nombre de línea: etiqueta cultural, no medición científica."] },
  ] },
  "pt-BR": { title: "Pregas, articulações e pontos detectados", summary: "Separe quatro conceitos confundidos em fotos: pregas da pele, articulações anatômicas, coordenadas do modelo e nomes simbólicos da quiromancia.", sections: [
    { heading: "Quatro rótulos diferentes", paragraphs: ["Pregas palmares são dobras visíveis da pele e variam naturalmente. Articulações são estruturas profundas onde os ossos se encontram. Uma prega pode ficar próxima sem marcar o centro da articulação.", "Um landmark do MediaPipe é uma coordenada estimada perto do punho ou articulação. Linha da vida ou da cabeça são nomes simbólicos de tradições. Não são evidências intercambiáveis."] },
    { heading: "Por que a sobreposição engana", paragraphs: ["Pontos e conexões podem parecer uma leitura, mas cada linha apenas segue um mapa fixo de índices. A saída não contém pixels de pregas, nomes da quiromancia ou significados.", "Luz e flexão mudam a aparência das pregas; postura muda as coordenadas. Misturar as mudanças transforma visualmente um localizador de articulações em um falso leitor de palma."] },
    { heading: "Comparar com segurança", paragraphs: ["Pergunte se algo aparece na foto, se o modelo retorna, se uma tradição usa e se permite conclusão médica. Saúde exige contexto clínico e profissionais; foto comum ou nome de prega não bastam.", "Para estudar cultura, atribua os nomes à tradição. Para tecnologia, volte aos 21 índices e à saída real, sem inserir histórias simbólicas."], bullets: ["Prega: dobra de pele visível.", "Articulação: estrutura anatômica distinta.", "Landmark: coordenada estimada sem significado de quiromancia.", "Nome de linha: rótulo cultural, não medição científica."] },
  ] },
  fr: { title: "Plis, articulations et repères détectés", summary: "Séparez quatre notions souvent confondues : plis cutanés, articulations anatomiques, coordonnées du modèle et noms symboliques de la chiromancie.", sections: [
    { heading: "Quatre étiquettes différentes", paragraphs: ["Les plis palmaires sont des replis visibles de la peau qui varient naturellement. Les articulations sont des structures profondes où les os se rejoignent. Un pli proche ne marque pas forcément le centre articulaire.", "Un repère MediaPipe est une coordonnée estimée près du poignet ou d’une articulation. Ligne de vie ou de tête sont des noms symboliques de traditions. Ces éléments ne sont pas des preuves interchangeables."] },
    { heading: "Pourquoi une superposition trompe", paragraphs: ["Points et connexions peuvent ressembler à une lecture, mais chaque trait suit seulement une carte d’indices fixe. La sortie ne contient ni pixels de plis, ni noms chiromantiques, ni significations.", "Lumière et flexion changent les plis ; la pose change les coordonnées. Mélanger ces variations transforme visuellement un localisateur d’articulations en faux lecteur de paume."] },
    { heading: "Comparer sans confusion", paragraphs: ["Demandez si l’élément est visible, renvoyé par le modèle, utilisé par une tradition et capable d’étayer une conclusion médicale. La santé exige contexte clinique et professionnels ; photo ou nom ne suffisent pas.", "Pour étudier la culture, attribuez les noms à la tradition. Pour la technique, revenez aux 21 indices et à la sortie réelle, sans ajouter de récit symbolique."], bullets: ["Pli : repli cutané parfois visible.", "Articulation : structure anatomique différente.", "Repère : coordonnée estimée sans sens chiromantique.", "Nom de ligne : étiquette culturelle, pas mesure scientifique."] },
  ] },
};

const barnum: Record<Locale, LocalizedPageCopy> = {
  "zh-TW": { title: "巴納姆效應互動實驗室", summary: "先親自比較兩段廣泛敘述，再拆解『好像很準』的感受從何而來，以及如何避免把共鳴誤當成個人化證據。", sections: [
    { heading: "先做選擇，再看答案", paragraphs: ["互動區會以不同順序顯示兩段故意寫得廣泛的敘述。請選出較像自己的那一段，也可以選兩段都不像。系統只在目前頁面記住這次點選，不會建立人格分數、上傳答案或存入本機儲存。", "這不是要證明你容易受騙，而是把閱讀時常見的心理過程變成可觀察的步驟。沒有標準答案；重要的是先記錄直覺，再檢查句子如何容納很多不同的人。", "重新開始會交換或重排呈現順序，但兩段文字的設計原則不變。這可以提醒我們：位置、版面與先後也可能影響偏好，不能把一次點選當成穩定人格特徵。"] },
    { heading: "為什麼廣泛描述會顯得貼身", paragraphs: ["APA 將巴納姆效應描述為把模糊預測或普遍人格敘述視為特別適用於自己的傾向。句子若同時容納相反特質，例如『你享受陪伴，但有時需要獨處』，多數人都能找到吻合時刻。", "讀者也可能特別記住符合的部分、忽略不符合的部分，或在知道結果後替句子補上脈絡。主觀共鳴可以是真實感受，但它本身不能證明文字取得了手掌、星座或測驗中的獨特個人資訊。"] },
    { heading: "把共鳴轉成可檢查的問題", paragraphs: ["再遇到看似準確的描述時，先問：這句話是否包含可同時成立的兩面？大多數人是否也能套用？不符合時能否明確判錯，還是總有新的解釋？描述是否在知道答案前就寫好？", "共鳴仍可成為自我反思的起點，例如你可以提出一個具體、由生活經驗回答的問題。安全界線是把答案歸於自己的觀察與選擇，不把模糊文字當成外部系統準確讀出你的證據。", "更嚴謹的比較可以把同一批敘述隨機分配給多人，先固定評分方式，再比較每段文字獲得的平均貼合感。如果所有人都對同一段廣泛描述給高分，這反而支持它具有普遍適用性，而不是高度個人化。"], bullets: ["先保存原始敘述，不要事後改字。", "同時記錄符合與不符合的例子。", "找未看過個人資料的人進行盲評。", "不要用這類文字做醫療、財務或重大人生決定。"] },
  ] },
  "zh-CN": { title: "巴纳姆效应互动实验室", summary: "先比较两段广泛描述，再拆解“好像很准”的感受来自哪里，以及如何避免把共鸣误当作个性化证据。", sections: [
    { heading: "先选择，再看解释", paragraphs: ["互动区会以不同顺序显示两段故意写得宽泛的描述。请选择更像自己的内容，也可以选两段都不像。系统只在当前页面记住点击，不会建立人格分数、上传答案或写入本地存储。", "这不是要证明读者容易受骗，而是把常见阅读过程变成可观察步骤。没有标准答案；重点是先记录直觉，再检查句子如何适用于很多不同的人。", "重新开始可能改变呈现顺序，但文本设计原则不变。这也提醒我们，位置和先后会影响偏好，不能把一次点击当作稳定人格特征。"] },
    { heading: "为什么宽泛描述显得贴身", paragraphs: ["APA 将巴纳姆效应描述为把模糊预测或普遍人格描述看成特别适用于自己的倾向。句子如果同时容纳相反特质，例如喜欢陪伴但有时需要独处，多数人都能找到吻合时刻。", "读者可能记住符合部分、忽略不符合部分，或事后补充背景。主观共鸣是真实感受，但不能证明文字从手掌、星座或测验中取得独特个人信息。"] },
    { heading: "把共鸣变成检查问题", paragraphs: ["再次遇到准确感时，问问这句话是否包含两面、多数人是否适用、不符合时能否明确判错，以及描述是否在知道答案之前写好。", "共鸣可以启动反思，但答案应来自自己的经历和选择，而不是把模糊文字当作外部系统读懂你的证据。"], bullets: ["保留原始描述，不要事后改写。", "同时记录符合和不符合的例子。", "尝试不知道个人资料的盲评。", "不要用于医疗、财务或重大决定。"] },
  ] },
  en: { title: "Interactive Barnum effect lab", summary: "Compare two broad statements before seeing the explanation, then examine where the feeling of accuracy comes from and how to avoid mistaking resonance for personal evidence.", sections: [
    { heading: "Choose first, reveal second", paragraphs: ["The lab presents two deliberately broad descriptions in changing order. Choose the one that feels more personal, or select neither. The page holds this choice only in component memory: it creates no personality score, sends no answer, and writes nothing to persistent browser storage.", "The exercise is not designed to prove that a reader is gullible. It turns a common reading process into visible steps. There is no correct choice. The useful move is to record the initial impression before examining how each sentence can accommodate many different people."] },
    { heading: "Why general statements feel specific", paragraphs: ["The APA describes the Barnum effect as a tendency to accept vague predictions or general personality descriptions as specifically applicable to oneself. A sentence that contains both sides—such as enjoying company while sometimes needing solitude—offers most readers a matching memory.", "A reader may remember the matching clause, discount a mismatch, or supply context after learning the supposed result. The feeling of resonance can be sincere and meaningful as an experience. By itself, however, it does not show that the text obtained unique information from a palm, birth sign, or test."] },
    { heading: "Turn a feeling into testable questions", paragraphs: ["When another description feels accurate, ask whether it covers opposite tendencies, whether most people could apply it, whether a clear mismatch can count against it, and whether the wording existed before the author knew the outcome. Compare the complete statement, not only the strongest phrase.", "Resonance can still start a useful reflection. Reframe it as a concrete question answered by your own observations and choices. The boundary is to keep ownership of the answer rather than treating vague prose as evidence that an external system accurately read you."], bullets: ["Preserve the original wording before checking the result.", "Record mismatches as well as matches.", "Try a blind comparison by someone without personal context.", "Never use such prose for medical, financial, or high-impact decisions."] },
  ] },
  ja: { title: "バーナム効果 インタラクティブ実験室", summary: "二つの幅広い文章を説明を見る前に比べ、正確に感じる理由と、共感を個人情報の証拠と誤解しない方法を学びます。", sections: [
    { heading: "選んでから説明を見る", paragraphs: ["実験では意図的に広く書かれた二文を順序を変えて表示します。自分に近い方、または「どちらでもない」を選びます。選択は画面内だけで保持され、性格点、送信、永続保存はありません。", "読者をだまされやすいと決める課題ではありません。最初の直感を記録し、文章が多くの人に当てはまる仕組みを観察します。正解はありません。"] },
    { heading: "一般文が個人的に感じられる理由", paragraphs: ["APA はバーナム効果を、曖昧な予測や一般的性格記述を自分特有だと受け入れる傾向と説明します。社交を好む一方で独りの時間も必要、という両面文は多くの人に記憶の一致を与えます。", "一致を覚え、不一致を無視し、結果を知ってから文脈を足すこともあります。共感は本物の感覚でも、それだけで手や星座から固有情報を得た証拠にはなりません。"] },
    { heading: "確認できる質問へ", paragraphs: ["反対傾向を同時に含むか、多くの人に当てはまるか、不一致で明確に否定できるか、結果を知る前に文章が固定されていたかを尋ねます。", "共感は内省の入口にできますが、答えは自分の経験と選択から出します。曖昧な文を外部システムが自分を読んだ証拠にしないことが境界です。"], bullets: ["結果を見る前の原文を保存する。", "一致と不一致を両方記録する。", "個人情報を知らない人の盲比較を試す。", "医療・金融・重大判断には使わない。"] },
  ] },
  ko: { title: "바넘 효과 인터랙티브 실험실", summary: "두 가지 넓은 문장을 설명 전에 비교하고 정확하게 느끼는 이유와 공감을 개인화된 증거로 오해하지 않는 법을 살펴봅니다.", sections: [
    { heading: "먼저 선택하고 설명 보기", paragraphs: ["실험실은 의도적으로 넓게 쓴 두 문장을 순서를 바꾸어 보여 줍니다. 더 개인적으로 느껴지는 것 또는 둘 다 아님을 선택하세요. 선택은 화면 메모리에만 있고 성격 점수, 전송, 영구 저장은 없습니다.", "독자를 잘 속는 사람으로 판정하는 과제가 아닙니다. 첫인상을 기록한 뒤 문장이 많은 사람을 포괄하는 방식을 관찰하며 정답은 없습니다."] },
    { heading: "일반 문장이 개인적으로 느껴지는 이유", paragraphs: ["APA는 바넘 효과를 모호한 예측이나 일반 성격 묘사를 자신에게 특별히 적용된다고 받아들이는 경향으로 설명합니다. 사람들과 있기를 좋아하지만 가끔 혼자 있고 싶다는 양면 문장은 대부분에게 일치 경험을 줍니다.", "맞는 부분을 기억하고 틀린 부분을 줄여 보거나 결과 뒤에 맥락을 더할 수도 있습니다. 공감은 진실한 느낌이지만 손이나 별자리에서 고유 정보를 얻었다는 증거는 아닙니다."] },
    { heading: "검사 가능한 질문으로 바꾸기", paragraphs: ["반대 성향을 동시에 담는지, 많은 사람에게 적용되는지, 불일치가 실제 반증이 되는지, 결과를 알기 전에 문장이 고정되었는지 물어보세요.", "공감은 성찰의 시작이 될 수 있지만 답은 자신의 경험과 선택에서 나옵니다. 모호한 글을 외부 시스템이 자신을 읽었다는 증거로 보지 마세요."], bullets: ["결과 확인 전 원문을 보존하세요.", "일치와 불일치를 함께 기록하세요.", "개인 맥락을 모르는 사람의 맹검 비교를 해보세요.", "의료·재정·중대한 결정에는 사용하지 마세요."] },
  ] },
  es: { title: "Laboratorio interactivo del efecto Barnum", summary: "Compara dos frases amplias antes de ver la explicación y analiza por qué parecen exactas sin confundir resonancia con evidencia personal.", sections: [
    { heading: "Elegir antes de revelar", paragraphs: ["El laboratorio muestra dos descripciones amplias en orden variable. Elige la más personal o ninguna. La elección permanece solo en memoria de la página: no crea un perfil, no envía respuestas ni escribe almacenamiento persistente.", "No pretende demostrar que alguien sea crédulo. Hace visible un proceso común: guardar la impresión inicial y observar cómo cada frase incluye a muchas personas. No hay respuesta correcta."] },
    { heading: "Por qué lo general parece específico", paragraphs: ["La APA describe el efecto Barnum como aceptar predicciones vagas o descripciones generales como propias. Una frase con dos caras, como disfrutar de compañía y necesitar soledad, ofrece recuerdos coincidentes a casi cualquiera.", "Podemos recordar aciertos, minimizar desacuerdos o añadir contexto después. La resonancia es una sensación real, pero no prueba que el texto obtuviera información única de la palma, el signo o un test."] },
    { heading: "Preguntas comprobables", paragraphs: ["Pregunta si incluye tendencias opuestas, si sirve a mucha gente, si un desacuerdo puede refutarla y si el texto existía antes de conocer el resultado. Evalúa la frase completa.", "La resonancia puede iniciar reflexión si la conviertes en una pregunta concreta respondida por tu experiencia. No conviertas prosa vaga en evidencia de que un sistema externo te leyó."], bullets: ["Conserva el texto original antes del resultado.", "Anota desacuerdos además de coincidencias.", "Prueba una comparación ciega sin contexto personal.", "No lo uses para decisiones médicas, financieras o importantes."] },
  ] },
  "pt-BR": { title: "Laboratório interativo do efeito Barnum", summary: "Compare duas frases amplas antes da explicação e analise por que parecem precisas sem confundir identificação com evidência pessoal.", sections: [
    { heading: "Escolher antes de revelar", paragraphs: ["O laboratório mostra duas descrições amplas em ordem variável. Escolha a mais pessoal ou nenhuma. A opção fica somente na memória da página: não cria perfil, não envia respostas nem grava armazenamento persistente.", "Não pretende provar que alguém é crédulo. Torna visível um processo comum: guardar a impressão inicial e observar como cada frase inclui muitas pessoas. Não há resposta correta."] },
    { heading: "Por que o geral parece específico", paragraphs: ["A APA descreve o efeito Barnum como aceitar previsões vagas ou descrições gerais como pessoais. Uma frase com dois lados, como gostar de companhia e precisar de solidão, oferece lembranças coincidentes a quase todos.", "Podemos lembrar acertos, reduzir discordâncias ou acrescentar contexto depois. A identificação é sensação real, mas não prova que o texto obteve informação única da palma, signo ou teste."] },
    { heading: "Perguntas verificáveis", paragraphs: ["Pergunte se inclui tendências opostas, se serve a muitas pessoas, se uma discordância pode refutá-la e se o texto existia antes do resultado. Avalie a frase inteira.", "A identificação pode iniciar reflexão se virar pergunta concreta respondida pela sua experiência. Não transforme prosa vaga em prova de que um sistema externo leu você."], bullets: ["Guarde o texto original antes do resultado.", "Anote discordâncias além de coincidências.", "Tente comparação cega sem contexto pessoal.", "Não use em decisões médicas, financeiras ou importantes."] },
  ] },
  fr: { title: "Laboratoire interactif de l’effet Barnum", summary: "Comparez deux phrases générales avant l’explication et analysez leur impression de justesse sans confondre résonance et preuve personnelle.", sections: [
    { heading: "Choisir avant de révéler", paragraphs: ["Le laboratoire montre deux descriptions générales dans un ordre variable. Choisissez la plus personnelle ou aucune. Le choix reste en mémoire de page : aucun profil, aucun envoi, aucun stockage persistant.", "L’exercice ne cherche pas à qualifier le lecteur de crédule. Il rend visible un processus courant : conserver l’impression initiale puis observer comment chaque phrase inclut beaucoup de personnes. Il n’y a pas de bonne réponse."] },
    { heading: "Pourquoi le général semble précis", paragraphs: ["L’APA décrit l’effet Barnum comme l’acceptation de prédictions vagues ou de descriptions générales comme propres à soi. Une phrase à deux faces, aimer la compagnie mais parfois la solitude, offre à presque tous un souvenir correspondant.", "On peut retenir les accords, minimiser les écarts ou ajouter un contexte après coup. La résonance est un sentiment réel, mais ne prouve pas que le texte a tiré une information unique d’une paume, d’un signe ou d’un test."] },
    { heading: "Questions vérifiables", paragraphs: ["Demandez si la phrase contient des tendances opposées, convient à beaucoup, peut être réfutée par un désaccord et existait avant le résultat. Évaluez-la en entier.", "La résonance peut lancer une réflexion si elle devient une question concrète à laquelle répond votre expérience. Ne faites pas d’une prose vague la preuve qu’un système externe vous a lu."], bullets: ["Conservez le texte original avant le résultat.", "Notez les écarts autant que les accords.", "Essayez une comparaison aveugle sans contexte personnel.", "Ne l’utilisez pas pour des décisions médicales, financières ou importantes."] },
  ] },
};

const evaluation: Record<Locale, LocalizedPageCopy> = {
  "zh-TW": { title: "如何檢查手相與占卜說法", summary: "用七個可重複的問題檢查一項說法：它說了什麼、如何可能被判錯、與什麼比較，以及證據是否能獨立重現。", sections: [
    { heading: "先把說法寫得可檢查", paragraphs: ["『你近期會有轉變』沒有時間、範圍或可觀察結果，幾乎任何事件都能被事後算成吻合。較可檢查的說法需要事先寫明對象、結果、期限與判定規則，也要保留未發生時算錯的可能。", "把反思問題與預測分開。『我最近想改變什麼？』可以是有用的自問，但它沒有宣稱外部系統知道答案；『你的掌線顯示三個月內會換工作』則是事實預測，應接受資料與失敗紀錄的檢驗。"] },
    { heading: "七項證據檢查", paragraphs: ["檢查具體性、可否證性、基準率、替代解釋、來源品質、是否事先登錄，以及獨立重複。基準率問的是：即使沒有手相，這件事本來多常發生？替代解釋則包含猜測、一般敘述、事前取得的線索與只報成功案例。", "來源品質不只看網站外觀或作者自稱。應查看方法、樣本、完整結果、利益衝突與其他研究者能否得到相近結果。單一感言可以提出研究問題，卻無法估計整體準確度。"] },
    { heading: "一個中立的實作範例", paragraphs: ["假設有人聲稱能從手掌判斷內向或外向。公平測試可先定義評量方法，收集不含姓名的手掌影像，讓解讀者無法接觸背景資料，再與已定義的對照或可靠量表比較，同時公開所有結果而非只挑成功者。", "即使一次測試高於機會，也要檢查樣本大小、分析選擇與是否能由獨立團隊重複。若證據不足，最誠實的結論是『目前不知道』，而不是把缺少反證說成證明有效。"], bullets: ["具體：結果、期限與對象是否事先明確？", "可否證：什麼結果會算錯？", "基準率：不用這套方法本來會猜中多少？", "替代解釋：是否可能來自線索、模糊語句或選擇性報告？", "來源與重複：方法、全數結果與獨立驗證是否可見？"] },
    { heading: "把方法用回日常決定", paragraphs: ["證據強度應配合決定風險。娛樂性問題可以低風險地保留或忽略；涉及健康、法律、金錢、工作與關係安全時，則應使用官方資訊、合格專業人員、可觀察行為與公平程序。", "尊重文化不要求把每項因果主張都當真。可以研究名稱、故事與社群意義，同時清楚說明哪些是歷史記錄、哪些是個人信念、哪些有可重複證據。"] },
  ] },
  "zh-CN": { title: "如何检查手相与占卜说法", summary: "用七个可重复问题检查一项说法：它说了什么、怎样可能被判错、与什么比较，以及证据能否独立重现。", sections: [
    { heading: "先把说法写得可检查", paragraphs: ["“近期会有转变”没有时间、范围或可观察结果，任何事件都可能事后算作吻合。可检查的说法应提前写明对象、结果、期限和判断规则，并允许未发生时判错。", "把反思问题和预测分开。“我最近想改变什么？”是自问；“掌线显示三个月内换工作”是事实预测，应接受数据和失败记录的检验。"] },
    { heading: "七项证据检查", paragraphs: ["检查具体性、可证伪性、基准率、替代解释、来源质量、是否事先登记和独立重复。基准率问的是不用手相这件事本来多常发生；替代解释包括猜测、一般描述、背景线索和只报告成功。", "不要只看网站外观或作者自称。查看方法、样本、完整结果、利益冲突和其他研究者能否得到相近结果。单个感言可以提出问题，不能估计整体准确率。"] },
    { heading: "中立测试范例", paragraphs: ["若有人声称从手掌判断内向或外向，可以先定义评量方法，收集匿名手掌图片，让解读者接触不到背景，再与明确对照或可靠量表比较，并公开全部结果。", "一次高于机会仍需检查样本、分析选择和独立重复。证据不足时，诚实结论是“目前不知道”，而不是把缺少反证当作有效证明。"], bullets: ["具体：结果、期限和对象是否提前明确？", "可证伪：什么结果算错？", "基准率：不用方法会猜中多少？", "替代解释：线索、模糊语句或选择性报告？", "来源与重复：方法、完整结果和独立验证是否可见？"] },
    { heading: "用于日常决定", paragraphs: ["证据强度应配合决定风险。娱乐问题可以保留或忽略；涉及健康、法律、金钱、工作和关系安全时，应使用官方信息、合格专业人员、可观察行为和公平程序。", "尊重文化不等于接受所有因果主张。可以研究名称、故事和社群意义，同时清楚区分历史记录、个人信念与能够独立重复验证的证据。"] },
  ] },
  en: { title: "How to evaluate palmistry and divination claims", summary: "Use seven repeatable questions to examine a claim: what it predicts, how it could fail, what comparison matters, and whether the evidence can be independently reproduced.", sections: [
    { heading: "Turn a claim into something checkable", paragraphs: ["‘A change is coming soon’ supplies no fixed time, scope, or observable outcome, so almost any later event can be counted as a match. A checkable claim states the subject, outcome, time window, and decision rule before results are known. It also preserves the possibility that nothing happens and the claim is wrong.", "Separate a reflection question from a prediction. ‘What would I like to change?’ can be a useful prompt without claiming that an external system knows the answer. ‘Your palm shows that you will change jobs within three months’ is a factual prediction that should face complete data and recorded failures."] },
    { heading: "Seven evidence checks", paragraphs: ["Check specificity, falsifiability, base rates, alternative explanations, source quality, advance registration, and independent replication. A base rate asks how often the event occurs without palmistry. Alternatives include ordinary guessing, widely applicable prose, information obtained beforehand, and reporting successes while hiding misses.", "Source quality is more than a polished site or confident title. Look for the method, sample, full results, conflicts of interest, and whether other investigators obtain similar findings. A testimonial can suggest a question for study, but cannot estimate overall accuracy."] },
    { heading: "A neutral worked example", paragraphs: ["Suppose someone claims to identify introversion from palms. A fair test could define the assessment first, collect palm images without names, prevent readers from accessing background information, compare predictions with a defined reference measure or control, and publish every result rather than selected successes.", "One result above chance would still need scrutiny of sample size and analysis choices, then repetition by independent teams. When evidence is insufficient, ‘we do not know yet’ is more accurate than treating the absence of disproof as proof."] , bullets: ["Specific: are outcome, period, and population fixed in advance?", "Falsifiable: what result would count as wrong?", "Base rate: how often would a guess succeed without this method?", "Alternatives: clues, vague wording, or selective reporting?", "Sources and replication: are method, full results, and independent checks visible?"] },
    { heading: "Match evidence to the decision", paragraphs: ["The evidence threshold should rise with the consequence. A low-stakes entertainment prompt can be kept or ignored. Health, law, money, employment, and relationship safety require authoritative information, qualified professionals where appropriate, observable behavior, and fair processes.", "Respecting a culture does not require accepting every causal claim. Readers can study names, stories, and community meaning while marking which statements are historical records, which are personal beliefs, and which have reproducible evidence."] },
  ] },
  ja: { title: "手相や占いの主張を確かめる方法", summary: "予測内容、誤りになる条件、比較対象、独立再現の有無を七つの質問で確認します。", sections: [
    { heading: "確認できる主張にする", paragraphs: ["「近く変化がある」は期間も観察結果も固定されず、後の出来事を何でも一致にできます。確認可能な主張は対象、結果、期限、判定規則を結果前に定め、起きなければ誤りとなる余地を残します。", "「何を変えたいか」は内省の質問ですが、「掌線から三か月以内に転職する」は事実予測で、完全なデータと失敗記録による検証が必要です。"] },
    { heading: "七つの証拠チェック", paragraphs: ["具体性、反証可能性、基準率、別の説明、情報源の質、事前登録、独立再現を確認します。基準率は手相なしでも出来事が起こる頻度、別の説明は一般文、事前情報、成功だけの報告などです。", "見た目や肩書だけでなく、方法、標本、全結果、利益相反、他者の再現を見ます。一件の体験談は研究課題にはなっても全体精度を示しません。"] },
    { heading: "中立なテスト例", paragraphs: ["手から内向性を判断できるという主張なら、評価法を先に定義し、匿名画像を集め、背景情報を隠し、定義済みの基準や対照と比較して全結果を公開します。", "一度偶然以上でも標本数、分析選択、独立再現が必要です。証拠不足なら「まだ分からない」が最も正確です。"], bullets: ["結果・期間・対象は事前に具体的か。", "何が起きれば誤りになるか。", "方法なしの成功率はどれほどか。", "手掛かり、曖昧文、選択報告ではないか。", "方法・全結果・独立検証が見えるか。"] },
    { heading: "判断の重さに合わせる", paragraphs: ["娯楽の問いは自由に無視できますが、健康、法律、お金、仕事、関係の安全には公的情報、必要な専門家、観察可能な行動、公正な手続きを使います。", "文化を尊重しながら、歴史記録、個人の信念、独立した人が再現できる証拠を明確に分けて検討することができます。"] },
  ] },
  ko: { title: "손금과 점술 주장을 평가하는 방법", summary: "무엇을 예측하는지, 틀릴 조건, 비교 대상과 독립 재현을 일곱 가지 질문으로 확인합니다.", sections: [
    { heading: "검사 가능한 주장 만들기", paragraphs: ["‘곧 변화가 온다’는 기간과 관찰 결과가 없어 어떤 일도 사후 일치로 만들 수 있습니다. 검사 가능한 주장은 대상, 결과, 기간과 판정 규칙을 결과 전에 정하고 일어나지 않으면 틀렸다고 할 여지를 둡니다.", "‘무엇을 바꾸고 싶은가’는 성찰 질문이지만 ‘손금이 석 달 안 이직을 말한다’는 사실 예측이므로 전체 자료와 실패 기록으로 검증해야 합니다."] },
    { heading: "일곱 가지 증거 점검", paragraphs: ["구체성, 반증 가능성, 기저율, 대안 설명, 출처의 질, 사전 등록과 독립 재현을 봅니다. 기저율은 손금 없이도 사건이 얼마나 일어나는지, 대안은 일반 문장, 미리 얻은 정보, 성공만 보고하는 경우입니다.", "멋진 화면이나 직함보다 방법, 표본, 전체 결과, 이해관계와 다른 연구자의 재현을 확인하세요. 한 사람의 경험담은 질문을 제시하지만 전체 정확도를 계산하지 못합니다."] },
    { heading: "중립적인 시험 예", paragraphs: ["손으로 내향성을 맞힌다는 주장이라면 평가법을 먼저 정하고 익명 이미지를 모아 배경 정보를 차단하며 정의된 기준이나 대조와 비교하고 모든 결과를 공개할 수 있습니다.", "한 번 우연보다 높아도 표본 크기, 분석 선택과 독립 반복을 봐야 합니다. 증거가 부족하면 ‘아직 모른다’가 정직한 결론입니다."], bullets: ["결과·기간·대상을 미리 구체화했나?", "무엇이 틀린 결과인가?", "방법 없이 맞힐 기저율은?", "단서·모호한 문장·선택 보고 가능성은?", "방법·전체 결과·독립 검증이 공개됐나?"] },
    { heading: "결정 위험에 맞추기", paragraphs: ["오락 질문은 무시할 수 있지만 건강, 법, 돈, 고용과 관계 안전에는 권위 있는 정보, 필요한 전문가, 관찰 가능한 행동과 공정한 절차가 필요합니다.", "문화를 존중하면서 역사 기록, 개인 믿음과 재현 가능한 증거를 분리할 수 있습니다."] },
  ] },
  es: { title: "Cómo evaluar afirmaciones de quiromancia", summary: "Usa siete preguntas repetibles: qué predice, cómo podría fallar, con qué se compara y si la evidencia se reproduce de forma independiente.", sections: [
    { heading: "Convertir una frase en comprobable", paragraphs: ["‘Pronto habrá un cambio’ no fija plazo ni resultado, así que cualquier evento puede contarse después. Una afirmación comprobable define sujeto, resultado, plazo y regla antes de conocer datos y permite concluir que fue errónea.", "‘¿Qué quiero cambiar?’ es reflexión. ‘La palma dice que cambiarás de empleo en tres meses’ es predicción factual y debe afrontar datos completos y fallos registrados."] },
    { heading: "Siete controles de evidencia", paragraphs: ["Revisa especificidad, falsabilidad, tasa base, explicaciones alternativas, calidad de fuente, registro previo y replicación independiente. La tasa base pregunta cuántas veces ocurre sin quiromancia; las alternativas incluyen adivinar, frases generales, pistas previas y ocultar fallos.", "Mira método, muestra, resultados completos, conflictos y reproducción por otros, no solo diseño o título. Un testimonio propone una pregunta, pero no estima precisión total."] },
    { heading: "Ejemplo neutral", paragraphs: ["Para afirmar que una palma identifica introversión, define primero la evaluación, usa imágenes anónimas, oculta antecedentes, compara con una referencia o control y publica todos los resultados.", "Un resultado superior al azar aún exige revisar muestra, análisis y repetición independiente. Sin evidencia suficiente, ‘no lo sabemos’ es la conclusión honesta."], bullets: ["¿Resultado, plazo y población definidos?", "¿Qué contaría como error?", "¿Cuál es la tasa base sin el método?", "¿Pistas, vaguedad o selección de éxitos?", "¿Método, resultados completos y réplica visibles?"] },
    { heading: "Ajustar evidencia a la decisión", paragraphs: ["Una pregunta de entretenimiento puede ignorarse. Salud, ley, dinero, empleo y seguridad de relaciones requieren información autorizada, profesionales cuando corresponda, conducta observable y procesos justos.", "Respetar una cultura permite distinguir registros históricos, creencias personales y evidencia reproducible sin aceptar toda causalidad."] },
  ] },
  "pt-BR": { title: "Como avaliar afirmações de quiromancia", summary: "Use sete perguntas repetíveis: o que prevê, como poderia falhar, qual comparação importa e se a evidência é reproduzida de forma independente.", sections: [
    { heading: "Transformar a frase em verificável", paragraphs: ["‘Uma mudança virá em breve’ não fixa prazo nem resultado, então qualquer evento pode virar acerto depois. Uma afirmação verificável define pessoa, resultado, prazo e regra antes dos dados e permite concluir que estava errada.", "‘O que quero mudar?’ é reflexão. ‘A palma diz que você mudará de emprego em três meses’ é previsão factual e deve enfrentar dados completos e falhas registradas."] },
    { heading: "Sete verificações de evidência", paragraphs: ["Confira especificidade, falseabilidade, taxa de base, explicações alternativas, qualidade da fonte, registro prévio e replicação independente. A taxa de base pergunta quantas vezes ocorre sem quiromancia; alternativas incluem palpite, frases gerais, pistas e ocultar falhas.", "Veja método, amostra, resultados completos, conflitos e reprodução por outros, não apenas design ou título. Um depoimento sugere pergunta, mas não estima precisão total."] },
    { heading: "Exemplo neutro", paragraphs: ["Para afirmar que uma palma identifica introversão, defina a avaliação primeiro, use imagens anônimas, esconda antecedentes, compare com referência ou controle e publique todos os resultados.", "Um resultado acima do acaso ainda exige revisar amostra, análise e repetição independente. Sem evidência suficiente, ‘não sabemos’ é a conclusão honesta."], bullets: ["Resultado, prazo e população definidos?", "O que contaria como erro?", "Qual a taxa de base sem o método?", "Pistas, vagueza ou seleção de acertos?", "Método, resultados completos e réplica visíveis?"] },
    { heading: "Adequar evidência à decisão", paragraphs: ["Uma pergunta de entretenimento pode ser ignorada. Saúde, lei, dinheiro, emprego e segurança de relações exigem informação oficial, profissionais quando necessário, conduta observável e processos justos.", "Respeitar uma cultura permite separar registros históricos, crenças pessoais e evidência reproduzível sem aceitar toda causalidade."] },
  ] },
  fr: { title: "Comment évaluer les affirmations de chiromancie", summary: "Utilisez sept questions reproductibles : que prédit-on, comment l’affirmation peut échouer, quelle comparaison compte et les preuves sont-elles reproduites ?", sections: [
    { heading: "Rendre une affirmation vérifiable", paragraphs: ["« Un changement arrive bientôt » ne fixe ni délai ni résultat ; tout événement peut devenir un accord après coup. Une affirmation vérifiable définit sujet, résultat, délai et règle avant les données, et laisse la possibilité d’être fausse.", "« Que voudrais-je changer ? » est une réflexion. « Votre paume annonce un nouvel emploi sous trois mois » est une prédiction factuelle qui doit affronter données complètes et échecs enregistrés."] },
    { heading: "Sept contrôles de preuve", paragraphs: ["Vérifiez précision, réfutabilité, taux de base, autres explications, qualité de source, enregistrement préalable et réplication indépendante. Le taux de base demande la fréquence sans chiromancie ; les alternatives incluent hasard, prose générale, indices préalables et succès sélectionnés.", "Examinez méthode, échantillon, résultats complets, conflits et reproduction par autrui, pas seulement apparence ou titre. Un témoignage propose une question mais n’estime pas la précision globale."] },
    { heading: "Exemple neutre", paragraphs: ["Pour prétendre reconnaître l’introversion sur une paume, définissez l’évaluation, utilisez des images anonymes, masquez le contexte, comparez à une référence ou un contrôle et publiez tous les résultats.", "Un résultat supérieur au hasard exige encore examen de l’échantillon, des analyses et réplication indépendante. Sans preuves suffisantes, « nous ne savons pas » est la conclusion honnête."], bullets: ["Résultat, délai et population fixés ?", "Qu’est-ce qui compterait comme erreur ?", "Quel taux de base sans méthode ?", "Indices, flou ou sélection de succès ?", "Méthode, résultats complets et réplication visibles ?"] },
    { heading: "Adapter la preuve à la décision", paragraphs: ["Une question de divertissement peut être ignorée. Santé, droit, argent, emploi et sécurité relationnelle exigent informations officielles, professionnels si nécessaire, comportements observables et procédures équitables.", "Respecter une culture permet de distinguer archives historiques, croyances personnelles et preuves reproductibles sans accepter toute causalité. "] },
  ] },
};

export const NEW_GUIDE_CONTENT: Record<
  NewGuidePath,
  Record<Locale, EditorialPage>
> = {
  "/guides/hand-landmark-atlas": Object.fromEntries(
    Object.entries(atlas).map(([locale, copy]) => [locale, page(copy, landmarkSources)]),
  ) as Record<Locale, EditorialPage>,
  "/guides/creases-vs-landmarks": Object.fromEntries(
    Object.entries(creases).map(([locale, copy]) => [locale, page(copy, creaseSources)]),
  ) as Record<Locale, EditorialPage>,
  "/guides/barnum-effect-lab": Object.fromEntries(
    Object.entries(barnum).map(([locale, copy]) => [locale, page(copy, barnumSources)]),
  ) as Record<Locale, EditorialPage>,
  "/guides/evaluating-palmistry-claims": Object.fromEntries(
    Object.entries(evaluation).map(([locale, copy]) => [locale, page(copy, evaluationSources)]),
  ) as Record<Locale, EditorialPage>,
};
