/**
 * Fixtures pour les messages de test
 */

export const testMessages = {
  valid: {
    content: 'Bonjour, je suis intéressé par votre annonce. Est-elle encore disponible ?',
  },
  long: {
    content: 'A'.repeat(1000), // Message très long
  },
  empty: {
    content: '', // Message vide - invalide
  },
  withSpecialChars: {
    content: 'Message avec caractères spéciaux: éàùç€£$%&',
  },
}

