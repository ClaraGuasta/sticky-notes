import { useCallback, useRef, useState } from 'react';
import type { Note, NoteId, Position, Size } from '../domain/note';
import { NoteCard } from './NoteCard';
import { isPointInRect } from '../domain/geometry';
import { TrashZone } from './TrashZone';

interface BoardProps {
  notes: Note[];
  onNoteMove: (id: NoteId, position: Position) => void;
  onNoteFocus: (id: NoteId) => void;
  onNoteDelete: (id: NoteId) => void;
  onNoteResize: (id: NoteId, size: Size) => void;
}

export function Board({ notes, onNoteMove, onNoteFocus, onNoteDelete, onNoteResize }: BoardProps) {
  const trashRef = useRef<HTMLDivElement>(null);
  const [trashHoverId, setTrashHoverId] = useState<NoteId | null>(null);

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

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-stone-100 select-none">
      <div className="absolute inset-0 isolate">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            isOverTrash={trashHoverId === note.id}
            onFocus={onNoteFocus}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            onResize={onNoteResize}
          />
        ))}
      </div>
        <TrashZone ref={trashRef} isActive={trashHoverId !== null} />
    </div>
  );
}