import { MIN_NOTE_SIZE, type Position, type Size } from './note';

const DRAG_THRESHOLD_PX = 4;

export type Rect = Position & Size;

export const isBelowDragThreshold = (delta: Position): boolean =>
  Math.abs(delta.x) < DRAG_THRESHOLD_PX && Math.abs(delta.y) < DRAG_THRESHOLD_PX;

export const isPointInRect = (point: Position, rect: Rect): boolean =>
  point.x >= rect.x &&
  point.x <= rect.x + rect.width &&
  point.y >= rect.y &&
  point.y <= rect.y + rect.height;

export const clampSize = (size: Size): Size => ({
  width: Math.max(MIN_NOTE_SIZE.width, size.width),
  height: Math.max(MIN_NOTE_SIZE.height, size.height),
});

export const rectFromDrag = (start: Position, end: Position, minSize: Size): Rect => {
  const width = Math.max(minSize.width, Math.abs(end.x - start.x));
  const height = Math.max(minSize.height, Math.abs(end.y - start.y));
  return {
    x: end.x < start.x ? start.x - width : start.x,
    y: end.y < start.y ? start.y - height : start.y,
    width,
    height,
  };
};