import { ArrowRight } from 'lucide-react'
import { Brand } from './components/Brand'
import { Benefits, Bonuses, Comparison, Hero, MainProduct, Method } from './sections/Editorial'
import { Samples } from './sections/Samples'
import { Faq, FinalCall, Footer, Guarantee, Offers, site, Testimonials, useConsent } from './sections/Commerce'

export function App() {
  const privacy = useConsent()
  return <>
    <a href="#conteudo" className="skip">Pular para o conteúdo</a>
    <header id="inicio">
      <p className="utility"><span>ACESSO DIGITAL</span><i /><span>PAGAMENTO ÚNICO</span><i /><span>SEM MENSALIDADE</span></p>
      <div className="wrap navigation">
        <Brand />
        <nav aria-label="Navegação principal"><a href="#amostras">Amostras</a><a href="#metodo">O método</a><a href="#materiais">Materiais</a><a href="#faq">Dúvidas</a></nav>
        <a className="nav-cta" href="#ofertas">Ver pacotes <ArrowRight size={15} /></a>
      </div>
    </header>
    <main id="conteudo">
      <Hero live={site.live} />
      <Benefits />
      <Samples />
      <Comparison />
      <Method />
      <MainProduct live={site.live} />
      <Testimonials />
      <Bonuses live={site.live} />
      <Offers consent={privacy.consent} />
      <Guarantee />
      <Faq />
      <FinalCall />
    </main>
    <Footer {...privacy} />
  </>
}
