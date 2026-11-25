type MetaQueue = {
  (...args: unknown[]): void
  callMethod?: (...args: unknown[]) => void
  queue: unknown[][]
  push?: MetaQueue
  loaded: boolean
  version: string
}

declare global {
  interface Window {
    fbq?: MetaQueue
    _fbq?: MetaQueue
  }
}

let installed = false

export function permitMeta(id: string) {
  if (installed) {
    window.fbq?.('consent', 'grant')
    return
  }
  if (window.fbq) return

  const queue: MetaQueue = Object.assign(
    (...args: unknown[]) => {
      if (queue.callMethod) queue.callMethod(...args)
      else queue.queue.push(args)
    },
    { queue: [] as unknown[][], loaded: true, version: '2.0' },
  )
  queue.push = queue
  window.fbq = window._fbq = queue
  const script = document.createElement('script')
  script.src = 'https://connect.facebook.net/pt_BR/fbevents.js'
  script.async = true
  script.onerror = () => {
    installed = false
    delete window.fbq
    delete window._fbq
    script.remove()
  }
  document.head.append(script)
  installed = true
  queue('consent', 'grant')
  queue('set', 'autoConfig', false, id)
  queue('init', id)
  queue('track', 'PageView')
  queue('track', 'ViewContent', { content_name: 'Código Penal 360', content_category: 'Material de estudo' })
}

export function revokeMeta() {
  if (installed) window.fbq?.('consent', 'revoke')
}
