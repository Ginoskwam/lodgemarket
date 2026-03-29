import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Tests d'accessibilité avec axe-core
 */

test.describe('Accessibilité', () => {
  test('page d\'accueil devrait être accessible', async ({ page }) => {
    await page.goto('/')
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('page de login devrait être accessible', async ({ page }) => {
    await page.goto('/auth/login')
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('page d\'annonces devrait être accessible', async ({ page }) => {
    await page.goto('/annonces')
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])
  })
})

