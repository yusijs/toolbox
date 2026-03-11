/**
 * Configuration for the server-side data plugin.
 *
 * Controls how the grid fetches, caches, and paginates data from a remote source.
 * The grid requests data in **blocks** (contiguous row ranges) as the user scrolls,
 * caching them locally to avoid redundant network requests.
 *
 * @example
 * ```typescript
 * new ServerSidePlugin({
 *   pageSize: 100,
 *   cacheBlockSize: 200,
 *   maxConcurrentRequests: 2,
 * })
 * ```
 */
export interface ServerSideConfig {
  /**
   * Number of rows to request per fetch.
   * This determines the `endRow - startRow` range passed to `getRows()`.
   * Smaller values mean faster initial loads but more frequent requests while scrolling.
   * @default 100
   */
  pageSize?: number;
  /**
   * Number of rows kept in each cache block.
   * When a block is evicted (e.g. scrolled far away), re-scrolling back triggers a new fetch.
   * Should be ≥ `pageSize`; larger values reduce re-fetches at the cost of memory.
   * @default 200
   */
  cacheBlockSize?: number;
  /**
   * Maximum number of concurrent `getRows()` requests.
   * Limits how many blocks can be fetched simultaneously during fast scrolling.
   * Set to 1 for strict sequential loading; higher values improve perceived performance.
   * @default 2
   */
  maxConcurrentRequests?: number;
}

/**
 * Data source contract for server-side row loading.
 *
 * Implement this interface to supply rows from a remote API, database, or any
 * asynchronous provider. The grid calls `getRows()` whenever it needs a new
 * block of rows (on initial load, scroll, sort change, or filter change).
 *
 * @example
 * ```typescript
 * const dataSource: ServerSideDataSource = {
 *   async getRows(params) {
 *     const res = await fetch(`/api/employees?start=${params.startRow}&end=${params.endRow}`);
 *     const data = await res.json();
 *     return { rows: data.items, totalRowCount: data.total };
 *   }
 * };
 * ```
 */
export interface ServerSideDataSource {
  getRows(params: GetRowsParams): Promise<GetRowsResult>;
}

/**
 * Parameters passed to {@link ServerSideDataSource.getRows} for each data request.
 *
 * The grid provides the row range to fetch plus any active sort/filter state,
 * allowing the server to apply pagination, sorting, and filtering on the backend.
 */
export interface GetRowsParams {
  /** Zero-based index of the first row to fetch (inclusive). */
  startRow: number;
  /** Zero-based index of the last row to fetch (exclusive). `endRow - startRow` equals the block size. */
  endRow: number;
  /** Active sort columns, in priority order. Empty array when unsorted. */
  sortModel?: Array<{ field: string; direction: 'asc' | 'desc' }>;
  /** Active filter model keyed by field name. Empty object when no filters are applied. */
  filterModel?: Record<string, any>;
}

/**
 * Result returned from {@link ServerSideDataSource.getRows}.
 *
 * @example
 * ```typescript
 * // Known total (pagination-style)
 * return { rows: pageData, totalRowCount: 5000 };
 *
 * // Infinite scroll — set lastRow when the final page is reached
 * return { rows: pageData, totalRowCount: -1, lastRow: absoluteLastIndex };
 * ```
 */
export interface GetRowsResult {
  /** The fetched row objects for the requested range. */
  rows: any[];
  /** Total number of rows available on the server. Use `-1` if unknown (infinite scroll mode). */
  totalRowCount: number;
  /**
   * The absolute index of the last row in the dataset.
   * Only needed for **infinite scroll** when `totalRowCount` is `-1`.
   * Once the server returns the final page, set this so the grid knows
   * scrolling has reached the end and stops requesting further blocks.
   */
  lastRow?: number;
}

export interface ServerSideState {
  dataSource: ServerSideDataSource | null;
  totalRowCount: number;
  loadedBlocks: Map<number, any[]>;
  loadingBlocks: Set<number>;
  lastRequestId: number;
  /** Scroll debounce timer for scroll-end detection */
  scrollDebounceTimer?: ReturnType<typeof setTimeout>;
  /** Cached grid reference for getting fresh viewport */
  gridRef?: { virtualization: { start: number; end: number } };
  /** Cached config reference */
  configRef?: ServerSideConfig;
  /** Cached request render function */
  requestRenderRef?: () => void;
}

// Module Augmentation - Register plugin name for type-safe getPluginByName()
declare module '../../core/types' {
  interface PluginNameMap {
    serverSide: import('./ServerSidePlugin').ServerSidePlugin;
  }
}
