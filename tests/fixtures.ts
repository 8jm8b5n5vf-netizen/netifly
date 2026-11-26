import { build } from 'vite'

export default async function setup() {
  process.env.VITE_COMMERCIAL_APPROVED = 'false'
  process.env.VITE_META_PIXEL_ID = ''
  process.env.VITE_CONFIRMED_BONUSES = ''
  process.env.VITE_CHECKOUT_BASIC_URL = ''
  process.env.VITE_CHECKOUT_PREMIUM_URL = ''
  await build({ logLevel: 'warn' })

  // Reserved test domains are intercepted in the browser. No transaction occurs.
  Object.assign(process.env, {
    VITE_SITE_URL: 'https://produto.example.test',
    VITE_EDITION_UPDATED: '2026-11-25',
    VITE_CHECKOUT_BASIC_URL: 'https://checkout.example.test/basico?fixed=1',
    VITE_CHECKOUT_PREMIUM_URL: 'https://checkout.example.test/premium?utm_source=wiapy',
    VITE_CHECKOUT_DOWNSELL_URL: 'https://checkout.example.test/alternativa',
    VITE_SUPPORT_EMAIL: 'suporte@example.test',
    VITE_SUPPLIER_NAME: 'Fornecedor fictício para teste',
    VITE_SUPPLIER_ID: 'Identificador fictício',
    VITE_SUPPLIER_ADDRESS: 'Endereço fictício',
    VITE_PRIVACY_URL: 'https://produto.example.test/privacidade',
    VITE_TERMS_URL: 'https://produto.example.test/termos',
    VITE_REFUND_URL: 'https://produto.example.test/reembolso',
    VITE_ACCESS_URL: 'https://produto.example.test/acesso',
    VITE_COMMERCIAL_APPROVED: 'true',
    VITE_PAYMENT_TERMS_CONFIRMED: 'true',
    VITE_DIGITAL_DELIVERY_CONFIRMED: 'true',
    VITE_GUARANTEE_7_DAYS_CONFIRMED: 'true',
    VITE_CONFIRMED_BONUSES: 'mapas,questoes,flashcards,guia,pegadinhas,simulados,plano',
    VITE_DOWNSELL_CONFIRMED: 'true',
    VITE_FORWARD_ATTRIBUTION: 'true',
    VITE_META_PIXEL_ID: '99999999999',
  })
  await build({ logLevel: 'warn', build: { outDir: 'test-results/fixture' } })
}
