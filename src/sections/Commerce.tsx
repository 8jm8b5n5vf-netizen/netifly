import { ArrowRight, Check, CircleHelp, LockKeyhole, Plus, ShieldCheck } from 'lucide-react'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { offers, sampleDate, type Plan } from '../config/catalog'
import { readConfig } from '../config/site'
import { Brand } from '../components/Brand'
import { Dialog } from '../components/Dialog'
import { checkoutTarget } from '../utils/checkout'
import { permitMeta, revokeMeta } from '../utils/pixel'

export const site = readConfig(import.meta.env)
const format = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 })
const privacyKey = 'cp360-consent-v1'
const testimonials: { quote: string; author: string; authorization: true }[] = []

type Consent = 'yes' | 'no'
let tabConsent: Consent | null = null

function loadConsent() {
  try {
    const saved = localStorage.getItem(privacyKey)
    return saved === 'yes' || saved === 'no' ? saved : tabConsent
  } catch {
    return tabConsent
  }
}

function subscribeConsent(update: () => void) {
  window.addEventListener('storage', update)
  window.addEventListener(privacyKey, update)
  return () => {
    window.removeEventListener('storage', update)
    window.removeEventListener(privacyKey, update)
  }
}

function serverConsent() {
  return undefined
}

function updateConsent(value: Consent) {
  tabConsent = value
  try {
    localStorage.setItem(privacyKey, value)
  } catch {
    // Honor the choice in the current page with storage disabled.
  }
  window.dispatchEvent(new Event(privacyKey))
}

export function useConsent() {
  const consent = useSyncExternalStore(subscribeConsent, loadConsent, serverConsent)

  useEffect(() => {
    if (!site.pixel) return
    if (consent === 'yes') permitMeta(site.pixel)
    if (consent === 'no' || consent === null) revokeMeta()
  }, [consent])

  return { consent, updateConsent }
}

export function Offers({ consent }: { consent: string | null | undefined }) {
  const [demo, setDemo] = useState<Plan>()
  const active = offers.find(offer => offer.id === demo)
  return <section className="section offers dark" id="ofertas" aria-labelledby="offers-heading">
    <div className="wrap">
      <div className="section-heading centered">
        <p className="eyebrow"><span /> {site.live ? 'PLANOS DIGITAIS' : 'PLANOS EM DEMONSTRAÇÃO'}</p>
        <h2 id="offers-heading">Escolha a melhor opção<br className="desktop-break" /> para seus estudos</h2>
        <p>{site.live ? 'Acesso digital com pagamento único.' : 'Compare os pacotes previstos. As vendas serão liberadas após a validação dos materiais e do checkout.'}</p>
      </div>
      <div className="offer-grid">
        {offers.map(offer => {
          const premium = offer.id === 'premium'
          const url = site.checkout[offer.id]
          const label = premium ? 'Quero o pacote Premium' : 'Quero o pacote Básico'
          return <article className={'offer-card ' + (premium ? 'premium' : 'basic')} key={offer.id}>
            {premium && <p className="recommendation">RECOMENDADO</p>}
            <h3>{offer.title}</h3>
            <p className="offer-intro">{offer.intro}</p>
            <p className="price"><span>R$</span> {format.format(offer.amount)}</p>
            <ul className="offer-list">{offer.includes.map(item => <li key={item}><Check size={17} /> {item}</li>)}</ul>
            {site.live && url
              ? <a className={'button ' + (premium ? 'button-primary' : 'button-outline')} href={checkoutTarget(url, consent === 'yes' ? window.location.search : '', Boolean(site.pixel && site.forwardAttribution && consent === 'yes'))}>{label} <ArrowRight size={18} /></a>
              : <button type="button" className={'button ' + (premium ? 'button-primary' : 'button-outline')} onClick={() => setDemo(offer.id)}>{label} <ArrowRight size={18} /></button>}
            <p className="offer-meta"><LockKeyhole size={13} /> Pagamento único. Sem mensalidade.</p>
          </article>
        })}
      </div>
    </div>
    {active && <Dialog title={active.title} className="offer-dialog" onClose={() => setDemo(undefined)}>
      <div className="offer-dialog-body">
        <p className="eyebrow"><span /> MODO DE DEMONSTRAÇÃO</p>
        <p className="price"><span>R$</span> {format.format(active.amount)}</p>
        <p>As vendas serão liberadas após a revisão dos materiais, a configuração do checkout Wiapy e a validação da entrega digital.</p>
        <a href="#amostras" className="button button-primary" onClick={() => setDemo(undefined)}>Ver amostras gratuitas <ArrowRight size={17} /></a>
      </div>
    </Dialog>}
  </section>
}

export function Testimonials() {
  if (!testimonials.length) return null
  return <section className="section" aria-labelledby="reviews-heading">
    <div className="wrap"><h2 id="reviews-heading">Avaliações de estudantes</h2>
      {testimonials.filter(item => item.authorization).map(item => <figure key={item.author + item.quote}><blockquote>{item.quote}</blockquote><figcaption>{item.author}</figcaption></figure>)}
    </div>
  </section>
}

export function Guarantee() {
  return <section className="guarantee" aria-labelledby="guarantee-heading">
    <div className="wrap guarantee-box">
      <div className="guarantee-icon"><ShieldCheck size={45} /></div>
      <div><h2 id="guarantee-heading">Garantia de 7 dias</h2>
        <p>{site.live ? 'Você poderá conhecer o material e, caso ele não atenda às suas expectativas, solicitar o reembolso dentro do prazo de sete dias, conforme as condições informadas no checkout e a legislação aplicável.' : 'Quando as vendas forem liberadas, você poderá solicitar o reembolso dentro do prazo de sete dias, conforme as condições informadas no checkout e a legislação aplicável.'}</p>
        {site.legal.refund && site.live && <a className="subtle-link" href={site.legal.refund}>Política de reembolso <ArrowRight size={14} /></a>}
      </div>
    </div>
  </section>
}

export function Faq() {
  const list = [
    ['Como receberei o material?', site.live ? 'Após a confirmação do pagamento, siga o e-mail de acesso enviado pela plataforma.' : 'A entrega por e-mail após a confirmação do pagamento é o fluxo previsto. Nesta versão, as amostras estão disponíveis para baixar diretamente.'],
    ['O material é físico ou digital?', 'O material é digital, em PDF.'],
    ['Posso estudar pelo celular?', 'Sim. Abra o PDF em um leitor do seu celular e use o índice para navegar entre os artigos.'],
    ['Posso imprimir os PDFs?', site.live ? 'Os PDFs são preparados em A4 para leitura e impressão de uso pessoal, de acordo com os termos do material.' : 'Sim. O PDF de amostras tem formato A4 e pode ser impresso para uso pessoal.'],
    ['O material serve para concursos públicos?', 'Foi pensado como apoio aos estudos de Direito Penal para concursos, inclusive carreiras policiais. Use o edital para delimitar os temas da sua prova.'],
    ['Posso utilizar como apoio na faculdade?', 'Sim. As explicações e os exercícios ajudam a revisar os conceitos abordados nas disciplinas de Direito Penal.'],
    ['Qual a diferença entre os pacotes?', 'O Básico inclui o livro digital. O Premium reúne o livro e materiais de prática e revisão, conforme o catálogo exibido acima.'],
    ['Qual é a data de atualização do conteúdo?', site.live ? 'A edição comercial indica atualização em ' + site.updated + '.' : 'O texto legal das amostras foi consultado em ' + sampleDate + '. A data da edição integral será indicada no próprio material.'],
    ['Existe mensalidade?', 'Os dois pacotes têm pagamento único.'],
    ['Como funciona a garantia?', site.live ? 'Solicite o reembolso em até sete dias, conforme as condições do checkout e a legislação aplicável.' : 'Quando as vendas forem liberadas, o checkout informará o canal para solicitar o reembolso dentro do prazo de sete dias.'],
  ]
  return <section id="faq" className="section faq" aria-labelledby="faq-heading">
    <div className="wrap faq-grid">
      <div className="section-heading">
        <p className="eyebrow"><span /> PERGUNTAS FREQUENTES</p>
        <h2 id="faq-heading">Tire suas dúvidas</h2>
        <p>Formato, acesso, pacotes e condições de compra.</p>
      </div>
      <div className="faq-list">{list.map(([question, answer]) => <details key={question}>
        <summary>{question}<Plus size={19} aria-hidden="true" /></summary><p>{answer}</p>
      </details>)}</div>
    </div>
  </section>
}

export function FinalCall() {
  return <section className="section final-call" aria-labelledby="final-heading">
    <div className="wrap centered"><h2 id="final-heading">Não deixe a linguagem jurídica<br className="desktop-break" /> dificultar sua preparação.</h2>
      <p>Comece a estudar com explicações claras, recursos visuais e materiais organizados.</p>
      <a className="button button-primary" href="#ofertas">Quero começar agora <ArrowRight size={20} /></a>
      <p className="final-meta">{site.live ? 'A partir de R$ 10,00' : 'Pacotes previstos a partir de R$ 10,00'} · Pagamento único</p>
    </div>
  </section>
}

export function Footer({ consent, updateConsent }: ReturnType<typeof useConsent>) {
  const [preferences, setPreferences] = useState(false)

  function update(value: 'yes' | 'no') {
    updateConsent(value)
    setPreferences(false)
  }

  return <>
    <footer className="footer dark">
      <div className="wrap">
        <div className="footer-grid">
          <div><Brand /><p>Material educacional de Direito Penal.<br />Use como apoio aos estudos. Orientação jurídica profissional requer atendimento especializado.</p></div>
          <div><h2>Atendimento</h2>
            <a href={site.legal.access ?? '/orientacao-de-acesso.html'}><CircleHelp size={16} /> Orientação de acesso</a>
            {site.supplier.email ? <a href={'mailto:' + site.supplier.email}>{site.supplier.email}</a> : <span>Canal de suporte pendente</span>}
            {site.supplier.name && <p>{site.supplier.name}<br />{site.supplier.id}<br />{site.supplier.address}</p>}
          </div>
          <div><h2>Informações legais</h2>
            {site.legal.privacy ? <a href={site.legal.privacy}>Política de privacidade</a> : <button onClick={() => setPreferences(true)}>Privacidade da demonstração</button>}
            {site.legal.terms ? <a href={site.legal.terms}>Termos de uso</a> : <span>Termos de uso pendentes</span>}
            {site.legal.refund ? <a href={site.legal.refund}>Política de reembolso</a> : <span>Política de reembolso pendente</span>}
            {site.pixel && site.legal.privacy && <button onClick={() => setPreferences(true)}>Preferências de privacidade</button>}
          </div>
        </div>
        <div className="footer-bottom"><span>© 2026 Código Penal 360</span>{!site.live && <span>Versão demonstrativa</span>}</div>
      </div>
    </footer>
    {site.pixel && consent === null && !preferences && <aside className="consent" aria-label="Preferências de privacidade">
      <p>A medição da Meta é opcional e depende da sua autorização.</p>
      <div><button className="button button-outline" onClick={() => update('no')}>Recusar</button><button className="button button-primary" onClick={() => update('yes')}>Aceitar medição</button></div>
    </aside>}
    {preferences && <Dialog title="Preferências de privacidade" onClose={() => setPreferences(false)}>
      <div className="offer-dialog-body">
        <p>{site.pixel ? 'Se você aceitar a medição, o Pixel da Meta receberá eventos de navegação. Você pode mudar sua escolha neste painel.' : 'A demonstração não usa o Pixel da Meta. O PDF de amostras pode ser baixado diretamente, sem cadastro.'}</p>
        {site.legal.privacy && <a href={site.legal.privacy} className="subtle-link">Ler política de privacidade</a>}
        {site.pixel && <div className="consent-actions"><button className="button button-outline" onClick={() => update('no')}>Recusar</button><button className="button button-primary" onClick={() => update('yes')}>Aceitar medição</button></div>}
      </div>
    </Dialog>}
  </>
}
