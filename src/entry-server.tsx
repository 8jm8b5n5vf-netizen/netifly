import { renderToString } from 'react-dom/server'
import { App } from './App'

export function renderPage() {
  return renderToString(<App />).replace(/^<link rel="preload" as="image"[^>]*\/>/, '')
}
