import { memo, useState } from 'react';
import type { Note, NoteColor, NoteId, Position, Size } from '../domain/note';
import { usePointerDrag } from '../hooks/usePointerDrag';
import { clampSize } from '../domain/geometry';

const COLOR_CLASSES: Record<NoteColor, string> = {
  yellow: 'bg-yellow-200',
  pink: 'bg-pink-200',
  blue: 'bg-sky-200',
  green: 'bg-green-200',
};

interface NoteCardProps {
  note: Note;
  isOverTrash: boolean;
  onFocus: (id: NoteId) => void;
  onDragMove: (id: NoteId, pointer: Position) => void;
  onDragEnd: (id: NoteId, pointer: Position, position: Position) => void;
  onDragCancel: () => void;
  onResize: (id: NoteId, size: Size) => void;
}

export const NoteCard = memo(function NoteCard({
  note,
  isOverTrash,
  onFocus,
  onDragMove,
  onDragEnd,
  onDragCancel,
  onResize
}: NoteCardProps) {
  const { id, position, size, color, zIndex, text } = note;
  const [dragOffset, setDragOffset] = useState<Position | null>(null);
  const [resizeDelta, setResizeDelta] = useState<Position | null>(null);

  const isDragging = dragOffset !== null;
  const x = position.x + (dragOffset?.x ?? 0);
  const y = position.y + (dragOffset?.y ?? 0);

  const displaySize = resizeDelta
  ? clampSize({ width: size.width + resizeDelta.x, height: size.height + resizeDelta.y })
  : size;

  const handleHeaderPointerDown = usePointerDrag({
    onMove: (delta, pointer) => {
      setDragOffset(delta);
      onDragMove(id, pointer);
    },
    onEnd: (delta, pointer) => {
      setDragOffset(null);
      if (delta.x === 0 && delta.y === 0) {
        onDragCancel(); // plain click, nothing to commit
        return;
      }
      onDragEnd(id, pointer, { x: position.x + delta.x, y: position.y + delta.y });
    },
    onCancel: () => {
      setDragOffset(null);
      onDragCancel();
    },
  });

  const handleResizePointerDown = usePointerDrag({
    onMove: setResizeDelta,
    onEnd: (delta) => {
      setResizeDelta(null);
      if (delta.x === 0 && delta.y === 0) return;
      onResize(id, { width: size.width + delta.x, height: size.height + delta.y });
    },
    onCancel: () => setResizeDelta(null),
  });


  return (
    <div
      onPointerDown={() => onFocus(id)}
      className={`absolute left-0 top-0 flex flex-col rounded-sm ${COLOR_CLASSES[color]} ${
        isDragging ? 'shadow-xl' : 'shadow-md'
      }  ${isOverTrash ? 'opacity-50' : ''}`}      
      style={{
        transform: `translate(${x}px, ${y}px)`,
        width: displaySize.width,
        height: displaySize.height,
        zIndex,
      }}
    >
      <div
        onPointerDown={handleHeaderPointerDown}
        className="h-6 shrink-0 cursor-grab bg-black/5"
      />
      <p className="flex-1 overflow-auto p-2 text-sm whitespace-pre-wrap">{text}</p>
      <div
        onPointerDown={handleResizePointerDown}
        aria-hidden="true"
        className="absolute right-0 bottom-0 h-4 w-4 cursor-nwse-resize"
        style={{ background: 'linear-gradient(135deg, transparent 50%, rgb(0 0 0 / 0.2) 50%)' }}
      />
    </div>
  );
});