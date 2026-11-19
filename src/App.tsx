import { useCallback, useReducer, useState } from 'react';
import { notesReducer } from './domain/notesReducer';
import { createNoteId, randomNoteColor, type NoteColor, type NoteId, type Position, type Size } from './domain/note';
import { Board } from './components/Board';
import type { Rect } from './domain/geometry';
import { createLocalStorageNotesRepository } from './persistence/localStorageNotesRepository';
import { StatusMessage } from './components/StatusMessage';
import { useNotesPersistence } from './hooks/useNotesPersistence';

const notesRepository = createLocalStorageNotesRepository();

export default function App() {
  const [notes, dispatch] = useReducer(notesReducer, []);
  const [lastCreatedId, setLastCreatedId] = useState<NoteId | null>(null);

  const status = useNotesPersistence(notesRepository, notes, dispatch);

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

 if (status === 'loading') {
    return <StatusMessage>Loading notes…</StatusMessage>;
  }
  if (status === 'error') {
    return <StatusMessage>Couldn't load your notes. Please reload the page.</StatusMessage>;
  }
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