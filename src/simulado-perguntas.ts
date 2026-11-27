export const codigoPenal = 'https://www2.camara.leg.br/legin/fed/declei/1940-1949/decreto-lei-2848-7-dezembro-1940-412868-normaatualizada-pe.html'

type Pergunta = {
  tema: string
  artigo: string
  enunciado: string
  opcoes: readonly [string, string, string, string]
  correta: 0 | 1 | 2 | 3
  comentario: string
}

export const perguntas: readonly Pergunta[] = [
  {
    tema: 'Consumação e tentativa',
    artigo: 'Art. 14, II',
    enunciado: 'Em um caso hipotético, a execução de um crime começa. Uma intervenção externa impede que todos os elementos da definição legal se realizem. Considerando somente os dados narrados, qual é o enquadramento?',
    opcoes: [
      'Crime consumado, porque começou a execução.',
      'Tentativa, porque a execução começou e a consumação falhou por circunstância alheia à vontade do agente.',
      'Mera preparação, porque o resultado deixou de acontecer.',
      'Desistência voluntária, porque o crime não se consumou.',
    ],
    correta: 1,
    comentario: 'A questão informa início da execução e interrupção por fator externo. O inciso II exige justamente esses dois elementos. A falta de consumação, sozinha, não indica desistência.',
  },
  {
    tema: 'Dolo e culpa',
    artigo: 'Art. 18, I e II',
    enunciado: 'Um responsável por equipamento deixa, por descuido, de aplicar uma verificação obrigatória. A omissão causa lesão. O enunciado informa que ele não quis o resultado e não assumiu o risco de produzi-lo. Qual elemento subjetivo deve ser examinado?',
    opcoes: [
      'Dolo direto, pois a omissão contrariou uma norma.',
      'Dolo eventual, pois houve lesão.',
      'Culpa por negligência, observada a previsão legal da modalidade culposa.',
      'Culpa apenas se o resultado tiver sido desejado.',
    ],
    correta: 2,
    comentario: 'Negligência é uma das formas de culpa. A existência da lesão não prova dolo. O parágrafo único limita a punição culposa aos casos expressos em lei.',
  },
  {
    tema: 'Estrito cumprimento de dever legal',
    artigo: 'Art. 23, III e parágrafo único',
    enunciado: 'Um agente público cumpre medida exigida por lei, mas o enunciado informa que ele excede dolosamente o limite imposto. Qual análise corresponde ao Código Penal?',
    opcoes: [
      'A função pública exclui automaticamente toda responsabilidade pelo excesso.',
      'Só o excesso involuntário recebe tratamento legal.',
      'A existência de dever legal dispensa avaliar como a conduta foi praticada.',
      'O estrito cumprimento do dever legal pode excluir a ilicitude, mas o excesso doloso ou culposo pode gerar responsabilidade.',
    ],
    correta: 3,
    comentario: 'O inciso III trata da conduta dentro dos limites do dever. O parágrafo único determina que se examine a responsabilidade pelo excesso doloso ou culposo.',
  },
  {
    tema: 'Estado de necessidade',
    artigo: 'Art. 24, caput',
    enunciado: 'Para retirar uma criança de um cômodo tomado pela fumaça, uma pessoa arromba a porta de terceiro. O perigo é atual, não foi provocado por ela, não há outro meio disponível e não seria razoável exigir que o direito à integridade da criança fosse sacrificado. Qual instituto está em foco?',
    opcoes: [
      'Estado de necessidade.',
      'Legítima defesa contra agressão humana.',
      'Desistência voluntária.',
      'Homicídio culposo.',
    ],
    correta: 0,
    comentario: 'A hipótese descreve salvamento de direito alheio diante de perigo atual que não se podia evitar de outro modo. O foco do art. 24 é o perigo, enquanto o art. 25 exige agressão injusta.',
  },
  {
    tema: 'Legítima defesa',
    artigo: 'Art. 25, caput',
    enunciado: 'Uma pessoa usa moderadamente os meios necessários para repelir uma agressão injusta que já está ocorrendo contra um terceiro. Qual aspecto do caso sustenta a legítima defesa?',
    opcoes: [
      'O direito protegido precisa ser de quem reage.',
      'Pode-se proteger direito próprio ou alheio diante de agressão injusta atual ou iminente.',
      'A reação pode ocorrer depois de cessada a agressão, por represália.',
      'A ocorrência de agressão dispensa o uso moderado dos meios.',
    ],
    correta: 1,
    comentario: 'A defesa de terceiro está abrangida pelo caput. O dispositivo também exige agressão injusta atual ou iminente, necessidade dos meios e moderação no uso.',
  },
  {
    tema: 'Homicídio',
    artigo: 'Art. 121, caput',
    enunciado: 'Uma pessoa age com intenção de matar, e o caso informa que sua conduta causa a morte de outra. Qual elemento separa a situação descrita de uma análise de tentativa de homicídio?',
    opcoes: [
      'A existência de planejamento prévio.',
      'A identidade da vítima ser conhecida.',
      'A ocorrência da morte como resultado da conduta.',
      'O intervalo de tempo entre a conduta e a morte.',
    ],
    correta: 2,
    comentario: 'O núcleo do caput é matar alguém. Pelas premissas da questão, a morte ocorreu e foi causada pela conduta, o que satisfaz o elemento de resultado. Eventuais qualificadoras exigem fatos próprios.',
  },
  {
    tema: 'Lesão corporal',
    artigo: 'Art. 129, § 1º, I',
    enunciado: 'Uma lesão dolosa deixa a vítima incapacitada para suas ocupações habituais por 45 dias. Não há informação sobre incapacidade permanente. Qual hipótese o enunciado descreve de forma expressa?',
    opcoes: [
      'Incapacidade para ocupações habituais por mais de 30 dias.',
      'Incapacidade permanente para o trabalho.',
      'Perda ou inutilização de membro.',
      'Perigo de vida, apenas pelo tempo de recuperação.',
    ],
    correta: 0,
    comentario: 'O período excede 30 dias e a incapacidade foi descrita em relação às ocupações habituais. Permanência, perda de membro e perigo de vida exigem dados distintos.',
  },
  {
    tema: 'Furto',
    artigo: 'Art. 155, caput',
    enunciado: 'Em um vestiário vazio, alguém retira sem autorização a mochila alheia e a leva para si. O relato não descreve violência, grave ameaça ou impedimento da resistência da vítima. Qual tipo básico corresponde aos fatos?',
    opcoes: [
      'Roubo, porque a perda do bem causa prejuízo.',
      'Estelionato, porque o dono não consentiu.',
      'Peculato, porque o objeto estava guardado.',
      'Furto, pela subtração de coisa móvel alheia.',
    ],
    correta: 3,
    comentario: 'A conduta indicada é a subtração de bem móvel alheio. O caso não traz o meio pessoal do roubo, fraude voltada ao erro de outra pessoa ou vínculo com função pública.',
  },
  {
    tema: 'Roubo',
    artigo: 'Art. 157, § 1º',
    enunciado: 'Logo após uma subtração, a pessoa ameaça gravemente quem a aborda, com o objetivo de permanecer com o objeto. Qual dado é decisivo para examinar a hipótese do § 1º?',
    opcoes: [
      'O valor de mercado do objeto.',
      'A ameaça logo depois da subtração com a finalidade de assegurar a detenção do objeto.',
      'A ameaça ter ocorrido dias antes.',
      'O dono do objeto ser a mesma pessoa que fez a abordagem.',
    ],
    correta: 1,
    comentario: 'O § 1º aplica a mesma pena a quem emprega violência ou grave ameaça logo depois de subtrair a coisa para assegurar a impunidade ou a detenção da coisa para si ou para terceiro.',
  },
  {
    tema: 'Estelionato',
    artigo: 'Art. 171, caput',
    enunciado: 'Ao vender uma peça comum, alguém usa laudo falso para fazer o comprador acreditar que ela é de coleção. O comprador paga o preço maior por causa do erro. Qual relação caracteriza a hipótese narrada?',
    opcoes: [
      'Fraude que induz a vítima em erro, gerando vantagem ilícita em prejuízo alheio.',
      'Violência à pessoa para subtrair o dinheiro.',
      'Mera inadimplência, independentemente do laudo usado antes do pagamento.',
      'Subtração sem participação da vítima.',
    ],
    correta: 0,
    comentario: 'O laudo falso produz erro no comprador, que realiza o pagamento. O caso apresenta o nexo entre fraude, erro, vantagem ilícita e prejuízo alheio.',
  },
  {
    tema: 'Receptação',
    artigo: 'Art. 180, caput',
    enunciado: 'Uma pessoa adquire para si uma bicicleta após o vendedor lhe informar expressamente que ela é produto de crime. Qual dado, além da aquisição, sustenta o exame da receptação dolosa?',
    opcoes: [
      'A bicicleta ter sido usada no dia seguinte.',
      'O pagamento ter ocorrido em espécie.',
      'O conhecimento de que o bem era produto de crime.',
      'O comprador trabalhar na administração pública.',
    ],
    correta: 2,
    comentario: 'No caso, a informação recebida fornece o dado subjetivo expresso no caput: o adquirente sabe que a coisa é produto de crime. Outras hipóteses e a modalidade culposa demandam análise própria.',
  },
  {
    tema: 'Peculato',
    artigo: 'Art. 312, caput',
    enunciado: 'Um servidor recebe um equipamento particular em guarda por força de suas atribuições e se apropria dele em proveito próprio. Qual elemento vincula os fatos ao peculato-apropriação?',
    opcoes: [
      'A propriedade pública do bem, indispensável ao tipo.',
      'A existência de violência contra o proprietário.',
      'A entrega voluntária do equipamento pelo proprietário, isoladamente.',
      'A posse do bem em razão do cargo e sua posterior apropriação.',
    ],
    correta: 3,
    comentario: 'O caput admite bem público ou particular. Na apropriação, o servidor já possui o bem devido ao cargo e passa a agir como se fosse seu.',
  },
]
