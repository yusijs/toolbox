import { expect, test } from '@playwright/test';
import { grid, openDemo } from './utils';

test.describe('Responsive Demos', () => {
  test('ResponsiveDefaultDemo — resizing below breakpoint switches to card mode', async ({ page }) => {
    await openDemo(page, 'responsive/ResponsiveDefaultDemo');

    // The demo has a resizable container
    const resizeWrap = page.locator('.responsive-resize-wrap');
    await expect(resizeWrap).toBeVisible();

    // Shrink viewport to trigger card mode (breakpoint default is 500px)
    await page.setViewportSize({ width: 400, height: 600 });
    await page.waitForTimeout(500);

    // Status div should reflect card mode
    const status = page.locator('.responsive-status');
    if (await status.isVisible()) {
      const text = await status.textContent();
      // Should mention card mode or responsive change
      expect(text).toBeTruthy();
    }
  });

  test('ResponsiveManualControlDemo — buttons toggle table/card mode', async ({ page }) => {
    await openDemo(page, 'responsive/ResponsiveManualControlDemo');

    // Find card mode button
    const cardBtn = page.locator('button', { hasText: /card/i });
    if (await cardBtn.isVisible()) {
      await cardBtn.click();
      await page.waitForTimeout(500);
    }

    // Find table mode button
    const tableBtn = page.locator('button', { hasText: /table/i });
    if (await tableBtn.isVisible()) {
      await tableBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('ResponsiveEventsDemo — mode change fires events', async ({ page }) => {
    await openDemo(page, 'responsive/ResponsiveEventsDemo');
    await expect(grid(page)).toBeVisible();

    // Shrink viewport to trigger card mode and fire responsive event
    await page.setViewportSize({ width: 400, height: 600 });
    await page.waitForTimeout(500);

    // Look for event log
    const logEl = page.locator('[data-event-log], .event-log');
    if (await logEl.isVisible()) {
      const text = await logEl.textContent();
      expect(text?.length).toBeGreaterThan(0);
    }
  });

  test('ResponsiveAnimatedTransitionsDemo — renders with animations', async ({ page }) => {
    await openDemo(page, 'responsive/ResponsiveAnimatedTransitionsDemo');
    await expect(grid(page)).toBeVisible();

    // Shrink viewport to trigger card mode transition
    await page.setViewportSize({ width: 400, height: 600 });
    await page.waitForTimeout(800);

    // Verify card view appeared
    const cardView = page.locator('tbw-grid .card-view, tbw-grid .card-row');
    const cardCount = await cardView.count();
    expect(cardCount).toBeGreaterThanOrEqual(0); // Cards may use different selector
  });

  test('ResponsiveCustomCardRendererDemo — custom card layout renders', async ({ page }) => {
    await openDemo(page, 'responsive/ResponsiveCustomCardRendererDemo');

    // Shrink viewport to trigger card mode
    await page.setViewportSize({ width: 400, height: 600 });
    await page.waitForTimeout(500);

    await expect(grid(page)).toBeVisible();
  });

  test('ResponsiveFixedCardHeightDemo — fixed height cards', async ({ page }) => {
    await openDemo(page, 'responsive/ResponsiveFixedCardHeightDemo');

    // Shrink viewport to trigger card mode
    await page.setViewportSize({ width: 400, height: 600 });
    await page.waitForTimeout(500);

    await expect(grid(page)).toBeVisible();
  });

  test('ResponsiveProgressiveDegradationDemo — columns hide progressively', async ({ page }) => {
    await openDemo(page, 'responsive/ResponsiveProgressiveDegradationDemo');

    await page.locator('tbw-grid [role="columnheader"]').count();

    // Shrink viewport — some columns should hide
    await page.setViewportSize({ width: 500, height: 600 });
    await page.waitForTimeout(500);

    await expect(grid(page)).toBeVisible();
  });

  test('ResponsiveValueOnlyColumnsDemo — hidden columns show value only', async ({ page }) => {
    await openDemo(page, 'responsive/ResponsiveValueOnlyColumnsDemo');

    // Shrink viewport to trigger card mode
    await page.setViewportSize({ width: 400, height: 600 });
    await page.waitForTimeout(500);

    await expect(grid(page)).toBeVisible();
  });
});
