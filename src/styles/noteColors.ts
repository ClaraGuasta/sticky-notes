import type { NoteColor } from '../domain/note';

// Full class names on purpose: Tailwind can't detect dynamically built ones
export const NOTE_BG_CLASSES: Record<NoteColor, string> = {
  yellow: 'bg-yellow-200',
  pink: 'bg-pink-200',
  blue: 'bg-sky-200',
  green: 'bg-green-200',
};

export const SWATCH_CLASSES: Record<NoteColor, string> = {
  yellow: 'bg-yellow-300',
  pink: 'bg-pink-300',
  blue: 'bg-sky-300',
  green: 'bg-green-300',
};