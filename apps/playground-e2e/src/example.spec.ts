import { expect, test } from '@playwright/test';

test('renders the Lumina UI playground shell', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Lumina UI');
});

test('switches theme via the theme switcher', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Dark' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.getByRole('button', { name: 'High contrast' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'hc');
});

test('Button is keyboard focusable and accessible', async ({ page }) => {
  await page.goto('/');
  const primary = page.getByRole('button', { name: 'primary' });
  await expect(primary).toBeVisible();
  await primary.focus();
  await expect(primary).toBeFocused();
});
