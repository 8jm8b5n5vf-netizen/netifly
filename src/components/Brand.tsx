import { Scale } from 'lucide-react'

export function Brand() {
  return <a className="brand" href="#inicio" aria-label="Código Penal 360, início">
    <span className="brand-mark"><Scale aria-hidden="true" size={22} /></span>
    <span>Código Penal <strong>360</strong></span>
  </a>
}
