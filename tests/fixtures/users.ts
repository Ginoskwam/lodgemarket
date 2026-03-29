/**
 * Fixtures pour les utilisateurs de test
 * Utilisés dans les tests unitaires, d'intégration et E2E
 */

export const testUsers = {
  user1: {
    email: 'test-user-1@broques.test',
    password: 'TestPassword123!',
    name: 'Test User 1',
  },
  user2: {
    email: 'test-user-2@broques.test',
    password: 'TestPassword123!',
    name: 'Test User 2',
  },
  admin: {
    email: 'test-admin@broques.test',
    password: 'TestPassword123!',
    name: 'Test Admin',
  },
}

/**
 * Données pour créer un nouvel utilisateur
 */
export const newUserData = {
  email: `test-new-${Date.now()}@broques.test`,
  password: 'TestPassword123!',
  name: 'New Test User',
}

