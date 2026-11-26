export const demoPdf = '/previews/codigo-penal-360-amostras.pdf'

export const images = {
  hero: 'hero/01-kit-completo-hero',
  guide: 'produto-principal/02-codigo-penal-360',
  premium: 'ofertas/20-pacote-premium',
  basic: 'ofertas/21-pacote-basico',
  downsell: 'popup/22-mockup-downsell',
}

export const asset = (path: string) => '/assets/oficiais/' + path + '.webp'

export const bonuses = [
  { id: 'mapas', image: '13-bonus-mapas-mentais', title: 'Mapas mentais ilustrados', info: 'Revise os elementos de cada conceito com um esquema visual.' },
  { id: 'questoes', image: '14-bonus-questoes', title: 'Questões comentadas', info: 'Confira o raciocínio por trás de cada resposta.' },
  { id: 'flashcards', image: '15-bonus-flashcards', title: 'Flashcards jurídicos', info: 'Responda de memória e confira o verso para praticar recuperação ativa.' },
  { id: 'guia', image: '16-bonus-penas-crimes', title: 'Guia de penas e crimes', info: 'Consulte o tema que precisa revisar e compare os dispositivos cobertos.' },
  { id: 'pegadinhas', image: '17-bonus-pegadinhas', title: 'Pegadinhas de Direito Penal', info: 'Identifique as distinções que podem mudar a resposta de uma questão.' },
  { id: 'simulados', image: '18-bonus-simulados', title: 'Simulados', info: 'Treine a resolução e identifique quais assuntos precisa revisar.' },
  { id: 'plano', image: '19-bonus-plano-estudos', title: 'Plano de estudos de 30 dias', info: 'Distribua leitura, exercícios e revisão ao longo de 30 dias.' },
] as const

export const offers: readonly { id: 'premium' | 'basic'; title: string; amount: number | null }[] = [
  { id: 'premium', title: 'Pacote Premium', amount: 27 },
  { id: 'basic', title: 'Pacote Básico', amount: 10 },
]

export const downsell = { amount: 17, title: 'Oferta alternativa' }

export const testimonials: { quote: string; author: string; authorized: boolean }[] = []

export const price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
