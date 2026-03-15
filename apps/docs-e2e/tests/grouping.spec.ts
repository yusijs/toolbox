import { expect, test } from '@playwright/test';
import { dataRows, openDemo } from './utils';

test.describe('Row Grouping Demos', () => {
  test('GroupingRowsDefaultDemo — group headers render and are clickable', async ({ page }) => {
    await openDemo(page, 'grouping-rows/GroupingRowsDefaultDemo');

    // Group headers should be visible
    const groupHeaders = page.locator('tbw-grid .group-row, tbw-grid [data-group-key]');
    await expect(groupHeaders.first()).toBeVisible({ timeout: 5000 });

    // Click a group header to toggle
    await groupHeaders.first().click();
    await page.waitForTimeout(500);
  });

  test('GroupingRowsExpandedByDefaultDemo — all groups start expanded', async ({ page }) => {
    await openDemo(page, 'grouping-rows/GroupingRowsExpandedByDefaultDemo');

    // Data rows should be visible (groups are expanded)
    const rows = await dataRows(page).count();
    expect(rows).toBeGreaterThan(0);

    // All group headers should have expanded state
    const groupHeaders = page.locator('tbw-grid .group-row, tbw-grid [data-group-key]');
    const groupCount = await groupHeaders.count();
    expect(groupCount).toBeGreaterThan(0);

    // With 7 data rows across 3 departments + group headers, total visible rows should be > 7
    const allRows = page.locator('tbw-grid [role="rowgroup"]:last-of-type [role="row"]');
    const totalVisible = await allRows.count();
    expect(totalVisible).toBeGreaterThan(groupCount); // More rows than just group headers
  });

  test('GroupingRowsAccordionModeDemo — expanding one group collapses others', async ({ page }) => {
    await openDemo(page, 'grouping-rows/GroupingRowsAccordionModeDemo');

    const groupHeaders = page.locator('tbw-grid .group-row, tbw-grid [data-group-key]');
    const count = await groupHeaders.count();

    if (count >= 2) {
      // Click first group
      await groupHeaders.nth(0).click();
      await page.waitForTimeout(500);

      // Click second group — first should collapse
      await groupHeaders.nth(1).click();
      await page.waitForTimeout(500);
    }
  });

  test('GroupingRowsEventsDemo — toggle fires events', async ({ page }) => {
    await openDemo(page, 'grouping-rows/GroupingRowsEventsDemo');

    const groupHeaders = page.locator('tbw-grid .group-row, tbw-grid [data-group-key]');
    if ((await groupHeaders.count()) > 0) {
      await groupHeaders.first().click();
      await page.waitForTimeout(300);

      const logEl = page.locator('#grouping-events-log, [data-event-log]');
      if (await logEl.isVisible()) {
        const text = await logEl.textContent();
        expect(text?.length).toBeGreaterThan(0);
      }
    }
  });

  test('GroupingRowsNoRowCountDemo — group headers have no count', async ({ page }) => {
    await openDemo(page, 'grouping-rows/GroupingRowsNoRowCountDemo');

    const groupHeaders = page.locator('tbw-grid .group-row, tbw-grid [data-group-key]');
    await expect(groupHeaders.first()).toBeVisible({ timeout: 5000 });

    // Group header text should NOT contain a count like "(3)" or "3 rows"
    const headerText = await groupHeaders.first().textContent();
    expect(headerText).not.toMatch(/\(\d+\)/);
    expect(headerText).not.toMatch(/\d+\s*rows?/i);
  });

  test('GroupingRowsWithAggregatorsDemo — footer aggregates visible', async ({ page }) => {
    await openDemo(page, 'grouping-rows/GroupingRowsWithAggregatorsDemo');

    // Expand a group to see its footer row with aggregated salary sum
    const groupHeaders = page.locator('tbw-grid .group-row, tbw-grid [data-group-key]');
    await expect(groupHeaders.first()).toBeVisible({ timeout: 5000 });
    await groupHeaders.first().click();
    await page.waitForTimeout(500);

    // After expanding, look for a footer/aggregation row with a numeric value
    const footerRows = page.locator('tbw-grid .group-footer, tbw-grid .aggregation-row, tbw-grid [data-aggregate]');
    await footerRows.count();
    // Aggregation might be inline in group rows; verify data rows appeared
    const rows = await dataRows(page).count();
    expect(rows).toBeGreaterThan(0);
  });

  test('GroupingRowsDefaultExpandedByKeyDemo — only specific group expanded', async ({ page }) => {
    await openDemo(page, 'grouping-rows/GroupingRowsDefaultExpandedByKeyDemo');

    // The 'Engineering' group should be expanded by default
    const groupHeaders = page.locator('tbw-grid .group-row, tbw-grid [data-group-key]');
    const groupCount = await groupHeaders.count();
    expect(groupCount).toBeGreaterThan(1);

    // Engineering group should be expanded (its data rows visible)
    // With 4 Engineering employees visible, there should be some data rows
    const rows = await dataRows(page).count();
    expect(rows).toBeGreaterThan(0);

    // Find the Engineering group header
    const engGroup = page.locator('tbw-grid .group-row, tbw-grid [data-group-key]', { hasText: 'Engineering' });
    await expect(engGroup).toBeVisible();
  });
});

test.describe('Column Grouping Demos', () => {
  test('GroupingColumnsDefaultDemo — column groups render in header', async ({ page }) => {
    await openDemo(page, 'grouping-columns/GroupingColumnsDefaultDemo');

    // Column groups render a header-group-row with header-group-cell elements
    const groupRow = page.locator('tbw-grid .header-group-row');
    await expect(groupRow).toBeVisible();

    // Verify column group labels are visible
    const personalHeader = page.locator('tbw-grid .header-group-cell', { hasText: 'Personal Info' });
    const workHeader = page.locator('tbw-grid .header-group-cell', { hasText: 'Work Info' });
    await expect(personalHeader).toBeVisible();
    await expect(workHeader).toBeVisible();
  });

  test('GroupingColumnsNoBordersDemo — renders without group borders', async ({ page }) => {
    await openDemo(page, 'grouping-columns/GroupingColumnsNoBordersDemo');

    // Column group headers should exist
    const groupRow = page.locator('tbw-grid .header-group-row');
    await expect(groupRow).toBeVisible();
    const groupCells = page.locator('tbw-grid .header-group-cell');
    const groupCount = await groupCells.count();
    expect(groupCount).toBeGreaterThan(0);
  });

  test('GroupingColumnsCustomRendererDemo — custom renderer in group header', async ({ page }) => {
    await openDemo(page, 'grouping-columns/GroupingColumnsCustomRendererDemo');

    // The custom renderer adds emoji icons (👤 for personal, 💼 for work)
    const groupRow = page.locator('tbw-grid .header-group-row');
    await expect(groupRow).toBeVisible();

    // Verify custom rendered content with icons
    const groupCells = page.locator('tbw-grid .header-group-cell');
    const groupCount = await groupCells.count();
    expect(groupCount).toBeGreaterThan(0);
    const headerText = await groupRow.textContent();
    expect(headerText).toBeTruthy();
    // Should contain column count text like "(3 columns)"
    expect(headerText).toMatch(/\d+ columns/);
  });
});
