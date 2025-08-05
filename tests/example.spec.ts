import { test, expect } from '@playwright/test'
import { menuItems } from '@libs/collections'

test.describe('Shortening URL', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4321/')
  })

  test('Header title should be visible', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('URL Shortener')
  })

  test.describe('Extra function buttons should toggle the functions', () => {
    test('Extra function buttons are visible', async ({ page }) => {
      for (const button of menuItems) {
        await expect(page.getByText(button.label)).toBeVisible()
      }
    })

    test('Extra functions should be hidden', async ({ page }) => {
      await expect(page.locator('.custom-hash-container')).toBeHidden()
      await expect(page.locator('.auth-code-container')).toBeHidden()
      await expect(page.locator('section.last-links-container')).toBeHidden()
    })

    test('Extra functions should be visible when their are activated', async ({ page }) => {
      for (const button of menuItems) {
        const $button = page.getByText(button.label)
        await $button.click()

        if (button.id === 'customHash') await expect(page.locator('.custom-hash-container')).toBeVisible()
        if (button.id === 'authCode') await expect(page.locator('.auth-code-container')).toBeVisible()
        if (button.id === 'showLinks') await expect(page.locator('section.last-links-container')).toBeVisible()
      }
    })
  })

  test('Should show a shorten URL', async ({ page }) => {
    const $result = page.locator('#result')
    const $urlInput = page.getByPlaceholder('Enter URL')
    const $submitButton = page.getByRole('button', { name: 'Shorten' })

    await expect($result).toBeHidden()
    await $urlInput.fill('https://joanbric.com')
    await $submitButton.click()
    await expect($result).toBeVisible()

    const generatedLink = await page.locator('#shortened-url').getAttribute('href')
    expect(generatedLink).toMatch(/http:\/\/localhost:4321\/[a-zA-Z0-9]+/)
  })
  test('Should return the same hash if URL is already registed', async ({ page }) => {
    const $result = page.locator('#result')
    const $urlInput = page.getByPlaceholder('Enter URL')
    const $submitButton = page.getByRole('button', { name: 'Shorten' })

    await expect($result).toBeHidden()
    await $urlInput.fill('https://joanbric.com')
    await $submitButton.click()
    await expect($result).toBeVisible()

    const generatedLink = await page.locator('#shortened-url').getAttribute('href')

    expect(generatedLink).toEqual('http://localhost:4321/4qnmbw')
  })
})
