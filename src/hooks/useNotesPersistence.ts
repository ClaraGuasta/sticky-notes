import { useEffect, useRef, useState, type Dispatch } from 'react';
import type { Note } from '../domain/note';
import type { NotesRepository } from '../persistence/NotesRepository';
import type { NoteAction } from '../domain/notesReducer';

const SAVE_DEBOUNCE_MS = 300;

export type PersistenceStatus = 'loading' | 'ready' | 'error';

export function useNotesPersistence(
  repository: NotesRepository,
  notes: Note[],
  dispatch: Dispatch<NoteAction>,
): PersistenceStatus {
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());

  const [status, setStatus] = useState<PersistenceStatus>('loading');

  useEffect(() => {
    let cancelled = false; // ignores stale results (StrictMode double-mount, repository swap)

    repository
      .load()
      .then((loaded) => {
        if (cancelled) return;
        dispatch({ type: 'notes/loaded', notes: loaded });
        setStatus('ready');
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error('Failed to load notes', error);
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [repository, dispatch]);


  useEffect(() => {
    // Saving before the initial load finishes would overwrite stored notes with the empty initial state
    if (status !== 'ready') return;

    const timeout = setTimeout(() => {
      saveQueueRef.current = saveQueueRef.current
        .then(() => repository.save(notes))
        .catch((error: unknown) => console.error('Failed to save notes', error));
    }, SAVE_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [notes, status, repository]);

  return status;
}