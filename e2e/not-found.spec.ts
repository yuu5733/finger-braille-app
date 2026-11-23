import { test, expect } from '@playwright/test';

test.describe('404 ページ', () => {
  test('存在しないURLで案内とナビゲーションリンクが表示される', async ({
    page,
  }) => {
    await page.goto('/non-existent-page-check');

    await expect(
      page.getByRole('heading', { name: 'お探しのページは見つかりません。' })
    ).toBeVisible();
    await expect(
      page.locator('.guidance-link', { hasText: 'ホーム' })
    ).toHaveAttribute('href', '/');
  });
});
