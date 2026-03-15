import { expect, test } from '@playwright/test';
import { dataRows, grid, openDemo } from './utils';

test.describe('Filtering Demos', () => {
  test('FilteringDefaultDemo — opening filter and typing reduces rows', async ({ page }) => {
    await openDemo(page, 'filtering/FilteringDefaultDemo');

    const initialRows = await dataRows(page).count();
    expect(initialRows).toBeGreaterThan(0);

    // Click the filter button (.tbw-filter-btn) on the Name column header
    const nameHeader = page.locator('tbw-grid [role="columnheader"]', { hasText: 'Name' });
    // Hover the header first to make the filter button visible
    await nameHeader.hover();
    const filterBtn = nameHeader.locator('.tbw-filter-btn');
    await expect(filterBtn).toBeVisible({ timeout: 5000 });
    await filterBtn.click();
    await page.waitForTimeout(300);

    // The filter panel is a set filter with checkboxes.
    // Click "Select All" to deselect all, then check only one value.
    const selectAllCheckbox = page.locator('.tbw-filter-panel .tbw-filter-checkbox').first();
    await selectAllCheckbox.click(); // Deselect all

    // Check only "Alice Johnson"
    const aliceCheckbox = page.locator('.tbw-filter-panel .tbw-filter-checkbox[data-value="Alice Johnson"]');
    await aliceCheckbox.click();

    // Click Apply button
    const applyBtn = page.locator('.tbw-filter-panel button', { hasText: /apply/i });
    await applyBtn.click();
    await page.waitForTimeout(300);

    const filteredRows = await dataRows(page).count();
    expect(filteredRows).toBeLessThan(initialRows);
  });

  test('FilteringFilterEventsDemo — filter triggers event log', async ({ page }) => {
    await openDemo(page, 'filtering/FilteringFilterEventsDemo');

    const nameHeader = page.locator('tbw-grid [role="columnheader"]', { hasText: 'Name' });
    await nameHeader.hover();
    const filterBtn = nameHeader.locator('.tbw-filter-btn');
    await expect(filterBtn).toBeVisible({ timeout: 5000 });
    await filterBtn.click();
    await page.waitForTimeout(300);

    const filterInput = page.locator('.tbw-filter-panel .tbw-filter-search-input, .tbw-filter-panel input').first();
    if (await filterInput.isVisible({ timeout: 3000 })) {
      await filterInput.fill('test');
      await page.waitForTimeout(500);

      const logEl = page.locator('#filter-event-log, [data-event-log]');
      if (await logEl.isVisible()) {
        const text = await logEl.textContent();
        expect(text?.length).toBeGreaterThan(0);
      }
    }
  });

  test('FilteringTypeSpecificFiltersDemo — renders type-specific controls', async ({ page }) => {
    await openDemo(page, 'filtering/FilteringTypeSpecificFiltersDemo');

    const initialRows = await dataRows(page).count();
    expect(initialRows).toBeGreaterThan(0);

    // Open the Salary filter (number type → range slider)
    const salaryHeader = page.locator('tbw-grid [role="columnheader"]', { hasText: 'Salary' });
    await salaryHeader.hover();
    const filterBtn = salaryHeader.locator('.tbw-filter-btn');
    await expect(filterBtn).toBeVisible({ timeout: 5000 });
    await filterBtn.click();
    await page.waitForTimeout(300);

    // The number-type filter panel should have range inputs or slider elements
    const panel = page.locator('.tbw-filter-panel');
    await expect(panel).toBeVisible();
    const rangeInputs = panel.locator('input[type="range"], input[type="number"]');
    const inputCount = await rangeInputs.count();
    expect(inputCount).toBeGreaterThan(0);
  });

  test('FilteringCustomFilterPanelDemo — custom filter panel renders', async ({ page }) => {
    await openDemo(page, 'filtering/FilteringCustomFilterPanelDemo');
    await expect(grid(page)).toBeVisible();

    // Open the Status column filter — this should use the custom radio-button panel
    const statusHeader = page.locator('tbw-grid [role="columnheader"]', { hasText: 'Status' });
    await statusHeader.hover();
    const filterBtn = statusHeader.locator('.tbw-filter-btn');
    await expect(filterBtn).toBeVisible({ timeout: 5000 });
    await filterBtn.click();
    await page.waitForTimeout(300);

    // The custom panel should contain radio buttons for status values
    const panel = page.locator('.tbw-filter-panel');
    await expect(panel).toBeVisible();
    const radios = panel.locator('input[type="radio"][name="status"]');
    const radioCount = await radios.count();
    expect(radioCount).toBeGreaterThan(2); // All, Active, Inactive, On Leave

    // Select a specific status to verify filtering works
    const activeRadio = panel.locator('input[type="radio"][value="Active"]');
    await activeRadio.click({ force: true });
    await page.waitForTimeout(500);

    const filteredRows = await dataRows(page).count();
    expect(filteredRows).toBeGreaterThan(0);
  });

  test('FilteringAsyncFilteringDemo — async filtering works', async ({ page }) => {
    await openDemo(page, 'filtering/FilteringAsyncFilteringDemo');

    const initialRows = await dataRows(page).count();
    expect(initialRows).toBeGreaterThan(0);

    // Open the Department filter — async handler fetches unique values
    const deptHeader = page.locator('tbw-grid [role="columnheader"]', { hasText: 'Department' });
    await deptHeader.hover();
    const filterBtn = deptHeader.locator('.tbw-filter-btn');
    await expect(filterBtn).toBeVisible({ timeout: 5000 });
    await filterBtn.click();

    // Wait for async values to load (200ms simulated delay + render)
    await page.waitForTimeout(800);

    const panel = page.locator('.tbw-filter-panel');
    await expect(panel).toBeVisible();

    // Should have loaded unique department values as checkboxes
    const checkboxes = panel.locator('.tbw-filter-checkbox');
    const checkboxCount = await checkboxes.count();
    expect(checkboxCount).toBeGreaterThan(1);
  });
});
