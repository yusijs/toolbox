/**
 * Tests for injectGridFiltering – deferred isReady behavior.
 *
 * The key fix: when `grid.ready()` resolves before Angular's Grid directive
 * has applied gridConfig (including the FilteringPlugin), `isReady` must be
 * deferred so consumers don't call plugin methods before the plugin exists.
 *
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Angular DI before importing the module under test
const mockIsReady = { value: false };
const mockSignal = vi.fn((initial: boolean) => {
  mockIsReady.value = initial;
  const sig = Object.assign(() => mockIsReady.value, {
    set: (v: boolean) => {
      mockIsReady.value = v;
    },
    asReadonly: () => sig,
  });
  return sig;
});
const mockElementRef = { nativeElement: document.createElement('div') };
const mockDestroyRef = { onDestroy: vi.fn() };
let afterNextRenderCallback: (() => void) | null = null;

vi.mock('@angular/core', () => ({
  inject: vi.fn((token: unknown) => {
    // ElementRef
    if ((token as any)?.name === 'ElementRef' || token === 'ElementRef') return mockElementRef;
    // DestroyRef
    return mockDestroyRef;
  }),
  ElementRef: { name: 'ElementRef' },
  DestroyRef: { name: 'DestroyRef' },
  signal: mockSignal,
  afterNextRender: vi.fn((cb: () => void) => {
    afterNextRenderCallback = cb;
  }),
}));

// Mock the grid features/plugins imports (they are side-effect only or type imports)
vi.mock('@toolbox-web/grid/features/filtering', () => ({}));
vi.mock('@toolbox-web/grid/plugins/filtering', () => ({
  FilteringPlugin: class FilteringPlugin {},
}));

// Import after mocks are set up
const { injectGridFiltering } = await import('./index.js');

describe('injectGridFiltering', () => {
  let mockGrid: {
    ready: () => Promise<void>;
    getPluginByName: ReturnType<typeof vi.fn>;
    querySelector?: unknown;
  };

  beforeEach(() => {
    vi.useFakeTimers();
    mockIsReady.value = false;
    afterNextRenderCallback = null;

    mockGrid = {
      ready: () => Promise.resolve(),
      getPluginByName: vi.fn().mockReturnValue(undefined),
    };

    // Place the mock grid inside the host element
    const gridEl = document.createElement('tbw-grid') as unknown as HTMLElement;
    Object.assign(gridEl, mockGrid);
    mockElementRef.nativeElement = document.createElement('div');
    mockElementRef.nativeElement.appendChild(gridEl);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should set isReady immediately if plugin is already attached', async () => {
    mockGrid.getPluginByName.mockReturnValue({ name: 'filtering' });

    const result = injectGridFiltering();

    // Trigger afterNextRender to discover the grid
    afterNextRenderCallback?.();

    // Flush the ready() promise microtask
    await vi.advanceTimersByTimeAsync(0);

    expect(result.isReady()).toBe(true);
  });

  it('should defer isReady via setTimeout when plugin is not yet attached', async () => {
    // Plugin not available initially
    mockGrid.getPluginByName.mockReturnValue(undefined);

    const result = injectGridFiltering();

    // Trigger afterNextRender to discover the grid
    afterNextRenderCallback?.();

    // Flush the ready() promise microtasks (but not setTimeout)
    await Promise.resolve();
    await Promise.resolve();

    // isReady should NOT be true yet — waiting for setTimeout(0)
    expect(result.isReady()).toBe(false);

    // Flush the setTimeout(0)
    vi.advanceTimersByTime(1);

    expect(result.isReady()).toBe(true);
  });
});
