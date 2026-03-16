/**
 * @vitest-environment happy-dom
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ReorderPlugin } from './ReorderPlugin';
import type { ColumnMoveDetail } from './types';

function createGridMock(columns: any[] = []) {
  const gridEl = document.createElement('div');
  // Create header row with cells
  const headerRow = document.createElement('div');
  headerRow.className = 'header-row';
  for (const col of columns) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.setAttribute('data-field', col.field);
    headerRow.appendChild(cell);
  }
  gridEl.appendChild(headerRow);

  const columnOrder = columns.map((c: any) => c.field);

  return {
    rows: [],
    sourceRows: [],
    columns,
    _visibleColumns: columns.filter((c: any) => !c.hidden),
    _hostElement: gridEl,
    _focusRow: 0,
    _focusCol: 0,
    gridConfig: {},
    effectiveConfig: {},
    getPlugin: () => undefined,
    getPluginByName: () => undefined,
    query: vi.fn(() => []),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(() => true),
    requestRender: vi.fn(),
    requestStateChange: vi.fn(),
    requestAfterRender: vi.fn(),
    refreshVirtualWindow: vi.fn(),
    _activeEditRows: -1,
    _bodyEl: gridEl,
    _virtualization: { start: 0, end: 100, enabled: false },
    _rows: [],
    setColumnOrder: vi.fn((order: string[]) => {
      columnOrder.splice(0, columnOrder.length, ...order);
    }),
    getColumnOrder: vi.fn(() => [...columnOrder]),
    forceLayout: vi.fn(() => Promise.resolve()),
    children: [gridEl],
    querySelectorAll: (sel: string) => gridEl.querySelectorAll(sel),
    querySelector: (sel: string) => gridEl.querySelector(sel),
    clientWidth: 800,
    classList: { add: vi.fn(), remove: vi.fn() },
    disconnectSignal: new AbortController().signal,
  };
}

const sampleColumns = [
  { field: 'id', header: 'ID' },
  { field: 'name', header: 'Name' },
  { field: 'email', header: 'Email' },
  { field: 'city', header: 'City' },
];

describe('ReorderPlugin (class)', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('constructor & defaults', () => {
    it('should have name "reorderColumns"', () => {
      const plugin = new ReorderPlugin();
      expect(plugin.name).toBe('reorderColumns');
    });

    it('should have alias "reorder"', () => {
      const plugin = new ReorderPlugin();
      expect(plugin.aliases).toContain('reorder');
    });
  });

  describe('getColumnOrder', () => {
    it('should return current column order from grid', () => {
      const plugin = new ReorderPlugin();
      const grid = createGridMock(sampleColumns);
      plugin.attach(grid as any);

      const order = plugin.getColumnOrder();
      expect(order).toEqual(['id', 'name', 'email', 'city']);
    });
  });

  describe('moveColumn', () => {
    it('should emit column-move event with correct detail', () => {
      const plugin = new ReorderPlugin();
      const grid = createGridMock(sampleColumns);
      plugin.attach(grid as any);

      plugin.moveColumn('name', 3);

      expect(grid.dispatchEvent).toHaveBeenCalled();
      const event = grid.dispatchEvent.mock.calls[0][0] as CustomEvent<ColumnMoveDetail>;
      expect(event.type).toBe('column-move');
      expect(event.detail.field).toBe('name');
      expect(event.detail.fromIndex).toBe(1);
      expect(event.detail.toIndex).toBe(3);
      expect(event.detail.columnOrder).toBeDefined();
    });

    it('should update column order when event is not cancelled', () => {
      const plugin = new ReorderPlugin();
      const grid = createGridMock(sampleColumns);
      grid.dispatchEvent = vi.fn(() => true); // Not cancelled
      plugin.attach(grid as any);

      plugin.moveColumn('id', 2);

      expect(grid.setColumnOrder).toHaveBeenCalled();
    });

    it('should not update column order when event is cancelled', () => {
      const plugin = new ReorderPlugin();
      const grid = createGridMock(sampleColumns);
      grid.dispatchEvent = vi.fn((event: Event) => {
        event.preventDefault();
        return false;
      });
      plugin.attach(grid as any);

      plugin.moveColumn('id', 2);

      expect(grid.setColumnOrder).not.toHaveBeenCalled();
    });

    it('should not move when field is not found', () => {
      const plugin = new ReorderPlugin();
      const grid = createGridMock(sampleColumns);
      plugin.attach(grid as any);

      plugin.moveColumn('nonexistent', 2);

      expect(grid.dispatchEvent).not.toHaveBeenCalled();
    });
  });

  describe('setColumnOrder', () => {
    it('should update grid column order directly', () => {
      const plugin = new ReorderPlugin();
      const grid = createGridMock(sampleColumns);
      plugin.attach(grid as any);

      plugin.setColumnOrder(['city', 'name', 'email', 'id']);

      expect(grid.setColumnOrder).toHaveBeenCalledWith(['city', 'name', 'email', 'id']);
    });
  });

  describe('resetColumnOrder', () => {
    it('should reset to original column order', () => {
      const plugin = new ReorderPlugin();
      const grid = createGridMock(sampleColumns);
      plugin.attach(grid as any);

      plugin.resetColumnOrder();

      expect(grid.setColumnOrder).toHaveBeenCalledWith(['id', 'name', 'email', 'city']);
    });
  });

  describe('onKeyDown', () => {
    it('should handle Alt+ArrowRight to move column right', () => {
      const plugin = new ReorderPlugin();
      const columns = [
        { field: 'id', header: 'ID' },
        { field: 'name', header: 'Name' },
        { field: 'email', header: 'Email' },
      ];
      const grid = createGridMock(columns);
      grid._focusCol = 0;
      plugin.attach(grid as any);

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', altKey: true });
      Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
      Object.defineProperty(event, 'stopPropagation', { value: vi.fn() });

      const result = plugin.onKeyDown(event);

      expect(result).toBe(true);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should handle Alt+ArrowLeft to move column left', () => {
      const plugin = new ReorderPlugin();
      const columns = [
        { field: 'id', header: 'ID' },
        { field: 'name', header: 'Name' },
        { field: 'email', header: 'Email' },
      ];
      const grid = createGridMock(columns);
      grid._focusCol = 2;
      plugin.attach(grid as any);

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', altKey: true });
      Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
      Object.defineProperty(event, 'stopPropagation', { value: vi.fn() });

      const result = plugin.onKeyDown(event);

      expect(result).toBe(true);
    });

    it('should not move when Alt is not pressed', () => {
      const plugin = new ReorderPlugin();
      const grid = createGridMock(sampleColumns);
      grid._focusCol = 1;
      plugin.attach(grid as any);

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', altKey: false });
      const result = plugin.onKeyDown(event);

      expect(result).toBeUndefined();
    });

    it('should not move for non-arrow keys', () => {
      const plugin = new ReorderPlugin();
      const grid = createGridMock(sampleColumns);
      grid._focusCol = 1;
      plugin.attach(grid as any);

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', altKey: true });
      const result = plugin.onKeyDown(event);

      expect(result).toBeUndefined();
    });

    it('should not move column left when at leftmost position', () => {
      const plugin = new ReorderPlugin();
      const grid = createGridMock(sampleColumns);
      grid._focusCol = 0;
      plugin.attach(grid as any);

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', altKey: true });
      const result = plugin.onKeyDown(event);

      expect(result).toBeUndefined();
    });

    it('should not move column right when at rightmost position', () => {
      const plugin = new ReorderPlugin();
      const grid = createGridMock(sampleColumns);
      grid._focusCol = 3; // Last column
      plugin.attach(grid as any);

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', altKey: true });
      const result = plugin.onKeyDown(event);

      expect(result).toBeUndefined();
    });

    it('should not move locked columns', () => {
      const plugin = new ReorderPlugin();
      const columns = [
        { field: 'id', header: 'ID', meta: { lockPosition: true } },
        { field: 'name', header: 'Name' },
      ];
      const grid = createGridMock(columns);
      grid._focusCol = 0;
      plugin.attach(grid as any);

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', altKey: true });
      const result = plugin.onKeyDown(event);

      expect(result).toBeUndefined();
    });

    it('should respect plugin query responses (e.g., pinned columns)', () => {
      const plugin = new ReorderPlugin();
      const grid = createGridMock(sampleColumns);
      grid._focusCol = 1;
      // Simulate a plugin responding with false (e.g., PinnedColumnsPlugin)
      grid.query = vi.fn(() => [false]);
      plugin.attach(grid as any);

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', altKey: true });
      const result = plugin.onKeyDown(event);

      expect(result).toBeUndefined();
    });
  });

  describe('afterRender (drag setup)', () => {
    it('should set draggable=true on movable header cells', () => {
      const plugin = new ReorderPlugin();
      const grid = createGridMock(sampleColumns);
      plugin.attach(grid as any);

      plugin.afterRender();

      const headers = grid._hostElement.querySelectorAll('.header-row > .cell');
      headers.forEach((h) => {
        expect((h as HTMLElement).draggable).toBe(true);
      });
    });

    it('should not set draggable on locked columns', () => {
      const columns = [
        { field: 'id', header: 'ID', meta: { lockPosition: true } },
        { field: 'name', header: 'Name' },
      ];
      const plugin = new ReorderPlugin();
      const grid = createGridMock(columns);
      plugin.attach(grid as any);

      plugin.afterRender();

      const idCell = grid._hostElement.querySelector('.cell[data-field="id"]') as HTMLElement;
      expect(idCell.draggable).toBe(false);

      const nameCell = grid._hostElement.querySelector('.cell[data-field="name"]') as HTMLElement;
      expect(nameCell.draggable).toBe(true);
    });
  });

  describe('detach', () => {
    it('should clear internal state on detach', () => {
      const plugin = new ReorderPlugin();
      const grid = createGridMock(sampleColumns);
      plugin.attach(grid as any);

      plugin.detach();

      // After detach, plugin should be in clean state
      expect(() => plugin.getColumnOrder()).not.toThrow();
    });
  });

  describe('column-reorder-request event', () => {
    it('should handle column-reorder-request events from other plugins', () => {
      const plugin = new ReorderPlugin();
      const grid = createGridMock(sampleColumns);
      plugin.attach(grid as any);

      // Simulate another plugin dispatching a reorder request
      const requestEvent = new CustomEvent('column-reorder-request', {
        detail: { field: 'name', toIndex: 3 },
        bubbles: true,
      });
      grid._hostElement.dispatchEvent(requestEvent);

      // Should process the reorder request
      expect(grid.dispatchEvent).toHaveBeenCalled();
    });
  });

  describe('animation config', () => {
    it('should default to flip animation', () => {
      const plugin = new ReorderPlugin();
      const grid = createGridMock(sampleColumns);
      grid.dispatchEvent = vi.fn(() => true);
      plugin.attach(grid as any);

      plugin.moveColumn('id', 2);

      // forceLayout is only called for flip animation
      expect(grid.forceLayout).toHaveBeenCalled();
    });

    it('should use no animation when animation is false', () => {
      const plugin = new ReorderPlugin({ animation: false });
      const grid = createGridMock(sampleColumns);
      grid.dispatchEvent = vi.fn(() => true);
      plugin.attach(grid as any);

      plugin.moveColumn('id', 2);

      // setColumnOrder should be called directly without forceLayout
      expect(grid.setColumnOrder).toHaveBeenCalled();
      expect(grid.forceLayout).not.toHaveBeenCalled();
    });
  });
});
