import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/inter/wght.css'
import '@fontsource-variable/sora/wght.css'
import { App } from './App'
import './styles/site.css'

const root = document.getElementById('root')!
const app = <StrictMode><App /></StrictMode>
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
