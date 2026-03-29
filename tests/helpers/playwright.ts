import { Page, expect } from '@playwright/test'
import { testUsers } from '../fixtures/users'

/**
 * Helpers pour les tests Playwright E2E
 */

/**
 * Login rapide avec un utilisateur de test
 */
export async function loginUser(page: Page, user = testUsers.user1) {
  await page.goto('/auth/login')
  
  // Attendre que le formulaire soit chargé
  await page.waitForSelector('input[type="email"]', { timeout: 5000 })
  
  await page.fill('input[type="email"]', user.email)
  await page.fill('input[type="password"]', user.password)
  
  // Attendre que le bouton soit cliquable
  const submitButton = page.locator('button[type="submit"]').or(page.locator('button:has-text("Se connecter")'))
  await submitButton.waitFor({ state: 'visible', timeout: 5000 })
  await submitButton.click()
  
  // Attendre soit la redirection, soit un message d'erreur
  try {
    // Attendre la redirection avec un timeout plus long
    await page.waitForURL(/\/(annonces|profil|messages)/, { timeout: 20000 })
  } catch (error) {
    // Si pas de redirection, vérifier s'il y a une erreur
    const errorElement = page.locator('[role="alert"]')
      .or(page.locator('.error'))
      .or(page.locator('text=/erreur/i'))
      .or(page.locator('text=/incorrect/i'))
      .or(page.locator('text=/invalide/i'))
    
    if (await errorElement.isVisible({ timeout: 3000 }).catch(() => false)) {
      const errorText = await errorElement.textContent()
      throw new Error(`Login failed: ${errorText || 'Unknown error'}`)
    }
    
    // Si toujours sur la page de login après 20s, c'est un échec
    const currentUrl = page.url()
    if (currentUrl.includes('/auth/login')) {
      // Prendre un screenshot pour debug
      await page.screenshot({ path: 'test-results/login-failed.png' })
      throw new Error(`Login timeout: still on login page (${currentUrl}) after 20s. User may not exist in Supabase. See SETUP_TEST_USERS.md`)
    }
    
    // Si on est ailleurs, peut-être que ça a marché
    throw error
  }
}

/**
 * Logout
 */
export async function logoutUser(page: Page) {
  // Chercher le bouton de déconnexion (ajuster le sélecteur selon votre UI)
  const logoutButton = page.locator('button:has-text("Déconnexion")').or(page.locator('a[href*="logout"]'))
  if (await logoutButton.isVisible()) {
    await logoutButton.click()
  }
  await page.waitForURL('/auth/login', { timeout: 5000 })
}

/**
 * Créer une annonce via le formulaire
 */
export async function createAnnonce(page: Page, annonceData: any) {
  await page.goto('/annonces/nouvelle')
  
  // Attendre que le formulaire soit chargé
  await page.waitForSelector('input[name="title"]', { timeout: 10000 })
  
  await page.fill('input[name="title"]', annonceData.title)
  await page.fill('textarea[name="description"]', annonceData.description)
  await page.fill('input[name="price"]', annonceData.price.toString())
  if (annonceData.location) {
    await page.fill('input[name="location"]', annonceData.location)
  }
  
  await page.click('button[type="submit"]')
  
  // Attendre la redirection ou le message de succès
  await page.waitForURL(/\/annonces/, { timeout: 10000 })
}

/**
 * Attendre qu'un élément soit visible avec retry
 */
export async function waitForElement(page: Page, selector: string, timeout = 5000) {
  await expect(page.locator(selector)).toBeVisible({ timeout })
}

/**
 * Vérifier qu'un message d'erreur est affiché
 */
export async function expectErrorMessage(page: Page, message?: string) {
  const errorLocator = page.locator('[role="alert"]').or(page.locator('.error')).or(page.locator('text=/erreur/i'))
  await expect(errorLocator).toBeVisible()
  if (message) {
    await expect(errorLocator).toContainText(message)
  }
}

/**
 * Vérifier qu'un message de succès est affiché
 */
export async function expectSuccessMessage(page: Page, message?: string) {
  const successLocator = page.locator('[role="status"]').or(page.locator('.success')).or(page.locator('text=/succès/i'))
  await expect(successLocator).toBeVisible()
  if (message) {
    await expect(successLocator).toContainText(message)
  }
}

/**
 * Nettoyer les données de test (à implémenter selon votre API)
 */
export async function cleanupTestData(page: Page) {
  // Implémenter la logique de nettoyage si nécessaire
  // Par exemple, supprimer les annonces de test créées
}

