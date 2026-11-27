import { ArrowDown, ArrowRight, BookOpen, CircleCheck, FileText, GraduationCap, ListChecks } from 'lucide-react'
import { asset, images } from '../config/catalog'
import { site } from './Commerce'

const audiences = [
  [GraduationCap, 'Estudantes de Direito', 'Acompanhe a matéria da faculdade com exemplos dos artigos.'],
  [ListChecks, 'Concurseiros', 'Identifique as diferenças entre conceitos que aparecem nas questões.'],
  [BookOpen, 'Quem precisa revisar', 'Retome os pontos centrais com esquemas e exemplos práticos.'],
] as const

export function Hero() {
  const bundle = site.fullBundle
  const image = bundle ? images.hero : images.guide
  return <section className="hero" aria-labelledby="hero-heading">
    <div className="wrap hero-grid">
      <h1 id="hero-heading"><em>Destrave</em> o Código Penal</h1>
      <p className="hero-intro">Leia o artigo, entenda o exemplo e pratique a distinção entre conceitos como furto e roubo.</p>
      <img className="hero-art" src={asset(image + '-720')} srcSet={asset(image + '-720') + ' 720w, ' + asset(image) + ' 1440w'}
        sizes="(min-width: 720px) 390px, (min-width: 485px) 445px, calc(100vw - 40px)" width="720" height="720" fetchPriority="high"
        alt={bundle ? 'Guia Código Penal 360, amostras dos artigos e os sete materiais do kit' : 'Capa bordô do guia Código Penal 360 com três páginas ilustradas ao fundo'} />
      <a className="button button-primary hero-cta" href="#ofertas">QUERO VER AS OFERTAS <ArrowDown size={19} aria-hidden="true" /></a>
      <p className="hero-meta"><FileText size={16} aria-hidden="true" /> Material de acesso digital</p>
    </div>
  </section>
}

export function Benefits() {
  return <section className="benefits dark" aria-labelledby="benefits-heading">
    <div className="wrap">
      <h2 id="benefits-heading">Para quem é o Código Penal 360?</h2>
      <ul>{audiences.map(([Icon, title, description]) => <li key={title}>
        <Icon size={22} aria-hidden="true" />
        <div><strong>{title}</strong><p>{description}</p></div>
      </li>)}</ul>
    </div>
  </section>
}

export function MainProduct() {
  return <section className="section main-product" id="materiais" aria-labelledby="product-heading">
    <div className="wrap product-grid">
      <div className="section-heading">
        <h2 id="product-heading">Tudo o que você vai receber</h2>
        <p>{site.live ? 'O guia digital em PDF reúne trechos da lei, explicações em português simples, exemplos e esquemas visuais.' : 'Veja o formato do guia digital em PDF nas amostras. Cada página combina trechos da lei, explicações, exemplos e esquemas visuais.'}</p>
        <ul className="checklist" id="metodo">{['Distinguir furto de roubo pelas circunstâncias da conduta.', 'Comparar dolo e culpa com exemplos práticos.', 'Identificar quando a execução iniciada configura tentativa.'].map(item =>
          <li key={item}><CircleCheck size={20} aria-hidden="true" /><span>{item}</span></li>)}</ul>
        <a className="text-link" href="#amostras">Explorar as amostras <ArrowRight size={18} aria-hidden="true" /></a>
      </div>
      <div className="product-art">
        <img src={asset(images.guide + '-720')} width="720" height="720" loading="lazy" alt="Guia digital Código Penal 360 com exemplos de páginas internas" />
      </div>
    </div>
  </section>
}

export function Bonuses() {
  if (!site.confirmedBonuses.length) return null
  return <section className="section bonus-section" aria-labelledby="bonuses-heading">
    <div className="wrap">
      <div className="section-heading">
        <h2 id="bonuses-heading">Bônus do Pacote Premium</h2>
        <p>Escolha o material de acordo com o que precisa praticar ou revisar.</p>
      </div>
      <div className="bonus-grid">{site.confirmedBonuses.map(bonus =>
        <article className="bonus-card" key={bonus.id}>
          <div className="bonus-art"><img src={asset('bonus/' + bonus.image)} width="1440" height="1440" alt="" loading="lazy" /></div>
          <div className="bonus-copy"><h3>{bonus.title}</h3><p>{bonus.info}</p></div>
        </article>)}</div>
    </div>
  </section>
}
