import { ArrowDownToLine, ArrowRight } from 'lucide-react'
import collection from '../../editorial/destrave/colecao.json'

export function StudyCollection() {
  return <section className="section study-collection" id="colecao" aria-labelledby="study-collection-heading">
    <div className="wrap">
      <div className="section-heading">
        <h2 id="study-collection-heading">Destrave o Código Penal por assunto</h2>
        <p>São nove unidades em três módulos. Leia a lei, aplique ao caso e use as questões comentadas para revisar.</p>
        <a className="button button-primary" href="/colecao/destrave-o-codigo-penal.zip" download>
          <ArrowDownToLine size={18} aria-hidden="true" /> Baixar os PDFs em ZIP
        </a>
      </div>
      <ul className="study-list study-modules" aria-label="Módulos do guia">
        {collection.modulos.map((item, index) => <li key={item.id}>
          <h3>Módulo {index + 1} · {item.title}</h3>
          <p>{item.description}</p>
          <a className="text-link" href={'/colecao/' + item.id + '.pdf'} download aria-label={'Baixar PDF — ' + item.title}>Baixar módulo em PDF <ArrowDownToLine size={17} aria-hidden="true" /></a>
        </li>)}
      </ul>
      <h3 className="study-review-heading">Materiais para revisar</h3>
      <ul className="study-list study-review">
        {collection.bonus.map(item => <li key={item.id}>
          <h3>{item.title}</h3><p>{item.description}</p>
          <a className="text-link" href={'/colecao/' + item.id + '.pdf'} download aria-label={'Baixar PDF — ' + item.title}>Baixar PDF <ArrowDownToLine size={17} aria-hidden="true" /></a>
        </li>)}
      </ul>
      <div className="study-simulation">
        <h3>Simulado interativo</h3>
        <p>Responda a 12 questões, confira os comentários e retome o progresso no mesmo navegador.</p>
        <a className="button button-primary" href="/simulado.html">Abrir simulado <ArrowRight size={17} aria-hidden="true" /></a>
      </div>
    </div>
  </section>
}
