import type { EditorialPage } from "../guides";
import type { LocalizedEditorialBundle } from "./types";

const palmistrySources = [
  { label: "1911 Encyclopaedia Britannica: Palmistry", url: "https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/Palmistry" },
  { label: "Merriam-Webster: Palmistry", url: "https://www.merriam-webster.com/dictionary/palmistry" },
];
const scienceSources = [
  { label: "APA Dictionary of Psychology: Barnum effect", url: "https://dictionary.apa.org/barnum-effect" },
  { label: "MediaPipe Hand Landmarker", url: "https://developers.google.com/mediapipe/solutions/vision/hand_landmarker" },
];
const implementationSources = [
  { label: "MediaPipe Hand Landmarker", url: "https://developers.google.com/mediapipe/solutions/vision/hand_landmarker" },
  { label: "MDN FileReader", url: "https://developer.mozilla.org/docs/Web/API/FileReader" },
];
const privacySources = [
  { label: "Vercel Analytics Privacy Policy", url: "https://vercel.com/docs/analytics/privacy-policy" },
  { label: "Google Privacy Policy", url: "https://policies.google.com/privacy" },
  { label: "Google AdSense: certified CMP requirements", url: "https://support.google.com/adsense/answer/13554116" },
];

function page(content: Omit<EditorialPage, "updatedAt">): EditorialPage {
  return { ...content, updatedAt: "2026-07-26" };
}

export const frEditorial: LocalizedEditorialBundle = {
  howItWorks: page({
    title: "Comment fonctionne HandFuture",
    summary: "Suivez les données du choix de la photo à la détection des articulations et à la sélection d’une carte de réflexion, en découvrant ce qui reste dans la session actuelle et ce que l’outil n’infère pas.",
    sections: [
      {
        heading: "Choisir une photo",
        paragraphs: [
          "Le sélecteur accepte les fichiers JPEG, PNG ou WebP jusqu’à 10MB. Choisissez une photo contenant une seule main. Dans le navigateur, FileReader lit le fichier expressément sélectionné sous forme d’URL de données temporaire et le place dans l’état de l’application de la page actuelle.",
          "Aucun point de téléversement HandFuture ne reçoit cette photo. Elle ne devient ni une donnée de compte ni un contenu public ; le choix du fichier la rend seulement accessible à la page actuelle pour la détection. Évitez néanmoins de cadrer des visages, des documents et un environnement permettant de vous identifier.",
        ],
      },
      {
        heading: "Repérer les articulations de la main",
        paragraphs: [
          "MediaPipe recherche les mains et renvoie des repères standard ainsi que des informations sur le côté de la main. HandFuture vérifie qu’une seule main a été trouvée, puis que le résultat contient exactement 21 articulations décrites par des coordonnées aux valeurs finies avant de l’accepter.",
          "L’interface conserve la photo d’origine et indique par écrit l’état de la détection ; le bouton de la carte est disponible après validation. Le modèle n’identifie pas la ligne de vie, de tête, de cœur, de destinée ni les autres plis de la paume, et ne tire aucune conclusion sur la personne photographiée.",
        ],
      },
      {
        heading: "Choisir une carte de réflexion",
        paragraphs: [
          "Après une détection réussie, et seulement lorsque vous appuyez sur le bouton, le programme transforme les coordonnées normalisées en une signature géométrique fixe. Celle-ci choisit l’une de quatre questions générales. Des coordonnées identiques donnent la même clé : il ne s’agit pas d’un nouveau tirage aléatoire à chaque clic.",
          "Cette étape n’infère ni personnalité, ni compatibilité, ni santé, ni carrière, ni fortune, ni avenir. La carte est une question ouverte d’un ensemble fixe, destinée à l’exploration culturelle et à l’autoréflexion dans un cadre de divertissement culturel non scientifique. La géométrie fournit seulement une clé de sélection stable ; elle ne mesure personne.",
        ],
      },
      {
        heading: "Effacer et comprendre les limites",
        paragraphs: [
          "La réinitialisation efface de l’état de l’application la photo, le résultat et la carte. Fermer ou actualiser la page efface également la photo de la mémoire. Seule l’acceptation de l’avertissement persiste dans le stockage local ; ni la photo ni les coordonnées ne sont conservées avec ce choix.",
          "La détection peut échouer à cause d’un cadrage incomplet, d’une faible lumière, d’une image que le navigateur ne décode pas ou d’un blocage réseau lors du chargement du modèle. Absence de main, plusieurs mains et modèle indisponible sont des états de limite. Changer la photo peut aider, mais aucun résultat n’est une lecture des plis de la paume.",
        ],
      },
    ],
    sources: implementationSources,
  }),
  guides: {
    "/guides/palmistry-basics": page({
      title: "Notions de chiromancie : noms traditionnels et contexte historique",
      summary: "Découvrez la chiromancie comme tradition divinatoire, les variations entre communautés et époques, et une façon de lire les noms courants sans prendre le folklore pour une évaluation factuelle.",
      sections: [
        {
          heading: "Qu’est-ce que la chiromancie ?",
          paragraphs: [
            "La chiromancie désigne généralement une tradition divinatoire qui lit le caractère ou les événements futurs dans les lignes et les traits de la main. Les dictionnaires et sources historiques parlent de lecture de la paume ou de chiromancy. Cette définition consigne la manière dont une pratique culturelle se présente ; elle ne valide pas ses affirmations.",
            "HandFuture traite la chiromancie dans le cadre du folklore, de l’histoire et des récits culturels. Ce n’est pas un système de mesure fondé sur des preuves, et les plis de la paume ne sont pas des échelles de personnalité, d’aptitude, de relations ou de parcours de vie. Ce qu’affirme une tradition et ce qu’étayent des preuves fiables sont deux questions distinctes.",
            "Les plis de la paume permettent à la peau de fléchir pendant la préhension, et leur aspect varie selon l’anatomie et le mouvement. Donner un nom symbolique à un pli crée un cadre interprétatif. Ces noms peuvent ouvrir une discussion sur le folklore, mais répéter une association dans un schéma n’en fait pas une loi naturelle reproductible.",
          ],
        },
        {
          heading: "Contexte historique et versions multiples",
          paragraphs: [
            "L’article de 1911 d’Encyclopaedia Britannica situe la chiromancie parmi la divination et les pratiques occultes, et passe en revue des références liées à la Méditerranée antique, à la Chine, à l’Inde, aux régions arabes et à l’Europe moderne. C’est une ancienne source historique, utile pour étudier son époque, mais pas un tableau complet des cultures vivantes actuelles.",
            "Les auteurs de différentes périodes ne s’accordaient ni sur les formes de mains, ni sur le nombre de monts, ni sur les noms des lignes ou leurs significations. Les communautés orales peuvent employer d’autres langues, règles de choix de la main et ordres de lecture. Un schéma dit standard représente donc au mieux une école ou une convention éditoriale, pas une carte universelle.",
            "L’étude historique exige aussi de repérer les biais. Les ouvrages anciens peuvent porter les présupposés et le vocabulaire de leur époque. Les lecteurs actuels peuvent comparer les sources, identifier le point de vue d’un auteur et éviter de faire d’un seul observateur la voix de toute une communauté. Le contexte apprend davantage que la mémorisation d’un schéma.",
          ],
        },
        {
          heading: "Quatre noms traditionnels",
          paragraphs: [
            "Les schémas traditionnels appellent souvent ligne de vie le grand pli qui contourne la base du pouce, ligne de tête celui qui traverse le milieu de la paume et ligne de cœur celui qui se trouve près des doigts. Certaines écoles nomment ligne de destinée un pli vertical remontant depuis le poignet. Ce sont des étiquettes traditionnelles, pas des catégories médicales ou psychologiques.",
            "La ligne de vie ne détermine pas la longévité ; sa longueur, sa profondeur ou ses interruptions n’établissent aucun risque de santé. La ligne de tête ne mesure pas l’intelligence, celle du cœur ne révèle pas la qualité d’une relation et celle de destinée ne consigne ni carrière ni finances. Les traiter comme des termes culturels évite de transformer leur sens littéral en conclusion personnelle.",
            "Les paumes réelles ne montrent pas toujours toutes les lignes d’un schéma ; les plis peuvent se chevaucher, se ramifier ou paraître différents selon la lumière. L’absence d’une étiquette traditionnelle ne signifie pas celle d’un trait. Le détecteur de HandFuture repère seulement le poignet et les articulations des doigts ; il ne classe aucune de ces lignes.",
          ],
          bullets: [
            "Ligne de vie : contourne traditionnellement la base du pouce ; elle ne représente pas la longévité.",
            "Ligne de tête : traverse traditionnellement le milieu de la paume ; elle ne représente pas l’intelligence.",
            "Ligne de cœur : se trouve traditionnellement près des doigts ; elle ne représente pas l’issue des relations.",
            "Ligne de destinée : nom vertical employé par certaines écoles ; elle ne représente pas un destin fixé.",
          ],
        },
        {
          heading: "Lire de façon responsable",
          paragraphs: [
            "Vous pouvez considérer les textes de chiromancie comme du folklore, un sujet de conversation ou une invitation à réfléchir. Un nom traditionnel peut inspirer une question ouverte, par exemple sur la place que vous accordez au repos. La réponse vient de votre expérience et de vos choix, pas d’un pli fournissant un fait. Préserver son autonomie importe davantage que chercher la certitude.",
            "N’utilisez jamais une interprétation pour des décisions médicales, de santé mentale, juridiques, financières, professionnelles, éducatives, relationnelles ou d’autres décisions importantes. Elle ne doit pas non plus évaluer la fiabilité, la compétence ou la compatibilité d’autrui. Les sujets exigeant une expertise méritent des informations vérifiables et des professionnels qualifiés.",
            "Quand vous rapportez une interprétation, des formules comme « certaines écoles estiment » ou « ce pli était historiquement appelé » maintiennent la frontière visible. Ajoutez une source et une date si possible. Cette démarche respecte le matériau culturel sans présenter une croyance comme une preuve. Vous pouvez rejeter toute interprétation ; le divertissement ne doit jamais imposer l’obéissance ni susciter la peur.",
          ],
        },
      ],
      sources: palmistrySources,
    }),
    "/guides/science-and-limitations": page({
      title: "Chiromancie, science et limites",
      summary: "Distinguez la détection des articulations de l’interprétation de la paume, comprenez pourquoi des descriptions générales semblent personnelles et écartez le divertissement des décisions lourdes de conséquences.",
      sections: [
        {
          heading: "Détecter n’est pas interpréter",
          paragraphs: [
            "MediaPipe Hand Landmarker fournit des repères en coordonnées d’image et du monde, ainsi que le côté de la main. HandFuture confirme qu’une seule main utilisable est présente et valide exactement 21 coordonnées articulaires finies. Il s’agit d’une tâche de localisation en vision par ordinateur : estimer quels points correspondent aux articulations standard.",
            "Le modèle ne renvoie ni ligne de vie, ni ligne de tête, de cœur ou de destinée. Sa sortie ne contient aucun nom de pli, sens symbolique, score de personnalité ou catégorie de vie. L’interface garde la photo et indique l’état par écrit ; après validation, la carte peut être choisie. Les points géométriques restent une localisation articulaire et ne deviennent pas une analyse de la paume en changeant de nom.",
            "HandFuture utilise une signature géométrique fixe pour sélectionner une carte générale. La règle fait seulement produire la même clé à des coordonnées identiques. La reproductibilité d’un programme n’établit pas la vérité d’une interprétation ; elle répète simplement la sélection. Le texte de la carte n’est ni entraîné sur la personne ni utilisé pour l’évaluer.",
          ],
        },
        {
          heading: "La frontière des preuves",
          paragraphs: [
            "Ce projet ne prétend pas qu’il existe une base scientifique pour prévoir ou déterminer par la paume la personnalité, la santé, les relations, l’argent, la carrière ou l’avenir. Un document historique montre qu’une croyance a été consignée ou pratiquée ; son existence ne prouve pas son efficacité pour un individu. Preuve d’une tradition et preuve d’un effet sont deux catégories différentes.",
            "Étayer un système de mesure exige normalement une cible clairement définie, des échantillons adaptés, une comparaison avec d’autres explications et des résultats fiables reproduits par des chercheurs indépendants. Les termes vagues, les réussites choisies ou la réinterprétation après avoir appris la réponse n’offrent pas des preuves équivalentes. Une interface soignée ne change pas cette norme.",
            "L’emploi de l’apprentissage automatique dans le modèle visuel ne rend pas scientifique chaque affirmation culturelle associée à sa sortie. Évaluez séparément la localisation des articulations, le mode de sélection de la carte et le caractère général de son texte. Distinguer ces couches évite de prendre une présentation technique pour un savoir sur une personne.",
          ],
        },
        {
          heading: "L’effet Barnum",
          paragraphs: [
            "L’APA Dictionary of Psychology décrit l’effet Barnum comme la tendance à accepter une description de personnalité largement applicable comme si elle nous correspondait de façon unique. Une phrase comme « vous tenez aux autres, mais avez parfois besoin de solitude » combine des tendances opposées. Beaucoup retrouvent un souvenir concordant et ressentent une description très personnelle.",
            "Cela ne signifie pas que chaque résonance est inutile. Une question générale peut aider à organiser ses pensées présentes. La limite est qu’un sentiment subjectif de justesse ne démontre pas à lui seul que le texte a obtenu une information unique dans une paume. Demandez-vous si la phrase conviendrait à beaucoup de monde, si les écarts ont été ignorés et si le contexte était déjà connu.",
            "HandFuture appelle volontairement le résultat carte de réflexion et révèle l’ensemble fixe de questions et la méthode de sélection. Vous pouvez garder une question utile et écarter une formulation sans intérêt, sans attribuer la résonance aux lignes de la paume. Comprendre l’effet Barnum aide à rester curieux tout en conservant la frontière des preuves.",
          ],
        },
        {
          heading: "Utilisation sûre",
          paragraphs: [
            "N’utilisez pas une carte ou un résultat de chiromancie pour des questions médicales ou de santé mentale, des droits juridiques, des investissements ou dettes, un recrutement ou emploi, une promotion ou un licenciement, ni des décisions importantes de relation. Le divertissement ignore l’ensemble de la situation et n’a ni qualification, ni données, ni procédure responsable pour ces jugements.",
            "Pour des symptômes physiques ou une crise de santé mentale, cherchez une aide qualifiée. Pour les questions juridiques ou financières, utilisez des informations officielles fiables et un professionnel compétent dans votre juridiction. Emploi et relations doivent reposer sur des comportements observables, une communication directe et une procédure équitable, pas sur une photo de main.",
            "Ne photographiez, ne classez et ne partagez pas de résultat concernant une personne sans son consentement. Les étiquettes culturelles ne doivent pas servir à ridiculiser, exclure ou faire pression. Un divertissement sûr est volontaire, facile à arrêter, sans tactique de peur, et traite chaque carte comme une question générale que l’on peut ignorer, non comme une instruction faisant autorité.",
          ],
        },
      ],
      sources: scienceSources,
    }),
    "/guides/hand-photo-guide": page({
      title: "Guide de photo de main : lumière, cadrage et confidentialité",
      summary: "Préparez une image plus facile à détecter avec une lumière uniforme, une main entière et un fond uni, tout en comprenant les limites de fichier, le traitement de la session actuelle et les états du détecteur.",
      sections: [
        {
          heading: "Utiliser une lumière frontale uniforme",
          paragraphs: [
            "Éclairez toute la main uniformément depuis la direction de l’appareil ou légèrement de côté. Plus lumineux n’est pas toujours mieux : une lumière du jour douce ou un éclairage intérieur diffus préserve généralement mieux les contours qu’une petite lampe intense. Vérifiez que le poignet, les articulations et le bout des doigts ne disparaissent pas dans l’ombre.",
            "Évitez reflets, ombres profondes et contre-jour. Une peau brillante, une table en verre ou un flash direct peuvent créer des zones blanches qui effacent le bord des articulations. Une fenêtre beaucoup plus claire que la main peut la transformer en silhouette. Déplacer la lumière ou la main est souvent plus utile qu’appliquer un filtre.",
            "Si l’exposition automatique change sans cesse, immobilisez la main un instant avant la prise. La couleur de peau n’est pas un critère de réussite. Comptent une limite visible entre la main et le fond, des zones claires détaillées et des ombres non bouchées. HandFuture n’évalue pas l’apparence de la peau.",
          ],
        },
        {
          heading: "Cadrer une main ouverte entière",
          paragraphs: [
            "Gardez dans le cadre tout ce qui va du poignet au bout des cinq doigts. Ouvrez naturellement la main et laissez de l’espace entre les doigts. Orientez l’appareil vers la paume et évitez de plier fortement les doigts vers l’objectif, ce qui crée des chevauchements. Une marge autour de la main apporte davantage de contexte qu’un fragment très recadré.",
            "Choisissez un fond uni contrastant avec la main. Les tissus à motifs, les vêtements de couleur proche et les objets sans rapport ajoutent du bruit visuel. Ne montrez qu’une main et évitez qu’elle ne chevauche une deuxième main, celle d’une autre personne ou un bras. La sortie plusieurs mains exige une nouvelle photo.",
            "Bagues, montres et bracelets n’empêchent pas toujours la détection, mais déplacez-les ou retirez-les s’ils cachent le poignet ou des articulations. Ne forcez jamais une main blessée ou douloureuse à se tendre. Le confort et la sécurité comptent davantage que la détection, et aucun geste particulier n’est exigé.",
          ],
          bullets: [
            "Montrez une main entière, du poignet au bout de chaque doigt.",
            "Ouvrez naturellement la paume et réduisez le chevauchement des doigts.",
            "Utilisez un fond uni contrastant avec la main.",
            "Déplacez les bijoux ou objets qui cachent les articulations.",
          ],
        },
        {
          heading: "Fichiers et confidentialité",
          paragraphs: [
            "Le sélecteur accepte JPEG, PNG et WebP, avec une limite de 10MB par fichier. L’extension et le contenu doivent tous deux correspondre à une image que le navigateur peut décoder ; renommer un autre format ne le convertit pas. Si une photo de téléphone est trop grande, réduisez-la avec les outils de l’appareil ou exportez-la dans un format compatible.",
            "Après le choix, FileReader lit l’image dans la page actuelle et HandFuture ne possède aucun point de téléversement de photos. L’image reste dans la mémoire de l’application pour le modèle pendant cette session. Réinitialiser, fermer l’onglet ou actualiser supprime cet état. L’acceptation de l’avertissement est la seule préférence associée stockée séparément.",
            "La minimisation des données reste importante même lorsque la photo n’est pas envoyée à HandFuture. Excluez les visages, pièces d’identité, étiquettes d’adresse, écrans et environnements identifiables. N’utilisez pas la photo de la main d’une personne sans son accord. Sur un appareil partagé, fermez l’onglet après utilisation.",
          ],
        },
        {
          heading: "Dépannage",
          paragraphs: [
            "Si aucune main n’est trouvée, vérifiez que le poignet et le bout des doigts sont visibles, passez à une lumière uniforme et choisissez un fond plus contrasté. Si plusieurs mains sont trouvées, recadrez pour n’en garder qu’une. Ces messages sont des sorties du détecteur, pas des jugements sur la photo ou la personne.",
            "Si le navigateur ne lit pas le fichier, vérifiez les formats et la limite de 10MB, puis réexportez l’image. Un fichier enregistré depuis une application sociale peut avoir une extension familière mais un contenu incomplet ; l’ouvrir dans la photothèque et enregistrer une nouvelle copie résout certains problèmes d’encodage. HandFuture ne conserve pas d’analyse inachevée après une erreur.",
            "Le modèle doit charger des ressources lors de la première utilisation. Une coupure réseau, la politique d’une entreprise ou d’une école, une extension de confidentialité ou un blocage du CDN peut empêcher l’initialisation. Actualiser ou réessayer plus tard peut aider ; si le blocage persiste, ne choisissez pas plusieurs fois des photos sensibles. Les guides restent lisibles sans détection.",
            "Améliorer lumière et cadrage aide le modèle à voir une forme standard, mais ne garantit pas la réussite de chaque photo. Performances de l’appareil, flou, poses inhabituelles et limites du modèle influencent la sortie. Une détection réussie signifie que les articulations ont été localisées, pas que les plis de la paume ont été identifiés ou interprétés.",
          ],
        },
      ],
      sources: implementationSources,
    }),
  },
  about: page({
    title: "À propos de HandFuture",
    summary: "HandFuture est un projet web indépendant consacré à la culture de la chiromancie, avec des articles sourcés et une fonction transparente dans le navigateur qui distingue tradition, capacité technique et preuve scientifique.",
    sections: [
      { heading: "Ce projet", paragraphs: ["HandFuture est un projet web indépendant consacré à l’exploration de la culture de la chiromancie. Il replace les noms traditionnels et les récits historiques dans leur contexte culturel et les distingue clairement des affirmations validées scientifiquement.", "HandFuture publie ce site. Les dates des pages éditoriales indiquent quand le contenu a réellement été révisé et mis à jour ; elles ne représentent ni la taille de l’organisation, ni ses résultats commerciaux, ni des qualifications professionnelles."] },
      { heading: "Ce qu’il propose", paragraphs: ["Le site propose des guides d’introduction sourcés et un détecteur d’articulations fonctionnant dans le navigateur. Après avoir localisé des repères généraux de la main, le détecteur choisit une carte de réflexion générale dans un ensemble fixe.", "La carte sert au divertissement culturel et à la réflexion personnelle. La géométrie utilisée pour la choisir est seulement une entrée stable du programme, pas une lecture de la paume ni une mesure de la personne photographiée."] },
      { heading: "Ce qu’il ne prétend pas", paragraphs: ["HandFuture ne fournit ni lecture scientifique de la paume, ni évaluation de personnalité, diagnostic, prédiction ou consultation spécialisée. Il ne présente pas les coordonnées articulaires comme une preuve concernant santé, aptitudes, relations ou avenir.", "La fonction actuelle utilise une technologie générale de détection des articulations. HandFuture ne prétend posséder ni collection exclusive d’images, ni méthode d’entraînement exclusive, ni technologie interne capable d’interpréter les plis de la paume."] },
      { heading: "Principes éditoriaux", paragraphs: ["Le contenu distingue les récits traditionnels des preuves vérifiables, renvoie vers des sources accessibles quand c’est possible et expose les limites de détection et d’interprétation. Les sources historiques sont lues dans leur époque, pas décrites comme un consensus entre cultures.", "Les erreurs substantielles qui affectent la compréhension seront corrigées. Chaque page éditoriale affiche sa date réelle de mise à jour afin de permettre d’évaluer l’actualité des informations."] },
    ],
    sources: [],
  }),
  privacy: page({
    title: "Politique de confidentialité",
    summary: "Cette politique explique comment le site HandFuture actuel traite les images de mains, requêtes externes, stockage du navigateur, diffusion, analyses agrégées, publicité Google et choix régionaux de consentement. Elle prend effet et a été mise à jour le 2026-07-26.",
    sections: [
      { heading: "Champ d’application et date", paragraphs: ["Cette politique s’applique au site public HandFuture et à sa fonction interactive dans le navigateur. Sa date d’entrée en vigueur et sa dernière mise à jour sont toutes deux le 2026-07-26.", "Les informations ci-dessous décrivent les flux actuellement vérifiables dans le code et la configuration de déploiement. Les services tiers traitent les données reçues selon leurs propres politiques."] },
      { heading: "Images de mains", paragraphs: ["Ce n’est qu’après le choix d’un fichier que FileReader lit l’image dans le navigateur. Celui-ci la décode en HTMLImageElement en mémoire et la transmet directement au détecteur MediaPipe sur l’appareil pour la détection des articulations et l’aperçu, sans étape de dessin intermédiaire. L’image n’est pas envoyée à un serveur d’application de HandFuture.", "L’image choisie, le HTMLImageElement décodé, les coordonnées et la carte restent dans la mémoire de la page actuelle et ne sont pas écrits par HandFuture dans un stockage persistant. Réinitialisation, actualisation, fermeture de l’onglet ou gestion de la mémoire par le navigateur suppriment ces états."] },
      { heading: "Requêtes de ressources externes", paragraphs: ["Après le choix d’une image, le navigateur charge les fichiers du modèle MediaPipe depuis le réseau de diffusion cdn.jsdelivr.net. À chaque chargement de page, le site récupère aussi les fichiers Google Fonts sur fonts.googleapis.com et fonts.gstatic.com.", "Ces requêtes obtiennent seulement le modèle et les polices. Comme toute requête web, elles peuvent transmettre aux fournisseurs des métadonnées ordinaires, telles que l’adresse IP et le user agent du navigateur. Elles n’incluent ni l’image choisie, ni les coordonnées, ni une télémétrie propre à HandFuture."] },
      { heading: "Stockage du navigateur", paragraphs: ["Le site n’écrit que trois clés de stockage local, toutes des préférences d’interface : palm-reading-storage conserve l’acceptation de l’avertissement ; language-store, la préférence de langue ; palm-theme, le thème. Elles ne conservent ni photo, ni élément d’image décodé, ni coordonnées articulaires.", "Vous pouvez examiner et effacer tout ce que handfortune.com stocke localement dans les réglages de données de site ou de confidentialité du navigateur. L’effacement rétablit les préférences et l’avertissement peut réapparaître lors d’une visite ultérieure."] },
      { heading: "Hébergement et analyses Vercel", paragraphs: ["Vercel fournit l’hébergement. Le fournisseur traite les journaux de diffusion du contenu selon son service et ses politiques, tandis que Vercel Web Analytics fournit des analyses agrégées de l’utilisation. Les événements analytiques HandFuture ne contiennent pas la photo de la main.", "Consultez la documentation de confidentialité Vercel Analytics ci-dessous pour connaître la conception de Web Analytics et le traitement des données associées."] },
      { heading: "Publicité Google", paragraphs: ["Le site contient le code publicitaire Google AdSense. Ce script peut demander des ressources à Google et utiliser des Cookie ou un autre stockage selon le consentement du visiteur et la politique de Google. L’affichage et les contrôles disponibles dépendent aussi de l’état du service Google.", "L’usage d’un bloqueur ou l’absence d’autorisation publicitaire du site ne limite ni le contenu HandFuture ni sa fonction locale. Consultez la Google Privacy Policy liée pour le traitement des données de service par Google."] },
      { heading: "Consentement régional", paragraphs: ["Avant de diffuser des annonces personnalisées ou non personnalisées là où Google exige une gestion du consentement, une CMP certifiée par Google sera activée via AdSense Privacy & messaging. Jusqu’à la fin du paramétrage, la CMP n’est pas décrite comme une fonction actuellement opérationnelle.", "L’exigence de Google concernant l’emploi d’une CMP certifiée par les éditeurs est liée ci-dessous. Quand des contrôles sont présentés, les visiteurs peuvent sélectionner ou ajuster les options disponibles."] },
      { heading: "DNS Cloudflare", paragraphs: ["Dans la configuration actuelle, Cloudflare fournit uniquement le DNS faisant autorité. Ce n’est ni le proxy de contenu ni l’hébergeur actif de HandFuture ; Vercel diffuse le contenu du site."] },
      { heading: "Choix et droits", paragraphs: ["Vous pouvez refuser de choisir une image, effacer les données du site, utiliser les contrôles de Cookie et de stockage, et ajuster vos choix quand une interface de consentement apparaît. Désactiver certaines fonctions peut réinitialiser des préférences ou affecter la publicité tierce, mais les articles restent accessibles.", "Pour le traitement et les choix propres à chaque fournisseur, consultez les politiques officielles Vercel et Google ci-dessous. Les droits applicables demeurent soumis à la loi et aux procédures proposées par la partie qui traite réellement les données."] },
      { heading: "Contact", paragraphs: ["L’adresse relative à la politique de confidentialité est privacy@handfortune.com. Elle n’est surveillée qu’après activation du routage de messagerie du domaine. Un Cloudflare Email Routing fonctionnel est une condition de publication ; avant de tester le routage et la réception réelle, l’adresse ne doit pas être considérée comme un canal de contact actuel."] },
    ],
    sources: privacySources,
  }),
  terms: page({
    title: "Conditions d’utilisation",
    summary: "Ces conditions expliquent la portée de divertissement culturel de HandFuture, les responsabilités, les droits sur le contenu, les limites du service et le droit applicable. Lisez ces limites avant d’utiliser le site.",
    sections: [
      { heading: "Acceptation et description du service", paragraphs: ["En visitant ou utilisant HandFuture, vous acceptez de respecter ces conditions et le droit applicable. Si vous refusez, cessez d’utiliser le site. HandFuture propose des articles sourcés sur la chiromancie, la détection des articulations et des cartes générales dans la page actuelle.", "Le service ne crée ni relation de compte, ni relation entre professionnel et client, ni service médical, ni relation fiduciaire. Tous les documents culturels et résultats interactifs restent soumis à la limite de divertissement ci-dessous."] },
      { heading: "Divertissement uniquement", paragraphs: ["Les articles, la détection des articulations et les cartes servent uniquement au divertissement culturel et à l’autoréflexion générale. Ce ne sont pas des évaluations factuelles et ils ne fournissent aucun conseil médical, de santé mentale, juridique, financier, d’emploi, de relation, de compatibilité ou d’avenir.", "Ne vous fiez pas au site pour des décisions importantes concernant santé, sécurité, droits, argent, travail, relations ou avenir. Utilisez des informations fiables et, lorsque nécessaire, un professionnel qualifié pour les décisions exigeant une expertise."] },
      { heading: "Indication d’âge", paragraphs: ["Les visiteurs n’ayant pas atteint l’âge de la majorité là où ils vivent doivent utiliser le site avec un parent ou tuteur. Les règles varient selon le lieu et ces conditions ne prétendent pas fixer un seuil unique pour tout le monde."] },
      { heading: "Utilisation acceptable", paragraphs: ["N’utilisez pas le site pour une conduite illégale, contrefaisante, trompeuse, harcelante ou abusive. Ne perturbez pas le site, ne contournez pas ses restrictions, n’introduisez pas de code malveillant et ne tentez pas d’accéder sans autorisation aux systèmes associés.", "Ne générez pas de trafic automatisé, ne collectez pas au point de surcharger le service et ne manipulez pas la publicité, ses impressions ou clics. Ne perturbez pas non plus le fonctionnement normal des annonces ou du site. La lecture raisonnable du contenu public reste permise."] },
      { heading: "Images des utilisateurs", paragraphs: ["Vous devez avoir le droit d’utiliser chaque image et garder hors du cadre les visages, documents et autres contenus identifiables de tiers. Ne choisissez pas d’image portant atteinte à la vie privée, au droit d’auteur ou à d’autres droits.", "HandFuture ne revendique pas la propriété des photos choisies localement. Choisir un fichier permet seulement à la page actuelle de le traiter ; cela ne transfère aucun droit à HandFuture et n’autorise pas une utilisation publique."] },
      { heading: "Propriété intellectuelle et licences", paragraphs: ["Sauf indication contraire, le code, la marque HandFuture et le contenu éditorial restent protégés par les règles de propriété intellectuelle. L’accès est permis pour une navigation ordinaire et un usage personnel, mais ne transfère aucune propriété.", "Les composants tiers et libres restent soumis à leurs licences, et les droits sur les sources citées appartiennent à leurs titulaires. Un lien ou une citation ne signifie pas que HandFuture possède le matériau tiers."] },
      { heading: "Disponibilité et modifications", paragraphs: ["Les fonctions, contenus et URL peuvent changer, être suspendus ou cesser pour maintenance, limites techniques ou besoins éditoriaux. HandFuture ne promet pas le maintien d’une fonction et ne garantit ni disponibilité, ni délai de réponse, ni service ininterrompu.", "Si ces conditions changent sensiblement, la version mise à jour affichera une nouvelle date. Continuer à utiliser le site après une modification signifie accepter les conditions alors affichées."] },
      { heading: "Avertissement et limitation de responsabilité", paragraphs: ["Dans la mesure permise par le droit applicable, le site est fourni selon disponibilité, sans garantie sur les interprétations culturelles, résultats, exhaustivité, adéquation ou disponibilité. Chaque visiteur reste responsable de sa compréhension et de son usage du contenu.", "Dans la mesure permise par le droit applicable, HandFuture n’est pas responsable des pertes indirectes, accessoires ou consécutives dues à l’utilisation ou l’impossibilité d’utiliser le site. Cette limite n’exclut aucune responsabilité que la loi interdit d’exclure ou limiter."] },
      { heading: "Contact", paragraphs: ["Pour le traitement des données et les canaux disponibles, consultez la Politique de confidentialité. La disponibilité du contact dépend de la condition de publication indiquée dans cette politique ; les présentes conditions ne donnent pas d’autre adresse non vérifiée."] },
    ],
    sources: [{ label: "Politique de confidentialité", url: "/privacy" }],
  }),
};
