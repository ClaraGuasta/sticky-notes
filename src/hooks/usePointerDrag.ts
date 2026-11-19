import type { PointerEvent as ReactPointerEvent } from 'react';
import type { Position } from '../domain/note';

interface PointerDragHandlers {
  onStart?: () => void;
  onMove: (delta: Position, pointer: Position) => void;
  onEnd: (delta: Position, pointer: Position) => void;
  onCancel?: () => void;
}

/**
 * Generic drag gesture. Uses pointer capture so the drag keeps tracking
 * even if the cursor leaves the element (or the window) mid-gesture.
 */
export function usePointerDrag({ onStart, onMove, onEnd, onCancel }: PointerDragHandlers) {
  return (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0) return; // left button only

    const target = event.currentTarget;
    const origin = { x: event.clientX, y: event.clientY };
    const getDelta = (e: PointerEvent): Position => ({ x: e.clientX - origin.x, y: e.clientY - origin.y });
    const getPointer = (e: PointerEvent): Position => ({ x: e.clientX, y: e.clientY });

    const cleanup = () => {
      target.removeEventListener('pointermove', handleMove);
      target.removeEventListener('pointerup', handleUp);
      target.removeEventListener('pointercancel', handleCancel);
    };
    const handleMove = (e: PointerEvent) => onMove(getDelta(e), getPointer(e));
    const handleUp = (e: PointerEvent) => {
      cleanup();
      onEnd(getDelta(e), getPointer(e));
    };
    const handleCancel = () => {
      cleanup();
      onCancel?.();
    };

    target.setPointerCapture(event.pointerId);
    target.addEventListener('pointermove', handleMove);
    target.addEventListener('pointerup', handleUp);
    target.addEventListener('pointercancel', handleCancel);
    onStart?.();
  };
}