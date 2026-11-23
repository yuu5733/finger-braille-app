import { test, expect } from '@playwright/test';

test.describe('指点字練習(PC版) (/practice)', () => {
  test('キーボード入力で文字をプレビューし、解放で確定済みエリアに追加される', async ({
    page,
  }) => {
    await page.goto('/practice');

    await expect(page).toHaveTitle(/指点字練習\(PC版\)/);
    await expect(
      page.getByRole('heading', { name: '指点字練習(PC版)' })
    ).toBeVisible();
    await expect(page.getByText('かな入力モード')).toBeVisible();

    const outputArea = page.getByLabel('確定済み:');
    await expect(outputArea).toHaveValue('');

    // 「あ」= f (1点) を 100ms 以上押下して安定化
    await page.keyboard.down('f');
    await page.waitForTimeout(150);
    await expect(page.locator('body')).toContainText('あ');

    await page.keyboard.up('f');
    await expect(outputArea).toHaveValue('あ');
  });
});
