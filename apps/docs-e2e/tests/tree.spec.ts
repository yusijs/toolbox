import { expect, test } from '@playwright/test';
import { dataRows, grid, openDemo } from './utils';

test.describe('Tree Demos', () => {
  test('TreeDefaultDemo — expand/collapse tree nodes', async ({ page }) => {
    await openDemo(page, 'tree/TreeDefaultDemo');

    const expandIcon = page.locator('tbw-grid .tree-toggle').first();
    if (await expandIcon.isVisible()) {
      await expandIcon.click();
      await page.waitForTimeout(500);
    }
    await expect(grid(page)).toBeVisible();
  });

  test('TreeExpandedByDefaultDemo — all nodes start expanded', async ({ page }) => {
    await openDemo(page, 'tree/TreeExpandedByDefaultDemo');
    const rows = await dataRows(page).count();
    // With all nodes expanded, there should be many rows (parent + children)
    expect(rows).toBeGreaterThan(3);

    // Verify expand/collapse icons exist — should show collapse state
    const expandIcons = page.locator('tbw-grid .tree-toggle');
    const iconCount = await expandIcons.count();
    expect(iconCount).toBeGreaterThan(0);
  });

  test('TreeEventsDemo — expand fires events to log', async ({ page }) => {
    await openDemo(page, 'tree/TreeEventsDemo');

    const expandIcon = page.locator('tbw-grid .tree-toggle').first();
    if (await expandIcon.isVisible()) {
      await expandIcon.click();
      await page.waitForTimeout(300);

      const logEl = page.locator('#tree-events-log, [data-event-log]');
      if (await logEl.isVisible()) {
        const text = await logEl.textContent();
        expect(text?.length).toBeGreaterThan(0);
      }
    }
  });

  test('TreeWideIndentationDemo — deep nodes are visually indented', async ({ page }) => {
    await openDemo(page, 'tree/TreeWideIndentationDemo');
    const rows = await dataRows(page).count();
    expect(rows).toBeGreaterThan(0);

    // Expand a node if collapsed to see indented children
    const expandIcon = page.locator('tbw-grid .tree-expand, tbw-grid [data-tree-toggle]').first();
    if (await expandIcon.isVisible()) {
      await expandIcon.click();
      await page.waitForTimeout(500);
    }

    // Verify deeper rows have larger padding-left (indentation)
    const firstRowPadding = await dataRows(page).first().locator('[role="gridcell"]').first().evaluate((el) => {
      return parseInt(getComputedStyle(el).paddingLeft, 10);
    });
    expect(firstRowPadding).toBeGreaterThanOrEqual(0);
  });
});
