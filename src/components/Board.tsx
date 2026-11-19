import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_NOTE_SIZE, MIN_NOTE_SIZE, type Note, type NoteColor, type NoteId, type Position, type Size } from '../domain/note';
import { NoteCard } from './NoteCard';
import { isBelowDragThreshold, isPointInRect, rectFromDrag, type Rect } from '../domain/geometry';
import { TrashZone } from './TrashZone';
import { usePointerDrag } from '../hooks/usePointerDrag';

interface BoardProps {
  notes: Note[];
  lastCreatedId: NoteId | null;
  onNoteCreate: (rect: Rect) => void;
  onNoteMove: (id: NoteId, position: Position) => void;
  onNoteFocus: (id: NoteId) => void;
  onNoteDelete: (id: NoteId) => void;
  onNoteResize: (id: NoteId, size: Size) => void;
  onNoteTextChange: (id: NoteId, text: string) => void;
  onNoteColorChange: (id: NoteId, color: NoteColor) => void;
}

export function Board({
  notes,
  lastCreatedId,
  onNoteCreate,
  onNoteMove,
  onNoteFocus,
  onNoteDelete,
  onNoteResize,
  onNoteTextChange,
  onNoteColorChange
}: BoardProps) {
  const trashRef = useRef<HTMLDivElement>(null);
  const [trashHoverId, setTrashHoverId] = useState<NoteId | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [draftRect, setDraftRect] = useState<Rect | null>(null);

  // --- Trash ---

  const isOverTrash = useCallback((pointer: Position) => {
    const rect = trashRef.current?.getBoundingClientRect();
    return rect ? isPointInRect(pointer, rect) : false;
  }, []);

  const handleDragMove = useCallback(
    (id: NoteId, pointer: Position) => setTrashHoverId(isOverTrash(pointer) ? id : null),
    [isOverTrash],
  );

  const handleDragEnd = useCallback(
    (id: NoteId, pointer: Position, position: Position) => {
      setTrashHoverId(null);
      if (isOverTrash(pointer)) onNoteDelete(id);
      else onNoteMove(id, position);
    },
    [isOverTrash, onNoteDelete, onNoteMove],
  );

  const handleDragCancel = useCallback(() => setTrashHoverId(null), []);

  // --- Creation mode ---

  const exitCreationMode = useCallback(() => {
    setIsCreating(false);
    setDraftRect(null);
  }, []);


  useEffect(() => {
    if (!isCreating) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') exitCreationMode();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCreating, exitCreationMode]);

  const handleCreatePointerDown = usePointerDrag({
    onMove: (delta, pointer) => {
      const start = { x: pointer.x - delta.x, y: pointer.y - delta.y };
      setDraftRect(isBelowDragThreshold(delta) ? null : rectFromDrag(start, pointer, MIN_NOTE_SIZE));
    },
    onEnd: (delta, pointer) => {
      const start = { x: pointer.x - delta.x, y: pointer.y - delta.y };
      exitCreationMode();
      onNoteCreate(
        isBelowDragThreshold(delta)
          ? { ...start, ...DEFAULT_NOTE_SIZE } // click: default size at that point
          : rectFromDrag(start, pointer, MIN_NOTE_SIZE),
      );
    },
    onCancel: () => setDraftRect(null),
  });
  
  return (
    <div className="fixed inset-0 overflow-hidden bg-stone-100 select-none">
      <div className="absolute inset-0 isolate">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            isOverTrash={trashHoverId === note.id}
            autoFocus={note.id === lastCreatedId}
            onFocus={onNoteFocus}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            onResize={onNoteResize}
            onTextChange={onNoteTextChange}
            onColorChange={onNoteColorChange}
          />
        ))}
      </div>
      
      <TrashZone ref={trashRef} isActive={trashHoverId !== null} />

      {isCreating && (
        <>
          {/* Overlay captures the gesture anywhere, even on top of existing notes */}
          <div
            className="absolute inset-0 z-20 cursor-crosshair bg-stone-900/5"
            onPointerDown={handleCreatePointerDown}
          />
          <p className="pointer-events-none absolute top-5 left-1/2 z-20 -translate-x-1/2 rounded-md bg-white/90 px-3 py-1.5 text-sm text-stone-600 shadow">
            Click to place a note, or drag to set its size · <kbd>Esc</kbd> to cancel
          </p>
        </>
      )}

      {draftRect && (
        <div
          className="pointer-events-none absolute top-0 left-0 z-20 rounded-sm border-2 border-dashed border-stone-400 bg-yellow-100/60"
          style={{
            transform: `translate(${draftRect.x}px, ${draftRect.y}px)`,
            width: draftRect.width,
            height: draftRect.height,
          }}
        />
      )}

      <button
        type="button"
        onClick={() => (isCreating ? exitCreationMode() : setIsCreating(true))}
        aria-pressed={isCreating}
        className={`absolute top-4 right-4 z-30 cursor-pointer rounded-md px-4 py-2 text-sm font-medium shadow transition ${
          isCreating ? 'bg-stone-700 text-white hover:bg-stone-800' : 'bg-white text-stone-700 hover:bg-stone-50'
        }`}
      >
        {isCreating ? 'Cancel' : '+ New note'}
      </button>

    </div>
  );
}