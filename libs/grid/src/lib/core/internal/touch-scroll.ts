/**
 * Touch scrolling controller for mobile devices.
 *
 * Uses pointer events with setPointerCapture to ensure events are delivered
 * directly to the grid element, even when DOM virtualization replaces the
 * original touch target element mid-gesture.
 *
 * Without pointer capture, touch events are dispatched to the original target
 * element (e.g., a cell or card). When virtualization recycles that element's
 * content, the target is removed from the DOM and subsequent touchmove/touchend
 * events are lost — causing scrolling to stop after ~2 rows.
 *
 * setPointerCapture routes all events for a pointer ID directly to the capture
 * element (.tbw-grid-content), bypassing target resolution entirely.
 *
 * Uses incremental deltas (frame-to-frame) rather than absolute offsets from
 * the gesture start, which is more robust when virtualized content height
 * changes during scrolling (e.g., responsive card mode with variable-height rows).
 */

// #region Types
export interface TouchScrollState {
  startY: number | null;
  startX: number | null;
  lastY: number | null;
  lastX: number | null;
  lastTime: number | null;
  velocityY: number;
  velocityX: number;
  momentumRaf: number;
  /** Once we start scrolling the grid, lock until gesture ends to prevent browser takeover */
  locked: boolean;
  /** Active pointer ID for setPointerCapture tracking (null = no active gesture) */
  activePointerId: number | null;
}

export interface TouchScrollElements {
  fauxScrollbar: HTMLElement;
  scrollArea: HTMLElement | null;
}
// #endregion

// #region State Management
/**
 * Create initial touch scroll state.
 */
export function createTouchScrollState(): TouchScrollState {
  return {
    startY: null,
    startX: null,
    lastY: null,
    lastX: null,
    lastTime: null,
    velocityY: 0,
    velocityX: 0,
    momentumRaf: 0,
    locked: false,
    activePointerId: null,
  };
}

/**
 * Reset touch scroll state (called on touchend or cleanup).
 */
export function resetTouchState(state: TouchScrollState): void {
  state.startY = null;
  state.startX = null;
  state.lastY = null;
  state.lastX = null;
  state.lastTime = null;
  state.locked = false;
}

/**
 * Cancel any ongoing momentum animation.
 */
export function cancelMomentum(state: TouchScrollState): void {
  if (state.momentumRaf) {
    cancelAnimationFrame(state.momentumRaf);
    state.momentumRaf = 0;
  }
}
// #endregion

// #region Touch Handlers
/**
 * Handle gesture start (from pointerdown).
 */
export function handleTouchStart(clientX: number, clientY: number, state: TouchScrollState): void {
  // Cancel any ongoing momentum animation
  cancelMomentum(state);

  state.startY = clientY;
  state.startX = clientX;
  state.lastY = clientY;
  state.lastX = clientX;
  state.lastTime = performance.now();
  state.velocityY = 0;
  state.velocityX = 0;
  state.locked = false;
}

/**
 * Handle gesture move (from pointermove).
 * Uses incremental deltas (from previous position) for robustness.
 * Returns true if the event should be prevented (grid is handling scroll).
 */
export function handleTouchMove(clientX: number, clientY: number, state: TouchScrollState, elements: TouchScrollElements): boolean {
  if (state.lastY === null || state.lastX === null) {
    return false;
  }

  const now = performance.now();

  // Incremental delta since last move (not from gesture start)
  const incrY = state.lastY - clientY;
  const incrX = state.lastX - clientX;

  // Calculate velocity for momentum scrolling
  if (state.lastTime !== null) {
    const dt = now - state.lastTime;
    if (dt > 0) {
      state.velocityY = incrY / dt;
      state.velocityX = incrX / dt;
    }
  }
  state.lastY = clientY;
  state.lastX = clientX;
  state.lastTime = now;

  // If already locked to grid scrolling, keep preventing default
  if (state.locked) {
    elements.fauxScrollbar.scrollTop += incrY;
    if (elements.scrollArea) {
      elements.scrollArea.scrollLeft += incrX;
    }
    return true;
  }

  // Determine scroll direction on first significant move (> 3px from start)
  const totalDeltaY = state.startY !== null ? Math.abs(state.startY - clientY) : 0;
  const totalDeltaX = state.startX !== null ? Math.abs(state.startX - clientX) : 0;
  if (totalDeltaY < 3 && totalDeltaX < 3) return false;

  // Determine primary gesture direction from total delta, not micro-frame delta.
  // Using totalDelta avoids mis-detection from finger jitter between frames.
  const isVerticalGesture = totalDeltaY >= totalDeltaX;

  // Check if grid has scrollable content (don't check boundary position —
  // the browser clamps scrollTop automatically, and checking boundaries here
  // causes the lock to fail when momentum brought us to an edge).
  const { scrollHeight, clientHeight } = elements.fauxScrollbar;
  const hasVerticalScroll = scrollHeight - clientHeight > 0;

  let hasHorizontalScroll = false;
  if (elements.scrollArea) {
    const { scrollWidth, clientWidth } = elements.scrollArea;
    hasHorizontalScroll = scrollWidth - clientWidth > 0;
  }

  if ((isVerticalGesture && hasVerticalScroll) || (!isVerticalGesture && hasHorizontalScroll)) {
    // Lock to grid scrolling for the rest of this gesture
    state.locked = true;
    elements.fauxScrollbar.scrollTop += incrY;
    if (elements.scrollArea) {
      elements.scrollArea.scrollLeft += incrX;
    }
    return true;
  }

  // Grid can't scroll in this direction — let the page scroll
  return false;
}

/**
 * Handle touchend event.
 * Starts momentum scrolling if velocity is significant.
 */
export function handleTouchEnd(state: TouchScrollState, elements: TouchScrollElements): void {
  const minVelocity = 0.1; // pixels per ms threshold

  // Start momentum scrolling if there's significant velocity
  if (Math.abs(state.velocityY) > minVelocity || Math.abs(state.velocityX) > minVelocity) {
    startMomentumScroll(state, elements);
  }

  resetTouchState(state);
}
// #endregion

// #region Momentum Scrolling
/**
 * Start momentum scrolling animation.
 */
function startMomentumScroll(state: TouchScrollState, elements: TouchScrollElements): void {
  const friction = 0.95; // Deceleration factor per frame
  const minVelocity = 0.01; // Stop threshold in px/ms

  const animate = () => {
    // Apply friction
    state.velocityY *= friction;
    state.velocityX *= friction;

    // Convert velocity (px/ms) to per-frame scroll amount (~16ms per frame)
    const scrollY = state.velocityY * 16;
    const scrollX = state.velocityX * 16;

    // Apply scroll if above threshold
    if (Math.abs(state.velocityY) > minVelocity) {
      elements.fauxScrollbar.scrollTop += scrollY;
    }
    if (Math.abs(state.velocityX) > minVelocity && elements.scrollArea) {
      elements.scrollArea.scrollLeft += scrollX;
    }

    // Continue animation if still moving
    if (Math.abs(state.velocityY) > minVelocity || Math.abs(state.velocityX) > minVelocity) {
      state.momentumRaf = requestAnimationFrame(animate);
    } else {
      state.momentumRaf = 0;
    }
  };

  state.momentumRaf = requestAnimationFrame(animate);
}
// #endregion

// #region Setup
/**
 * Set up pointer event listeners on the grid content element for touch scrolling.
 *
 * Uses pointer events + setPointerCapture instead of touch events because
 * DOM virtualization can destroy the original touch target mid-gesture,
 * causing touch events to stop being delivered. Pointer capture routes
 * all events directly to the grid element regardless of DOM changes.
 */
export function setupTouchScrollListeners(
  gridContentEl: HTMLElement,
  state: TouchScrollState,
  elements: TouchScrollElements,
  signal: AbortSignal,
): void {
  gridContentEl.addEventListener(
    'pointerdown',
    (e: PointerEvent) => {
      // Only handle touch (not mouse/pen), and only one finger at a time
      if (e.pointerType !== 'touch' || state.activePointerId !== null) return;
      state.activePointerId = e.pointerId;
      gridContentEl.setPointerCapture(e.pointerId);
      handleTouchStart(e.clientX, e.clientY, state);
    },
    { passive: true, signal },
  );

  gridContentEl.addEventListener(
    'pointermove',
    (e: PointerEvent) => {
      if (e.pointerId !== state.activePointerId) return;
      const shouldPrevent = handleTouchMove(e.clientX, e.clientY, state, elements);
      if (shouldPrevent) {
        e.preventDefault();
      }
    },
    { passive: false, signal },
  );

  gridContentEl.addEventListener(
    'pointerup',
    (e: PointerEvent) => {
      if (e.pointerId !== state.activePointerId) return;
      state.activePointerId = null;
      handleTouchEnd(state, elements);
    },
    { passive: true, signal },
  );

  gridContentEl.addEventListener(
    'pointercancel',
    (e: PointerEvent) => {
      if (e.pointerId !== state.activePointerId) return;
      state.activePointerId = null;
      resetTouchState(state);
    },
    { passive: true, signal },
  );

  // Safety net: if pointer capture is lost unexpectedly, clean up
  gridContentEl.addEventListener(
    'lostpointercapture',
    (e: PointerEvent) => {
      if (e.pointerId !== state.activePointerId) return;
      state.activePointerId = null;
      resetTouchState(state);
    },
    { passive: true, signal },
  );
}
// #endregion
