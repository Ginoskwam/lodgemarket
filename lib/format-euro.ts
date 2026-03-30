/** Affichage prix en euros (FR), sans centimes pour les montants « ronds ». */
export function formatEuroEUR(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value)
}
