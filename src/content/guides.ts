import type { GuidePath, Locale } from "@/config/public-routes";

export interface SourceLink {
  label: string;
  url: string;
}

export interface ContentSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface EditorialPage {
  title: string;
  summary: string;
  updatedAt: "2026-07-26";
  sections: ContentSection[];
  sources: SourceLink[];
}

const palmistrySources: SourceLink[] = [
  {
    label: "1911 Encyclopaedia Britannica: Palmistry",
    url: "https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/Palmistry",
  },
  {
    label: "Merriam-Webster: Palmistry",
    url: "https://www.merriam-webster.com/dictionary/palmistry",
  },
];

const scienceSources: SourceLink[] = [
  {
    label: "APA Dictionary of Psychology: Barnum effect",
    url: "https://dictionary.apa.org/barnum-effect",
  },
  {
    label: "MediaPipe Hand Landmarker",
    url: "https://developers.google.com/mediapipe/solutions/vision/hand_landmarker",
  },
];

const implementationSources: SourceLink[] = [
  {
    label: "MediaPipe Hand Landmarker",
    url: "https://developers.google.com/mediapipe/solutions/vision/hand_landmarker",
  },
  {
    label: "MDN FileReader",
    url: "https://developer.mozilla.org/docs/Web/API/FileReader",
  },
];

export const HOW_IT_WORKS_CONTENT: Record<Locale, EditorialPage> = {
  zh: {
    title: "HandFuture 如何運作",
    summary:
      "從選擇照片、定位手部關節到產生反思卡，逐步了解資料如何在目前的瀏覽器工作階段中流動，以及這項工具刻意不做哪些推論。",
    updatedAt: "2026-07-26",
    sections: [
      {
        heading: "選擇照片",
        paragraphs: [
          "上傳器接受 JPEG、PNG 或 WebP，檔案上限為 10MB。請選擇只呈現一隻手的照片；程式會用瀏覽器的 FileReader 將你明確選取的檔案讀成暫時的資料網址，放入目前頁面的應用程式狀態。",
          "HandFuture 沒有接收這張照片的上傳端點。照片不是帳號資料，也不會成為公開內容；選檔只是讓目前的瀏覽器頁面取得可供後續偵測的影像。仍請避免讓臉孔、證件或可辨識的居家環境入鏡。",
        ],
      },
      {
        heading: "尋找手部關節",
        paragraphs: [
          "MediaPipe 會在影像中尋找手部，回傳標準手部關節座標與左右手資訊。HandFuture 會確認只找到一隻手，並確認單一結果包含恰好 21 個有限數值的關節座標，才把它視為可用的偵測結果。",
          "介面會保留原始上傳照片，並以文字顯示偵測狀態；驗證成功後，反思卡按鈕才可供選擇。關節模型不會辨識生命線、智慧線、感情線、命運線或其他掌褶，也不會從照片得到個人特質或人生結論。",
        ],
      },
      {
        heading: "選擇反思卡",
        paragraphs: [
          "偵測成功後，只有在你按下按鈕時，程式才會把正規化座標整理成固定的幾何簽章，再由簽章選出四個一般反思提示之一。相同的正規化座標會得到相同的鍵值，因此它不是每次都改變的隨機抽取。",
          "這個步驟不推論性格、相容性、健康、職涯、財富或未來。卡片只是固定題庫中的開放式問題，設計目的在於文化娛樂與自我對話；幾何簽章只負責穩定選卡，並不是對一個人的衡量。",
        ],
      },
      {
        heading: "清除與了解限制",
        paragraphs: [
          "按下重設會清除應用程式狀態中的照片、偵測結果與反思卡。關閉頁面或重新整理也會清除記憶體中的照片；只有你是否接受過免責聲明這項偏好會保存在本機儲存空間，照片與關節座標不會隨它一起保存。",
          "偵測可能因取景不完整、光線不足、瀏覽器無法解碼檔案，或模型載入時遭到網路與內容阻擋而失敗。沒有找到手、找到多隻手或模型不可用都是限制狀態；調整照片後重試有時有幫助，但任何結果都不代表對掌褶的解讀。",
        ],
      },
    ],
    sources: implementationSources,
  },
  en: {
    title: "How HandFuture works",
    summary:
      "Follow the data from choosing a photo through hand-joint detection and reflection-card selection, including what remains in the current browser session and what the tool deliberately does not infer.",
    updatedAt: "2026-07-26",
    sections: [
      {
        heading: "Choose a photo",
        paragraphs: [
          "The uploader accepts JPEG, PNG, or WebP files up to 10MB. Choose a photo that contains one hand. Browser FileReader reads the file you explicitly select into a temporary data URL and places it in the current page's application state.",
          "There is no HandFuture upload endpoint for this photo. It does not become account data or public content; file selection only makes the image available to the current browser page for detection. You should still keep faces, documents, and identifying surroundings out of the frame.",
        ],
      },
      {
        heading: "Locate hand joints",
        paragraphs: [
          "MediaPipe looks for hands and returns standard hand landmarks plus handedness information. HandFuture first confirms that only one hand was found, then validates that one result contains exactly 21 finite joint coordinates before treating the detection as usable.",
          "The interface keeps the original uploaded photo and reports the detection status in text; after validation succeeds, the reflection-card button becomes available. The landmark model does not identify the life, head, heart, or fate creases, and it supplies no conclusion about the person in the photo.",
        ],
      },
      {
        heading: "Select a reflection card",
        paragraphs: [
          "After successful detection, and only after you press the button, the program turns normalized coordinates into a fixed geometry signature. That signature selects one of four general prompts. Identical normalized coordinates return the same key, so the result is not a fresh random draw on every click.",
          "This step makes no inference about personality, compatibility, health, career, wealth, or future events. A card is an open-ended question from a fixed set for cultural entertainment and personal reflection. Geometry provides a stable selection key; it is not a measurement of a person.",
        ],
      },
      {
        heading: "Clear and understand limits",
        paragraphs: [
          "Reset clears the photo, detection result, and reflection card from application state. Closing or refreshing the page clears the photo from memory. Disclaimer acceptance alone persists in local storage; neither the photo nor landmark coordinates persist with that preference.",
          "Detection can fail because of incomplete framing, poor light, unsupported image decoding, or network and content blocking while the model loads. No-hand, multiple-hand, and unavailable-model results are limitation states. Changing the photo may help, but no detector result amounts to an interpretation of palm creases.",
        ],
      },
    ],
    sources: implementationSources,
  },
};

export const GUIDE_CONTENT: Record<
  GuidePath,
  Record<Locale, EditorialPage>
> = {
  "/guides/palmistry-basics": {
    zh: {
      title: "手相文化入門：傳統名稱與歷史脈絡",
      summary:
        "認識手相作為占卜傳統的定義、不同時代與社群中的差異，以及如何在不把傳統說法當成事實判斷的前提下閱讀常見掌線名稱。",
      updatedAt: "2026-07-26",
      sections: [
        {
          heading: "手相是什麼",
          paragraphs: [
            "手相通常指從手掌線條或手部外觀解讀個性與未來的占卜傳統；字典與歷史資料以「閱讀掌中線條」或 chiromancy 等詞描述這類實踐。這個定義是在說明一種文化活動如何自我定位，不表示其說法已被驗證。",
            "HandFuture 把手相放在民俗、歷史與文化敘事的範圍內介紹。它不是實證測量系統，掌褶也不是衡量人格、能力、關係或人生走向的刻度。閱讀相關術語時，最重要的界線是：傳統相信什麼，與可靠證據能支持什麼，是兩件不同的事。",
            "手掌的褶皺有助於皮膚在抓握時彎曲，真實的形狀也會因身體結構與動作而不同。為線條加上象徵名稱，是人們後來建立的解釋框架。名稱可以成為研究民俗的入口，卻不會把象徵關聯變成可重複驗證的自然定律。",
          ],
        },
        {
          heading: "歷史脈絡與多種版本",
          paragraphs: [
            "1911 年《大英百科全書》的歷史條目把手相放在占卜與神祕實踐的脈絡中，並記錄古代地中海、中國、印度、阿拉伯地區與近代歐洲文獻中的不同痕跡。這是一份年代久遠的歷史來源，適合用來觀察當時作者如何整理材料，不應被當成今日文化的完整代表。",
            "不同年代的作者對手形分類、丘位數量、線條名稱與象徵意義並不完全一致。口傳社群也可能使用不同語言、左右手規則或閱讀順序。因此，任何一張「標準掌紋圖」最多只能代表特定流派的約定，不能被描述成跨文化、跨時代都通用的唯一版本。",
            "學習歷史時也要留意舊資料的偏見與限制。早期百科條目可能沿用當時對族群與信仰的用語；現代讀者可以核對來源、辨認作者立場，並避免把一個人的敘述擴大成整個社群的聲音。文化脈絡比背誦單一圖表更重要。",
          ],
        },
        {
          heading: "四個傳統名稱",
          paragraphs: [
            "傳統圖表常把環繞拇指根部的主要褶線稱為「生命線」，把橫過掌心中部的線稱為「智慧線」或「頭腦線」，再把較靠近指根的橫線稱為「感情線」。有些流派也把從手腕方向向中指延伸的縱向褶線稱為「命運線」。這些都只是傳統標籤，不是醫學或心理學分類。",
            "生命線不決定壽命，也不能用長短、深淺或斷續判斷健康風險。相同地，智慧線不是智力測驗，感情線不會揭露關係品質，命運線也不是職涯或財務紀錄。把名稱還原為文化術語，可以避免字面意思被誤當成對個人的結論。",
            "實際手掌不一定清楚呈現圖表中的每一條線，線條也可能交疊、分岔或因拍攝光線而看起來不同。找不到某個傳統標籤並不代表缺少某種特質。HandFuture 的關節偵測器只定位手腕與手指關節，根本不替這些傳統掌線分類。",
          ],
          bullets: [
            "生命線：傳統上環繞拇指根部；不代表壽命。",
            "智慧線：傳統上橫過掌心中部；不代表智力。",
            "感情線：傳統上位於靠近指根處；不代表感情結果。",
            "命運線：部分流派採用的縱向名稱；不代表命定人生。",
          ],
        },
        {
          heading: "負責任地閱讀",
          paragraphs: [
            "如果你閱讀手相內容，可以把它當作民俗故事、社交對話或自我反思的題材。例如，一個名稱可能引出「最近如何安排休息」這類開放問題；回答來自你自己的觀察，而不是掌線替你提供的事實。保留選擇權，比追求確定答案更符合安全的娛樂使用方式。",
            "不要把手相解讀用於醫療、心理健康、法律、財務、工作、教育或關係等重大決定，也不要用它評估另一個人的可信度、能力或相容性。遇到需要專業知識的問題，應尋找合格專業人士與可核實資訊，而不是放大模糊的象徵敘述。",
            "引用傳統說法時，清楚加上「某些流派認為」或「歷史上曾被稱為」等界線，也應附上來源與年代。這種寫法既尊重文化材料，又不把信仰包裝成證據。你也可以選擇完全不接受任何解讀；娛樂內容不應要求服從或製造恐懼。",
          ],
        },
      ],
      sources: palmistrySources,
    },
    en: {
      title: "Palmistry basics: traditional names and historical context",
      summary:
        "Learn how palmistry is defined as a divinatory tradition, why practices differ across communities and periods, and how to read familiar line names without treating folklore as factual assessment.",
      updatedAt: "2026-07-26",
      sections: [
        {
          heading: "What palmistry is",
          paragraphs: [
            "Palmistry commonly means a divinatory tradition that reads character or future events from lines and features of the hand. Dictionaries and historical sources use descriptions such as reading palm lines or chiromancy. That definition records how a cultural practice presents itself; it does not validate the claims made within the practice.",
            "HandFuture discusses palmistry within folklore, history, and cultural storytelling. It is not an evidence-based measurement system, and palm creases are not scales for personality, ability, relationships, or life outcomes. The central reading boundary is simple: what a tradition says and what reliable evidence supports are separate questions.",
            "Palm folds have a physical role when skin bends during gripping, and their appearance varies with anatomy and movement. Giving a fold a symbolic name creates an interpretive framework. Names can open a useful conversation about folklore, but symbolic associations do not become reproducible laws of nature merely because a chart repeats them.",
          ],
        },
        {
          heading: "Historical context and many versions",
          paragraphs: [
            "The 1911 Encyclopaedia Britannica entry places palmistry among divination and occult practices and surveys references associated with the ancient Mediterranean, China, India, Arab regions, and early modern Europe. It is itself an old historical source: useful for examining how one period organized material, but not a complete account of any living culture today.",
            "Writers from different periods did not agree on the number of hand shapes, mounts, line names, or symbolic meanings. Oral communities may use different languages, hand-selection rules, and reading sequences. A diagram presented as standard can therefore represent only one school or publishing convention, not a universal map shared across cultures and centuries.",
            "Historical study also requires attention to bias. Older reference works can carry the assumptions and vocabulary of their period. Modern readers can compare sources, identify an author's standpoint, and avoid treating a single observer as the voice of an entire community. Context is more informative than memorizing one chart.",
          ],
        },
        {
          heading: "Four traditional names",
          paragraphs: [
            "Traditional diagrams often call the major fold curving around the base of the thumb the life line. A fold crossing the middle of the palm may be called the head line, while a fold closer to the fingers may be called the heart line. Some schools also label a vertical fold running upward from the wrist area as the fate line. These are traditional labels, not medical or psychological categories.",
            "A life line does not determine a person's lifespan, and its length, depth, or interruptions cannot establish health risk. Likewise, a head line is not an intelligence test, a heart line does not reveal relationship quality, and a fate line is not a career or financial record. Treating the names as cultural terms prevents their literal wording from becoming a conclusion about someone.",
            "Real palms do not always display every line shown in a diagram, and folds may overlap, branch, or look different under changing light. The absence of a traditional label does not imply the absence of a trait. HandFuture's detector locates wrist and finger joints only; it does not classify any of these traditional creases.",
          ],
          bullets: [
            "Life line: traditionally curves around the thumb base; it does not represent lifespan.",
            "Head line: traditionally crosses the middle palm; it does not represent intelligence.",
            "Heart line: traditionally lies nearer the finger bases; it does not represent relationship outcomes.",
            "Fate line: a vertical name used by some schools; it does not represent a fixed destiny.",
          ],
        },
        {
          heading: "Reading responsibly",
          paragraphs: [
            "If you read palmistry material, treat it as folklore, conversation, or a prompt for your own reflection. A traditional name might inspire an open question such as how you have been making time for rest. The answer comes from your experience and choices, not from a crease supplying a fact. Keeping agency matters more than seeking certainty from a reading.",
            "Never use a palmistry interpretation for medical, mental-health, legal, financial, employment, education, or relationship decisions. It should not be used to assess another person's trustworthiness, competence, or compatibility. Questions that require expertise deserve qualified professionals and verifiable information, not an amplified symbolic description.",
            "When repeating a traditional interpretation, phrases such as some schools hold or historically this was called keep the boundary visible. Include a source and its date where possible. That approach respects cultural material without presenting belief as evidence. Readers are also free to reject every interpretation; entertainment should never demand compliance or create fear.",
          ],
        },
      ],
      sources: palmistrySources,
    },
  },
  "/guides/science-and-limitations": {
    zh: {
      title: "手相、科學與限制：安全看待解讀",
      summary:
        "分辨手部關節偵測與掌紋詮釋，認識一般敘述為何容易帶來貼身感，並建立不讓娛樂內容介入重大決策的清楚界線。",
      updatedAt: "2026-07-26",
      sections: [
        {
          heading: "偵測不是解讀",
          paragraphs: [
            "MediaPipe Hand Landmarker 的輸出是手部關節座標、世界座標與左右手資訊。HandFuture 使用其中的正規化關節座標確認一隻手是否被定位，再繪出手腕、手指關節與指尖的連線。這是電腦視覺的定位工作，目標是回答影像中哪些點可能對應手部關節。",
            "模型不會回傳生命線、智慧線、感情線或命運線，也沒有掌褶名稱、象徵意義、人格分數或人生分類。即使關節骨架看起來精細，也不能把輸出的幾何點換個名稱就當成手相分析。技術能可靠描述的範圍，必須以實際輸入與輸出為準。",
            "HandFuture 由固定幾何簽章選擇一般反思卡，這個規則只讓相同座標產生相同鍵值。穩定的程式規則不等於詮釋已被證實；它只是可重現的選卡方式。反思卡的文字也沒有回頭訓練或評估照片中的人。",
          ],
        },
        {
          heading: "證據界線",
          paragraphs: [
            "本專案沒有主張能從手掌預知或判定人格、健康、關係、金錢、職涯或未來事件；這些說法沒有科學依據。傳統文獻可以證明某種觀念曾被記錄或流傳，卻不能單靠歷史存在就證明觀念對個人有效。文化史證據與效果證據必須分開。",
            "要支持一種測量工具，通常需要清楚定義測量對象、以適當樣本測試、比較替代解釋，並由不同研究者重複得到可靠結果。模糊詞語、只挑符合的案例，或在知道答案後重新解釋線條，都無法提供同等品質的證據。漂亮介面也不會改變這個標準。",
            "電腦視覺模型本身使用機器學習，並不會使接在後面的任何文化敘述自動成為科學。應分別檢查每個步驟：模型是否定位關節，程式如何選卡，以及卡片是否只是一段一般文字。把這些層次拆開，就較不容易把技術感誤認成對人的洞察。",
          ],
        },
        {
          heading: "巴納姆效應",
          paragraphs: [
            "APA 心理學詞典所稱的巴納姆效應，描述人們可能把廣泛適用、看似正面的性格敘述視為特別貼合自己。像「你重視他人，但有時需要獨處」這類句子同時容納相反傾向，許多人都能從生活中找到相符片段，因此容易產生被說中的感覺。",
            "這不表示每次共鳴都是虛假；一句一般提示仍可能幫助你整理當下想法。限制在於，主觀的貼身感不能單獨證明文字從手掌取得了專屬資訊。閱讀娛樂性內容時，可以問：這句話是否也適用很多人？我是否忽略不符合的部分？是否先知道情境才覺得它準？",
            "HandFuture 刻意把結果稱為反思卡，並公開固定題庫與選擇方式。你可以保留有幫助的問題、捨棄不合適的文字，不需要把共鳴歸因於掌褶。知道巴納姆效應，是保持好奇同時維持證據界線的一種方法。",
          ],
        },
        {
          heading: "安全使用",
          paragraphs: [
            "請勿使用反思卡或任何手相結果處理醫療與心理健康問題、法律權利、投資與債務、求職與僱用、升遷與解僱，或親密關係中的重大選擇。娛樂內容不知道你的完整處境，也沒有資格、資料或程序承擔這些判斷。",
            "如果問題涉及身體症狀或心理危機，尋求合格醫療或心理健康專業協助；涉及法律或財務時，使用所在地可靠的專業服務與官方資訊。工作與關係問題則應依可觀察的行為、直接溝通與公平程序處理，而不是依據手部照片。",
            "也不要替未同意的人拍攝、分類或分享結果。避免用文化標籤嘲笑、排除或施壓他人。安全的使用方式是自願、可隨時停止、不製造恐懼，並把每張卡視為可以忽略的一般提問，而不是權威指示。",
          ],
        },
      ],
      sources: scienceSources,
    },
    en: {
      title: "Palmistry, science, and limitations",
      summary:
        "Separate hand-joint detection from palm interpretation, learn why general descriptions can feel unusually personal, and keep entertainment content out of consequential decisions.",
      updatedAt: "2026-07-26",
      sections: [
        {
          heading: "Detection is not interpretation",
          paragraphs: [
            "MediaPipe Hand Landmarker outputs hand landmarks in image and world coordinates along with handedness. HandFuture uses normalized joint coordinates to confirm that one hand was located and to draw connections among the wrist, finger joints, and fingertips. This is a computer-vision localization task: it estimates which image points correspond to standard hand joints.",
            "The model does not return life, head, heart, or fate creases. Its output has no crease names, symbolic meanings, personality scores, or life categories. A detailed-looking joint skeleton cannot become palm analysis merely by relabeling geometric points. Claims about the technology must stay within its actual inputs and documented outputs.",
            "HandFuture uses a fixed geometry signature to select a general reflection card. That rule only makes identical coordinates produce the same key. A reproducible program rule does not establish the truth of an interpretation; it is simply a repeatable card-selection method. The card text neither trains on nor evaluates the person in the photo.",
          ],
        },
        {
          heading: "The evidence boundary",
          paragraphs: [
            "This project asserts no scientific basis for using palms to forecast or determine personality, health, relationships, money, career, or future events. Historical documents can show that a belief was recorded or practiced, but historical existence alone does not demonstrate that the belief works for an individual. Evidence of a tradition and evidence of an effect are different categories.",
            "Support for a measurement system normally requires a clearly defined target, appropriate samples, comparisons against alternative explanations, and reliable results replicated by independent researchers. Vague terms, selected success stories, or reinterpretation after an answer is known do not offer equivalent evidence. A polished interface does not change that standard.",
            "The use of machine learning in the vision model does not make every cultural statement attached to its output scientific. Evaluate each layer separately: whether the model locates joints, how the program selects a card, and whether that card is simply general prose. Keeping those layers distinct prevents technical presentation from being mistaken for insight about a person.",
          ],
        },
        {
          heading: "The Barnum effect",
          paragraphs: [
            "The APA Dictionary of Psychology describes the Barnum effect as a tendency to accept broadly applicable personality descriptions as uniquely fitting oneself. A sentence such as you value other people but sometimes need solitude can accommodate opposite tendencies. Many readers can recall a matching event, creating an impression of a highly personal description.",
            "That does not mean every moment of resonance is worthless. A general prompt may still help someone organize current thoughts. The limitation is that a personal feeling of fit cannot by itself show that the text obtained unique information from a palm. Ask whether the statement would suit many people, whether mismatches were ignored, and whether context was known before it felt specific.",
            "HandFuture deliberately calls its output a reflection card and discloses the fixed prompt set and selection method. You can retain a useful question and discard irrelevant wording without attributing resonance to palm creases. Understanding the Barnum effect is one way to remain curious while preserving an evidence boundary.",
          ],
        },
        {
          heading: "Safe use",
          paragraphs: [
            "Do not use a reflection card or palmistry result for medical or mental-health questions, legal rights, investments or debt, hiring and employment, promotion or dismissal, or major relationship choices. Entertainment content does not know a person's full circumstances and lacks the qualifications, data, and accountable process required for those decisions.",
            "For physical symptoms or a mental-health crisis, seek qualified health support. For legal or financial questions, use trustworthy official information and an appropriately qualified professional in your jurisdiction. Employment and relationship issues should rely on observable behavior, direct communication, and fair process rather than a hand photo.",
            "Do not photograph, classify, or share a result about someone who has not consented. Cultural labels should never be used to ridicule, exclude, or pressure another person. Safe entertainment is voluntary, easy to stop, free from fear tactics, and treats each card as a general question that can be ignored rather than an authoritative instruction.",
          ],
        },
      ],
      sources: scienceSources,
    },
  },
  "/guides/hand-photo-guide": {
    zh: {
      title: "手部照片指南：光線、取景與隱私",
      summary:
        "用均勻光線、完整單手與單純背景準備較容易偵測的照片，同時理解檔案限制、目前瀏覽器工作階段的處理方式與常見失敗狀態。",
      updatedAt: "2026-07-26",
      sections: [
        {
          heading: "使用均勻的正面光線",
          paragraphs: [
            "讓光線從相機方向或側前方均勻照在整隻手上。明亮不等於越強越好；柔和的日光或分散的室內燈通常比單一小燈更容易保留手指輪廓。拍攝前先看畫面，確認手腕、各指節與指尖沒有融入黑暗區域。",
            "避免強烈反光、深色陰影與背光。油亮皮膚、玻璃桌面或直射閃光可能形成白色高光，讓部分關節邊緣消失；背後的窗戶若比手更亮，相機也可能把手壓成剪影。移動燈源或手的位置，通常比套用濾鏡更直接。",
            "若相機自動曝光反覆改變，先讓手停留一秒再拍。膚色本身不是成功條件，重點是手與背景之間有清楚可見的輪廓，而且亮部沒有過曝、暗部仍保有細節。HandFuture 不會用照片評價皮膚外觀。",
          ],
        },
        {
          heading: "完整呈現一隻張開的手",
          paragraphs: [
            "從手腕到五個指尖都應留在畫面內，手掌自然張開，手指之間保留一些空隙。相機盡量正對手掌，避免手指大幅朝鏡頭彎曲造成重疊。四周留一點空間，模型比只看到被裁切的局部更容易建立完整手部形狀。",
            "使用與手部有對比、紋理較少的單純背景。花紋桌布、相近顏色的衣物或畫面中的其他物品都可能增加視覺干擾。請只放一隻手，避免另一隻手、別人的手或手臂交疊；多手畫面會被介面當成需要重新拍攝的狀態。",
            "戒指、手錶或手鍊不一定會造成失敗，但若它們遮住手腕或關節，請先取下或調整。不要為了拍照勉強拉直受傷或不舒服的手；舒適與安全比偵測成功更重要。這個工具只需要一般姿勢，不要求特定手勢。",
          ],
          bullets: [
            "一隻手，從手腕到所有指尖完整入鏡。",
            "手掌自然張開，手指盡量不要互相遮擋。",
            "選擇素色、有對比的背景。",
            "移開遮住關節的飾品與物件。",
          ],
        },
        {
          heading: "檔案與隱私",
          paragraphs: [
            "上傳器實際接受 JPEG、PNG 與 WebP，單一檔案上限為 10MB。副檔名與檔案內容都要是瀏覽器能解碼的圖片；把其他格式只改檔名並不會轉換內容。若手機照片太大，可以先用裝置內建工具縮小尺寸或另存成支援格式。",
            "選取檔案後，FileReader 會在目前的瀏覽器頁面讀取影像，HandFuture 沒有照片上傳端點。影像存在應用程式記憶體中，供目前工作階段的模型使用；按下重設、關閉分頁或重新整理會移除該影像狀態。免責聲明偏好是唯一另行保存在本機的相關狀態。",
            "即使照片不送到 HandFuture，也應採用資料最少化原則。把臉孔、證件、地址標籤、螢幕內容與可辨識的室內外環境排除在畫面外，也不要使用未同意者的手部照片。共用裝置上完成後，可直接關閉分頁。",
          ],
        },
        {
          heading: "疑難排解",
          paragraphs: [
            "若顯示找不到手，先檢查是否完整呈現手腕與指尖，再移到較均勻的光線並換成對比明顯的背景。若顯示多隻手，請重新取景，只保留一隻手。這兩種訊息都是偵測器輸出，不是對照片品質或人的評價。",
            "如果瀏覽器無法讀取檔案，確認格式與 10MB 上限，並嘗試重新匯出圖片。社群應用程式下載的檔案有時副檔名正確但內容不完整；用相簿開啟後另存新檔，可以排除部分編碼問題。HandFuture 不會在錯誤後保留一個半完成的分析。",
            "模型首次使用時需要載入必要資源。網路中斷、公司或學校的內容政策、隱私擴充套件或 CDN 阻擋可能讓初始化失敗。重新整理與稍後重試可能有幫助；若環境持續阻擋模型，請不要反覆提交敏感照片，閱讀指南不需要啟用偵測器。",
            "改善光線與取景能增加模型看見標準手部形狀的機會，卻不能保證每張照片都成功。裝置效能、相機模糊、特殊姿勢與模型限制都會影響結果。偵測成功只表示定位到關節，不表示掌褶被辨識或解讀。",
          ],
        },
      ],
      sources: implementationSources,
    },
    en: {
      title: "Hand photo guide: lighting, framing, and privacy",
      summary:
        "Prepare a more detectable image with even light, one complete hand, and a plain background while understanding file limits, current-session processing, and common detector states.",
      updatedAt: "2026-07-26",
      sections: [
        {
          heading: "Use even front light",
          paragraphs: [
            "Light the full hand evenly from the camera direction or slightly to one side. Brighter is not always better: soft daylight or a diffused room light usually preserves finger outlines more effectively than one small, intense lamp. Check the preview to ensure the wrist, joints, and fingertips do not disappear into dark areas.",
            "Avoid glare, deep shadow, and backlighting. Shiny skin, a glass table, or direct flash can produce white highlights that erase joint edges. A window much brighter than the hand can turn the hand into a silhouette. Moving the light or the hand is usually more useful than applying an image filter.",
            "If automatic exposure keeps changing, hold the hand still for a moment before taking the photo. Skin tone is not a success criterion. The important qualities are a visible boundary between hand and background, highlights that retain detail, and shadows that are not crushed. HandFuture does not evaluate anyone's skin appearance.",
          ],
        },
        {
          heading: "Frame one complete open hand",
          paragraphs: [
            "Keep everything from the wrist through all five fingertips inside the frame. Open the hand naturally and leave some space between fingers. Aim the camera toward the palm and avoid bending fingers sharply toward the lens, which can create overlap. A margin around the hand gives the model more context than a tightly cropped fragment.",
            "Choose a plain background with contrast against the hand. Patterned fabric, similarly colored clothing, and unrelated objects add visual clutter. Include only one hand and avoid overlap from a second hand, another person's hand, or an arm. The interface treats multiple-hand output as a state that needs a new photo.",
            "Rings, watches, and bracelets do not always prevent detection, but move or remove them if they cover the wrist or joints. Never force an injured or uncomfortable hand to straighten for a photo. Comfort and safety matter more than detector success, and the tool does not require a special gesture.",
          ],
          bullets: [
            "Show one hand completely from wrist through every fingertip.",
            "Open the palm naturally and minimize overlapping fingers.",
            "Use a plain, contrasting background.",
            "Move jewelry or objects that cover joints.",
          ],
        },
        {
          heading: "Files and privacy",
          paragraphs: [
            "The implemented uploader accepts JPEG, PNG, and WebP with a 10MB limit for one file. Both the extension and file contents must describe an image the browser can decode; renaming another format does not convert it. If a phone photo is too large, use the device's built-in tools to reduce its dimensions or export a supported format.",
            "After selection, FileReader reads the image in the current browser page, and HandFuture has no photo upload endpoint. The image remains in application memory for the model during this session. Resetting, closing the tab, or refreshing removes that image state. Disclaimer acceptance is the only related preference stored separately on the device.",
            "Data minimization still matters even when a photo is not sent to HandFuture. Keep faces, identity documents, address labels, screens, and identifying surroundings out of the image. Do not use a hand photo of someone who has not agreed. On a shared device, close the tab when finished.",
          ],
        },
        {
          heading: "Troubleshooting",
          paragraphs: [
            "For a no-hand result, first confirm that the wrist and fingertips are visible, then move to even lighting and a more contrasting background. For a multiple-hand result, reframe so only one hand remains. Both messages are detector outputs, not judgments about image quality or the person shown.",
            "If the browser cannot read the file, check the supported formats and 10MB limit, then try exporting the image again. A file downloaded from a social app can have a familiar extension but incomplete contents; opening it in the photo library and saving a new copy may resolve some encoding problems. HandFuture does not preserve a half-finished analysis after an error.",
            "The model must load required resources on first use. A network interruption, workplace or school content policy, privacy extension, or CDN block can prevent initialization. Refreshing or trying later may help. If the environment continues to block the model, do not repeatedly submit sensitive images; all guides remain readable without detection.",
            "Better lighting and framing can give the model a clearer standard hand shape, but cannot ensure success for every photo. Device performance, camera blur, unusual poses, and model limits all affect output. Successful detection means that joints were located; it does not mean palm creases were identified or interpreted.",
          ],
        },
      ],
      sources: implementationSources,
    },
  },
};
