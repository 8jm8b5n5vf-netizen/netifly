const campaignKey = /^(utm_(source|medium|campaign|id|content|term|source_platform|creative_format|marketing_tactic)|fbclid|gclid|wbraid|gbraid)$/i

export function checkoutTarget(base: string, query: string, forward: boolean) {
  const target = new URL(base)
  if (forward) {
    for (const [key, value] of new URLSearchParams(query)) {
      if (campaignKey.test(key) && value && !target.searchParams.has(key)) target.searchParams.set(key, value)
    }
  }
  return target.href
}
