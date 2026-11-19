import { NOTE_COLORS, type Note, type NoteColor, type Position, type Size } from '../domain/note';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isPosition = (value: unknown): value is Position =>
  isRecord(value) && isFiniteNumber(value.x) && isFiniteNumber(value.y);

const isSize = (value: unknown): value is Size =>
  isRecord(value) && isFiniteNumber(value.width) && isFiniteNumber(value.height);

const isNoteColor = (value: unknown): value is NoteColor =>
  typeof value === 'string' && (NOTE_COLORS as readonly string[]).includes(value);

export const isNote = (value: unknown): value is Note =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.text === 'string' &&
  isPosition(value.position) &&
  isSize(value.size) &&
  isNoteColor(value.color) &&
  isFiniteNumber(value.zIndex);

/** Keeps valid notes and drops malformed entries instead of failing the whole load. */
export const parseNotes = (data: unknown): Note[] => (Array.isArray(data) ? data.filter(isNote) : []);