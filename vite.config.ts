import { readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { createServer, defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { readConfig } from './src/config/site.ts'

function htmlAttribute(text: string) {
  return text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
}

function staticPage(mode: string): Plugin {
  let htmlPath: string
  return {
    name: 'static-page',
    apply: 'build',
    configResolved(config) {
      htmlPath = resolve(config.root, config.build.outDir, 'index.html')
    },
    async closeBundle() {
      const renderer = await createServer({
        configFile: false,
        mode,
        plugins: [react()],
        appType: 'custom',
        optimizeDeps: { noDiscovery: true, include: [] },
        server: { middlewareMode: true, ws: false, watch: null },
      })
      try {
        const { renderPage } = await renderer.ssrLoadModule('/src/entry-server.tsx')
        const html = await readFile(htmlPath, 'utf8')
        if (!html.includes('<!--app-html-->')) throw new Error('Marcador da página inicial ausente')
        const files = await readdir(resolve(dirname(htmlPath), 'assets'))
        const preloadFonts = files.filter(file => /^(inter|sora)-latin-wght-normal-.*\.woff2$/.test(file))
          .map(file => '<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/' + htmlAttribute(file) + '">')
          .join('')
        await writeFile(htmlPath, html.replace('</head>', preloadFonts + '</head>')
          .replace('<!--app-html-->', () => renderPage()))
      } finally {
        await renderer.close()
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const config = readConfig({ ...loadEnv(mode, process.cwd(), 'VITE_'), ...process.env })
  const canonical = config.live && config.url ? config.url : undefined
  return {
    plugins: [
      react(),
      staticPage(mode),
      {
        name: 'deployment-meta',
        transformIndexHtml(html) {
          if (!canonical) return html.replace('<!-- deployment-meta -->', '<meta name="robots" content="noindex, nofollow">')
          return html
            .replace('<!-- deployment-meta -->', '<link rel="canonical" href="' + htmlAttribute(canonical) + '"><meta property="og:url" content="' + htmlAttribute(canonical) + '">')
            .replaceAll('content="/assets/branding/social.webp"', 'content="' + htmlAttribute(new URL('/assets/branding/social.webp', canonical).href) + '"')
        },
        generateBundle() {
          const sitemap = canonical && new URL('/sitemap.xml', canonical).href
          this.emitFile({
            type: 'asset', fileName: 'robots.txt',
            source: canonical ? 'User-agent: *\nAllow: /\nSitemap: ' + sitemap + '\n' : 'User-agent: *\nAllow: /\n',
          })
          if (canonical) this.emitFile({
            type: 'asset', fileName: 'sitemap.xml',
            source: '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>' + htmlAttribute(canonical) + '</loc></url></urlset>',
          })
          if (!canonical) this.emitFile({ type: 'asset', fileName: '_headers', source: '/*\n  X-Robots-Tag: noindex, nofollow\n' })
        },
      },
    ],
  }
})
