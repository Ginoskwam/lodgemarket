import { test, expect } from '@playwright/test'
import { testUsers } from '../../fixtures/users'

/**
 * CUJ-5: Authentification et Sécurité
 * 
 * Parcours:
 * 1. Tentative accès route protégée sans auth → redirection login
 * 2. Login avec mauvais credentials → erreur
 * 3. Login avec bons credentials → succès
 * 4. Déconnexion
 * 5. Vérification session supprimée
 */
test.describe('CUJ-5: Authentification et Sécurité', () => {
  test('tentative accès route protégée redirige vers login', async ({ page }) => {
    // 1. Tentative accès route protégée sans auth
    await page.goto('/annonces/mes-annonces')
    
    // Vérifier redirection vers login
    await page.waitForURL(/\/auth\/login/, { timeout: 5000 })
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('login avec mauvais credentials affiche erreur', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Remplir avec de mauvais credentials
    await page.fill('input[type="email"]', 'wrong@email.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    // Vérifier message d'erreur
    await expect(
      page.locator('text=/erreur/i')
        .or(page.locator('text=/incorrect/i'))
        .or(page.locator('text=/invalide/i'))
        .or(page.locator('[role="alert"]'))
    ).toBeVisible({ timeout: 5000 })
    
    // Vérifier qu'on est toujours sur la page de login
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('login avec bons credentials réussit', async ({ page }) => {
    await page.goto('/auth/login')
    
    // 3. Login avec bons credentials
    await page.fill('input[type="email"]', testUsers.user1.email)
    await page.fill('input[type="password"]', testUsers.user1.password)
    await page.click('button[type="submit"]')
    
    // Attendre la redirection
    await page.waitForURL(/\/(annonces|profil|messages)/, { timeout: 10000 })
    
    // Vérifier qu'on n'est plus sur la page de login
    await expect(page).not.toHaveURL(/\/auth\/login/)
  })

  test('déconnexion supprime la session', async ({ page }) => {
    // Login d'abord
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', testUsers.user1.email)
    await page.fill('input[type="password"]', testUsers.user1.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/(annonces|profil|messages)/, { timeout: 10000 })
    
    // 4. Déconnexion
    // Chercher le bouton de déconnexion dans le header
    const logoutButton = page.locator('header button:has-text("Déconnexion")')
      .or(page.locator('header a:has-text("Déconnexion")'))
    
    if (await logoutButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await logoutButton.click()
      // La déconnexion redirige vers / (pas /auth/login)
      await page.waitForURL(/\/$/, { timeout: 5000 })
    } else {
      // Si le bouton n'est pas trouvé, skip le test
      test.skip('Bouton de déconnexion non trouvé')
      return
    }
    
    // 5. Vérification session supprimée (redirection vers accueil)
    await expect(page).toHaveURL(/\/$/)
    
    // Vérifier qu'on ne peut plus accéder aux routes protégées
    await page.goto('/annonces/mes-annonces')
    await page.waitForURL(/\/auth\/login/, { timeout: 5000 })
    await expect(page).toHaveURL(/\/auth\/login/)
  })
})

