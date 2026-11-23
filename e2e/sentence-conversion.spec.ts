import { test, expect } from '@playwright/test';

test.describe('文の変換 (/sentence-conversion)', () => {
  test('WASM初期化後にテキストを変換して結果を表示する', async ({ page }) => {
    await page.goto('/sentence-conversion');

    await expect(page).toHaveTitle(/文の変換/);
    await expect(
      page.getByRole('heading', { name: '文を指点字に変換して表示' })
    ).toBeVisible();

    const convertBtn = page.getByRole('button', { name: '変換' });
    await expect(convertBtn).toBeEnabled();

    const textarea = page.getByLabel('変換するテキスト');
    await textarea.fill('あ');
    await convertBtn.click();

    await expect(page.getByText('原文:')).toBeVisible();
    await expect(page.getByText('仮名:')).toBeVisible();
  });
});
