import { mkdir, readFile } from 'node:fs/promises'
import { extname, resolve } from 'node:path'
import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const host = 'https://produto.example.test'
const source = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.woff2': 'font/woff2',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
} as const

async function serveBuild(page: Page, folder = 'dist') {
  await page.route(host + '/**', async route => {
    const pathname = new URL(route.request().url()).pathname
    const file = pathname === '/' ? '/index.html' : pathname
    const disk = resolve(folder, '.' + file)
    const body = await readFile(disk).catch(() => undefined)
    if (!body) return route.fulfill({ status: 404 })
    const extension = extname(disk) as keyof typeof source
    return route.fulfill({
      body,
      contentType: source[extension] ?? 'text/plain; charset=utf-8',
      headers: extension === '.pdf' ? { 'Content-Disposition': 'attachment' } : {},
    })
  })
}

const widths = [320, 360, 390, 430, 768, 1024, 1440]
for (const width of widths) {
  test('layout e imagens em ' + width + ' px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', event => { if (event.type() === 'error') errors.push(event.text()) })
    await serveBuild(page)
    await page.goto(host)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Destrave o Código Penal')
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
    const heroArt = (await page.locator('.hero-art').boundingBox())!
    const heroHeading = (await page.getByRole('heading', { level: 1 }).boundingBox())!
    expect(Math.abs(heroArt.x + heroArt.width / 2 - width / 2)).toBeLessThan(2)
    expect(heroArt.y).toBeGreaterThan(heroHeading.y + heroHeading.height)
    await expect(page.locator('.hero-art')).toHaveAttribute('src', /02-codigo-penal-360/)
    await expect(page.locator('#amostras .sample-open')).toHaveCount(10)
    await expect(page.locator('#ofertas article').first()).toContainText('Pacote Premium')
    if (width <= 430) {
      const cards = await page.locator('#ofertas article').evaluateAll(items => items.map(item => item.getBoundingClientRect().top))
      expect(cards[1]).toBeGreaterThan(cards[0])
    }
    const assets = await page.locator('img').evaluateAll(async images => {
      return Promise.all(images.map(async element => {
        const image = element as HTMLImageElement
        image.loading = 'eager'
        try {
          await image.decode()
          return image.naturalWidth > 0
        } catch {
          return false
        }
      }))
    })
    expect(assets.every(Boolean)).toBe(true)
    expect(errors).toEqual([])
  })
}

test('conteúdo e navegação básica disponíveis no HTML estático', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  try {
    const page = await context.newPage()
    await serveBuild(page)
    await page.goto(host)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Destrave o Código Penal')
    await page.getByRole('link', { name: 'QUERO VER AS OFERTAS' }).click()
    await expect(page).toHaveURL(/#ofertas$/)
    await expect(page.getByRole('heading', { name: 'Pacote Premium' })).toBeVisible()
  } finally {
    await context.close()
  }
})

test('CTAs, planos, PDF e perguntas funcionam em modo demonstração', async ({ page }) => {
  await serveBuild(page)
  await page.goto(host)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
  await page.getByRole('link', { name: 'QUERO VER AS OFERTAS' }).click()
  await expect(page).toHaveURL(/#ofertas$/)
  for (const [name, value] of [['Premium', '27,00'], ['Básico', '10,00']]) {
    const card = page.locator('#ofertas article').filter({ has: page.getByRole('heading', { name: 'Pacote ' + name }) })
    await expect(card).toContainText(value)
    await expect(card.getByRole('button', { name: 'Quero o Pacote ' + name })).toBeDisabled()
    await expect(card).toContainText('Checkout ainda sem link configurado')
  }
  await expect(page.getByRole('heading', { name: 'Garantia de 7 dias' })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Avaliações de estudantes' })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Bônus do Pacote Premium' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Ver oferta alternativa' })).toHaveCount(0)
  await page.locator('summary').filter({ hasText: 'Posso estudar pelo celular?' }).click()
  await expect(page.getByText('Sim. Você pode abrir o PDF', { exact: false })).toBeVisible()
  const downloading = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Baixar PDF complementar' }).click()
  const pdf = await downloading
  expect(pdf.suggestedFilename()).toBe('codigo-penal-360-amostras.pdf')
  const unitDownload = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Baixar unidade-modelo' }).click()
  expect((await unitDownload).suggestedFilename()).toBe('destrave-furto-e-roubo.pdf')
  await page.getByRole('link', { name: 'Orientação de acesso' }).click()
  await expect(page.getByRole('heading', { name: 'Orientação de acesso', exact: true })).toBeVisible()
})

test('carrossel por teclado, navegação no leitor, zoom e foco', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await serveBuild(page)
  await page.goto(host + '/#amostras')
  const carousel = page.getByRole('list', { name: 'Carrossel de amostras' })
  await carousel.focus()
  await page.keyboard.press('ArrowRight')
  await expect.poll(() => carousel.evaluate(node => node.scrollLeft)).toBeGreaterThan(0)
  await page.getByRole('button', { name: 'Amostras anteriores' }).click()
  await expect.poll(() => carousel.evaluate(node => node.scrollLeft)).toBe(0)
  const opener = page.getByRole('button', { name: 'Ampliar art. 155 — Furto' })
  await opener.focus()
  await page.keyboard.press('Enter')
  const reader = page.getByRole('dialog')
  await expect(reader).toBeVisible()
  await reader.getByRole('button', { name: 'Aumentar zoom' }).click()
  await expect(reader.getByText('125%')).toBeVisible()
  await reader.getByRole('button', { name: 'Próximo artigo' }).click()
  await expect(reader.getByRole('heading')).toHaveText('Art. 157 · Roubo')
  await expect(reader.locator('img')).toHaveAttribute('src', /04-artigo-157-roubo\.webp/)
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([])
  await page.keyboard.press('Escape')
  await expect(reader).toHaveCount(0)
  await expect(opener).toBeFocused()
})

test('carrossel com gesto de toque', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  const page = await context.newPage()
  await serveBuild(page)
  await page.goto(host + '/#amostras')
  const stage = page.locator('.sample-stage').first()
  await stage.scrollIntoViewIfNeeded()
  const box = (await stage.boundingBox())!
  const x = Math.round(Math.min(310, box.x + box.width - 12))
  const y = Math.round(box.y + box.height / 2)
  const cdp = await context.newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
  for (let offset = 35; offset <= 245; offset += 35) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x - offset, y }] })
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await expect.poll(() => page.locator('.sample-track').evaluate(node => node.scrollLeft)).toBeGreaterThan(100)
  await context.close()
})

test('checkout e Pixel com consentimento e serviços simulados', async ({ page }) => {
  await serveBuild(page, 'test-results/fixture')
  let loads = 0
  await page.route('https://connect.facebook.net/**', async route => {
    loads++
    await route.fulfill({ contentType: 'text/javascript', body: '' })
  })
  await page.route('https://checkout.example.test/**', route => route.fulfill({ body: 'Checkout de teste' }))
  await page.goto(host + '/?utm_source=anuncio&utm_campaign=campanha&fbclid=teste&email=exemplo')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', host + '/')
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0)
  const premium = page.getByRole('link', { name: 'Quero o Pacote Premium' })
  const basic = page.getByRole('link', { name: 'Quero o Pacote Básico' })
  const banner = page.getByRole('complementary', { name: 'Preferências de privacidade' })
  const pixelCalls = () => page.evaluate(() => window.fbq?.queue ?? [])
  expect(await pixelCalls()).toEqual([])
  await expect(premium).toHaveAttribute('href', 'https://checkout.example.test/premium?utm_source=wiapy')
  await expect(basic).toHaveAttribute('href', 'https://checkout.example.test/basico?fixed=1')
  await banner.getByRole('button', { name: 'Recusar' }).click()
  expect(loads).toBe(0)
  await page.getByRole('button', { name: 'Preferências de privacidade' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Aceitar medição' }).click()
  await expect.poll(() => loads).toBe(1)
  const accepted = await pixelCalls()
  expect(accepted.filter(args => args[0] === 'track').map(args => args[1])).toEqual(['PageView', 'ViewContent'])
  await expect(premium).toHaveAttribute('href', 'https://checkout.example.test/premium?utm_source=wiapy&utm_campaign=campanha&fbclid=teste')
  await expect(basic).toHaveAttribute('href', 'https://checkout.example.test/basico?fixed=1&utm_source=anuncio&utm_campaign=campanha&fbclid=teste')
  await page.getByRole('button', { name: 'Preferências de privacidade' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Recusar' }).click()
  expect((await pixelCalls()).at(-1)).toEqual(['consent', 'revoke'])
  await expect(basic).toHaveAttribute('href', 'https://checkout.example.test/basico?fixed=1')
  await basic.click()
  await expect(page).toHaveURL('https://checkout.example.test/basico?fixed=1')
  await page.goBack()
  await premium.click()
  await expect(page).toHaveURL('https://checkout.example.test/premium?utm_source=wiapy')
})

for (const [label, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]] as const) {
  test('acessibilidade e captura ' + label, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await serveBuild(page)
    await page.goto(host)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.evaluate(async () => {
      await document.fonts.ready
      await Promise.all(Array.from(document.images).map(async image => {
        image.loading = 'eager'
        await image.decode()
      }))
    })
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([])
    if (process.env.CP360_SCREENSHOTS) {
      await mkdir(process.env.CP360_SCREENSHOTS, { recursive: true })
      await page.screenshot({ path: resolve(process.env.CP360_SCREENSHOTS, label + '-hero.png') })
      await page.screenshot({
        path: resolve(process.env.CP360_SCREENSHOTS, label + '-pagina.png'),
        fullPage: true,
        style: '.bonus-grid { content-visibility: visible !important }',
      })
      await page.getByRole('button', { name: 'Ampliar art. 155 — Furto' }).click()
      await expect(page.getByRole('dialog')).toBeVisible()
      await page.screenshot({ path: resolve(process.env.CP360_SCREENSHOTS, label + '-modal.png') })
    }
  })
}

for (const action of ['escape', 'backdrop', 'touch', 'checkout'] as const) {
  test('oferta alternativa com ação por ' + action, async ({ browser }) => {
    const mobile = action === 'touch' || action === 'checkout'
    const context = await browser.newContext({
      viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
      hasTouch: mobile,
      isMobile: mobile,
      reducedMotion: 'reduce',
    })
    try {
      const page = await context.newPage()
      await serveBuild(page, 'test-results/fixture')
      await page.goto(host + '/#ofertas')
      const trigger = page.getByRole('button', { name: 'Ver oferta alternativa', exact: true })
      await trigger.scrollIntoViewIfNeeded()
      const scroll = await page.evaluate(() => window.scrollY)
      if (mobile) await trigger.tap()
      else if (action === 'escape') { await trigger.focus(); await page.keyboard.press('Enter') }
      else await trigger.click()
      const dialog = page.getByRole('dialog', { name: 'Oferta alternativa' })
      await expect(dialog).toContainText('17,00')
      const checkout = dialog.getByRole('link', { name: 'Quero a oferta alternativa' })
      await expect(checkout).toHaveAttribute('href', 'https://checkout.example.test/alternativa')
      if (action === 'checkout') {
        await page.route('https://checkout.example.test/**', route => route.fulfill({ body: 'Página de teste' }))
        await checkout.tap()
        await expect(page).toHaveURL('https://checkout.example.test/alternativa')
        await page.goBack()
        await expect(dialog).toHaveCount(0)
      } else {
        if (action === 'escape') {
          expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([])
          await page.keyboard.press('Escape')
        } else if (action === 'touch') {
          await dialog.getByRole('button', { name: 'Fechar' }).tap()
        } else {
          await page.mouse.click(2, 2)
        }
        await expect(dialog).toHaveCount(0)
        await expect(page.getByRole('button', { name: 'Oferta alternativa já exibida' })).toBeFocused()
        expect(Math.abs((await page.evaluate(() => window.scrollY)) - scroll)).toBeLessThan(3)
      }
      await page.reload()
      await trigger.click()
      await expect(dialog).toHaveCount(0)
    } finally {
      await context.close()
    }
  })
}
