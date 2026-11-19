import { MIN_NOTE_SIZE, type Position, type Size } from './note';

export type Rect = Position & Size;

export const isPointInRect = (point: Position, rect: Rect): boolean =>
  point.x >= rect.x &&
  point.x <= rect.x + rect.width &&
  point.y >= rect.y &&
  point.y <= rect.y + rect.height;

export const clampSize = (size: Size): Size => ({
  width: Math.max(MIN_NOTE_SIZE.width, size.width),
  height: Math.max(MIN_NOTE_SIZE.height, size.height),
});