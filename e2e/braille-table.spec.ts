import { test, expect } from '@playwright/test';

test.describe('指点字表 (/braille-table)', () => {
  test('見出し・目次リンク・各セクションが表示される', async ({ page }) => {
    await page.goto('/braille-table');

    await expect(page).toHaveTitle(/指点字表/);
    await expect(
      page.getByRole('heading', { name: '指点字表', exact: true })
    ).toBeVisible();

    await expect(
      page.getByRole('heading', { name: '清音｜指点字表' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: '数字｜指点字表' })
    ).toBeVisible();

    await page.getByRole('link', { name: 'アルファベット' }).click();
    await expect(page).toHaveURL(/#alphabet$/);
  });
});
