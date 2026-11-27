import { ArrowRight, Check, CircleHelp, Plus, ShieldCheck } from 'lucide-react'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { asset, downsell, images, offers, price, testimonials } from '../config/catalog'
import { readConfig } from '../config/site'
import { Brand } from '../components/Brand'
import { Dialog } from '../components/Dialog'
import { checkoutTarget } from '../utils/checkout'
import { permitMeta, revokeMeta } from '../utils/pixel'

export const site = readConfig(import.meta.env)
const privacyKey = 'cp360-consent-v1'

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

function CheckoutLink({ url, consent, label, primary = true }: {
  url: string
  consent: string | null | undefined
  label: string
  primary?: boolean
}) {
  const forward = Boolean(site.pixel && site.forwardAttribution && consent === 'yes')
  return <a className={'button ' + (primary ? 'button-primary' : 'button-outline')}
    href={checkoutTarget(url, forward ? window.location.search : '', forward)}>
    {label} <ArrowRight size={18} aria-hidden="true" />
  </a>
}

const downsellSessionKey = 'cp360-downsell-seen'

function Downsell({ url, consent }: { url: string; consent: string | null | undefined }) {
  const [state, setState] = useState<'ready' | 'open' | 'seen'>('ready')

  function open(trigger: HTMLButtonElement) {
    if (state !== 'ready') return
    try {
      if (window.sessionStorage.getItem(downsellSessionKey)) {
        setState('seen')
        return
      }
      window.sessionStorage.setItem(downsellSessionKey, 'true')
    } catch {
      setState('seen')
      return
    }
    trigger.focus({ preventScroll: true })
    setState('open')
  }

  return <div className="downsell">
    <button className="button button-outline" type="button" aria-disabled={state === 'seen'}
      onClick={event => open(event.currentTarget)}>{state === 'seen' ? 'Oferta alternativa já exibida' : 'Ver oferta alternativa'}</button>
    {state === 'open' && <Dialog title={downsell.title} className="downsell-dialog" onClose={() => setState('seen')}>
      <img src={asset(images.downsell)} width="1200" height="1200" alt="Guia Código Penal 360 e os sete materiais complementares" />
      <p className="price">{price.format(downsell.amount)}</p>
      <CheckoutLink url={url} consent={consent} label="Quero a oferta alternativa" />
    </Dialog>}
  </div>
}

export function Offers({ consent }: { consent: string | null | undefined }) {
  return <section className="section offers dark" id="ofertas" aria-labelledby="offers-heading">
    <div className="wrap">
      <div className="section-heading">
        <h2 id="offers-heading">Escolha como quer estudar Direito Penal</h2>
        <p>Leia o artigo, veja um exemplo concreto e compare conceitos que costumam gerar dúvida.</p>
        <a className="offer-sample-link" href="#amostras">Veja furto e roubo nas amostras gratuitas <ArrowRight size={17} aria-hidden="true" /></a>
        {site.live && site.terms.payment && <p>Pagamento único.</p>}
        {!site.live && <p>Prévia das ofertas. As compras estão desativadas.</p>}
      </div>
      <div className="offer-grid">
        {offers.map(offer => {
          const premium = offer.id === 'premium'
          const url = site.checkout[offer.id]
          const amount = offer.amount !== null && offer.amount > 0 ? offer.amount : undefined
          const enabled = site.live && url && amount !== undefined && (!premium || site.confirmedBonuses.length > 0)
          const label = premium ? 'Quero o Pacote Premium' : 'Quero o Pacote Básico'
          const offerImage = premium ? (site.fullBundle ? images.premium : images.guide) : images.basic
          const included = premium ? site.confirmedBonuses : []
          const description = premium
            ? included.length
              ? 'Para quem quer estudar pelo guia e complementar a revisão com os materiais abaixo.'
              : 'Para quem quer combinar a leitura do guia com materiais de prática e revisão. Os bônus estão em confirmação.'
            : 'Para quem quer ler os artigos em linguagem simples e consultar exemplos na hora da dúvida.'
          return <article className={'offer-card ' + offer.id} key={offer.id}>
            <h3>{offer.title}</h3>
            <p className="offer-description">{description}</p>
            <img className="offer-art" src={asset(offerImage)} width="1440" height="1440" alt="" loading="lazy" />
            <p className="price">{amount === undefined ? 'Preço a confirmar' : price.format(amount)}</p>
            <ul className="offer-list">
              <li><Check size={17} aria-hidden="true" /> Guia digital Código Penal 360</li>
              <li><Check size={17} aria-hidden="true" /> Trechos da lei com explicações, exemplos e esquemas</li>
              {included.map(bonus => <li key={bonus.id}><Check size={17} aria-hidden="true" /><div>{bonus.title}<p>{bonus.info}</p></div></li>)}
            </ul>
            {enabled
              ? <CheckoutLink url={url} consent={consent} label={label} primary={premium} />
              : <button className="button button-outline" type="button" disabled>{label}</button>}
            {!enabled && <p className="offer-meta">
              {!url ? 'Checkout ainda sem link configurado.' : amount === undefined ? 'Preço pendente.' : 'Liberação comercial pendente.'}
            </p>}
          </article>
        })}
      </div>
      {site.downsellUrl && <Downsell url={site.downsellUrl} consent={consent} />}
    </div>
  </section>
}

export function Testimonials() {
  const approved = testimonials.filter(item => item.authorized && item.quote.trim() && item.author.trim())
  if (!approved.length) return null
  return <section className="section testimonials" aria-labelledby="reviews-heading">
    <div className="wrap">
      <div className="section-heading"><h2 id="reviews-heading">Avaliações de estudantes</h2></div>
      <ul className="testimonial-track" tabIndex={approved.length > 1 ? 0 : undefined} aria-label="Depoimentos publicados com autorização">
        {approved.map(item => <li key={item.author + item.quote}><figure>
          <blockquote>{item.quote}</blockquote><figcaption>{item.author}</figcaption>
        </figure></li>)}
      </ul>
    </div>
  </section>
}

export function Guarantee() {
  if (!site.live || !site.terms.guarantee) return null
  return <section className="guarantee" aria-labelledby="guarantee-heading">
    <div className="wrap guarantee-box">
      <div className="guarantee-icon"><ShieldCheck size={32} aria-hidden="true" /></div>
      <div><h2 id="guarantee-heading">Garantia de 7 dias</h2>
        <p>Você pode solicitar o reembolso dentro de sete dias, conforme as condições do checkout.</p>
        {site.legal.refund && <a className="text-link" href={site.legal.refund}>Política de reembolso <ArrowRight size={14} aria-hidden="true" /></a>}
      </div>
    </div>
  </section>
}

export function Faq() {
  const list = [
    ['Qual é o formato do material?', 'O guia tem formato digital, em PDF.'],
    ['Como receberei o material?', site.live && site.terms.delivery
      ? 'O acesso digital é liberado após a confirmação do pagamento. Siga as instruções do checkout.'
      : 'A forma de acesso será informada quando o checkout estiver validado. As amostras já podem ser abertas nesta página.'],
    ['Posso estudar pelo celular?', 'Sim. Você pode abrir o PDF em um leitor compatível com seu celular.'],
    ['Qual a diferença entre os pacotes?', site.confirmedBonuses.length
      ? 'O Básico inclui o guia digital. O Premium também inclui os bônus listados no card da oferta.'
      : 'O Básico é composto pelo guia digital. Os materiais adicionais do Premium ainda estão em confirmação.'],
    ['O material serve para concursos públicos?', 'Sim, como apoio aos estudos. Consulte o edital para saber quais temas revisar.'],
  ]
  if (site.live && site.terms.guarantee) list.push(['Como funciona a garantia?', 'Solicite o reembolso em até sete dias pelo canal indicado no checkout.'])
  return <section id="faq" className="section faq" aria-labelledby="faq-heading">
    <div className="wrap">
      <div className="section-heading"><h2 id="faq-heading">Perguntas frequentes</h2></div>
      <div className="faq-list">{list.map(([question, answer]) => <details key={question}>
        <summary>{question}<Plus size={19} aria-hidden="true" /></summary><p>{answer}</p>
      </details>)}</div>
    </div>
  </section>
}

export function FinalCall() {
  return <section className="section final-call" aria-labelledby="final-heading">
    <div className="wrap">
      <h2 id="final-heading">Comece pelo próximo artigo.</h2>
      <p>Encontre o pacote que faz sentido para sua rotina de estudos.</p>
      <a className="button button-primary" href="#ofertas">Comparar os pacotes <ArrowRight size={19} aria-hidden="true" /></a>
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
