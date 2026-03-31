export function formatCurrencyEur(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(
    amount
  )
}

export function formatPercent(value: number, fractionDigits = 1): string {
  return `${value.toFixed(fractionDigits).replace('.', ',')} %`
}

/** Affichage type « 65 k€ » à partir du CA annuel */
export function formatRevenueShort(euros: number | null | undefined): string | null {
  if (euros == null || Number.isNaN(euros)) return null
  if (euros >= 1_000_000) return `${(euros / 1_000_000).toFixed(1).replace('.', ',')} M€`
  if (euros >= 1000) return `${Math.round(euros / 1000)} k€`
  return `${Math.round(euros)} €`
}
