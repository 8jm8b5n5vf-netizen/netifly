import { bonuses } from './catalog.ts'

type BuildVariables = Partial<Record<string, string>>

export function httpsUrl(value?: string) {
  if (!value) return undefined
  try {
    const url = new URL(value)
    if (url.protocol === 'https:' && !url.username && !url.password) return url.href
  } catch {
    return undefined
  }
}

function editionDate(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined
  const date = new Date(value)
  if (!Number.isFinite(date.valueOf()) || date.toISOString().slice(0, 10) !== value) return undefined
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(date)
}

export function readConfig(env: BuildVariables) {
  const url = httpsUrl(env.VITE_SITE_URL)
  const checkout = {
    basic: httpsUrl(env.VITE_CHECKOUT_BASIC_URL),
    premium: httpsUrl(env.VITE_CHECKOUT_PREMIUM_URL),
    downsell: httpsUrl(env.VITE_CHECKOUT_DOWNSELL_URL),
  }
  const approvedBonuses = new Set(env.VITE_CONFIRMED_BONUSES?.split(',').map(id => id.trim()))
  const confirmedBonuses = bonuses.filter(bonus => approvedBonuses.has(bonus.id))
  const fullBundle = confirmedBonuses.length === bonuses.length
  const payment = env.VITE_PAYMENT_TERMS_CONFIRMED === 'true'
  const delivery = env.VITE_DIGITAL_DELIVERY_CONFIRMED === 'true'
  const guarantee = env.VITE_GUARANTEE_7_DAYS_CONFIRMED === 'true'
  const supplier = {
    name: env.VITE_SUPPLIER_NAME?.trim(),
    id: env.VITE_SUPPLIER_ID?.trim(),
    address: env.VITE_SUPPLIER_ADDRESS?.trim(),
    email: /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(env.VITE_SUPPORT_EMAIL ?? '') ? env.VITE_SUPPORT_EMAIL : undefined,
  }
  const legal = {
    privacy: httpsUrl(env.VITE_PRIVACY_URL),
    terms: httpsUrl(env.VITE_TERMS_URL),
    refund: httpsUrl(env.VITE_REFUND_URL),
    access: httpsUrl(env.VITE_ACCESS_URL),
  }
  const updated = editionDate(env.VITE_EDITION_UPDATED)
  const approved = env.VITE_COMMERCIAL_APPROVED === 'true'
  const live = Boolean(approved && delivery && updated && url && checkout.basic && checkout.premium && checkout.basic !== checkout.premium
    && Object.values(supplier).every(Boolean) && Object.values(legal).every(Boolean))
  const downsellReady = live && fullBundle && env.VITE_DOWNSELL_CONFIRMED === 'true' && checkout.downsell
    && checkout.downsell !== checkout.basic && checkout.downsell !== checkout.premium
  return {
    url, checkout, supplier, legal, updated, live, fullBundle, confirmedBonuses,
    terms: { payment, delivery, guarantee },
    downsellUrl: downsellReady ? checkout.downsell : undefined,
    pixel: /^\d{5,25}$/.test(env.VITE_META_PIXEL_ID ?? '') ? env.VITE_META_PIXEL_ID : undefined,
    forwardAttribution: env.VITE_FORWARD_ATTRIBUTION === 'true',
  }
}
