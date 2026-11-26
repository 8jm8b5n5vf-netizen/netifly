import { useEffect, useRef, useState } from 'react'
import { ArrowDownToLine, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Maximize2, Minus, Plus } from 'lucide-react'
import { Dialog } from '../components/Dialog'
import { asset, demoPdf } from '../config/catalog'
import samples from '../content/official-samples.json'

const previewImage = (image: string, miniature = false) => asset('paginas-internas/' + image + (miniature ? '-mini' : ''))

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
      <div className="section-heading">
        <h2 id="samples-heading">Amostras do material</h2>
        <p>Deslize para conhecer os dez artigos. Selecione uma página para ampliar.</p>
      </div>
      <ul className="sample-track" ref={track} onScroll={scrollPosition} tabIndex={0} aria-label="Carrossel de amostras"
        onKeyDown={event => {
          if (event.target !== event.currentTarget || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return
          event.preventDefault()
          go(page + (event.key === 'ArrowRight' ? 1 : -1))
        }}>
        {samples.map((item, index) => <li key={item.id} className="sample-card">
          <button type="button" className="sample-open" onClick={event => { event.currentTarget.focus({ preventScroll: true }); view(index) }} aria-label={'Ampliar art. ' + item.id + ' — ' + item.title}>
            <span className="sample-stage">
              <img src={previewImage(item.image, true)} width="430" height="608" loading="lazy" alt="" />
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
      <div className="sample-note">
        <p>Amostras editoriais em revisão.</p>
        <a className="text-link" href={demoPdf} download><ArrowDownToLine size={17} aria-hidden="true" /> Baixar PDF complementar</a>
      </div>
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
        <img src={previewImage(sample.image)} width="1273" height="1800" alt={'Página demonstrativa do art. ' + sample.id + '.'} />
      </div>
      <a className="reader-download text-link" href={previewImage(sample.image)} download><ArrowDownToLine size={17} aria-hidden="true" /> Baixar esta página em resolução completa</a>
    </Dialog>}
  </section>
}
