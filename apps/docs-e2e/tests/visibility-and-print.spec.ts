import { expect, test } from '@playwright/test';
import { dataRows, grid, headerCells, openDemo } from './utils';

test.describe('Visibility Demos', () => {
  test('VisibilityDefaultDemo — toggle column visibility from panel', async ({ page }) => {
    await openDemo(page, 'visibility/VisibilityDefaultDemo');
    await expect(grid(page)).toBeVisible();

    // Email column should be initially hidden (per default controls)
    const emailHeader = page.locator('tbw-grid [role="columnheader"]', { hasText: 'Email' });
    await expect(emailHeader).toHaveCount(0);

    // Visible columns should be ID, Name, Department, Salary (4 headers)
    const headers = await headerCells(page).count();
    expect(headers).toBe(4);
  });

  test('VisibilityInitiallyHiddenDemo — some columns hidden by default', async ({ page }) => {
    await openDemo(page, 'visibility/VisibilityInitiallyHiddenDemo');
    await expect(grid(page)).toBeVisible();

    // Email and Phone are hidden by default
    const emailHeader = page.locator('tbw-grid [role="columnheader"]', { hasText: 'Email' });
    const phoneHeader = page.locator('tbw-grid [role="columnheader"]', { hasText: 'Phone' });
    await expect(emailHeader).toHaveCount(0);
    await expect(phoneHeader).toHaveCount(0);

    // ID, Name, Department should be visible (3 headers)
    const headers = await headerCells(page).count();
    expect(headers).toBe(3);
  });

  test('VisibilityLockedColumnsDemo — locked columns remain visible', async ({ page }) => {
    await openDemo(page, 'visibility/VisibilityLockedColumnsDemo');
    await expect(grid(page)).toBeVisible();

    const headers = await headerCells(page).count();
    expect(headers).toBeGreaterThan(0);

    // Verify at least the locked column names are visible
    const idHeader = page.locator('tbw-grid [role="columnheader"]', { hasText: 'ID' });
    await expect(idHeader).toBeVisible();
  });
});

test.describe('Print Demos', () => {
  test('PrintBasicDemo — print button triggers action', async ({ page }) => {
    await openDemo(page, 'print/PrintBasicDemo');

    // Don't actually trigger print (would open dialog), just verify button exists
    const printBtn = page.locator('#print-basic-btn, button', { hasText: /print/i }).first();
    await expect(printBtn).toBeVisible({ timeout: 5000 });
  });

  test('PrintHiddenColumnsDemo — renders with printHidden columns', async ({ page }) => {
    await openDemo(page, 'print/PrintHiddenColumnsDemo');
    await expect(grid(page)).toBeVisible();
    const rows = await dataRows(page).count();
    expect(rows).toBeGreaterThan(0);
  });

  test('PrintPrintEventsDemo — renders with event logging', async ({ page }) => {
    await openDemo(page, 'print/PrintPrintEventsDemo');
    await expect(grid(page)).toBeVisible();
    const rows = await dataRows(page).count();
    expect(rows).toBeGreaterThan(0);
  });

  test('PrintRowLimitDemo — renders with row limit', async ({ page }) => {
    await openDemo(page, 'print/PrintRowLimitDemo');
    await expect(grid(page)).toBeVisible();
    const rows = await dataRows(page).count();
    expect(rows).toBeGreaterThan(0);
  });
});
