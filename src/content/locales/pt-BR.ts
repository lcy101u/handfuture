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

export const ptBREditorial: LocalizedEditorialBundle = {
  howItWorks: page({
    title: "Como o HandFuture funciona",
    summary: "Acompanhe os dados desde a escolha da foto até a detecção de articulações e a seleção do cartão de reflexão, incluindo o que fica na sessão atual do navegador e o que a ferramenta não infere.",
    sections: [
      {
        heading: "Escolher uma foto",
        paragraphs: [
          "O seletor aceita arquivos JPEG, PNG ou WebP de até 10MB. Escolha uma foto com apenas uma mão. O FileReader do navegador lê o arquivo selecionado expressamente como uma URL de dados temporária e o coloca no estado do aplicativo da página atual.",
          "Não existe um endpoint do HandFuture que receba essa foto. Ela não vira dado de conta nem conteúdo público; selecionar o arquivo apenas disponibiliza a imagem à página atual para a detecção. Mesmo assim, mantenha rostos, documentos e ambientes identificáveis fora do enquadramento.",
        ],
      },
      {
        heading: "Localizar as articulações da mão",
        paragraphs: [
          "O MediaPipe procura mãos na imagem e devolve pontos de referência padrão e informações sobre o lado da mão. O HandFuture confirma que só uma mão foi encontrada e valida exatamente 21 articulações representadas por coordenadas com valores finitos antes de aceitar o resultado como utilizável.",
          "A interface mantém a foto original e informa por texto o estado da detecção; quando a validação termina, o botão do cartão é habilitado. O modelo não identifica as linhas nem as dobras da palma, incluindo as linhas da vida, cabeça, coração e destino, e não tira conclusões sobre a pessoa fotografada.",
        ],
      },
      {
        heading: "Escolher um cartão de reflexão",
        paragraphs: [
          "Depois de uma detecção bem-sucedida, e somente quando você aperta o botão, o programa transforma as coordenadas normalizadas em uma assinatura geométrica fixa. Ela escolhe uma entre quatro perguntas gerais. Coordenadas idênticas geram a mesma chave; não há um novo sorteio aleatório a cada clique.",
          "Essa etapa não infere personalidade, compatibilidade, saúde, carreira, riqueza nem futuro. O cartão é uma pergunta aberta de um conjunto fixo para entretenimento cultural e a autorreflexão não científica. A geometria fornece apenas uma chave estável de seleção; não mede uma pessoa.",
        ],
      },
      {
        heading: "Limpar e entender os limites",
        paragraphs: [
          "Redefinir remove do estado do aplicativo a foto, o resultado da detecção e o cartão. Fechar ou atualizar a página também elimina a foto da memória. Somente a aceitação do aviso fica no armazenamento local; nem a foto nem as coordenadas permanecem com essa preferência.",
          "A detecção pode falhar por enquadramento incompleto, pouca luz, imagem que o navegador não decodifica ou bloqueios de rede e conteúdo enquanto o modelo carrega. Sem mão, várias mãos e modelo indisponível são estados de limitação. Trocar a foto pode ajudar, mas nenhum resultado representa uma interpretação das linhas da palma.",
        ],
      },
    ],
    sources: implementationSources,
  }),
  guides: {
    "/guides/palmistry-basics": page({
      title: "Fundamentos da quiromancia: nomes tradicionais e contexto histórico",
      summary: "Entenda a quiromancia como tradição divinatória, por que as práticas variam entre comunidades e épocas e como ler nomes conhecidos sem tratar o folclore como avaliação factual.",
      sections: [
        {
          heading: "O que é quiromancia",
          paragraphs: [
            "Quiromancia costuma significar uma tradição divinatória que lê o caráter ou acontecimentos futuros nas linhas e características da mão. Dicionários e fontes históricas falam em leitura das linhas da palma ou chiromancy. A definição registra como uma prática cultural se apresenta; não valida suas alegações.",
            "O HandFuture aborda a quiromancia no âmbito do folclore, da história e das narrativas culturais. Ela não é um sistema de medição baseado em evidências, e as dobras da palma não são escalas de personalidade, capacidade, relacionamentos ou resultados de vida. O que uma tradição afirma e o que evidências confiáveis sustentam são perguntas diferentes.",
            "As dobras da palma ajudam a pele a flexionar quando seguramos objetos, e sua aparência varia com a anatomia e o movimento. Dar um nome simbólico a uma dobra cria uma estrutura interpretativa. Os nomes podem iniciar uma conversa sobre folclore, mas repetir associações em um diagrama não as transforma em leis naturais reproduzíveis.",
          ],
        },
        {
          heading: "Contexto histórico e muitas versões",
          paragraphs: [
            "O verbete de 1911 da Encyclopaedia Britannica situa a quiromancia entre a adivinhação e práticas ocultas e examina referências do Mediterrâneo antigo, China, Índia, regiões árabes e Europa do início da era moderna. É uma fonte histórica antiga, útil para observar como um período organizou o material, mas não uma descrição completa de culturas vivas atuais.",
            "Autores de épocas distintas não concordavam sobre formatos de mão, quantidade de montes, nomes de linhas ou significados simbólicos. Comunidades orais podem usar outros idiomas, regras de escolha da mão e sequências de leitura. Assim, um diagrama apresentado como padrão representa no máximo uma escola ou convenção editorial, não um mapa universal.",
            "O estudo histórico também pede atenção aos vieses. Obras antigas podem carregar pressupostos e vocabulário de seu período. Leitores atuais podem comparar fontes, identificar o ponto de vista do autor e evitar transformar um observador na voz de uma comunidade inteira. O contexto informa mais do que decorar um único gráfico.",
          ],
        },
        {
          heading: "Quatro nomes tradicionais",
          paragraphs: [
            "Diagramas tradicionais costumam chamar de linha da vida a dobra que contorna a base do polegar; de linha da cabeça, a que cruza o centro da palma; e de linha do coração, a mais próxima dos dedos. Algumas escolas chamam uma dobra vertical que sobe do punho de linha do destino. São rótulos tradicionais, não categorias médicas ou psicológicas.",
            "A linha da vida não determina longevidade, e seu comprimento, profundidade ou interrupções não estabelecem risco de saúde. A linha da cabeça não mede inteligência, a do coração não revela a qualidade de um relacionamento e a do destino não registra carreira ou finanças. Tratá-las como termos culturais impede que nomes literais virem conclusões sobre alguém.",
            "Palmas reais nem sempre exibem todas as linhas de um desenho; as dobras podem se sobrepor, ramificar ou mudar de aparência com a luz. A ausência de um rótulo tradicional não indica ausência de uma característica. O detector do HandFuture localiza apenas punho e articulações dos dedos; não classifica essas linhas tradicionais.",
          ],
          bullets: [
            "Linha da vida: tradicionalmente contorna a base do polegar; não representa longevidade.",
            "Linha da cabeça: tradicionalmente cruza o centro da palma; não representa inteligência.",
            "Linha do coração: tradicionalmente fica perto da base dos dedos; não representa resultados afetivos.",
            "Linha do destino: nome vertical usado por algumas escolas; não representa um destino fixo.",
          ],
        },
        {
          heading: "Ler com responsabilidade",
          paragraphs: [
            "Você pode tratar o material de quiromancia como folclore, tema de conversa ou ponto de partida para sua própria reflexão. Um nome tradicional pode inspirar uma pergunta aberta, como de que modo você tem reservado tempo para descansar. A resposta vem da sua experiência e das suas escolhas, não de uma dobra que forneça um fato. Preservar a autonomia importa mais do que buscar certeza.",
            "Nunca use uma interpretação para decisões médicas, de saúde mental, jurídicas, financeiras, de emprego, educação, relacionamento ou outras decisões importantes. Ela também não deve avaliar a confiabilidade, competência ou compatibilidade de outra pessoa. Questões que exigem conhecimento especializado merecem informação verificável e profissionais qualificados.",
            "Ao repetir uma interpretação, expressões como ‘algumas escolas afirmam’ ou ‘historicamente foi chamada’ mantêm o limite visível. Inclua fonte e data quando possível. Isso respeita o material cultural sem apresentar crença como evidência. Você também pode rejeitar toda interpretação; entretenimento nunca deve exigir obediência nem criar medo.",
          ],
        },
      ],
      sources: palmistrySources,
    }),
    "/guides/science-and-limitations": page({
      title: "Quiromancia, ciência e limitações",
      summary: "Separe a detecção de articulações da interpretação da palma, entenda por que descrições gerais parecem pessoais e mantenha o entretenimento longe de decisões com consequências.",
      sections: [
        {
          heading: "Detectar não é interpretar",
          paragraphs: [
            "O MediaPipe Hand Landmarker produz pontos de referência em coordenadas de imagem e do mundo, além do lado da mão. O HandFuture confirma que existe exatamente uma mão utilizável e valida que o resultado contém exatamente 21 coordenadas articulares finitas. É uma tarefa de localização por visão computacional: estima quais pontos correspondem às articulações padrão.",
            "O modelo não devolve linhas da vida, cabeça, coração ou destino. Sua saída não contém nomes de dobras, sentidos simbólicos, notas de personalidade ou categorias de vida. A interface mantém a foto e mostra o estado em texto; depois da validação, permite escolher um cartão. Pontos geométricos continuam sendo localização articular e não viram análise da palma ao receber outro nome.",
            "O HandFuture usa uma assinatura geométrica fixa para selecionar um cartão geral. A regra só faz coordenadas iguais produzirem a mesma chave. Uma regra reproduzível não demonstra que uma interpretação é verdadeira; apenas repete a seleção. O texto do cartão não é treinado com a pessoa nem a avalia.",
          ],
        },
        {
          heading: "O limite das evidências",
          paragraphs: [
            "Este projeto não afirma existir base científica para usar a palma a fim de prever ou determinar personalidade, saúde, relacionamentos, dinheiro, carreira ou acontecimentos futuros. Documentos históricos mostram que uma crença foi registrada ou praticada, mas sua existência não comprova efeito em um indivíduo. Evidência de tradição e evidência de efeito são categorias distintas.",
            "Sustentar um sistema de medição costuma exigir um alvo claramente definido, amostras adequadas, comparação com explicações alternativas e resultados confiáveis reproduzidos por pesquisadores independentes. Termos vagos, histórias de sucesso escolhidas ou reinterpretação depois de saber a resposta não oferecem evidência equivalente. Uma interface elegante não muda esse padrão.",
            "O uso de aprendizado de máquina no modelo visual não torna científica toda afirmação cultural ligada à saída. Avalie separadamente se o modelo localiza articulações, como o programa escolhe o cartão e se o cartão é apenas texto geral. Manter as camadas distintas impede confundir apresentação técnica com conhecimento sobre uma pessoa.",
          ],
        },
        {
          heading: "O efeito Barnum",
          paragraphs: [
            "O APA Dictionary of Psychology descreve o efeito Barnum como a tendência a aceitar descrições de personalidade amplamente aplicáveis como se fossem exclusivas. Uma frase como ‘você valoriza os outros, mas às vezes precisa ficar só’ comporta tendências opostas. Muitas pessoas recordam um caso compatível e sentem que a descrição é muito pessoal.",
            "Isso não significa que todo momento de identificação seja inútil. Uma pergunta geral pode ajudar a organizar ideias atuais. O limite é que a sensação subjetiva de acerto não demonstra, sozinha, que o texto obteve uma informação exclusiva da palma. Pergunte se serviria para muita gente, se desacordos foram ignorados e se o contexto já era conhecido.",
            "O HandFuture chama deliberadamente o resultado de cartão de reflexão e revela o conjunto fixo e o método de seleção. Você pode guardar uma pergunta útil e descartar um texto irrelevante sem atribuir a identificação às linhas da palma. Conhecer o efeito Barnum ajuda a manter a curiosidade e o limite das evidências.",
          ],
        },
        {
          heading: "Uso seguro",
          paragraphs: [
            "Não use um cartão ou resultado de quiromancia para questões médicas ou de saúde mental, direitos jurídicos, investimentos ou dívidas, contratação e emprego, promoção ou demissão, nem decisões importantes de relacionamento. O entretenimento desconhece todas as circunstâncias e não tem qualificação, dados ou processo responsável para esses julgamentos.",
            "Para sintomas físicos ou crise de saúde mental, busque apoio de saúde qualificado. Para questões jurídicas ou financeiras, use informação oficial confiável e um profissional habilitado na sua jurisdição. Trabalho e relacionamento devem se basear em comportamento observável, comunicação direta e processo justo, não em uma foto da mão.",
            "Não fotografe, classifique nem compartilhe resultados de quem não consentiu. Rótulos culturais não devem servir para ridicularizar, excluir ou pressionar. Entretenimento seguro é voluntário, fácil de interromper, livre de táticas de medo e trata cada cartão como uma pergunta geral que pode ser ignorada, não como ordem de autoridade.",
          ],
        },
      ],
      sources: scienceSources,
    }),
    "/guides/hand-photo-guide": page({
      title: "Guia de foto da mão: luz, enquadramento e privacidade",
      summary: "Prepare uma imagem mais fácil de detectar com luz uniforme, uma mão completa e fundo liso, entendendo o limite de arquivo, o processamento na sessão atual e os estados comuns do detector.",
      sections: [
        {
          heading: "Usar luz frontal uniforme",
          paragraphs: [
            "Ilumine a mão inteira por igual a partir da direção da câmera ou um pouco de lado. Mais brilho nem sempre é melhor: luz natural suave ou uma luz ambiente difusa costuma preservar melhor os contornos do que uma lâmpada pequena e intensa. Confira se punho, articulações e pontas dos dedos não desaparecem em áreas escuras.",
            "Evite reflexos, sombras profundas e contraluz. Pele brilhante, mesa de vidro ou flash direto podem produzir pontos brancos que apagam bordas articulares. Uma janela muito mais clara que a mão pode transformá-la em silhueta. Mover a luz ou a mão costuma ser mais útil que aplicar filtro de imagem.",
            "Se a exposição automática continuar mudando, mantenha a mão parada por um instante antes da foto. Tom de pele não é critério de sucesso. Importam um limite visível entre mão e fundo, áreas claras com detalhes e sombras não esmagadas. O HandFuture não avalia a aparência da pele.",
          ],
        },
        {
          heading: "Enquadrar uma mão aberta completa",
          paragraphs: [
            "Mantenha no quadro tudo do punho às cinco pontas dos dedos. Abra a mão naturalmente e deixe algum espaço entre os dedos. Aponte a câmera para a palma e evite dobrar muito os dedos em direção à lente, pois eles podem se sobrepor. Uma margem em volta da mão dá mais contexto que um fragmento recortado.",
            "Escolha um fundo liso que contraste com a mão. Tecido estampado, roupa de cor parecida e objetos sem relação aumentam a interferência visual. Inclua só uma mão e evite a sobreposição de outra mão, da mão de outra pessoa ou de um braço. A interface trata a saída com várias mãos como estado que pede uma nova foto.",
            "Anéis, relógios e pulseiras nem sempre impedem a detecção, mas mova ou retire o que cobrir o punho ou as articulações. Nunca force uma mão lesionada ou desconfortável a ficar reta. Conforto e segurança importam mais que a detecção, e a ferramenta não exige gesto especial.",
          ],
          bullets: [
            "Mostre uma mão inteira, do punho até todas as pontas dos dedos.",
            "Abra a palma naturalmente e reduza a sobreposição dos dedos.",
            "Use um fundo liso que contraste com a mão.",
            "Mova joias ou objetos que cubram articulações.",
          ],
        },
        {
          heading: "Arquivos e privacidade",
          paragraphs: [
            "O seletor implementado aceita JPEG, PNG e WebP, com limite de 10MB por arquivo. Tanto a extensão quanto o conteúdo precisam descrever uma imagem decodificável pelo navegador; renomear outro formato não o converte. Se a foto do celular for grande, reduza suas dimensões com ferramentas do aparelho ou exporte em formato compatível.",
            "Após a escolha, o FileReader lê a imagem na página atual e o HandFuture não tem endpoint para upload de fotos. A imagem fica na memória do aplicativo para o modelo durante esta sessão. Redefinir, fechar a aba ou atualizar remove esse estado. A aceitação do aviso é a única preferência relacionada salva separadamente no aparelho.",
            "Minimizar dados continua importante mesmo quando a foto não é enviada ao HandFuture. Mantenha fora da imagem rostos, documentos, etiquetas de endereço, telas e ambientes identificáveis. Não use a foto da mão de alguém sem consentimento. Em aparelho compartilhado, feche a aba ao terminar.",
          ],
        },
        {
          heading: "Solução de problemas",
          paragraphs: [
            "Se nenhuma mão for encontrada, verifique se punho e pontas estão visíveis, passe para uma luz uniforme e use fundo com mais contraste. Se várias mãos forem encontradas, reenquadre para deixar apenas uma. As duas mensagens são saídas do detector, não julgamentos da qualidade da foto ou da pessoa.",
            "Se o navegador não ler o arquivo, confira os formatos e o limite de 10MB e tente exportá-lo de novo. Um arquivo baixado de aplicativo social pode ter extensão conhecida e conteúdo incompleto; abri-lo na galeria e salvar outra cópia resolve alguns problemas de codificação. O HandFuture não guarda uma análise pela metade depois de um erro.",
            "O modelo precisa carregar recursos na primeira utilização. Interrupção de rede, política de conteúdo da empresa ou escola, extensão de privacidade ou bloqueio de CDN podem impedir a inicialização. Atualizar ou tentar depois pode ajudar; se o bloqueio persistir, não selecione repetidamente fotos sensíveis. Os guias continuam legíveis sem detecção.",
            "Melhorar luz e enquadramento ajuda o modelo a ver uma forma padrão, mas não garante sucesso em toda foto. Desempenho do aparelho, desfoque, poses incomuns e limites do modelo afetam a saída. Detecção bem-sucedida significa que articulações foram localizadas; não que as linhas da palma foram identificadas ou interpretadas.",
          ],
        },
      ],
      sources: implementationSources,
    }),
  },
  about: page({
    title: "Sobre o HandFuture",
    summary: "O HandFuture é um projeto web independente para explorar a cultura da quiromancia por meio de artigos introdutórios com fontes e de uma função transparente no navegador que separa tradição, capacidade técnica e evidência científica.",
    sections: [
      { heading: "Este projeto", paragraphs: ["O HandFuture é um projeto web independente para explorar a cultura da quiromancia. Ele situa nomes tradicionais e narrativas históricas em contexto cultural e os distingue claramente de alegações validadas pela ciência.", "O HandFuture publica este site. As datas nas páginas editoriais registram quando o material foi realmente revisto e atualizado; não representam tamanho da organização, resultados comerciais ou credenciais profissionais."] },
      { heading: "O que oferece", paragraphs: ["O site oferece guias introdutórios com fontes sobre cultura da quiromancia e um detector de articulações no navegador. Depois de localizar pontos gerais da mão, o detector escolhe um cartão de reflexão geral de um conjunto fixo.", "O cartão serve para entretenimento cultural e reflexão pessoal. A geometria usada na seleção é apenas uma entrada estável do programa, não uma leitura da palma nem uma medição da pessoa na foto."] },
      { heading: "O que não alega", paragraphs: ["O HandFuture não oferece leitura científica da palma, avaliação de personalidade, diagnóstico, previsão ou consultoria especializada. Não apresenta coordenadas articulares como evidência sobre saúde, capacidade, relacionamentos ou futuro.", "A função atual usa tecnologia geral de detecção de articulações. O HandFuture não alega ter coleção exclusiva de imagens, método exclusivo de treinamento ou tecnologia própria capaz de interpretar linhas da palma."] },
      { heading: "Princípios editoriais", paragraphs: ["O conteúdo distingue relatos tradicionais de evidências verificáveis, conecta fontes acessíveis quando possível e revela limites de detecção e interpretação. Material histórico é lido no contexto de sua época, não descrito como consenso entre culturas.", "Erros relevantes que afetem a compreensão serão corrigidos. Cada página editorial mostra a data real de atualização para que leitores possam avaliar a atualidade da informação."] },
    ],
    sources: [],
  }),
  privacy: page({
    title: "Política de Privacidade",
    summary: "Esta política explica como o site atual do HandFuture trata imagens de mãos, solicitações externas, armazenamento do navegador, entrega do site, análises agregadas, publicidade do Google e escolhas regionais de consentimento. Vigora e foi atualizada em 2026-07-26.",
    sections: [
      { heading: "Escopo e data", paragraphs: ["Esta política se aplica ao site público do HandFuture e à função interativa no navegador. A data de vigência e a atualização mais recente são 2026-07-26.", "As informações abaixo descrevem fluxos que hoje podem ser confirmados pelo código e pela configuração de implantação. Serviços de terceiros tratam os dados recebidos segundo suas próprias políticas."] },
      { heading: "Imagens de mãos", paragraphs: ["Somente após a pessoa escolher um arquivo o FileReader o lê no navegador. O navegador decodifica a imagem em um HTMLImageElement na memória e a envia diretamente ao detector MediaPipe do aparelho para detectar articulações e exibir a prévia, sem etapa intermediária de desenho. A imagem não é enviada a um servidor de aplicativos do HandFuture.", "A imagem selecionada, o HTMLImageElement decodificado, as coordenadas e o cartão ficam na memória da página atual e não são gravados pelo HandFuture em armazenamento persistente. Redefinir, atualizar, fechar a aba ou o gerenciamento de memória do navegador remove esses estados."] },
      { heading: "Solicitações de recursos externos", paragraphs: ["Depois da escolha da imagem, o navegador carrega os arquivos do modelo MediaPipe da rede de distribuição cdn.jsdelivr.net. A cada página carregada, também obtém arquivos do Google Fonts em fonts.googleapis.com e fonts.gstatic.com.", "Essas solicitações buscam apenas recursos do modelo e fontes. Como qualquer pedido web, podem expor aos provedores metadados comuns, como endereço IP e user agent do navegador. Não incluem a imagem escolhida, as coordenadas nem telemetria própria do HandFuture."] },
      { heading: "Armazenamento do navegador", paragraphs: ["O site grava apenas três chaves locais, todas preferências de interface: palm-reading-storage guarda a aceitação do aviso; language-store, a preferência de idioma; e palm-theme, a preferência de tema. Não guardam a foto, o elemento de imagem decodificado ou coordenadas articulares.", "Você pode verificar e apagar tudo o que handfortune.com armazena localmente nas configurações de dados do site ou privacidade do navegador. A exclusão restaura as preferências, e o aviso pode aparecer de novo em outra visita."] },
      { heading: "Sugestão de idioma", paragraphs: ["Para sugerir um idioma na página inicial sem prefixo, o HandFuture verifica primeiro a preferência de idioma salva e depois os idiomas do navegador. Somente se nenhum deles indicar um idioma compatível, a página solicita a um endpoint da Vercel na mesma origem um código de país de duas letras derivado do IP; uma URL que já indique um idioma ignora esse processo.", "Essa função não obtém nem armazena o IP completo, nem cria um perfil de localização. A Vercel pode tratar os dados de solicitação necessários para derivar o código segundo seu serviço de hospedagem e suas políticas; o endpoint devolve à página do HandFuture apenas o código do país ou null, nunca uma cidade ou localização mais precisa."] },
      { heading: "Hospedagem e análises da Vercel", paragraphs: ["A Vercel fornece hospedagem. O provedor trata registros de entrega de conteúdo conforme seus serviços e políticas, e o Vercel Web Analytics apresenta análises agregadas de uso. Os eventos analíticos do HandFuture não incluem a foto da mão.", "Consulte a documentação de privacidade do Vercel Analytics abaixo para saber como a Vercel projeta o Web Analytics e trata os dados relacionados."] },
      { heading: "Publicidade do Google", paragraphs: ["O site contém código de publicidade do Google AdSense. O script pode solicitar recursos do Google e usar Cookie ou outro armazenamento conforme o consentimento da pessoa e a política do Google. A exibição e os controles disponíveis também dependem do estado do serviço do Google.", "Usar bloqueador ou o site ainda não estar aprovado para anúncios não restringe o conteúdo do HandFuture nem sua função local. Consulte a Google Privacy Policy vinculada para o tratamento de dados do serviço pelo Google."] },
      { heading: "Consentimento regional", paragraphs: ["Antes de veicular anúncios personalizados ou não personalizados onde o Google exige gestão de consentimento, uma CMP certificada pelo Google será ativada pelo AdSense Privacy & messaging. Até concluir a configuração, a CMP não é descrita como função atualmente operacional.", "O requisito do Google para editores usarem CMP certificada está vinculado abaixo. Quando controles de consentimento forem exibidos, a pessoa poderá escolher ou ajustar as opções disponíveis."] },
      { heading: "DNS da Cloudflare", paragraphs: ["Na configuração atual, a Cloudflare fornece apenas DNS autoritativo. Ela não é o proxy de conteúdo nem a hospedagem ativa do HandFuture; a Vercel entrega o conteúdo do site."] },
      { heading: "Escolhas e direitos", paragraphs: ["Você pode não escolher imagem, apagar dados do site, usar controles de Cookie e armazenamento e ajustar escolhas quando houver interface de consentimento. Desativar algumas funções pode redefinir preferências ou afetar publicidade de terceiros, mas os artigos continuam acessíveis.", "Para tratamento e opções específicas de cada provedor, consulte as políticas oficiais da Vercel e do Google abaixo. Direitos aplicáveis por lei continuam sujeitos à legislação e aos procedimentos oferecidos por quem realmente processa os dados."] },
      { heading: "Contato", paragraphs: ["O endereço da política de privacidade é privacy@handfortune.com. Ele só é monitorado depois que o roteamento de e-mail do domínio é ativado. Um Cloudflare Email Routing funcional é requisito de publicação; até testar o roteamento e o recebimento real, o endereço não deve ser tratado como canal atual de contato."] },
    ],
    sources: privacySources,
  }),
  terms: page({
    title: "Termos de Uso",
    summary: "Estes termos explicam o escopo de entretenimento cultural do HandFuture, as responsabilidades, os direitos sobre conteúdo, os limites do serviço e a lei aplicável. Leia estes limites antes de usar o site.",
    sections: [
      { heading: "Aceitação e descrição do serviço", paragraphs: ["Ao visitar ou usar o HandFuture, você concorda em seguir estes termos e a legislação aplicável. Se não concordar, pare de usar o site. O HandFuture oferece artigos com fontes sobre cultura da quiromancia, detecção de articulações e cartões gerais que funcionam na página atual.", "O serviço não cria relação de conta, profissional-cliente, serviço médico ou relação fiduciária. Todo material cultural e resultado interativo continua sujeito ao limite de entretenimento abaixo."] },
      { heading: "Apenas para entretenimento", paragraphs: ["Os artigos, a detecção de articulações e os cartões servem apenas para entretenimento cultural e autorreflexão geral. Não são avaliações factuais de uma pessoa e não oferecem orientação médica, de saúde mental, jurídica, financeira, de emprego, relacionamento, compatibilidade ou futuro.", "Não use o conteúdo para decisões importantes sobre saúde, segurança, direitos, dinheiro, trabalho, relacionamento ou futuro. Use informações confiáveis e, quando necessário, profissionais qualificados nas decisões que exigem conhecimento especializado."] },
      { heading: "Orientação etária", paragraphs: ["Quem não tiver atingido a maioridade onde vive deve usar o site com pai, mãe ou responsável. As regras variam por local, e estes termos não afirmam um único limite de idade para todas as pessoas."] },
      { heading: "Uso aceitável", paragraphs: ["Não use o site para conduta ilegal, infratora, enganosa, assediante ou abusiva. Não interfira no site, contorne restrições de segurança, introduza código malicioso ou tente acesso não autorizado a sistemas relacionados.", "Não gere tráfego automatizado, faça coleta que sobrecarregue o serviço nem manipule anúncios, suas impressões ou cliques. Também não perturbe publicidade ou operação normal. A leitura razoável do conteúdo público não é limitada."] },
      { heading: "Imagens dos usuários", paragraphs: ["Você precisa ter direito de usar cada imagem e manter fora do quadro rostos, documentos e outros conteúdos identificáveis de terceiros. Não escolha imagem que infrinja privacidade, direito autoral ou outros direitos.", "O HandFuture não reivindica propriedade das fotos selecionadas localmente. Escolher um arquivo só permite processá-lo na página atual; não transfere direitos ao HandFuture nem concede permissão de uso público."] },
      { heading: "Propriedade intelectual e licenças", paragraphs: ["Salvo indicação contrária, o código, a marca HandFuture e o conteúdo editorial são protegidos por regras de propriedade intelectual. O acesso é permitido para navegação comum e uso pessoal, mas não transfere propriedade.", "Componentes de terceiros e de código aberto continuam sujeitos às próprias licenças, e os direitos do material citado ficam com seus titulares. Um link ou citação não significa que o HandFuture possua material de terceiros."] },
      { heading: "Disponibilidade e mudanças", paragraphs: ["Funções, conteúdo e URLs podem mudar, pausar ou terminar por manutenção, limites técnicos ou necessidades editoriais. O HandFuture não promete que determinada função continuará disponível nem garante tempo de atividade, resposta ou serviço ininterrupto.", "Se estes termos mudarem de forma relevante, a versão atualizada mostrará nova data. Continuar usando o site depois da mudança significa aceitar os termos exibidos então."] },
      { heading: "Isenção e limitação de responsabilidade", paragraphs: ["Na medida permitida pela lei aplicável, o site é oferecido conforme disponível, sem garantias sobre interpretações culturais, resultados, integridade, adequação ou disponibilidade. Cada visitante responde por como entende e usa o conteúdo.", "Na medida permitida pela lei aplicável, o HandFuture não responde por perdas indiretas, incidentais ou consequenciais decorrentes do uso ou impossibilidade de uso. Esta limitação não exclui responsabilidade que a lei não permita excluir ou limitar."] },
      { heading: "Contato", paragraphs: ["Para tratamento de dados e canais disponíveis, consulte a Política de Privacidade. A disponibilidade do contato depende do requisito de publicação indicado ali; estes termos não listam outro e-mail não verificado."] },
    ],
    sources: [{ label: "Política de Privacidade", url: "/privacy" }],
  }),
};
