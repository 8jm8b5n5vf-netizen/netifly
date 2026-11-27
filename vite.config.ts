import { readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { createServer, defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { readConfig } from './src/config/site.ts'
import collection from './editorial/destrave/colecao.json' with { type: 'json' }

const securityHeaders = [
  'X-Content-Type-Options: nosniff',
  'X-Frame-Options: DENY',
  'Referrer-Policy: strict-origin-when-cross-origin',
  'Permissions-Policy: camera=(), microphone=(), geolocation=()',
  "Content-Security-Policy: default-src 'self'; script-src 'self' https://connect.facebook.net; style-src 'self'; img-src 'self' data: https://www.facebook.com; font-src 'self'; connect-src 'self' https://www.facebook.com https://connect.facebook.net; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
]

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
    build: config.editorialReview ? {
      rolldownOptions: { input: { index: resolve('index.html'), simulado: resolve('simulado.html') } },
    } : undefined,
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
        async generateBundle() {
          const sitemap = canonical && new URL('/sitemap.xml', canonical).href
          this.emitFile({
            type: 'asset', fileName: 'robots.txt',
            source: canonical ? 'User-agent: *\nAllow: /\nSitemap: ' + sitemap + '\n' : 'User-agent: *\nAllow: /\n',
          })
          if (canonical) this.emitFile({
            type: 'asset', fileName: 'sitemap.xml',
            source: '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>' + htmlAttribute(canonical) + '</loc></url></urlset>',
          })
          const headers = [...securityHeaders]
          if (!canonical) headers.push('X-Robots-Tag: noindex, nofollow')
          this.emitFile({
            type: 'asset', fileName: '_headers',
            source: ['/*', ...headers.map(header => '  ' + header),
              '/assets/*', '  Cache-Control: public, max-age=3600, stale-while-revalidate=86400', ''].join('\n'),
          })
          if (config.editorialReview) {
            const names = [...collection.modulos, ...collection.bonus].map(item => item.id + '.pdf')
            names.push('destrave-o-codigo-penal.zip')
            const files = await Promise.all(names.map(async name => ({
              type: 'asset' as const, fileName: 'colecao/' + name,
              source: await readFile(resolve('editorial/destrave/exportados', name)),
            })))
            for (const file of files) this.emitFile(file)
          }
        },
      },
    ],
  }
})
