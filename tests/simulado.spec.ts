import { readFile } from 'node:fs/promises'
import { extname, resolve } from 'node:path'
import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const host = 'https://simulado.example.test'
const contentType: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
}

async function abrirSimulado(page: Page) {
  await page.route(host + '/**', async route => {
    const pathname = new URL(route.request().url()).pathname
    const file = pathname === '/simulado' ? '/simulado.html' : pathname
    const body = await readFile(resolve('test-results/editorial', '.' + file)).catch(() => undefined)
    if (!body) return route.fulfill({ status: 404 })
    return route.fulfill({
      body,
      contentType: contentType[extname(file)],
      headers: { 'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'" },
    })
  })
  await page.goto(host + '/simulado')
}

async function responder(page: Page, indice: number) {
  await page.getByRole('radio').nth(indice).check()
  await page.getByRole('button', { name: 'Confirmar resposta' }).click()
}

test('corrige a questão, persiste o nome e retoma na questão seguinte', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 })
  await abrirSimulado(page)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Simulado de Direito Penal')
  await expect(page.getByRole('button', { name: 'Começar simulado' })).toBeDisabled()
  await page.getByLabel('Nome ou apelido').fill('Estudante')
  await page.getByRole('button', { name: 'Começar simulado' }).click()
  await expect(page.getByRole('heading', { name: 'Consumação e tentativa' })).toBeFocused()
  await responder(page, 1)
  await expect(page.getByRole('heading', { name: 'Resposta correta' })).toBeFocused()
  await expect(page.getByText('Base legal: Art. 14, II.')).toBeVisible()
  await expect(page.getByText('1 de 12 respondidas')).toBeVisible()
  await page.reload()
  await expect(page.getByText('Estudante')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Dolo e culpa' })).toBeVisible()
  await page.getByRole('button', { name: 'Anterior' }).click()
  await expect(page.getByRole('radio').nth(1)).toBeChecked()
  await expect(page.getByRole('radio').nth(1)).toBeDisabled()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320)
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([])
})

test('calcula o resultado, sugere revisão e reinicia a tentativa', async ({ page }) => {
  await abrirSimulado(page)
  await page.getByLabel('Nome ou apelido').fill('Estudante')
  await page.getByRole('button', { name: 'Começar simulado' }).click()
  // Apenas a primeira resposta está errada.
  for (const resposta of [0, 2, 3, 0, 1, 2, 0, 3, 1, 0, 2, 3]) {
    await responder(page, resposta)
    await page.getByRole('button', { name: /próxima questão|ver resultado/i }).click()
  }
  await expect(page.getByRole('heading', { name: 'Resultado do simulado' })).toBeVisible()
  await expect(page.getByText('11 de 12 questões corretas')).toBeVisible()
  await page.getByRole('button', { name: 'Consumação e tentativa' }).click()
  await expect(page.getByRole('heading', { name: 'Resposta incorreta' })).toBeVisible()
  await page.reload()
  await expect(page.getByText('11 de 12 questões corretas')).toBeVisible()
  page.once('dialog', dialog => dialog.accept())
  await page.getByRole('button', { name: 'Reiniciar' }).click()
  await expect(page.getByText('0 de 12 respondidas')).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Consumação e tentativa' })).toBeVisible()
  await expect(page.getByText('0 de 12 respondidas')).toBeVisible()
})
