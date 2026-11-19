import { describe, expect, it } from 'vitest';
import { MIN_NOTE_SIZE } from '../note';
import { clampRectToBounds, clampSize, isBelowDragThreshold, isPointInRect, rectFromDrag } from '../geometry';

describe('isPointInRect', () => {
  const rect = { x: 10, y: 10, width: 100, height: 50 };

  it.each([
    { case: 'center', point: { x: 50, y: 30 } },
    { case: 'top-left edge', point: { x: 10, y: 10 } },
    { case: 'bottom-right edge', point: { x: 110, y: 60 } },
  ])('returns true for a point on the $case', ({ point }) => {

    const result = isPointInRect(point, rect);

    expect(result).toBe(true);
  });

  it.each([
    { case: 'left', point: { x: 5, y: 30 } },
    { case: 'below', point: { x: 50, y: 61 } },
  ])('returns false for a point to the $case of the rect', ({ point }) => {

    const result = isPointInRect(point, rect);

    expect(result).toBe(false);
  });
});

describe('isBelowDragThreshold', () => {
  it('treats a tiny movement as a click', () => {
    // Arrange
    const delta = { x: 2, y: -3 };

    const result = isBelowDragThreshold(delta);

    expect(result).toBe(true);
  });

  it('treats a larger movement as a drag', () => {
    // Arrange
    const delta = { x: 10, y: 0 };

    const result = isBelowDragThreshold(delta);

    expect(result).toBe(false);
  });
});

describe('rectFromDrag', () => {
  const minSize = { width: 100, height: 100 };

  it('builds the rect when dragging down-right', () => {
    // Arrange
    const start = { x: 0, y: 0 };
    const end = { x: 300, y: 200 };

    const rect = rectFromDrag(start, end, minSize);

    expect(rect).toEqual({ x: 0, y: 0, width: 300, height: 200 });
  });

  it('builds the rect when dragging up-left', () => {
    // Arrange
    const start = { x: 300, y: 200 };
    const end = { x: 0, y: 0 };

    const rect = rectFromDrag(start, end, minSize);

    expect(rect).toEqual({ x: 0, y: 0, width: 300, height: 200 });
  });

  it('enforces the minimum size, anchored at the start point', () => {
    // Arrange
    const start = { x: 500, y: 500 };
    const end = { x: 490, y: 490 };

    const rect = rectFromDrag(start, end, minSize);

    expect(rect).toEqual({ x: 400, y: 400, width: 100, height: 100 });
  });
});

describe('clampSize', () => {
  it('raises a size below the minimum to the minimum', () => {
    // Arrange
    const size = { width: 1, height: 1 };

    const result = clampSize(size);

    expect(result).toEqual(MIN_NOTE_SIZE);
  });

  it('keeps a size above the minimum untouched', () => {
    // Arrange
    const size = { width: MIN_NOTE_SIZE.width + 50, height: MIN_NOTE_SIZE.height + 50 };

    const result = clampSize(size);

    expect(result).toEqual(size);
  });
});

describe('clampRectToBounds', () => {
  const bounds = { width: 1000, height: 800 };

  it('leaves a rect inside the bounds untouched', () => {
    // Arrange
    const rect = { x: 100, y: 100, width: 200, height: 200 };

    const result = clampRectToBounds(rect, bounds);

    expect(result).toEqual(rect);
  });

  it.each([
    { case: 'top-left', rect: { x: -50, y: -50, width: 200, height: 200 }, expected: { x: 0, y: 0 } },
    { case: 'bottom-right', rect: { x: 950, y: 750, width: 200, height: 200 }, expected: { x: 800, y: 600 } },
  ])('pulls a rect back inside past the $case edge', ({ rect, expected }) => {
    // Arrange: rect and bounds defined above

    const result = clampRectToBounds(rect, bounds);

    expect(result).toMatchObject(expected);
  });

  it('pins a rect larger than the bounds to the top-left', () => {
    // Arrange
    const rect = { x: 50, y: 50, width: 2000, height: 2000 };

    const result = clampRectToBounds(rect, bounds);

    expect(result).toMatchObject({ x: 0, y: 0 });
  });
});