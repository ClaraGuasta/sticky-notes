export const NOTE_COLORS = ['yellow', 'pink', 'blue', 'green'] as const;
export const MIN_NOTE_SIZE: Size = { width: 120, height: 120 };

export type NoteColor = (typeof NOTE_COLORS)[number];
// → 'yellow' | 'pink' | 'blue' | 'green'

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type NoteId = string & { readonly __brand: 'NoteId' };

export const createNoteId = (): NoteId => crypto.randomUUID() as NoteId;

export interface Note {
  id: NoteId;
  text: string;
  position: Position;
  size: Size;
  color: NoteColor;
  zIndex: number;
}

export type NoteAction =
| { type: 'notes/loaded'; notes: Note[] }
| { type: 'note/created'; note: Note }
| { type: 'note/removed'; id: NoteId }
| { type: 'note/moved'; id: NoteId; position: Position }
| { type: 'note/resized'; id: NoteId; size: Size }
| { type: 'note/textChanged'; id: NoteId; text: string }
| { type: 'note/colorChanged'; id: NoteId; color: NoteColor }
| { type: 'note/broughtToFront'; id: NoteId };
