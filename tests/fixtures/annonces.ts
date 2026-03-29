/**
 * Fixtures pour les annonces de test
 */

export const testAnnonces = {
  valid: {
    title: 'Perceuse Bosch Professionnelle',
    description: 'Perceuse Bosch en excellent état, utilisée seulement quelques fois. Avec tous les accessoires.',
    price: 15,
    location: 'Paris 75001',
    category: 'outils',
  },
  validWithImage: {
    title: 'Tondeuse à gazon électrique',
    description: 'Tondeuse électrique en très bon état, idéale pour petits jardins.',
    price: 20,
    location: 'Lyon 69001',
    category: 'jardinage',
    imageUrl: 'https://example.com/image.jpg',
  },
  invalid: {
    title: '', // Titre vide - invalide
    description: 'Description valide',
    price: -10, // Prix négatif - invalide
    location: 'Paris',
    category: 'outils',
  },
  minimal: {
    title: 'Scie circulaire',
    description: 'Scie circulaire',
    price: 12,
  },
}

/**
 * Données pour créer une nouvelle annonce
 */
export const newAnnonceData = {
  title: `Annonce Test ${Date.now()}`,
  description: 'Description de test pour une nouvelle annonce',
  price: 25,
  location: 'Test Location',
  category: 'outils',
}

