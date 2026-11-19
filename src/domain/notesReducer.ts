import { clampSize } from './geometry';
import type { Note, NoteColor, NoteId, Position, Size } from './note';

export type NoteAction =
  | { type: 'notes/loaded'; notes: Note[] }
  | { type: 'note/created'; note: Omit<Note, 'zIndex'> }
  | { type: 'note/removed'; id: NoteId }
  | { type: 'note/moved'; id: NoteId; position: Position }
  | { type: 'note/resized'; id: NoteId; size: Size }
  | { type: 'note/textChanged'; id: NoteId; text: string }
  | { type: 'note/colorChanged'; id: NoteId; color: NoteColor }
  | { type: 'note/broughtToFront'; id: NoteId };

const updateNote = (state: Note[], id: NoteId, update: (note: Note) => Note): Note[] =>
  state.map((n) => (n.id === id ? update(n) : n));

const getMaxZIndex = (state: Note[]): number => state.reduce((max, n) => Math.max(max, n.zIndex), 0);

export function notesReducer(state: Note[], action: NoteAction): Note[] {
  switch (action.type) {
    case 'notes/loaded':
      return action.notes;

    case 'note/created':
      return [...state, { ...action.note, zIndex: getMaxZIndex(state) + 1 }];

    case 'note/removed':
      return state.filter((n) => n.id !== action.id);

    case 'note/moved':
      return updateNote(state, action.id, (n) => ({ ...n, position: action.position }));

    case 'note/resized':
      return updateNote(state, action.id, (n) => ({ ...n, size: clampSize(action.size) }));

    case 'note/textChanged':
      return updateNote(state, action.id, (n) => ({ ...n, text: action.text }));

    case 'note/colorChanged':
      return updateNote(state, action.id, (n) => ({ ...n, color: action.color }));

    case 'note/broughtToFront': {
      const maxZIndex = getMaxZIndex(state);
      const target = state.find((n) => n.id === action.id);
      // Same reference when already on top, so React skips the re-render
      if (!target || target.zIndex === maxZIndex) return state;
      return updateNote(state, action.id, (n) => ({ ...n, zIndex: maxZIndex + 1 }));
    }

    default: {
      const exhaustive: never = action;
      return exhaustive;
    }
  }
}