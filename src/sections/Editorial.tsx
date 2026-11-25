import { ArrowDown, ArrowDownToLine, ArrowRight, BookOpen, Brain, CalendarDays, Check, CircleCheck, FileText, Gavel, GraduationCap, Highlighter, Layers3, LayoutGrid, ListChecks, Map, NotebookPen, ShieldCheck } from 'lucide-react'
import { bonuses, demoPdf, legalSource } from '../config/catalog'
import samples from '../content/samples.json'

const pains = [
  'Compreender o significado dos artigos com uma linguagem mais acessível.',
  'Estudar Direito Penal com uma sequência organizada.',
  'Diferenciar conceitos jurídicos semelhantes.',
  'Praticar questões com explicações fundamentadas.',
  'Revisar conteúdos com esquemas e materiais visuais.',
  'Aproveitar melhor o tempo disponível para estudar.',
]

const method = [
  [BookOpen, 'Leia', 'Comece pelo trecho da lei.'],
  [Highlighter, 'Entenda', 'Traduza o juridiquês em ideias claras.'],
  [Map, 'Visualize', 'Conecte conceitos com esquemas e exemplos.'],
  [NotebookPen, 'Pratique', 'Resolva exercícios e confira o raciocínio.'],
  [Brain, 'Memorize', 'Recupere os conceitos com revisão ativa.'],
] as const

const bonusIcons = [Map, NotebookPen, Brain, Gavel, ListChecks, GraduationCap, CalendarDays]

const heroSizes = '(min-width: 1200px) 620px, (min-width: 801px) 49vw, (min-width: 650px) 560px, 94vw'
const heroSet = (extension: 'avif' | 'webp') =>
  '/assets/hero/kit-small.' + extension + ' 650w, /assets/hero/kit-medium.' + extension + ' 850w, /assets/hero/kit.' + extension + ' 1300w'

export function Hero({ live }: { live: boolean }) {
  return <section className="hero" aria-labelledby="hero-heading">
    <div className="wrap hero-grid">
      <div className="hero-copy">
        <p className="eyebrow"><span /> DIREITO PENAL EM LINGUAGEM SIMPLES</p>
        <h1 id="hero-heading">Cansado de ler o Código Penal e continuar <em>sem entender</em> o que está escrito?</h1>
        <p className="hero-intro">Entenda o Código Penal com explicações artigo por artigo, exemplos didáticos, mapas mentais e uma linguagem simples, desenvolvida para facilitar seus estudos.</p>
        <a className="button button-primary" href="#ofertas">Quero entender o Código Penal <ArrowRight size={20} /></a>
        <p className="hero-meta"><ShieldCheck size={17} /> Pagamento único · Acesso digital · Garantia de 7 dias</p>
      </div>
      <figure className="hero-figure">
        <picture>
          <source type="image/avif" srcSet={heroSet('avif')} sizes={heroSizes} />
          <img src="/assets/hero/kit.webp" srcSet={heroSet('webp')} sizes={heroSizes}
            width="1300" height="1230" fetchPriority="high" alt="Mockup autoral do Código Penal 360 com livro, páginas demonstrativas e cadernos do kit de estudo" />
        </picture>
        <figcaption><span /> {live ? 'Edição digital' : 'Composição demonstrativa da edição digital'}</figcaption>
      </figure>
    </div>
  </section>
}

export function Benefits() {
  return <section className="benefits dark" aria-labelledby="benefits-heading">
    <div className="wrap benefits-grid">
      <div><p className="eyebrow"><span /> PARA QUEM ESTUDA DIREITO PENAL</p><h2 id="benefits-heading">Ideal para quem deseja...</h2></div>
      <ul>{pains.map(pain => <li key={pain}><CircleCheck size={21} /><span>{pain}</span></li>)}</ul>
    </div>
  </section>
}

export function Comparison() {
  const furto = samples.find(article => article.id === 155)!
  return <section className="section comparison" aria-labelledby="comparison-heading">
    <div className="wrap">
      <div className="section-heading">
        <p className="eyebrow"><span /> A LEI NA PRÁTICA</p>
        <h2 id="comparison-heading">O mesmo artigo. <em>Outra leitura.</em></h2>
        <p>Compare o trecho do art. 155 com a explicação usada no material.</p>
      </div>
      <div className="comparison-grid">
        <article className="comparison-card before">
          <p className="card-kicker"><FileText size={18} /> ANTES</p>
          <h3>Somente o texto legal</h3>
          <p className="article-label">ART. 155 · FURTO</p>
          <blockquote>“{furto.law}”</blockquote>
          <a className="subtle-link" href={legalSource}>Consultar o Código Penal no Planalto <ArrowRight size={14} /></a>
        </article>
        <article className="comparison-card after">
          <p className="card-kicker"><Layers3 size={18} /> DEPOIS</p>
          <h3>Texto legal com contexto</h3>
          <blockquote>“{furto.law}”</blockquote>
          <p>{furto.plain}</p>
          <ol className="flow">{furto.steps.map(step => <li key={step}>{step}</li>)}</ol>
          <div className="example"><strong>Exemplo didático</strong><p>{furto.example}</p></div>
        </article>
      </div>
    </div>
  </section>
}

export function Method() {
  return <section className="section method" id="metodo" aria-labelledby="method-heading">
    <div className="wrap">
      <div className="section-heading centered">
        <p className="eyebrow"><span /> DA LEITURA À REVISÃO</p>
        <h2 id="method-heading">Método Lei em 5 Camadas</h2>
        <p>Cinco etapas para passar do texto legal à revisão ativa.</p>
      </div>
      <ol className="method-list">{method.map(([Icon, title, description], index) =>
        <li key={title}>
          <div className="method-icon"><Icon size={28} /><span>{index + 1}</span></div>
          <h3>{title}</h3><p>{description}</p>
        </li>)}</ol>
    </div>
  </section>
}

export function MainProduct({ live }: { live: boolean }) {
  return <>
    <section className="section main-product dark" aria-labelledby="product-heading">
      <div className="wrap product-grid">
        <div className="product-art"><img src="/assets/mockups/livro.webp" width="780" height="760" loading="lazy" alt="Mockup da capa do livro principal Código Penal 360" /></div>
        <div className="section-heading">
          <p className="eyebrow"><span /> MATERIAL PRINCIPAL</p>
          <h2 id="product-heading">Tudo o que você precisa para estudar Direito Penal de forma mais organizada</h2>
          <p>{live ? 'O livro reúne texto legal, explicações e navegação por assunto.' : 'Amostras do formato editorial planejado para o livro principal.'}</p>
          <ul className="checklist">{['Dispositivos legais vigentes e referências de consulta', 'Explicações claras e conceitos importantes em destaque', 'Exemplos didáticos e esquemas visuais', 'Índice clicável e navegação por assunto', 'Data de atualização identificada'].map(item => <li key={item}><Check size={17} /><span>{item}</span></li>)}</ul>
          <a className="text-link dark-link" href="#amostras">Ver as páginas demonstrativas <ArrowRight size={18} /></a>
        </div>
      </div>
    </section>
    <section className="section proof" aria-labelledby="proof-heading">
      <div className="wrap proof-grid">
        <div className="section-heading">
          <p className="eyebrow"><span /> AMOSTRA GRATUITA</p>
          <h2 id="proof-heading">Experimente uma sessão de estudo</h2>
          <p>Abra o PDF, escolha um artigo no índice e tente responder ao exercício antes de conferir o comentário.</p>
          <a href={demoPdf} download className="button button-outline"><ArrowDownToLine size={18} /> Baixar amostras em PDF</a>
        </div>
        <ul className="proof-list">
          <li><BookOpen size={21} /><div><strong>Trechos legais com fonte</strong><p>Confira o dispositivo e a data da consulta.</p></div></li>
          <li><LayoutGrid size={21} /><div><strong>Diagramas vetoriais</strong><p>Siga as relações entre os conceitos na página.</p></div></li>
          <li><NotebookPen size={21} /><div><strong>Exercícios com resposta explicada</strong><p>Compare o seu raciocínio com o comentário.</p></div></li>
        </ul>
      </div>
    </section>
  </>
}

export function Bonuses({ live }: { live: boolean }) {
  return <section className="section bonus-section" aria-labelledby="bonuses-heading">
    <div className="wrap">
      <div className="section-heading">
        <p className="eyebrow"><span /> KIT PREMIUM {live ? '' : '· CATÁLOGO PREVISTO'}</p>
        <h2 id="bonuses-heading">Além do Código Penal explicado,<br className="desktop-break" /> materiais para praticar e revisar.</h2>
        <p>Sete formatos complementares para diferentes momentos do estudo.</p>
      </div>
      <div className="bonus-grid">{bonuses.map((bonus, index) => {
        const Icon = bonusIcons[index]
        return <article className={'bonus-card bonus-' + bonus.id} key={bonus.id}>
          <div className="bonus-art"><img src={'/assets/mockups/' + bonus.id + '.webp'} width="480" height="380" alt={'Capa de ' + bonus.title} loading="lazy" /></div>
          <div className="bonus-copy"><span className="bonus-label"><Icon size={15} /> BÔNUS {String(index + 1).padStart(2, '0')}</span><h3>{bonus.title}</h3><p>{bonus.info}</p></div>
        </article>
      })}</div>
      <a className="button button-primary" href="#ofertas">Quero o material completo <ArrowDown size={19} /></a>
    </div>
  </section>
}
