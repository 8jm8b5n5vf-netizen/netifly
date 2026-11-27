import { useRef, useState, type FormEvent } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowLeft, ArrowRight, BookOpen, Check, RotateCcw, X } from 'lucide-react'
import '@fontsource-variable/inter/wght.css'
import '@fontsource-variable/sora/wght.css'
import './styles/site.css'
import './simulado.css'
import { codigoPenal, perguntas } from './simulado-perguntas'

const chave = 'codigo-penal-360:simulado:v1'
const total = perguntas.length
const letras = ['A', 'B', 'C', 'D']
type Progresso = { nome: string; respostas: number[] }

function lerProgresso(): Progresso {
  try {
    const salvo: Partial<Progresso> = JSON.parse(localStorage.getItem(chave) ?? '{}')
    if (typeof salvo.nome === 'string' && salvo.nome.trim() &&
      Array.isArray(salvo.respostas) && salvo.respostas.length <= total &&
      salvo.respostas.every((resposta, indice) =>
        Number.isInteger(resposta) && resposta >= 0 && resposta < perguntas[indice].opcoes.length)) {
      return { nome: salvo.nome.trim().slice(0, 40), respostas: salvo.respostas }
    }
  } catch {
    // O simulado também funciona quando o armazenamento está indisponível.
  }
  return { nome: '', respostas: [] }
}

function Simulado() {
  const [progresso, setProgresso] = useState(lerProgresso)
  const [nome, setNome] = useState('')
  const [indice, setIndice] = useState(progresso.respostas.length)
  const [selecionada, setSelecionada] = useState<number>()
  const [armazenamentoIndisponivel, setArmazenamentoIndisponivel] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const feedback = useRef<HTMLHeadingElement>(null)
  const respondidas = progresso.respostas.length
  const acertos = progresso.respostas.filter((resposta, i) => resposta === perguntas[i].correta).length
  const pergunta = perguntas[indice]
  const respondida = progresso.respostas[indice]
  const acertou = respondida === pergunta?.correta

  function gravar(novo: Progresso) {
    setProgresso(novo)
    try {
      localStorage.setItem(chave, JSON.stringify(novo))
      setArmazenamentoIndisponivel(false)
    } catch {
      setArmazenamentoIndisponivel(true)
    }
  }

  function navegar(novaPosicao: number) {
    setIndice(novaPosicao)
    setSelecionada(undefined)
    requestAnimationFrame(() => heading.current?.focus())
  }

  function iniciar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const nomeLimpo = nome.trim()
    if (!nomeLimpo) return
    gravar({ nome: nomeLimpo, respostas: [] })
    navegar(0)
  }

  function confirmar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (selecionada === undefined || indice !== respondidas) return
    gravar({ ...progresso, respostas: [...progresso.respostas, selecionada] })
    requestAnimationFrame(() => feedback.current?.focus())
  }

  function reiniciar() {
    if (!window.confirm('Reiniciar o simulado e apagar as respostas desta tentativa?')) return
    gravar({ ...progresso, respostas: [] })
    navegar(0)
  }

  return <>
    <a className="skip" href="#conteudo-simulado">Ir para o simulado</a>
    <header className="simulado-header">
      <div className="wrap simulado-nav">
        <a className="brand" href="/"><span className="brand-mark"><BookOpen size={18} aria-hidden="true" /></span>Código Penal <strong>360</strong></a>
        <a className="simulado-return" href="/#colecao"><ArrowLeft size={16} aria-hidden="true" /> Materiais</a>
      </div>
    </header>
    <section className="simulado-hero" aria-labelledby="simulado-titulo">
      <div className="wrap">
        <p>DESTRAVE O CÓDIGO PENAL</p>
        <h1 id="simulado-titulo">Simulado de Direito Penal</h1>
        <p>12 questões autorais com correção comentada.</p>
      </div>
    </section>
    <main className="wrap simulado-main" id="conteudo-simulado">
      <aside className="simulado-card simulado-painel" aria-labelledby="simulado-progresso-titulo">
        <h2 id="simulado-progresso-titulo">Seu progresso</h2>
        {progresso.nome && <p className="simulado-nome">{progresso.nome}</p>}
        <progress value={respondidas} max={total} aria-label="Questões respondidas" />
        <p aria-live="polite"><strong>{respondidas} de {total}</strong> respondidas</p>
        <dl>
          <div><dt>Acertos</dt><dd>{acertos}</dd></div>
          <div><dt>Erros</dt><dd>{respondidas - acertos}</dd></div>
        </dl>
        {armazenamentoIndisponivel
          ? <p className="simulado-nota" role="status">O navegador bloqueou o armazenamento. O progresso dura até fechar ou recarregar esta página.</p>
          : <p className="simulado-nota">Seu nome e suas respostas ficam neste navegador.</p>}
      </aside>
      <section className="simulado-card simulado-atividade" aria-labelledby="simulado-atividade-titulo">
        {!progresso.nome ? <>
          <h2 id="simulado-atividade-titulo" ref={heading} tabIndex={-1}>Comece seu simulado</h2>
          <p>Responda no seu ritmo. O comentário aparece após cada resposta.</p>
          <form className="simulado-identificacao" onSubmit={iniciar}>
            <label htmlFor="simulado-nome">Nome ou apelido</label>
            <input id="simulado-nome" value={nome} onChange={evento => setNome(evento.target.value)} maxLength={40} autoComplete="off" required />
            <button type="submit" className="button button-primary" disabled={!nome.trim()}>
              Começar simulado <ArrowRight size={18} aria-hidden="true" />
            </button>
          </form>
        </> : pergunta ? <>
          <p className="simulado-etapa">QUESTÃO {indice + 1} DE {total}</p>
          <h2 id="simulado-atividade-titulo" ref={heading} tabIndex={-1}>{pergunta.tema}</h2>
          <p className="simulado-enunciado" id="simulado-enunciado">{pergunta.enunciado}</p>
          <form onSubmit={confirmar}>
            <fieldset className="simulado-opcoes" disabled={respondida !== undefined} aria-describedby="simulado-enunciado">
              <legend className="simulado-sr">Escolha uma alternativa</legend>
              {pergunta.opcoes.map((opcao, i) => {
                const destaque = respondida === undefined ? '' :
                  i === pergunta.correta ? ' simulado-correta' : i === respondida ? ' simulado-incorreta' : ''
                return <label className={destaque.trim()} key={opcao}>
                  <input type="radio" name="resposta" value={i} checked={(respondida ?? selecionada) === i}
                    onChange={() => setSelecionada(i)} required />
                  <span><strong>{letras[i]}.</strong> {opcao}</span>
                </label>
              })}
            </fieldset>
            {respondida !== undefined && <div className="simulado-comentario" role="status">
              <h3 ref={feedback} tabIndex={-1}>{acertou ? <Check size={19} aria-hidden="true" /> : <X size={19} aria-hidden="true" />}
                {acertou ? 'Resposta correta' : 'Resposta incorreta'}
              </h3>
              <p><strong>Gabarito: {letras[pergunta.correta]}.</strong> {pergunta.comentario}</p>
              <p className="simulado-nota">Base legal: {pergunta.artigo}.</p>
            </div>}
            <div className="simulado-acoes">
              {indice > 0 && <button className="button button-outline" type="button" onClick={() => navegar(indice - 1)}>
                <ArrowLeft size={18} aria-hidden="true" /> Anterior
              </button>}
              {respondida === undefined
                ? <button type="submit" className="button button-primary" disabled={selecionada === undefined}>Confirmar resposta</button>
                : <button type="button" className="button button-primary" onClick={() => navegar(indice + 1)}>
                  {indice === total - 1 ? 'Ver resultado' : 'Próxima questão'} <ArrowRight size={18} aria-hidden="true" />
                </button>}
            </div>
          </form>
        </> : <>
          <h2 id="simulado-atividade-titulo" ref={heading} tabIndex={-1}>Resultado do simulado</h2>
          <p className="simulado-resultado">{acertos} de {total} questões corretas</p>
          {acertos < total && <>
            <p>Temas para retomar na próxima revisão:</p>
            <ul className="simulado-erros">{perguntas.map((item, i) => progresso.respostas[i] !== item.correta &&
              <li key={item.tema}><button type="button" onClick={() => navegar(i)}>{item.tema}</button></li>)}</ul>
          </>}
          <div className="simulado-acoes">
            <button className="button button-primary" type="button" onClick={() => navegar(0)}>Rever respostas</button>
            <button className="button button-outline" type="button" onClick={reiniciar}><RotateCcw size={17} aria-hidden="true" /> Reiniciar</button>
          </div>
        </>}
      </section>
    </main>
    <footer className="simulado-footer wrap">
      <a className="text-link" href={codigoPenal}>Consultar o Código Penal na Câmara dos Deputados</a>
    </footer>
  </>
}

createRoot(document.getElementById('simulado-root')!).render(<Simulado />)
