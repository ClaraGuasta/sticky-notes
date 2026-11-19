export const NOTE_COLORS = ['yellow', 'pink', 'blue', 'green'] as const;
export const MIN_NOTE_SIZE: Size = { width: 120, height: 120 };
export const DEFAULT_NOTE_SIZE: Size = { width: 140, height: 140 };

export type NoteColor = (typeof NOTE_COLORS)[number];
// → 'yellow' | 'pink' | 'blue' | 'green'

export const randomNoteColor = (): NoteColor =>
  NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];

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
