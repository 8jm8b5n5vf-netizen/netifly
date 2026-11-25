import { useEffect, useRef, useState } from 'react'
import { ArrowDownToLine, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Maximize2, Minus, Plus } from 'lucide-react'
import { Dialog } from '../components/Dialog'
import { demoPdf, sampleDate } from '../config/catalog'
import samples from '../content/samples.json'

const previewImage = (id: number, size: 'card' | 'full') => '/assets/previews/art-' + id + '-' + size + '.webp'

export function Samples() {
  const track = useRef<HTMLUListElement>(null)
  const [anchors, setAnchors] = useState([0])
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<number>()
  const [zoom, setZoom] = useState(1)
  const sample = selected === undefined ? undefined : samples[selected]

  useEffect(() => {
    const node = track.current
    if (!node) return
    const observer = new ResizeObserver(() => {
      const card = node.children[0] as HTMLElement
      const next = node.children[1] as HTMLElement
      const step = next.offsetLeft - card.offsetLeft
      if (!step) return
      const count = Math.max(1, Math.round(node.clientWidth / step))
      const max = node.scrollWidth - node.clientWidth
      const positions = [0]
      for (let i = step * count; i < max - 2; i += step * count) positions.push(i)
      if (max > 2) positions.push(max)
      setAnchors(positions)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  function go(index: number) {
    const next = Math.min(anchors.length - 1, Math.max(index, 0))
    track.current?.scrollTo({ left: anchors[next] })
  }

  function scrollPosition() {
    const left = track.current?.scrollLeft ?? 0
    const nearest = anchors.reduce((best, anchor, index) =>
      Math.abs(left - anchor) < Math.abs(left - anchors[best]) ? index : best, 0)
    setPage(nearest)
  }

  function view(index: number) {
    setZoom(1)
    setSelected(index)
  }

  return <section className="section samples" id="amostras" aria-labelledby="samples-heading">
    <div className="wrap">
      <div className="section-heading section-heading-row">
        <div>
          <p className="eyebrow"><span /> POR DENTRO DO MATERIAL</p>
          <h2 id="samples-heading">Veja por dentro do<br className="desktop-break" /> Código Penal 360</h2>
          <p>Explore amostras autorais com trechos da lei, exemplos e exercícios de fixação.</p>
        </div>
        <a className="text-link" href={demoPdf} download><ArrowDownToLine size={18} /> Baixar amostras em PDF</a>
      </div>
      <ul className="sample-track" ref={track} onScroll={scrollPosition} tabIndex={0} aria-label="Carrossel de amostras"
        onKeyDown={event => {
          if (event.target !== event.currentTarget || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return
          event.preventDefault()
          go(page + (event.key === 'ArrowRight' ? 1 : -1))
        }}>
        {samples.map((item, index) => <li key={item.id} className={'sample-card ' + item.tone}>
          <button type="button" className="sample-open" onClick={() => view(index)} aria-label={'Ampliar art. ' + item.id + ' — ' + item.title}>
            <span className="sample-stage">
              <img src={previewImage(item.id, 'card')} width="520" height="735" loading="lazy" alt="" />
              <span className="sample-expand"><Maximize2 size={17} /></span>
            </span>
            <span className="sample-caption"><span className="sample-number">ART. {item.id}</span><strong>{item.title}</strong></span>
          </button>
        </li>)}
      </ul>
      <div className="carousel-controls">
        <div className="carousel-dots" aria-label="Posições do carrossel">
          {anchors.map((anchor, index) => <button type="button" key={anchor} aria-current={index === page ? 'true' : undefined}
            aria-label={'Ir à posição ' + (index + 1)} onClick={() => go(index)}><span /></button>)}
        </div>
        <div className="carousel-arrows">
          <button className="icon-button" aria-label="Amostras anteriores" disabled={page === 0} onClick={() => go(page - 1)}><ArrowLeft size={19} /></button>
          <button className="icon-button" aria-label="Próximas amostras" disabled={page >= anchors.length - 1} onClick={() => go(page + 1)}><ArrowRight size={19} /></button>
        </div>
      </div>
      <p className="edition-note">Amostras demonstrativas · Texto legal consultado em {sampleDate} · Revisão especializada pendente</p>
    </div>
    {sample && selected !== undefined && <Dialog title={'Art. ' + sample.id + ' · ' + sample.title} className="reader-dialog" onClose={() => setSelected(undefined)}>
      <div className="reader-controls" aria-label="Navegação e ampliação da amostra">
        <button className="icon-button" aria-label="Artigo anterior" disabled={selected === 0} onClick={() => view(selected - 1)}><ChevronLeft size={18} /></button>
        <button className="icon-button" aria-label="Próximo artigo" disabled={selected === samples.length - 1} onClick={() => view(selected + 1)}><ChevronRight size={18} /></button>
        <span className="reader-spacer" />
        <button className="icon-button" aria-label="Reduzir zoom" disabled={zoom === 1} onClick={() => setZoom(zoom - 0.25)}><Minus size={18} /></button>
        <output aria-live="polite">{Math.round(zoom * 100)}%</output>
        <button className="icon-button" aria-label="Aumentar zoom" disabled={zoom === 2} onClick={() => setZoom(zoom + 0.25)}><Plus size={18} /></button>
      </div>
      <div className={'reader-viewport zoom-' + Math.round(zoom * 100)} key={sample.id} tabIndex={0} role="region" aria-label="Página ampliável da amostra">
        <img src={previewImage(sample.id, 'full')} width="1160" height="1640" alt={'Página demonstrativa do art. ' + sample.id + '. Versão em texto disponível a seguir.'} />
      </div>
      <details className="reader-transcript">
        <summary>Ler versão em texto</summary>
        <dl>
          <dt>Trecho da lei</dt><dd>{sample.law}</dd>
          <dt>Em linguagem simples</dt><dd>{sample.plain}</dd>
          <dt>Conceitos fundamentais</dt><dd>{sample.concept}</dd>
          <dt>Esquema</dt><dd>{sample.steps.join(sample.id === 18 ? ' / ' : ' → ')}</dd>
          <dt>Exemplo didático</dt><dd>{sample.example}</dd>
          <dt>Erro comum</dt><dd>{sample.trap}</dd>
          <dt>Fixação</dt><dd>{sample.question} {sample.answer}</dd>
        </dl>
      </details>
      <a className="reader-download text-link" href={demoPdf} download><ArrowDownToLine size={17} /> Baixar PDF com texto selecionável</a>
    </Dialog>}
  </section>
}
