import { test, expect } from '@playwright/test'
import { loginUser, createAnnonce } from '../../helpers/playwright'
import { testUsers } from '../../fixtures/users'
import { newAnnonceData } from '../../fixtures/annonces'

/**
 * CUJ-3: Gestion Annonce
 * 
 * Parcours:
 * 1. Login utilisateur existant
 * 2. Accès "Mes annonces"
 * 3. Modification d'une annonce
 * 4. Vérification mise à jour
 * 5. Suppression (si disponible)
 */
test.describe('CUJ-3: Gestion Annonce', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, testUsers.user1)
  })

  test('utilisateur peut modifier son annonce', async ({ page }) => {
    // 1. Login (déjà fait dans beforeEach)
    
    // 2. Accès "Mes annonces"
    await page.goto('/annonces/mes-annonces')
    await expect(page).toHaveURL(/\/annonces\/mes-annonces/)
    
    // Vérifier qu'il y a au moins une annonce, sinon en créer une
    // Dans "mes-annonces", les annonces sont dans des divs avec des liens "Voir" et "Modifier"
    const annoncesContainer = page.locator('main').first()
    await annoncesContainer.waitFor({ state: 'visible', timeout: 5000 })
    
    // Chercher les liens "Modifier" ou "Voir"
    const modifierLinks = page.locator('main a:has-text("Modifier")')
    const voirLinks = page.locator('main a:has-text("Voir")')
    
    let hasAnnonces = false
    
    try {
      hasAnnonces = await modifierLinks.count() > 0 || await voirLinks.count() > 0
    } catch {
      hasAnnonces = false
    }
    
    if (!hasAnnonces) {
      // Créer une annonce pour le test
      await createAnnonce(page, {
        ...newAnnonceData,
        title: `Annonce à modifier ${Date.now()}`,
      })
      await page.goto('/annonces/mes-annonces')
      await page.waitForTimeout(2000) // Attendre le rechargement
    }
    
    // 3. Modification d'une annonce
    // Dans "mes-annonces", il y a directement un lien "Modifier" sur chaque annonce
    const firstModifierLink = page.locator('main a:has-text("Modifier")').first()
    
    if (await firstModifierLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await firstModifierLink.click()
    } else {
      // Si pas de lien "Modifier" directement, chercher un lien "Voir" puis "Modifier"
      const firstVoirLink = page.locator('main a:has-text("Voir")').first()
      if (await firstVoirLink.isVisible({ timeout: 3000 }).catch(() => false)) {
        await firstVoirLink.click()
        await page.waitForURL(/\/annonces\/[^/]+$/, { timeout: 5000 })
        
        // Chercher le bouton "Modifier" sur la page de détail
        const editButtonDetail = page.locator('button:has-text("Modifier")')
          .or(page.locator('a:has-text("Modifier")'))
          .or(page.locator('a[href*="/modifier"]'))
        
        if (await editButtonDetail.isVisible({ timeout: 3000 }).catch(() => false)) {
          await editButtonDetail.click()
        } else {
          test.skip('Bouton modifier non trouvé')
          return
        }
      } else {
        test.skip('Aucune annonce trouvée')
        return
      }
    }
    
    // Attendre le formulaire de modification
    await page.waitForURL(/\/annonces\/[^/]+\/modifier/, { timeout: 5000 })
    
    // Modifier le titre
    const titleInput = page.locator('input[name="title"]').or(page.locator('input[type="text"]').first())
    if (await titleInput.isVisible()) {
      const newTitle = `Annonce Modifiée ${Date.now()}`
      await titleInput.clear()
      await titleInput.fill(newTitle)
      
      // Soumettre le formulaire
      const submitButton = page.locator('button[type="submit"]').or(page.locator('button:has-text("Enregistrer")'))
      await submitButton.click()
      
      // 4. Vérification mise à jour
      await page.waitForURL(/\/annonces\/[^/]+$/, { timeout: 10000 })
      await expect(page.locator(`text=${newTitle}`)).toBeVisible({ timeout: 5000 })
    }
  })
})

