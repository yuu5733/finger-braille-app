import { test, expect } from '@playwright/test';

test.describe('PC版指点字練習 (/practice)', () => {
  test('キーボード入力で文字をプレビューし、解放で確定済みエリアに追加される', async ({
    page,
  }) => {
    await page.goto('/practice');

    await expect(
      page.getByRole('heading', { name: /指点字練習/ })
    ).toBeVisible();
    await expect(page.getByText('かな入力モード')).toBeVisible();

    const outputArea = page.getByLabel('確定済み:');
    await expect(outputArea).toHaveValue('');

    // 「あ」= f (1点) を押下し、デバウンス待ち後に解放
    await page.keyboard.down('f');
    await page.waitForTimeout(150);
    await expect(page.locator('body')).toContainText('あ');

    await page.keyboard.up('f');
    await expect(outputArea).toHaveValue('あ');
  });
});
