import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

export function Dialog({ title, className = '', onClose, children }: {
  title: string
  className?: string
  onClose: () => void
  children: ReactNode
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const node = dialog.current
    if (!node) return
    const trigger = document.activeElement
    node.showModal()
    document.body.classList.add('dialog-open')
    return () => {
      if (node.open) node.close()
      document.body.classList.remove('dialog-open')
      if (trigger instanceof HTMLElement) trigger.focus({ preventScroll: true })
    }
  }, [])

  return <dialog ref={dialog} className={className} aria-labelledby={titleId}
    onCancel={event => { event.preventDefault(); onClose() }}
    onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <div className="dialog-panel">
      <div className="dialog-header">
        <h2 id={titleId}>{title}</h2>
        <button type="button" className="icon-button" aria-label="Fechar" onClick={onClose} autoFocus><X size={20} /></button>
      </div>
      {children}
    </div>
  </dialog>
}
