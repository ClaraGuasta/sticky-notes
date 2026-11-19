import { useCallback, useReducer } from 'react';
import { notesReducer } from './domain/notesReducer';
import { createNoteId, type Note, type NoteId, type Position, type Size } from './domain/note';
import { Board } from './components/Board';

// Temporary seed data, will be replaced by persistence
const SEED_NOTES: Note[] = [
  { id: createNoteId(), text: 'Hola!', position: { x: 80, y: 80 }, size: { width: 200, height: 160 }, color: 'yellow', zIndex: 1 },
  { id: createNoteId(), text: 'Otra nota', position: { x: 220, y: 180 }, size: { width: 180, height: 180 }, color: 'pink', zIndex: 2 },
  { id: createNoteId(), text: 'Tercera', position: { x: 480, y: 120 }, size: { width: 240, height: 140 }, color: 'blue', zIndex: 3 },
];

export default function App() {
  const [notes, dispatch] = useReducer(notesReducer, SEED_NOTES);

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


  return <Board notes={notes} onNoteMove={handleNoteMove} onNoteFocus={handleNoteFocus} onNoteDelete={handleNoteDelete} onNoteResize={handleNoteResize} />;
}