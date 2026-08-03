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
  return { ...content, updatedAt: "2026-08-03" };
}

export const esEditorial: LocalizedEditorialBundle = {
  howItWorks: page({
    title: "Cómo funciona HandFuture",
    summary: "Sigue el recorrido de los datos desde la elección de una foto hasta la detección de articulaciones y la selección de una tarjeta de reflexión, incluido lo que permanece en la sesión actual y lo que la herramienta no infiere.",
    sections: [
      {
        heading: "Elegir una foto",
        paragraphs: [
          "El cargador acepta archivos JPEG, PNG o WebP de hasta 10MB. Elige una foto que contenga una sola mano. FileReader, en el navegador, lee el archivo que selecciones expresamente como una URL de datos temporal y lo guarda en el estado de la aplicación de la página actual.",
          "No existe un punto de carga que reciba esta foto: la foto no se carga en HandFuture. No pasa a ser un dato de cuenta ni contenido público; elegir el archivo solo permite que la página actual del navegador use la imagen para la detección. Aun así, evita incluir rostros, documentos y entornos identificables en el encuadre.",
        ],
      },
      {
        heading: "Localizar las articulaciones de la mano",
        paragraphs: [
          "MediaPipe busca manos en la imagen y devuelve puntos de referencia estándar e información sobre la lateralidad. HandFuture confirma que solo se haya encontrado una mano y valida que el resultado contenga exactamente 21 coordenadas articulares con valores finitos antes de considerarlo utilizable.",
          "La interfaz muestra sobre la foto original un esqueleto de 21 articulaciones unido por índices fijos y comunica por escrito el estado de la detección; tras validar se habilita la tarjeta. Los puntos no son pliegues: el modelo no identifica las líneas de vida, cabeza, corazón o destino ni obtiene conclusiones sobre la persona.",
        ],
      },
      {
        heading: "Elegir una tarjeta de reflexión",
        paragraphs: [
          "Después de una detección correcta, y solo al pulsar el botón, el programa convierte las coordenadas normalizadas en una firma geométrica fija. Esa firma selecciona una de cuatro preguntas generales. Unas coordenadas idénticas devuelven la misma clave, así que no se hace un sorteo aleatorio nuevo con cada clic.",
          "Este paso no infiere personalidad, compatibilidad, salud, profesión, riqueza ni futuro. La tarjeta es una pregunta abierta de un conjunto fijo para el entretenimiento cultural y la autorreflexión no científica. La geometría aporta una clave estable de selección; no mide a una persona.",
        ],
      },
      {
        heading: "Borrar y comprender los límites",
        paragraphs: [
          "Al restablecer se borran del estado de la aplicación la foto, el resultado de detección y la tarjeta. Cerrar o actualizar la página también elimina la foto de la memoria. Solo la aceptación del descargo persiste en el almacenamiento local; ni la foto ni las coordenadas se guardan con esa preferencia.",
          "La detección puede fallar por un encuadre incompleto, poca luz, una imagen que el navegador no pueda decodificar o bloqueos de red y contenido mientras se carga el modelo. Los estados sin mano, con varias manos o con modelo no disponible expresan límites. Cambiar la foto puede ayudar, pero ningún resultado equivale a interpretar las líneas de la palma.",
        ],
      },
    ],
    sources: implementationSources,
  }),
  guides: {
    "/guides/palmistry-basics": page({
      title: "Fundamentos de la quiromancia: nombres tradicionales y contexto histórico",
      summary: "Conoce la quiromancia como tradición adivinatoria, las diferencias entre comunidades y épocas, y una forma de leer nombres conocidos sin convertir el folclore en una evaluación de hechos.",
      sections: [
        {
          heading: "Qué es la quiromancia",
          paragraphs: [
            "La quiromancia suele definirse como una tradición adivinatoria que lee el carácter o los acontecimientos futuros en las líneas y rasgos de la mano. Los diccionarios y las fuentes históricas hablan de leer la palma o de chiromancy. La definición registra cómo se presenta una práctica cultural; no valida sus afirmaciones.",
            "HandFuture trata la quiromancia dentro del folclore, la historia y la narración cultural. No es un sistema de medición basado en evidencia, y los pliegues de la palma no son escalas de personalidad, capacidad, relaciones o resultados vitales. Lo que afirma una tradición y lo que respalda la evidencia fiable son preguntas distintas.",
            "Los pliegues ayudan a que la piel se doble al agarrar objetos, y su aspecto varía con la anatomía y el movimiento. Dar un nombre simbólico a un pliegue crea un marco interpretativo. Esos nombres pueden abrir una conversación sobre folclore, pero repetir una asociación en un diagrama no la convierte en una ley natural reproducible.",
          ],
        },
        {
          heading: "Contexto histórico y muchas versiones",
          paragraphs: [
            "La entrada de 1911 de Encyclopaedia Britannica sitúa la quiromancia entre la adivinación y las prácticas ocultas, y repasa referencias del Mediterráneo antiguo, China, India, regiones árabes y la Europa de la primera modernidad. Es una fuente histórica antigua: sirve para estudiar cómo una época organizó el material, pero no describe por completo ninguna cultura viva actual.",
            "Autores de distintos periodos discreparon sobre las formas de la mano, el número de montes, los nombres de líneas y sus significados simbólicos. Las comunidades orales también pueden usar otros idiomas, reglas para elegir la mano y secuencias de lectura. Un diagrama ‘estándar’ representa como mucho una escuela o convención editorial, no un mapa universal.",
            "El estudio histórico exige además atender a los sesgos. Las obras antiguas pueden contener supuestos y vocabulario propios de su época. Quien lee hoy puede comparar fuentes, reconocer la perspectiva del autor y evitar convertir a un observador en portavoz de toda una comunidad. El contexto informa más que memorizar un solo gráfico.",
          ],
        },
        {
          heading: "Cuatro nombres tradicionales",
          paragraphs: [
            "Los diagramas tradicionales suelen llamar línea de la vida al pliegue que rodea la base del pulgar; línea de la cabeza al que cruza el centro de la palma; y línea del corazón al que está más cerca de los dedos. Algunas escuelas llaman línea del destino a un pliegue vertical que sube desde la muñeca. Son etiquetas tradicionales, no categorías médicas ni psicológicas.",
            "La línea de la vida no determina la longevidad, y su longitud, profundidad o interrupciones no establecen riesgos de salud. La línea de la cabeza no mide la inteligencia, la del corazón no revela la calidad de una relación y la del destino no registra una carrera o unas finanzas. Tratarlas como términos culturales evita convertir sus nombres literales en conclusiones personales.",
            "Las palmas reales no siempre muestran todas las líneas de un diagrama; los pliegues pueden superponerse, bifurcarse o verse distintos con otra luz. La ausencia de una etiqueta tradicional no implica que falte un rasgo. El detector de HandFuture solo localiza la muñeca y las articulaciones de los dedos; no clasifica esas líneas tradicionales.",
          ],
          bullets: [
            "Línea de la vida: tradicionalmente rodea la base del pulgar; no representa la longevidad.",
            "Línea de la cabeza: tradicionalmente cruza el centro de la palma; no representa la inteligencia.",
            "Línea del corazón: tradicionalmente está cerca de la base de los dedos; no representa resultados afectivos.",
            "Línea del destino: nombre vertical usado por algunas escuelas; no representa un destino fijo.",
          ],
        },
        {
          heading: "Leer de forma responsable",
          paragraphs: [
            "Puedes tratar el material de quiromancia como folclore, conversación o punto de partida para tu propia reflexión. Un nombre tradicional podría inspirar una pregunta abierta, como de qué manera reservas tiempo para descansar. La respuesta procede de tu experiencia y tus decisiones, no de un pliegue que aporte un hecho. Mantener la autonomía importa más que buscar certeza.",
            "Nunca uses una interpretación para decisiones médicas, de salud mental, jurídicas, financieras, laborales, educativas, de pareja ni otras decisiones importantes. Tampoco debe servir para juzgar la fiabilidad, capacidad o compatibilidad de otra persona. Los asuntos que requieren conocimientos especializados merecen información verificable y profesionales cualificados.",
            "Al repetir una interpretación, expresiones como ‘según algunas escuelas’ o ‘históricamente se denominó’ mantienen visible el límite. Añade la fuente y su fecha cuando sea posible. Así se respeta el material cultural sin presentar una creencia como evidencia. También puedes rechazar todas las interpretaciones; el entretenimiento nunca debe exigir obediencia ni provocar miedo.",
          ],
        },
      ],
      sources: palmistrySources,
    }),
    "/guides/science-and-limitations": page({
      title: "Quiromancia, ciencia y limitaciones",
      summary: "Distingue la detección de articulaciones de la interpretación de la palma, comprende por qué las descripciones generales parecen personales y aparta el entretenimiento de las decisiones con consecuencias.",
      sections: [
        {
          heading: "Detectar no es interpretar",
          paragraphs: [
            "MediaPipe Hand Landmarker produce puntos de referencia en coordenadas de imagen y del mundo, además de la lateralidad. HandFuture confirma que haya exactamente una mano utilizable y valida que el resultado contenga exactamente 21 coordenadas articulares finitas. Es una tarea de localización por visión artificial: estima qué puntos de la imagen corresponden a articulaciones estándar.",
            "El modelo no devuelve las líneas de la vida, cabeza, corazón o destino. Su salida no contiene nombres de pliegues, significados simbólicos, puntuaciones de personalidad ni categorías vitales. La interfaz muestra sobre la foto original un esqueleto de 21 articulaciones con conexiones de índice fijo y el estado en texto; tras validar permite elegir una tarjeta. Los puntos siguen siendo localización articular, no análisis de palma.",
            "HandFuture usa una firma geométrica fija para seleccionar una tarjeta general. La regla solo hace que unas coordenadas idénticas produzcan la misma clave. Que un programa sea reproducible no demuestra la verdad de una interpretación; solo repite una selección. El texto de la tarjeta no se entrena con la persona ni la evalúa.",
          ],
        },
        {
          heading: "El límite de la evidencia",
          paragraphs: [
            "Este proyecto no atribuye base científica al uso de la palma para pronosticar o determinar personalidad, salud, relaciones, dinero, carrera o hechos futuros. Un documento histórico puede demostrar que una creencia se registró o practicó, pero su existencia histórica no demuestra que funcione en una persona. La evidencia de una tradición y la de un efecto son categorías diferentes.",
            "Respaldar un sistema de medición suele exigir un objetivo bien definido, muestras adecuadas, comparación con explicaciones alternativas y resultados fiables reproducidos por investigadores independientes. Términos vagos, casos favorables seleccionados o reinterpretaciones después de conocer la respuesta no ofrecen evidencia equivalente. Una interfaz elegante no cambia ese estándar.",
            "Que el modelo visual utilice aprendizaje automático no vuelve científica cada afirmación cultural asociada a su salida. Hay que evaluar por separado si el modelo localiza articulaciones, cómo el programa elige una tarjeta y si esa tarjeta es simple prosa general. Separar las capas evita confundir una presentación técnica con conocimiento sobre una persona.",
          ],
        },
        {
          heading: "El efecto Barnum",
          paragraphs: [
            "El APA Dictionary of Psychology describe el efecto Barnum como la tendencia a aceptar descripciones de personalidad ampliamente aplicables como si encajaran de manera única. Una frase como ‘valoras a los demás, pero a veces necesitas soledad’ admite tendencias opuestas. Muchas personas recuerdan una experiencia coincidente y sienten que la descripción es muy personal.",
            "Eso no significa que todo momento de resonancia carezca de valor. Una pregunta general puede ayudar a ordenar ideas presentes. El límite es que la sensación subjetiva de encaje no demuestra por sí sola que el texto obtuviera información única de una palma. Pregúntate si serviría para mucha gente, si ignoraste los desacuerdos y si ya conocías el contexto.",
            "HandFuture llama deliberadamente tarjeta de reflexión al resultado y revela el conjunto fijo de preguntas y el método de selección. Puedes conservar una pregunta útil y descartar un texto irrelevante sin atribuir la resonancia a las líneas de la palma. Conocer el efecto Barnum permite mantener la curiosidad sin perder el límite de la evidencia.",
          ],
        },
        {
          heading: "Uso seguro",
          paragraphs: [
            "No uses una tarjeta o un resultado de quiromancia para cuestiones médicas o de salud mental, derechos jurídicos, inversiones o deudas, contratación y empleo, ascensos o despidos, ni decisiones importantes de pareja. El entretenimiento desconoce las circunstancias completas y carece de la cualificación, los datos y el proceso responsable que esas decisiones exigen.",
            "Ante síntomas físicos o una crisis de salud mental, busca apoyo sanitario cualificado. Para cuestiones jurídicas o financieras, utiliza información oficial fiable y profesionales con la cualificación adecuada en tu jurisdicción. Los asuntos laborales y de pareja deben basarse en conductas observables, comunicación directa y procesos justos, no en una foto de la mano.",
            "No fotografíes, clasifiques ni compartas un resultado sobre alguien que no haya dado su consentimiento. Las etiquetas culturales no deben usarse para ridiculizar, excluir o presionar. El entretenimiento seguro es voluntario, fácil de abandonar, no usa el miedo y trata cada tarjeta como una pregunta general que se puede ignorar, no como una orden autorizada.",
          ],
        },
      ],
      sources: scienceSources,
    }),
    "/guides/hand-photo-guide": page({
      title: "Guía para fotos de manos: luz, encuadre y privacidad",
      summary: "Prepara una imagen más fácil de detectar con luz uniforme, una mano completa y un fondo liso, y conoce los límites del archivo, el procesamiento de la sesión actual y los estados del detector.",
      sections: [
        {
          heading: "Usar luz frontal uniforme",
          paragraphs: [
            "Ilumina toda la mano de manera uniforme desde la dirección de la cámara o un poco hacia un lado. Más brillo no siempre es mejor: la luz diurna suave o una luz interior difusa suele conservar mejor los contornos que una lámpara pequeña e intensa. Comprueba que muñeca, articulaciones y puntas de los dedos no desaparezcan en zonas oscuras.",
            "Evita reflejos, sombras profundas y contraluz. La piel brillante, una mesa de vidrio o un flash directo pueden crear zonas blancas que borran bordes articulares. Una ventana mucho más luminosa que la mano puede convertirla en silueta. Mover la luz o la mano suele ser más útil que aplicar un filtro de imagen.",
            "Si la exposición automática cambia sin parar, mantén quieta la mano un momento antes de tomar la foto. El tono de piel no es un criterio de éxito. Importan un límite visible entre la mano y el fondo, luces que conserven detalle y sombras no empastadas. HandFuture no evalúa el aspecto de la piel.",
          ],
        },
        {
          heading: "Encuadrar una mano abierta completa",
          paragraphs: [
            "Mantén dentro del encuadre todo, desde la muñeca hasta las cinco puntas. Abre la mano con naturalidad y deja espacio entre los dedos. Orienta la cámara hacia la palma y evita doblar mucho los dedos hacia el objetivo, porque pueden solaparse. Un margen alrededor de la mano aporta más contexto que un fragmento recortado.",
            "Elige un fondo liso que contraste con la mano. Las telas estampadas, la ropa de color similar y los objetos ajenos añaden ruido visual. Incluye una sola mano y evita que se superpongan otra mano, la mano de otra persona o un brazo. La interfaz considera la salida con varias manos como un estado que requiere otra foto.",
            "Anillos, relojes y pulseras no impiden siempre la detección, pero muévelos o quítalos si cubren la muñeca o las articulaciones. Nunca fuerces a estirarse una mano lesionada o incómoda. La comodidad y la seguridad importan más que detectar, y la herramienta no exige ningún gesto especial.",
          ],
          bullets: [
            "Muestra una mano completa desde la muñeca hasta todas las puntas.",
            "Abre la palma con naturalidad y reduce el solapamiento de dedos.",
            "Usa un fondo liso que contraste con la mano.",
            "Mueve joyas u objetos que cubran articulaciones.",
          ],
        },
        {
          heading: "Archivos y privacidad",
          paragraphs: [
            "El cargador implementado admite JPEG, PNG y WebP, con un límite de 10MB por archivo. Tanto la extensión como el contenido deben describir una imagen que el navegador pueda decodificar; cambiar el nombre de otro formato no lo convierte. Si una foto del teléfono es grande, redúcela con las herramientas del dispositivo o expórtala en un formato compatible.",
            "Tras elegirla, FileReader lee la imagen en la página actual y HandFuture no dispone de un punto de carga de fotos. La imagen queda en la memoria de la aplicación para el modelo durante esta sesión. Restablecer, cerrar la pestaña o actualizar elimina ese estado. La aceptación del descargo es la única preferencia relacionada que se guarda aparte en el dispositivo.",
            "Minimizar datos sigue siendo importante aunque la foto no se envíe a HandFuture. Excluye rostros, documentos de identidad, etiquetas de dirección, pantallas y entornos identificables. No utilices la foto de la mano de alguien sin su permiso. En un dispositivo compartido, cierra la pestaña al terminar.",
          ],
        },
        {
          heading: "Solución de problemas",
          paragraphs: [
            "Si no se detecta una mano, comprueba que se vean muñeca y puntas, cambia a una luz uniforme y usa un fondo con más contraste. Si se detectan varias manos, reencuadra para dejar solo una. Ambos mensajes son salidas del detector, no juicios sobre la calidad de la foto ni sobre la persona.",
            "Si el navegador no lee el archivo, revisa los formatos y el límite de 10MB, y vuelve a exportarlo. Un archivo descargado de una aplicación social puede tener una extensión conocida pero contenido incompleto; abrirlo en la fototeca y guardar otra copia resuelve algunos problemas de codificación. HandFuture no conserva un análisis a medias después de un error.",
            "El modelo debe cargar recursos la primera vez. Una interrupción de red, la política de contenidos de una empresa o escuela, una extensión de privacidad o un bloqueo de CDN pueden impedir la inicialización. Actualizar o probar más tarde puede ayudar; si el bloqueo persiste, no selecciones repetidamente fotos sensibles. Las guías se leen sin detector.",
            "Mejorar luz y encuadre ayuda al modelo a ver una forma estándar, pero no garantiza el éxito de todas las fotos. El rendimiento del dispositivo, el desenfoque, las posturas inusuales y los límites del modelo influyen. Una detección correcta significa que se localizaron articulaciones; no que se identificaran o interpretaran las líneas de la palma.",
          ],
        },
      ],
      sources: implementationSources,
    }),
  },
  about: page({
    title: "Acerca de HandFuture",
    summary: "HandFuture es un proyecto web independiente para explorar la cultura de la quiromancia mediante artículos introductorios con fuentes y una función transparente en el navegador que separa tradición, capacidad técnica y evidencia científica.",
    sections: [
      { heading: "Este proyecto", paragraphs: ["HandFuture es un proyecto web independiente para explorar la cultura de la quiromancia. Sitúa los nombres tradicionales y los relatos históricos en su contexto cultural y los distingue claramente de afirmaciones validadas por la ciencia.", "HandFuture publica este sitio. Las fechas de las páginas editoriales indican cuándo se revisó y actualizó realmente el material; no representan tamaño de organización, resultados comerciales ni credenciales profesionales."] },
      { heading: "Qué ofrece", paragraphs: ["El sitio ofrece guías introductorias con fuentes sobre la cultura de la quiromancia y un detector de articulaciones que funciona en el navegador. Tras localizar puntos generales de la mano, el detector elige una tarjeta de reflexión general de un conjunto fijo.", "La tarjeta sirve para el entretenimiento cultural y la reflexión personal. La geometría usada para seleccionarla es solo una entrada estable del programa, no una lectura de la palma ni una medición de la persona fotografiada."] },
      { heading: "Qué no afirma", paragraphs: ["HandFuture no ofrece lectura científica de la palma, evaluación de personalidad, diagnóstico, predicción ni asesoramiento experto. No presenta las coordenadas de las articulaciones como evidencia sobre salud, capacidad, relaciones o futuro.", "La función actual utiliza tecnología general de detección de articulaciones. HandFuture no afirma disponer de una colección exclusiva de imágenes, un método de entrenamiento exclusivo ni una tecnología propia capaz de interpretar las líneas de la palma."] },
      { heading: "Principios editoriales", paragraphs: ["El contenido distingue los relatos tradicionales de la evidencia verificable, enlaza fuentes accesibles cuando es posible y revela los límites de detección e interpretación. El material histórico se lee en el contexto de su época y no como consenso entre culturas.", "Se corregirán los errores sustanciales que afecten a la comprensión. Cada página editorial muestra su fecha de actualización real para que sea posible valorar la vigencia de la información."] },
    ],
    sources: [],
  }),
  privacy: page({
    title: "Política de privacidad",
    summary: "Esta política explica cómo el sitio actual de HandFuture trata imágenes de manos, solicitudes externas, almacenamiento del navegador, entrega del sitio, análisis agregados, publicidad de Google y opciones regionales de consentimiento. Rige y se actualizó el 2026-07-26.",
    sections: [
      { heading: "Ámbito y fecha", paragraphs: ["Esta política se aplica al sitio público de HandFuture y a su función interactiva en el navegador. La fecha de entrada en vigor y la última actualización son 2026-07-26.", "Las declaraciones siguientes describen flujos de datos que pueden confirmarse actualmente a partir del código y la configuración de despliegue. Los terceros tratan los datos recibidos según sus propias políticas."] },
      { heading: "Imágenes de manos", paragraphs: ["Solo después de que una persona elija un archivo, FileReader lo lee en el navegador. Este lo decodifica como un HTMLImageElement en memoria y lo entrega directamente al detector MediaPipe del dispositivo para detectar articulaciones y mostrar la vista previa, sin un paso intermedio de dibujo. La imagen no se envía a un servidor de aplicaciones de HandFuture.", "La imagen seleccionada, el HTMLImageElement decodificado, las coordenadas y la tarjeta permanecen en la memoria de la página actual y HandFuture no los escribe en almacenamiento persistente. Restablecer, actualizar, cerrar la pestaña o la gestión de memoria del navegador elimina esos estados."] },
      { heading: "Solicitudes de recursos externos", paragraphs: ["Después de elegir una imagen, el navegador carga los archivos del modelo MediaPipe desde la red de distribución cdn.jsdelivr.net. Al cargar cada página, el sitio también obtiene archivos de Google Fonts desde fonts.googleapis.com y fonts.gstatic.com.", "Estas solicitudes solo obtienen recursos del modelo y tipografías. Como cualquier petición web, pueden revelar a esos proveedores metadatos ordinarios, como la dirección IP y el user agent del navegador. No incluyen la imagen seleccionada, las coordenadas ni telemetría propia de HandFuture."] },
      { heading: "Almacenamiento del navegador", paragraphs: ["El sitio escribe solo tres claves de almacenamiento local, todas preferencias de interfaz: palm-reading-storage guarda la aceptación del descargo; language-store, el idioma; y palm-theme, el tema. No guardan la foto, el elemento de imagen decodificado ni las coordenadas articulares.", "Puedes consultar y borrar todo lo almacenado para handfortune.com desde los ajustes de datos del sitio o privacidad del navegador. Al borrarlo se restauran las preferencias y el sitio puede volver a mostrar el descargo en otra visita."] },
      { heading: "Sugerencia de idioma", paragraphs: ["Para sugerir un idioma en la página de inicio sin prefijo, HandFuture consulta primero la preferencia de idioma guardada y después los idiomas del navegador. Solo si ninguno coincide con un idioma admitido, la página solicita a un endpoint de Vercel del mismo origen un código de país de dos letras derivado de la IP; una URL que ya indica un idioma omite este proceso.", "Esta función no obtiene ni guarda la IP completa, ni crea un perfil de ubicación. Vercel puede tratar los datos de solicitud necesarios para derivar el código según su servicio de alojamiento y sus políticas; el endpoint solo devuelve a la página de HandFuture el código de país o null, nunca una ciudad ni una ubicación más precisa."] },
      { heading: "Alojamiento y análisis de Vercel", paragraphs: ["Vercel proporciona el alojamiento. El proveedor gestiona los registros de entrega del contenido según su servicio y sus políticas, y Vercel Web Analytics presenta análisis agregados del uso. Los eventos analíticos de HandFuture no incluyen la foto de la mano.", "Consulta la documentación enlazada de Vercel Analytics para saber cómo Vercel diseña Web Analytics y trata los datos relacionados."] },
      { heading: "Publicidad de Google", paragraphs: ["El sitio contiene código publicitario de Google AdSense. El script puede solicitar recursos a Google y usar Cookie u otro almacenamiento según el consentimiento del visitante y la política de Google. Los anuncios y controles disponibles también dependen del estado del servicio de Google.", "Usar un bloqueador o que el sitio aún no esté autorizado a mostrar anuncios no restringe el contenido de HandFuture ni su función local. Consulta la Google Privacy Policy enlazada para el tratamiento que Google hace de los datos del servicio."] },
      { heading: "Consentimiento regional", paragraphs: ["Antes de servir anuncios personalizados o no personalizados donde Google exige gestionar el consentimiento, se activará una CMP certificada por Google mediante AdSense Privacy & messaging. Hasta completar la configuración, no se describe la CMP como una función actualmente operativa.", "El requisito de Google para que los editores usen una CMP certificada aparece enlazado abajo. Cuando se presenten controles de consentimiento, el visitante podrá seleccionar o ajustar las opciones disponibles."] },
      { heading: "DNS de Cloudflare", paragraphs: ["En la configuración actual, Cloudflare solo proporciona DNS autoritativo. No es el proxy de contenido ni el alojamiento activo de HandFuture; Vercel entrega el contenido del sitio."] },
      { heading: "Opciones y derechos", paragraphs: ["Puedes negarte a elegir una imagen, borrar datos del sitio, usar los controles de Cookie y almacenamiento, y ajustar opciones cuando aparezca una interfaz de consentimiento. Desactivar ciertas funciones puede restablecer preferencias o afectar anuncios de terceros, pero los artículos siguen accesibles.", "Para el tratamiento y las opciones de cada proveedor, consulta las políticas oficiales de Vercel y Google enlazadas. Los derechos que procedan por ley quedan sujetos a la normativa y a los procedimientos de quien realmente trate los datos."] },
      { heading: "Contacto", paragraphs: ["La dirección de la política de privacidad es privacy@handfortune.com. Solo se supervisa después de activar el enrutamiento de correo del dominio. Un Cloudflare Email Routing operativo es un requisito de publicación; hasta probar el enrutamiento y la recepción real, no debe considerarse un canal de contacto actual."] },
    ],
    sources: privacySources,
  }),
  terms: page({
    title: "Términos de uso",
    summary: "Estos términos explican el ámbito de entretenimiento cultural de HandFuture, las responsabilidades, los derechos de contenido, las limitaciones del servicio y la ley aplicable. Lee estos límites antes de usar el sitio.",
    sections: [
      { heading: "Aceptación y descripción del servicio", paragraphs: ["Al visitar o usar HandFuture, aceptas cumplir estos términos y la legislación aplicable. Si no estás de acuerdo, deja de usar el sitio. HandFuture ofrece artículos con fuentes sobre cultura quiromántica, detección de articulaciones y tarjetas generales que funcionan en la página actual.", "El servicio no crea una relación de cuenta, profesional-cliente, servicio médico ni relación fiduciaria. Todo material cultural y resultado interactivo queda sujeto al límite de entretenimiento siguiente."] },
      { heading: "Solo entretenimiento", paragraphs: ["Los artículos, la detección de articulaciones y las tarjetas son solo para entretenimiento cultural y autorreflexión general. No son evaluaciones objetivas de una persona ni ofrecen consejos médicos, de salud mental, jurídicos, financieros, laborales, de relaciones, compatibilidad o futuro.", "No te apoyes en el sitio para decisiones importantes sobre salud, seguridad, derechos, dinero, trabajo, relaciones o futuro. Usa información fiable y, cuando corresponda, profesionales cualificados para las decisiones que requieren conocimientos especializados."] },
      { heading: "Orientación sobre la edad", paragraphs: ["Quienes no hayan alcanzado la mayoría de edad donde viven deben usar el sitio con su madre, padre o tutor. Las reglas varían según el lugar y estos términos no afirman un único umbral para todas las personas."] },
      { heading: "Uso aceptable", paragraphs: ["No uses el sitio para conductas ilegales, infractoras, engañosas, acosadoras o abusivas. No interfieras con él, eludas restricciones de seguridad, introduzcas código malicioso ni intentes acceder sin autorización a sistemas relacionados.", "No generes tráfico automatizado, recopiles datos de forma que sobrecargue el servicio ni manipules anuncios, sus impresiones o clics. Tampoco perturbes la publicidad o el funcionamiento normal. La lectura razonable del contenido público no está restringida."] },
      { heading: "Imágenes de usuarios", paragraphs: ["Debes tener derecho a utilizar cada imagen y mantener fuera del encuadre rostros, documentos y otros contenidos identificables de terceros. No elijas imágenes que infrinjan privacidad, derechos de autor u otros derechos.", "HandFuture no reclama la propiedad de las fotos seleccionadas localmente. Elegir un archivo solo permite procesarlo en la página actual; no transfiere derechos a HandFuture ni concede permiso de uso público."] },
      { heading: "Propiedad intelectual y licencias", paragraphs: ["Salvo indicación contraria, el código, la marca HandFuture y el contenido editorial están protegidos por normas de propiedad intelectual. Se permite el acceso para navegación ordinaria y uso personal, pero ese acceso no transmite la propiedad.", "Los componentes de terceros y de código abierto siguen sujetos a sus licencias, y los derechos del material citado pertenecen a sus titulares. Un enlace o cita no significa que HandFuture sea propietario del material ajeno."] },
      { heading: "Disponibilidad y cambios", paragraphs: ["Funciones, contenido y URL pueden cambiar, pausarse o finalizar por mantenimiento, límites técnicos o necesidades editoriales. HandFuture no promete la continuidad de una función ni garantiza tiempo de actividad, respuesta o servicio ininterrumpido.", "Si estos términos cambian sustancialmente, la versión nueva mostrará otra fecha. Continuar usando el sitio después del cambio supone aceptar los términos mostrados entonces."] },
      { heading: "Descargo y limitación de responsabilidad", paragraphs: ["En la medida permitida por la ley aplicable, el sitio se ofrece según disponibilidad, sin garantías sobre interpretaciones culturales, resultados, integridad, idoneidad o disponibilidad. Cada visitante responde de cómo comprende y usa el contenido.", "En la medida permitida por la ley aplicable, HandFuture no responde por pérdidas indirectas, incidentales o consecuentes derivadas del uso o imposibilidad de uso. Esta limitación no excluye responsabilidades que legalmente no puedan excluirse o limitarse."] },
      { heading: "Contacto", paragraphs: ["Para el tratamiento de datos y cualquier canal disponible, consulta la Política de privacidad. La disponibilidad del contacto depende del requisito de publicación indicado allí; estos términos no incluyen otro correo no verificado."] },
    ],
    sources: [{ label: "Política de privacidad", url: "/privacy" }],
  }),
};
