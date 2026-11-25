export const legalSource = 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm'
export const sampleDate = '25/11/2026'
export const demoPdf = '/previews/codigo-penal-360-amostras.pdf'

export const bonuses = [
  { id: 'mapas', title: 'Mapas Mentais Ilustrados', info: 'Conecte os principais conceitos do Direito Penal em esquemas fáceis de revisar.' },
  { id: 'questoes', title: 'Questões Comentadas', info: 'Pratique com exercícios autorais e acompanhe o raciocínio de cada resposta.' },
  { id: 'flashcards', title: 'Flashcards Jurídicos', info: 'Recupere os conceitos de memória com perguntas diretas e respostas objetivas.' },
  { id: 'guia', title: 'Guia de Penas e Crimes', info: 'Localize dispositivos, penas e particularidades em tabelas organizadas.' },
  { id: 'pegadinhas', title: 'Pegadinhas de Direito Penal', info: 'Identifique distinções e erros de interpretação recorrentes nas provas.' },
  { id: 'simulados', title: 'Simulados Completos', info: 'Treine com uma sequência de questões, gabarito comentado e ficha de desempenho.' },
  { id: 'plano', title: 'Plano de Estudos', info: 'Organize leituras, exercícios e revisões em um roteiro de estudo.' },
] as const

export const offers = [
  { id: 'premium', title: 'Pacote Premium', amount: 27, intro: 'Leitura, prática e revisão no mesmo kit.', includes: ['Código Penal explicado', 'Exemplos didáticos e esquemas visuais', ...bonuses.map(bonus => bonus.title)] },
  { id: 'basic', title: 'Pacote Básico', amount: 10, intro: 'O essencial para entender a lei.', includes: ['Código Penal explicado', 'Exemplos didáticos', 'Ilustrações e esquemas', 'PDF digital', 'Índice clicável'] },
] as const

export type Plan = (typeof offers)[number]['id']
