import { useCallback, useReducer, useState } from 'react';
import { notesReducer } from './domain/notesReducer';
import { createNoteId, randomNoteColor, type Note, type NoteColor, type NoteId, type Position, type Size } from './domain/note';
import { Board } from './components/Board';
import type { Rect } from './domain/geometry';

// Temporary seed data, will be replaced by persistence
const SEED_NOTES: Note[] = [
  { id: createNoteId(), text: 'Hola!', position: { x: 80, y: 80 }, size: { width: 200, height: 160 }, color: 'yellow', zIndex: 1 },
  { id: createNoteId(), text: 'Otra nota', position: { x: 220, y: 180 }, size: { width: 180, height: 180 }, color: 'pink', zIndex: 2 },
  { id: createNoteId(), text: 'Tercera', position: { x: 480, y: 120 }, size: { width: 240, height: 140 }, color: 'blue', zIndex: 3 },
];

export default function App() {
  const [notes, dispatch] = useReducer(notesReducer, SEED_NOTES);
  const [lastCreatedId, setLastCreatedId] = useState<NoteId | null>(null);

  const handleNoteCreate = useCallback((rect: Rect) => {
    const id = createNoteId();
    setLastCreatedId(id);
    dispatch({
      type: 'note/created',
      note: {
        id,
        text: '',
        color: randomNoteColor(),
        position: { x: rect.x, y: rect.y },
        size: { width: rect.width, height: rect.height },
     },
  });
}, []);

  const handleNoteMove = useCallback(
    (id: NoteId, position: Position) => dispatch({ type: 'note/moved', id, position }),
    [],
  );

  const handleNoteFocus = useCallback(
    (id: NoteId) => dispatch({ type: 'note/broughtToFront', id }),
    [],
  );

  const handleNoteDelete = useCallback(
    (id: NoteId) => dispatch({ type: 'note/removed', id }),
    [],
  );

  const handleNoteResize = useCallback(
    (id: NoteId, size: Size) => dispatch({ type: 'note/resized', id, size }),
    [],
  );

  const handleNoteTextChange = useCallback(
    (id: NoteId, text: string) => dispatch({ type: 'note/textChanged', id, text }),
    [],
  );

  const handleNoteColorChange = useCallback(
  (id: NoteId, color: NoteColor) => dispatch({ type: 'note/colorChanged', id, color }),
  [],
);

  return (
    <Board
      notes={notes}
      lastCreatedId={lastCreatedId}
      onNoteCreate={handleNoteCreate}
      onNoteMove={handleNoteMove}
      onNoteResize={handleNoteResize}
      onNoteFocus={handleNoteFocus}
      onNoteDelete={handleNoteDelete}
      onNoteTextChange={handleNoteTextChange}
      onNoteColorChange={handleNoteColorChange}
    />
  );  
}