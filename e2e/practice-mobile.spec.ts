import { test, expect } from '@playwright/test';

test.describe('指点字練習(スマホ版) (/practice/mobile)', () => {
  test('指ボタン操作で文字を入力し、確定済みエリアに反映される', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/practice/mobile');

    await expect(page).toHaveTitle(/指点字練習\(スマホ版\)/);
    await expect(
      page.getByRole('heading', { name: '指点字練習 (スマホ版)' })
    ).toBeVisible();

    const dot1Button = page.getByRole('button', { name: /1.*の点/ });
    await dot1Button.dispatchEvent('mousedown');
    await expect(page.locator('body')).toContainText('あ');
    await dot1Button.dispatchEvent('mouseup');

    await expect(page.getByLabel('確定済み:')).toHaveValue('あ');
  });
});
