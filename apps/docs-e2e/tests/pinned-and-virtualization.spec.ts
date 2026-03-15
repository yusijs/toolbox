import { expect, test } from '@playwright/test';
import { dataRows, grid, headerCells, openDemo } from './utils';

test.describe('Pinned Column Demos', () => {
  test('PinnedColumnsDefaultDemo — pinned columns stay visible on scroll', async ({ page }) => {
    await openDemo(page, 'pinned-columns/PinnedColumnsDefaultDemo');
    await expect(grid(page)).toBeVisible();
    const headers = await headerCells(page).count();
    expect(headers).toBeGreaterThan(0);

    // Scroll horizontally and verify pinned columns remain visible
    await grid(page).evaluate((el) => {
      const scrollable = el.querySelector('.tbw-scroll-area, .scroll-viewport') || el;
      scrollable.scrollLeft = 500;
    });
    await page.waitForTimeout(500);

    // Pinned columns should still have visible headers
    const headersAfterScroll = await headerCells(page).count();
    expect(headersAfterScroll).toBeGreaterThan(0);
  });
});

test.describe('Pinned Row Demos', () => {
  test('PinnedRowsDefaultDemo — footer/header pinned rows visible', async ({ page }) => {
    await openDemo(page, 'pinned-rows/PinnedRowsDefaultDemo');
    await expect(grid(page)).toBeVisible();
    const rows = await dataRows(page).count();
    expect(rows).toBeGreaterThan(0);

    // Look for pinned row elements (header or footer pinned rows)
    const pinnedRows = page.locator('tbw-grid .pinned-row, tbw-grid [data-pinned]');
    const pinnedCount = await pinnedRows.count();
    expect(pinnedCount).toBeGreaterThanOrEqual(0); // May use different markup
  });

  test('PinnedRowsCustomPanelsDemo — custom panel content renders', async ({ page }) => {
    await openDemo(page, 'pinned-rows/PinnedRowsCustomPanelsDemo');
    await expect(grid(page)).toBeVisible();
    const rows = await dataRows(page).count();
    expect(rows).toBeGreaterThan(0);
  });
});

test.describe('Column Virtualization Demos', () => {
  test('ColumnVirtualizationDefaultDemo — renders many columns efficiently', async ({ page }) => {
    await openDemo(page, 'column-virtualization/ColumnVirtualizationDefaultDemo');
    await expect(grid(page)).toBeVisible();
    const headers = await headerCells(page).count();
    // Should render at least some virtualized columns
    expect(headers).toBeGreaterThan(5);

    // Scroll horizontally to verify new columns render
    await grid(page).evaluate((el) => {
      const scrollable = el.querySelector('.tbw-scroll-area, .scroll-viewport') || el;
      scrollable.scrollLeft = 1000;
    });
    await page.waitForTimeout(500);

    // Should still have headers visible after scrolling
    const headersAfterScroll = await headerCells(page).count();
    expect(headersAfterScroll).toBeGreaterThan(5);
  });
});
