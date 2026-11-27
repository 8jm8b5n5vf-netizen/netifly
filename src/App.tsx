import { ArrowRight } from 'lucide-react'
import { Brand } from './components/Brand'
import { Benefits, Bonuses, Hero, MainProduct } from './sections/Editorial'
import { Samples } from './sections/Samples'
import { StudyCollection } from './sections/StudyCollection'
import { Faq, FinalCall, Footer, Guarantee, Offers, Testimonials, site, useConsent } from './sections/Commerce'

export function App() {
  const privacy = useConsent()
  return <>
    <a href="#conteudo" className="skip">Pular para o conteúdo</a>
    <header id="inicio">
      <p className="utility">DIREITO PENAL EM LINGUAGEM SIMPLES</p>
      <div className="wrap navigation">
        <Brand />
        <nav aria-label="Navegação principal"><a href="#amostras">Amostras</a><a href="#materiais">O guia</a>{site.editorialReview && <a href="#colecao">Coleção</a>}<a href="#faq">Dúvidas</a></nav>
        <a className="nav-cta" href="#ofertas">Ver pacotes <ArrowRight size={15} aria-hidden="true" /></a>
      </div>
    </header>
    <main id="conteudo">
      <Hero />
      <Benefits />
      <Samples />
      <MainProduct />
      {site.editorialReview && <StudyCollection />}
      <Testimonials />
      <Bonuses />
      <Offers consent={privacy.consent} />
      <Guarantee />
      <Faq />
      <FinalCall />
    </main>
    <Footer {...privacy} />
  </>
}
