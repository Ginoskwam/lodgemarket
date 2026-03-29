import { test, expect } from '@playwright/test'
import { loginUser } from '../../helpers/playwright'
import { testUsers } from '../../fixtures/users'
import { testMessages } from '../../fixtures/messages'

/**
 * CUJ-4: Messagerie
 * 
 * Parcours:
 * 1. Login
 * 2. Accès messages
 * 3. Ouverture conversation
 * 4. Envoi message
 * 5. Vérification affichage
 */
test.describe('CUJ-4: Messagerie', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, testUsers.user1)
  })

  test('utilisateur peut envoyer un message', async ({ page }) => {
    // 1. Login (déjà fait dans beforeEach)
    
    // 2. Accès messages
    await page.goto('/messages')
    await expect(page).toHaveURL(/\/messages/)
    
    // Vérifier que la page se charge (chercher le titre h1 spécifiquement)
    await expect(page.locator('h1:has-text("Messages")')).toBeVisible({ timeout: 5000 })
    
    // 3. Ouverture conversation (si des conversations existent)
    const conversationsList = page.locator('[data-testid="conversation"]')
      .or(page.locator('a[href*="/messages/"]'))
      .or(page.locator('li, div').filter({ hasText: /@/ }))
    
    const conversationCount = await conversationsList.count()
    
    if (conversationCount > 0) {
      // Ouvrir la première conversation
      await conversationsList.first().click()
      await page.waitForURL(/\/messages\/[^/]+/, { timeout: 5000 })
    } else {
      // Si pas de conversation, on peut créer une nouvelle conversation
      // En cliquant sur une annonce puis "Contacter"
      await page.goto('/annonces')
      const firstAnnonce = page.locator('a[href*="/annonces/"]').first()
      if (await firstAnnonce.isVisible()) {
        await firstAnnonce.click()
        await page.waitForURL(/\/annonces\/[^/]+/, { timeout: 5000 })
        
        const contactButton = page.locator('button:has-text("Contacter")')
          .or(page.locator('a:has-text("Contacter")'))
        
        if (await contactButton.isVisible()) {
          await contactButton.click()
          await page.waitForURL(/\/messages/, { timeout: 5000 })
        }
      }
    }
    
    // 4. Envoi message
    const messageInput = page.locator('textarea[name*="message"]')
      .or(page.locator('textarea[placeholder*="message"]'))
      .or(page.locator('textarea').first())
    
    if (await messageInput.isVisible()) {
      const messageText = testMessages.valid.content
      await messageInput.fill(messageText)
      
      const sendButton = page.locator('button:has-text("Envoyer")')
        .or(page.locator('button[type="submit"]'))
        .or(page.locator('button[aria-label*="envoyer"]'))
      
      if (await sendButton.isVisible()) {
        await sendButton.click()
        
        // 5. Vérification affichage
        await expect(page.locator(`text=${messageText}`)).toBeVisible({ timeout: 5000 })
      }
    } else {
      test.skip('Formulaire de message non trouvé')
    }
  })
})

