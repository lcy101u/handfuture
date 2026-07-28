import type { Locale } from "./locales";

export type LanguageCatalog = Record<string, string>;

export interface LanguageOption {
  code: Locale;
  name: string;
  shortLabel: string;
}

export const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  { code: "zh-TW", name: "繁體中文", shortLabel: "繁中" },
  { code: "zh-CN", name: "简体中文", shortLabel: "简中" },
  { code: "en", name: "English", shortLabel: "EN" },
  { code: "ja", name: "日本語", shortLabel: "日" },
  { code: "ko", name: "한국어", shortLabel: "한" },
  { code: "es", name: "Español", shortLabel: "ES" },
  { code: "pt-BR", name: "Português (Brasil)", shortLabel: "PT" },
  { code: "fr", name: "Français", shortLabel: "FR" },
];

export const catalogs: Record<Locale, LanguageCatalog> = {
  "zh-TW": {
    "app.title": "HandFuture",
    "app.subtitle": "手相文化探索與手部偵測",
    "nav.home": "首頁", "nav.about": "關於", "nav.privacy": "隱私政策", "nav.terms": "使用條款", "language.switch": "切換語言",
    "hero.title": "從一張手部照片，開始一段文化探索",
    "hero.description": "照片會在你的瀏覽器內進行手部關節偵測；結果是一張用於文化探索與自我反思的非科學娛樂提示卡。",
    "disclaimer.prompt": "開始分析前請先閱讀並同意免責聲明。", "button.viewDisclaimer": "閱讀免責聲明",
    "tool.uploadTitle": "選擇手部照片", "tool.uploadDescription": "請使用單純背景，讓一隻手完整出現在畫面中。", "tool.previewTitle": "手部關節偵測", "tool.previewDescription": "偵測成功後，你可以主動選擇一張反思卡。", "tool.reset": "更換照片", "tool.choose": "選擇反思卡",
    "upload.drag": "拖放照片至此處，或點擊選擇檔案", "upload.formats": "支援 JPG、PNG、WebP 格式", "upload.open_camera": "開啟相機", "upload.select_file": "選擇檔案", "upload.tip1": "讓一隻手完整出現在畫面中", "upload.tip2": "使用均勻且充足的光線", "upload.tip3": "選擇單純背景並避免模糊",
    "home.feature.browser.title": "瀏覽器內偵測", "home.feature.browser.description": "模型定位 21 個手部關節，不會辨識或解讀掌褶。", "home.feature.reflection.title": "文化反思卡", "home.feature.reflection.description": "偵測成功後，由你主動選擇固定題庫中的一張非科學反思提示。", "home.feature.privacy.title": "照片不會上傳", "home.feature.privacy.description": "照片只由這項功能在目前的瀏覽器工作階段處理。",
    "home.continue.title": "繼續閱讀", "guide.basics.title": "手相文化入門", "guide.basics.summary": "從文化與歷史脈絡認識手相傳統的常見名稱。", "guide.science.title": "科學與限制", "guide.science.summary": "了解手部關節偵測能做什麼，以及手相缺乏哪些科學證據。", "guide.photo.title": "手部照片指南", "guide.photo.summary": "用光線、背景與取景提高瀏覽器偵測成功率。",
    "faq.title": "常見問題", "faq.detected.q": "這項工具會偵測什麼？", "faq.detected.a": "它只定位一隻手的 21 個關節座標，不會讀取掌褶。", "faq.scientific.q": "反思卡是科學結果嗎？", "faq.scientific.a": "不是。反思卡是非科學的文化娛樂與自我反思提示。", "faq.upload.q": "照片會上傳嗎？", "faq.upload.a": "不會。這項功能只在目前的瀏覽器工作階段處理照片。", "faq.decisions.q": "我應該依照結果做決定嗎？", "faq.decisions.a": "不應該。請勿用反思卡取代可靠資訊或合格專業意見。",
    "footer.explore": "探索", "footer.guides": "指南", "footer.project": "網站資訊", "footer.howItWorks": "運作方式",
    "theme.light": "淺色模式", "theme.dark": "深色模式", "theme.system": "跟隨系統", "theme.toggle": "切換主題",
  },
  "zh-CN": {
    "app.title": "HandFuture", "app.subtitle": "手相文化探索与手部检测",
    "nav.home": "首页", "nav.about": "关于", "nav.privacy": "隐私政策", "nav.terms": "使用条款", "language.switch": "切换语言",
    "hero.title": "从一张手部照片，开始一段文化探索", "hero.description": "照片会在你的浏览器内进行手部关节检测；结果是一张用于文化探索与自我反思的非科学娱乐提示卡。",
    "disclaimer.prompt": "开始分析前请先阅读并同意免责声明。", "button.viewDisclaimer": "阅读免责声明",
    "tool.uploadTitle": "选择手部照片", "tool.uploadDescription": "请使用简单背景，让一只手完整出现在画面中。", "tool.previewTitle": "手部关节检测", "tool.previewDescription": "检测成功后，你可以主动选择一张反思卡。", "tool.reset": "更换照片", "tool.choose": "选择反思卡",
    "upload.drag": "将照片拖放到此处，或点击选择文件", "upload.formats": "支持 JPG、PNG 和 WebP 格式", "upload.open_camera": "打开相机", "upload.select_file": "选择文件", "upload.tip1": "让一只手完整出现在画面中", "upload.tip2": "使用均匀且充足的光线", "upload.tip3": "选择简单背景并避免模糊",
    "home.feature.browser.title": "浏览器内检测", "home.feature.browser.description": "模型定位 21 个手部关节，不会识别或解读掌纹。", "home.feature.reflection.title": "文化反思卡", "home.feature.reflection.description": "检测成功后，由你主动从固定题库中选择一张非科学反思提示。", "home.feature.privacy.title": "照片不会上传", "home.feature.privacy.description": "照片只会由此功能在当前浏览器会话中处理。",
    "home.continue.title": "继续阅读", "guide.basics.title": "手相文化入门", "guide.basics.summary": "从文化与历史脉络认识手相传统的常见名称。", "guide.science.title": "科学与局限", "guide.science.summary": "了解手部关节检测能做什么，以及手相缺少哪些科学证据。", "guide.photo.title": "手部照片指南", "guide.photo.summary": "通过光线、背景与取景提高浏览器检测成功率。",
    "faq.title": "常见问题", "faq.detected.q": "这项工具会检测什么？", "faq.detected.a": "它只定位一只手的 21 个关节坐标，不会读取掌纹。", "faq.scientific.q": "反思卡是科学结果吗？", "faq.scientific.a": "不是。反思卡是非科学的文化娱乐与自我反思提示。", "faq.upload.q": "照片会上传吗？", "faq.upload.a": "不会。此功能只在当前浏览器会话中处理照片。", "faq.decisions.q": "我应该依照结果做决定吗？", "faq.decisions.a": "不应该。请勿用反思卡取代可靠信息或合格专业人士的建议。",
    "footer.explore": "探索", "footer.guides": "指南", "footer.project": "网站信息", "footer.howItWorks": "运作方式",
    "theme.light": "浅色模式", "theme.dark": "深色模式", "theme.system": "跟随系统", "theme.toggle": "切换主题",
  },
  en: {
    "app.title": "HandFuture", "app.subtitle": "Palmistry culture and hand detection",
    "nav.home": "Home", "nav.about": "About", "nav.privacy": "Privacy", "nav.terms": "Terms", "language.switch": "Switch language",
    "hero.title": "Start a cultural exploration with one hand photo", "hero.description": "Your photo is used for hand-joint detection in your browser. The result is a non-scientific entertainment prompt for cultural exploration and self-reflection.",
    "disclaimer.prompt": "Please review and accept the disclaimer before starting an analysis.", "button.viewDisclaimer": "View Disclaimer",
    "tool.uploadTitle": "Choose a hand photo", "tool.uploadDescription": "Use a plain background and keep one full hand visible in the frame.", "tool.previewTitle": "Hand-joint detection", "tool.previewDescription": "After detection succeeds, you can explicitly choose a reflection card.", "tool.reset": "Choose another photo", "tool.choose": "Choose reflection card",
    "upload.drag": "Drop a photo here, or click to choose a file", "upload.formats": "Supports JPG, PNG, and WebP", "upload.open_camera": "Open Camera", "upload.select_file": "Select File", "upload.tip1": "Keep one full hand visible in the frame", "upload.tip2": "Use bright, even lighting", "upload.tip3": "Choose a plain background and avoid blur",
    "home.feature.browser.title": "In-browser detection", "home.feature.browser.description": "The model locates 21 hand joints; it does not identify or interpret palm creases.", "home.feature.reflection.title": "Cultural reflection card", "home.feature.reflection.description": "After successful detection, you explicitly select one non-scientific prompt from a fixed set.", "home.feature.privacy.title": "Photo stays on your device", "home.feature.privacy.description": "This feature processes the photo only in the current browser session.",
    "home.continue.title": "Continue reading", "guide.basics.title": "Palmistry as culture", "guide.basics.summary": "Meet common palmistry terms in their cultural and historical context.", "guide.science.title": "Science and limitations", "guide.science.summary": "Learn what hand-joint detection can do and what scientific evidence palmistry lacks.", "guide.photo.title": "Hand photo guide", "guide.photo.summary": "Use lighting, background, and framing to improve browser detection.",
    "faq.title": "Frequently asked questions", "faq.detected.q": "What does this tool detect?", "faq.detected.a": "It locates only 21 joint coordinates on one hand; it does not read palm creases.", "faq.scientific.q": "Is the reflection card scientific?", "faq.scientific.a": "No. It is a non-scientific prompt for cultural entertainment and self-reflection.", "faq.upload.q": "Is my photo uploaded?", "faq.upload.a": "No. This feature processes it only in the current browser session.", "faq.decisions.q": "Should the result guide my decisions?", "faq.decisions.a": "No. Do not use a reflection card in place of reliable information or qualified professional advice.",
    "footer.explore": "Explore", "footer.guides": "Guides", "footer.project": "Project", "footer.howItWorks": "How it works",
    "theme.light": "Light Mode", "theme.dark": "Dark Mode", "theme.system": "System", "theme.toggle": "Toggle Theme",
  },
  ja: {
    "app.title": "HandFuture", "app.subtitle": "手相文化の探究と手の検出",
    "nav.home": "ホーム", "nav.about": "概要", "nav.privacy": "プライバシー", "nav.terms": "利用規約", "language.switch": "言語を切り替える",
    "hero.title": "一枚の手の写真から、文化の探究を始めましょう", "hero.description": "写真はブラウザー内で手の関節を検出するために使われます。結果は、文化の探究と自己省察のための非科学的な娯楽用プロンプトカードです。",
    "disclaimer.prompt": "分析を始める前に、免責事項を確認して同意してください。", "button.viewDisclaimer": "免責事項を読む",
    "tool.uploadTitle": "手の写真を選択", "tool.uploadDescription": "無地の背景を使い、片手全体がフレームに入るようにしてください。", "tool.previewTitle": "手の関節検出", "tool.previewDescription": "検出に成功した後、リフレクションカードを自分で選べます。", "tool.reset": "別の写真を選ぶ", "tool.choose": "リフレクションカードを選ぶ",
    "upload.drag": "ここに写真をドロップするか、クリックしてファイルを選択", "upload.formats": "JPG、PNG、WebP に対応", "upload.open_camera": "カメラを開く", "upload.select_file": "ファイルを選択", "upload.tip1": "片手全体をフレームに入れる", "upload.tip2": "明るく均一な照明を使う", "upload.tip3": "無地の背景を選び、ぼやけを避ける",
    "home.feature.browser.title": "ブラウザー内検出", "home.feature.browser.description": "モデルは手の21個の関節を検出します。手相線を識別・解釈することはありません。", "home.feature.reflection.title": "文化的リフレクションカード", "home.feature.reflection.description": "検出成功後、固定セットから非科学的なプロンプトを一枚、自分で選びます。", "home.feature.privacy.title": "写真は端末から送信されません", "home.feature.privacy.description": "この機能は現在のブラウザーセッション内でのみ写真を処理します。",
    "home.continue.title": "続きを読む", "guide.basics.title": "文化としての手相入門", "guide.basics.summary": "文化的・歴史的な文脈で、手相の一般的な用語を知りましょう。", "guide.science.title": "科学と限界", "guide.science.summary": "手の関節検出でできることと、手相に欠けている科学的根拠を学びます。", "guide.photo.title": "手の写真ガイド", "guide.photo.summary": "照明、背景、構図を工夫してブラウザー検出の成功率を高めましょう。",
    "faq.title": "よくある質問", "faq.detected.q": "このツールは何を検出しますか？", "faq.detected.a": "片手の21個の関節座標のみを検出し、手相線は読み取りません。", "faq.scientific.q": "リフレクションカードは科学的な結果ですか？", "faq.scientific.a": "いいえ。文化的な娯楽と自己省察のための非科学的なプロンプトです。", "faq.upload.q": "写真はアップロードされますか？", "faq.upload.a": "いいえ。この機能は現在のブラウザーセッション内でのみ写真を処理します。", "faq.decisions.q": "結果を意思決定の参考にすべきですか？", "faq.decisions.a": "いいえ。リフレクションカードを信頼できる情報や有資格の専門家の助言の代わりに使わないでください。",
    "footer.explore": "探究", "footer.guides": "ガイド", "footer.project": "プロジェクト", "footer.howItWorks": "仕組み",
    "theme.light": "ライトモード", "theme.dark": "ダークモード", "theme.system": "システム設定", "theme.toggle": "テーマを切り替える",
  },
  ko: {
    "app.title": "HandFuture", "app.subtitle": "손금 문화 탐구와 손 감지",
    "nav.home": "홈", "nav.about": "소개", "nav.privacy": "개인정보 처리방침", "nav.terms": "이용 약관", "language.switch": "언어 전환",
    "hero.title": "손 사진 한 장으로 문화 탐구를 시작하세요", "hero.description": "사진은 브라우저에서 손 관절을 감지하는 데 사용됩니다. 결과는 문화 탐구와 자기 성찰을 위한 비과학적 오락용 프롬프트 카드입니다.",
    "disclaimer.prompt": "분석을 시작하기 전에 면책 조항을 읽고 동의해 주세요.", "button.viewDisclaimer": "면책 조항 보기",
    "tool.uploadTitle": "손 사진 선택", "tool.uploadDescription": "단순한 배경을 사용하고 한 손 전체가 프레임 안에 보이게 해 주세요.", "tool.previewTitle": "손 관절 감지", "tool.previewDescription": "감지에 성공하면 성찰 카드를 직접 선택할 수 있습니다.", "tool.reset": "다른 사진 선택", "tool.choose": "성찰 카드 선택",
    "upload.drag": "사진을 이곳에 놓거나 클릭하여 파일 선택", "upload.formats": "JPG, PNG, WebP 지원", "upload.open_camera": "카메라 열기", "upload.select_file": "파일 선택", "upload.tip1": "한 손 전체가 프레임에 보이게 하기", "upload.tip2": "밝고 고른 조명 사용", "upload.tip3": "단순한 배경을 선택하고 흐림 피하기",
    "home.feature.browser.title": "브라우저 내 감지", "home.feature.browser.description": "모델은 손의 21개 관절을 찾으며 손금 선을 식별하거나 해석하지 않습니다.", "home.feature.reflection.title": "문화 성찰 카드", "home.feature.reflection.description": "감지에 성공한 뒤 고정된 목록에서 비과학적 프롬프트 하나를 직접 선택합니다.", "home.feature.privacy.title": "사진은 기기를 떠나지 않습니다", "home.feature.privacy.description": "이 기능은 현재 브라우저 세션에서만 사진을 처리합니다.",
    "home.continue.title": "계속 읽기", "guide.basics.title": "문화로서의 손금 입문", "guide.basics.summary": "문화적·역사적 맥락에서 손금 전통의 일반적인 용어를 알아보세요.", "guide.science.title": "과학과 한계", "guide.science.summary": "손 관절 감지가 할 수 있는 일과 손금에 과학적 근거가 부족한 점을 알아보세요.", "guide.photo.title": "손 사진 가이드", "guide.photo.summary": "조명, 배경, 구도를 활용해 브라우저 감지 성공률을 높이세요.",
    "faq.title": "자주 묻는 질문", "faq.detected.q": "이 도구는 무엇을 감지하나요?", "faq.detected.a": "한 손의 21개 관절 좌표만 찾으며 손금 선을 읽지 않습니다.", "faq.scientific.q": "성찰 카드는 과학적인 결과인가요?", "faq.scientific.a": "아니요. 문화적 오락과 자기 성찰을 위한 비과학적 프롬프트입니다.", "faq.upload.q": "사진이 업로드되나요?", "faq.upload.a": "아니요. 이 기능은 현재 브라우저 세션에서만 사진을 처리합니다.", "faq.decisions.q": "결과에 따라 결정을 내려야 하나요?", "faq.decisions.a": "아니요. 성찰 카드를 신뢰할 수 있는 정보나 자격을 갖춘 전문가의 조언 대신 사용하지 마세요.",
    "footer.explore": "탐구", "footer.guides": "가이드", "footer.project": "프로젝트", "footer.howItWorks": "작동 방식",
    "theme.light": "라이트 모드", "theme.dark": "다크 모드", "theme.system": "시스템 설정", "theme.toggle": "테마 전환",
  },
  es: {
    "app.title": "HandFuture", "app.subtitle": "Cultura de la quiromancia y detección de manos",
    "nav.home": "Inicio", "nav.about": "Acerca de", "nav.privacy": "Privacidad", "nav.terms": "Términos", "language.switch": "Cambiar idioma",
    "hero.title": "Empieza una exploración cultural con una foto de una mano", "hero.description": "Tu foto se usa en el navegador para detectar articulaciones de la mano. El resultado es una tarjeta de sugerencias de entretenimiento no científico para la exploración cultural y la autorreflexión.",
    "disclaimer.prompt": "Revisa y acepta el descargo de responsabilidad antes de iniciar un análisis.", "button.viewDisclaimer": "Ver descargo de responsabilidad",
    "tool.uploadTitle": "Elige una foto de una mano", "tool.uploadDescription": "Usa un fondo liso y mantén una mano completa visible en el encuadre.", "tool.previewTitle": "Detección de articulaciones de la mano", "tool.previewDescription": "Cuando la detección tenga éxito, podrás elegir explícitamente una tarjeta de reflexión.", "tool.reset": "Elegir otra foto", "tool.choose": "Elegir tarjeta de reflexión",
    "upload.drag": "Suelta una foto aquí o haz clic para elegir un archivo", "upload.formats": "Compatible con JPG, PNG y WebP", "upload.open_camera": "Abrir cámara", "upload.select_file": "Seleccionar archivo", "upload.tip1": "Mantén una mano completa visible en el encuadre", "upload.tip2": "Usa una iluminación brillante y uniforme", "upload.tip3": "Elige un fondo liso y evita el desenfoque",
    "home.feature.browser.title": "Detección en el navegador", "home.feature.browser.description": "El modelo localiza 21 articulaciones de la mano; no identifica ni interpreta líneas de la palma.", "home.feature.reflection.title": "Tarjeta de reflexión cultural", "home.feature.reflection.description": "Tras una detección correcta, eliges explícitamente una sugerencia no científica de un conjunto fijo.", "home.feature.privacy.title": "La foto permanece en tu dispositivo", "home.feature.privacy.description": "Esta función procesa la foto solo en la sesión actual del navegador.",
    "home.continue.title": "Seguir leyendo", "guide.basics.title": "La quiromancia como cultura", "guide.basics.summary": "Conoce términos comunes de la quiromancia en su contexto cultural e histórico.", "guide.science.title": "Ciencia y limitaciones", "guide.science.summary": "Descubre qué puede hacer la detección de articulaciones de la mano y qué evidencia científica le falta a la quiromancia.", "guide.photo.title": "Guía para fotos de manos", "guide.photo.summary": "Usa la iluminación, el fondo y el encuadre para mejorar la detección en el navegador.",
    "faq.title": "Preguntas frecuentes", "faq.detected.q": "¿Qué detecta esta herramienta?", "faq.detected.a": "Solo localiza las coordenadas de 21 articulaciones de una mano; no lee las líneas de la palma.", "faq.scientific.q": "¿La tarjeta de reflexión es científica?", "faq.scientific.a": "No. Es una sugerencia no científica para el entretenimiento cultural y la autorreflexión.", "faq.upload.q": "¿Se sube mi foto?", "faq.upload.a": "No. Esta función la procesa solo en la sesión actual del navegador.", "faq.decisions.q": "¿Debo usar el resultado para tomar decisiones?", "faq.decisions.a": "No. No uses una tarjeta de reflexión en lugar de información fiable o el consejo de profesionales cualificados.",
    "footer.explore": "Explorar", "footer.guides": "Guías", "footer.project": "Proyecto", "footer.howItWorks": "Cómo funciona",
    "theme.light": "Modo claro", "theme.dark": "Modo oscuro", "theme.system": "Sistema", "theme.toggle": "Cambiar tema",
  },
  "pt-BR": {
    "app.title": "HandFuture", "app.subtitle": "Cultura da quiromancia e detecção de mãos",
    "nav.home": "Início", "nav.about": "Sobre", "nav.privacy": "Privacidade", "nav.terms": "Termos", "language.switch": "Trocar idioma",
    "hero.title": "Comece uma exploração cultural com uma foto de uma mão", "hero.description": "Sua foto é usada no navegador para detectar articulações da mão. O resultado é um cartão de sugestão de entretenimento não científico para exploração cultural e autorreflexão.",
    "disclaimer.prompt": "Leia e aceite o aviso de isenção antes de iniciar uma análise.", "button.viewDisclaimer": "Ver aviso de isenção",
    "tool.uploadTitle": "Escolha uma foto de uma mão", "tool.uploadDescription": "Use um fundo simples e mantenha uma mão inteira visível no enquadramento.", "tool.previewTitle": "Detecção de articulações da mão", "tool.previewDescription": "Depois que a detecção for bem-sucedida, você poderá escolher explicitamente um cartão de reflexão.", "tool.reset": "Escolher outra foto", "tool.choose": "Escolher cartão de reflexão",
    "upload.drag": "Solte uma foto aqui ou clique para escolher um arquivo", "upload.formats": "Compatível com JPG, PNG e WebP", "upload.open_camera": "Abrir câmera", "upload.select_file": "Selecionar arquivo", "upload.tip1": "Mantenha uma mão inteira visível no enquadramento", "upload.tip2": "Use iluminação clara e uniforme", "upload.tip3": "Escolha um fundo simples e evite desfoque",
    "home.feature.browser.title": "Detecção no navegador", "home.feature.browser.description": "O modelo localiza 21 articulações da mão; não identifica nem interpreta linhas da palma.", "home.feature.reflection.title": "Cartão de reflexão cultural", "home.feature.reflection.description": "Após uma detecção bem-sucedida, você escolhe explicitamente uma sugestão não científica de um conjunto fixo.", "home.feature.privacy.title": "A foto permanece no seu dispositivo", "home.feature.privacy.description": "Este recurso processa a foto apenas na sessão atual do navegador.",
    "home.continue.title": "Continuar lendo", "guide.basics.title": "Quiromancia como cultura", "guide.basics.summary": "Conheça termos comuns da quiromancia em seu contexto cultural e histórico.", "guide.science.title": "Ciência e limitações", "guide.science.summary": "Saiba o que a detecção de articulações da mão pode fazer e quais evidências científicas faltam à quiromancia.", "guide.photo.title": "Guia de fotos de mãos", "guide.photo.summary": "Use iluminação, fundo e enquadramento para melhorar a detecção no navegador.",
    "faq.title": "Perguntas frequentes", "faq.detected.q": "O que esta ferramenta detecta?", "faq.detected.a": "Ela localiza apenas as coordenadas de 21 articulações de uma mão; não lê linhas da palma.", "faq.scientific.q": "O cartão de reflexão é científico?", "faq.scientific.a": "Não. É uma sugestão não científica para entretenimento cultural e autorreflexão.", "faq.upload.q": "Minha foto é enviada?", "faq.upload.a": "Não. Este recurso a processa apenas na sessão atual do navegador.", "faq.decisions.q": "Devo orientar minhas decisões pelo resultado?", "faq.decisions.a": "Não. Não use um cartão de reflexão no lugar de informações confiáveis ou aconselhamento profissional qualificado.",
    "footer.explore": "Explorar", "footer.guides": "Guias", "footer.project": "Projeto", "footer.howItWorks": "Como funciona",
    "theme.light": "Modo claro", "theme.dark": "Modo escuro", "theme.system": "Sistema", "theme.toggle": "Alternar tema",
  },
  fr: {
    "app.title": "HandFuture", "app.subtitle": "Culture de la chiromancie et détection de la main",
    "nav.home": "Accueil", "nav.about": "À propos", "nav.privacy": "Confidentialité", "nav.terms": "Conditions", "language.switch": "Changer de langue",
    "hero.title": "Commencez une exploration culturelle avec une photo de main", "hero.description": "Votre photo est utilisée dans votre navigateur pour détecter les articulations de la main. Le résultat est une carte d'invite de divertissement non scientifique pour l'exploration culturelle et l'autoréflexion.",
    "disclaimer.prompt": "Veuillez lire et accepter l'avertissement avant de commencer une analyse.", "button.viewDisclaimer": "Voir l'avertissement",
    "tool.uploadTitle": "Choisir une photo de main", "tool.uploadDescription": "Utilisez un arrière-plan uni et gardez une main entière visible dans le cadre.", "tool.previewTitle": "Détection des articulations de la main", "tool.previewDescription": "Une fois la détection réussie, vous pouvez choisir explicitement une carte de réflexion.", "tool.reset": "Choisir une autre photo", "tool.choose": "Choisir une carte de réflexion",
    "upload.drag": "Déposez une photo ici ou cliquez pour choisir un fichier", "upload.formats": "Compatible avec JPG, PNG et WebP", "upload.open_camera": "Ouvrir l'appareil photo", "upload.select_file": "Sélectionner un fichier", "upload.tip1": "Gardez une main entière visible dans le cadre", "upload.tip2": "Utilisez un éclairage clair et homogène", "upload.tip3": "Choisissez un arrière-plan uni et évitez le flou",
    "home.feature.browser.title": "Détection dans le navigateur", "home.feature.browser.description": "Le modèle localise 21 articulations de la main ; il n'identifie ni n'interprète les lignes de la paume.", "home.feature.reflection.title": "Carte de réflexion culturelle", "home.feature.reflection.description": "Après une détection réussie, vous choisissez explicitement une invite non scientifique dans un ensemble fixe.", "home.feature.privacy.title": "La photo reste sur votre appareil", "home.feature.privacy.description": "Cette fonctionnalité traite la photo uniquement dans la session actuelle du navigateur.",
    "home.continue.title": "Continuer la lecture", "guide.basics.title": "La chiromancie comme culture", "guide.basics.summary": "Découvrez les termes courants de la chiromancie dans leur contexte culturel et historique.", "guide.science.title": "Science et limites", "guide.science.summary": "Découvrez ce que peut faire la détection des articulations de la main et quelles preuves scientifiques manquent à la chiromancie.", "guide.photo.title": "Guide des photos de mains", "guide.photo.summary": "Utilisez l'éclairage, l'arrière-plan et le cadrage pour améliorer la détection dans le navigateur.",
    "faq.title": "Questions fréquentes", "faq.detected.q": "Que détecte cet outil ?", "faq.detected.a": "Il localise uniquement les coordonnées de 21 articulations d'une main ; il ne lit pas les lignes de la paume.", "faq.scientific.q": "La carte de réflexion est-elle scientifique ?", "faq.scientific.a": "Non. C'est une invite non scientifique pour le divertissement culturel et l'autoréflexion.", "faq.upload.q": "Ma photo est-elle téléversée ?", "faq.upload.a": "Non. Cette fonctionnalité la traite uniquement dans la session actuelle du navigateur.", "faq.decisions.q": "Le résultat doit-il guider mes décisions ?", "faq.decisions.a": "Non. N'utilisez pas une carte de réflexion à la place d'informations fiables ou des conseils d'un professionnel qualifié.",
    "footer.explore": "Explorer", "footer.guides": "Guides", "footer.project": "Projet", "footer.howItWorks": "Comment ça marche",
    "theme.light": "Mode clair", "theme.dark": "Mode sombre", "theme.system": "Système", "theme.toggle": "Changer de thème",
  },
};

export function getTranslation(locale: Locale, key: string): string {
  return catalogs[locale][key] ?? catalogs.en[key] ?? key;
}
