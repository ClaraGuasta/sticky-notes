import { describe, expect, it } from 'vitest';
import { notesReducer } from '../notesReducer';
import { MIN_NOTE_SIZE, type Note, type NoteId } from '../note';

const makeNewNote = (id: string, overrides: Partial<Omit<Note, 'zIndex'>> = {}): Omit<Note, 'zIndex'> => ({
  id: id as NoteId,
  text: '',
  position: { x: 0, y: 0 },
  size: { width: 200, height: 200 },
  color: 'yellow',
  ...overrides,
});

const makeNote = (id: string, overrides: Partial<Note> = {}): Note => ({
  ...makeNewNote(id),
  zIndex: 1,
  ...overrides,
});

describe('notesReducer', () => {
  describe('notes/loaded', () => {
    it('replaces the whole state with the loaded notes', () => {
      const state = [makeNote('old')];
      const loaded = [makeNote('a'), makeNote('b')];

      const next = notesReducer(state, { type: 'notes/loaded', notes: loaded });

      expect(next).toBe(loaded);
    });
  });

  describe('note/created', () => {
    it('places the new note above all existing ones', () => {
      const state = [makeNote('a', { zIndex: 3 }), makeNote('b', { zIndex: 7 })];

      const next = notesReducer(state, { type: 'note/created', note: makeNewNote('c') });

      expect(next).toHaveLength(3);
      expect(next[2]).toMatchObject({ id: 'c', zIndex: 8 });
    });

    it('assigns zIndex 1 to the first note on an empty board', () => {
      const state: Note[] = [];

      const next = notesReducer(state, { type: 'note/created', note: makeNewNote('a') });

      expect(next[0].zIndex).toBe(1);
    });
  });

  describe('note/removed', () => {
    it('removes the note with the given id', () => {
      const state = [makeNote('a'), makeNote('b')];

      const next = notesReducer(state, { type: 'note/removed', id: 'a' as NoteId });

      expect(next.map((n) => n.id)).toEqual(['b']);
    });
  });

  describe('note/moved', () => {
    it('updates the position of the target note', () => {
      const state = [makeNote('a'), makeNote('b')];
      const position = { x: 50, y: 60 };

      const next = notesReducer(state, { type: 'note/moved', id: 'a' as NoteId, position });

      expect(next[0].position).toEqual(position);
    });

    it('keeps untouched notes by reference so memoized cards skip re-rendering', () => {
      const state = [makeNote('a'), makeNote('b')];

      const next = notesReducer(state, { type: 'note/moved', id: 'a' as NoteId, position: { x: 50, y: 60 } });

      expect(next[1]).toBe(state[1]);
    });
  });

  describe('note/resized', () => {
    it('clamps the size to the minimum note size', () => {
      const state = [makeNote('a')];

      const next = notesReducer(state, { type: 'note/resized', id: 'a' as NoteId, size: { width: 10, height: 10 } });

      expect(next[0].size).toEqual(MIN_NOTE_SIZE);
    });
  });

  describe('note/textChanged', () => {
    it('updates the text of the target note', () => {
      const state = [makeNote('a')];

      const next = notesReducer(state, { type: 'note/textChanged', id: 'a' as NoteId, text: 'hello' });

      expect(next[0].text).toBe('hello');
    });
  });

  describe('note/colorChanged', () => {
    it('updates the color of the target note', () => {
      const state = [makeNote('a', { color: 'yellow' })];

      const next = notesReducer(state, { type: 'note/colorChanged', id: 'a' as NoteId, color: 'blue' });

      expect(next[0].color).toBe('blue');
    });
  });

  describe('note/broughtToFront', () => {
    it('raises the note above the current top note', () => {
      const state = [makeNote('a', { zIndex: 1 }), makeNote('b', { zIndex: 2 })];

      const next = notesReducer(state, { type: 'note/broughtToFront', id: 'a' as NoteId });

      expect(next[0].zIndex).toBe(3);
    });

    it('returns the same state when the note is already on top', () => {
      const state = [makeNote('a', { zIndex: 1 }), makeNote('b', { zIndex: 2 })];

      const next = notesReducer(state, { type: 'note/broughtToFront', id: 'b' as NoteId });

      expect(next).toBe(state);
    });
  });
});