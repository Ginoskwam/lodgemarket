import { test, expect } from '@playwright/test'
import { loginUser, createAnnonce } from '../../helpers/playwright'
import { testUsers, newUserData } from '../../fixtures/users'
import { newAnnonceData } from '../../fixtures/annonces'

/**
 * CUJ-1: Inscription et Première Annonce
 * 
 * Parcours:
 * 1. Accès page d'accueil
 * 2. Clic "Publier une annonce" → redirection login
 * 3. Inscription nouveau compte
 * 4. Confirmation email (mock)
 * 5. Création d'une annonce
 * 6. Vérification affichage dans "Mes annonces"
 */
test.describe('CUJ-1: Inscription et Première Annonce', () => {
  test('utilisateur peut s\'inscrire et créer sa première annonce', async ({ page }) => {
    // 1. Accès page d'accueil
    await page.goto('/')
    await expect(page).toHaveTitle(/Lodgemarket/i)
    
    // 2. Clic "Publier une annonce" → redirection login
    // Utiliser le premier lien (dans le main, pas dans le footer)
    const publishLink = page.locator('main a:has-text("Publier une annonce")').first()
    await publishLink.click()
    
    // Vérifier redirection vers login (si non authentifié)
    await page.waitForURL(/\/auth\/login/, { timeout: 5000 }).catch(() => {
      // Si déjà connecté, on continue
    })
    
    // Si on est sur la page de login, aller vers register
    if (page.url().includes('/auth/login')) {
      // Utiliser le premier lien d'inscription dans le main (évite le footer)
      const registerLink = page.locator('main a[href*="register"]').first()
        .or(page.locator('a:has-text("S\'inscrire")').first())
        .or(page.locator('a[href*="register"]').first())
      await registerLink.click()
      await page.waitForURL(/\/auth\/register/, { timeout: 5000 })
    }
    
    // 3. Inscription nouveau compte
    const uniqueEmail = `test-${Date.now()}@broques.test`
    await page.fill('input[type="email"]', uniqueEmail)
    await page.fill('input[type="password"]', newUserData.password)
    
    // Si le formulaire a un champ de confirmation de mot de passe
    const confirmPasswordInput = page.locator('input[name*="confirm"]').or(page.locator('input[type="password"]').nth(1))
    if (await confirmPasswordInput.isVisible()) {
      await confirmPasswordInput.fill(newUserData.password)
    }
    
    // Si le formulaire a un champ nom
    const nameInput = page.locator('input[name*="name"]').or(page.locator('input[type="text"]').first())
    if (await nameInput.isVisible()) {
      await nameInput.fill(newUserData.name)
    }
    
    await page.click('button[type="submit"]')
    
    // 4. Attendre la redirection ou le message de succès
    // Note: En test, on peut avoir besoin de mocker la confirmation email
    await page.waitForURL(/\/(auth\/login|annonces)/, { timeout: 15000 })
    
    // Si redirigé vers login avec message de succès, se connecter
    if (page.url().includes('/auth/login')) {
      await page.fill('input[type="email"]', uniqueEmail)
      await page.fill('input[type="password"]', newUserData.password)
      await page.click('button[type="submit"]')
      await page.waitForURL(/\/(annonces|profil)/, { timeout: 10000 })
    }
    
    // 5. Création d'une annonce
    const annonceTitle = `Annonce Test ${Date.now()}`
    await createAnnonce(page, {
      ...newAnnonceData,
      title: annonceTitle,
    })
    
    // 6. Vérification affichage dans "Mes annonces"
    await page.goto('/annonces/mes-annonces')
    await expect(page.locator(`text=${annonceTitle}`)).toBeVisible({ timeout: 5000 })
  })
})

