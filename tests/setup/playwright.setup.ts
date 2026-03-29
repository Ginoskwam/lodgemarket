import { test as setup, expect } from '@playwright/test'
import { testUsers } from '../fixtures/users'

/**
 * Setup global pour Playwright
 * Crée des sessions authentifiées réutilisables
 */

const authFile = 'tests/.auth/user.json'

setup('authenticate', async ({ page }) => {
  // Navigate vers la page de login
  await page.goto('/auth/login')
  
  // Login avec un utilisateur de test
  await page.fill('input[type="email"]', testUsers.user1.email)
  await page.fill('input[type="password"]', testUsers.user1.password)
  await page.click('button[type="submit"]')
  
  // Attendre la redirection après login
  await page.waitForURL('/**', { timeout: 10000 })
  
  // Vérifier que l'utilisateur est bien connecté
  await expect(page).toHaveURL(/\/(annonces|profil|messages)/)
  
  // Sauvegarder l'état de la session
  await page.context().storageState({ path: authFile })
})

