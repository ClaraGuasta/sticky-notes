import type { NotesRepository } from './NotesRepository';
import { parseNotes } from './parseNotes';

// Versioned key: a future schema change can migrate from v1 instead of misreading it
const DEFAULT_STORAGE_KEY = 'sticky-notes:v1';

export const createLocalStorageNotesRepository = (key = DEFAULT_STORAGE_KEY): NotesRepository => ({
  async load() {
    const raw = localStorage.getItem(key);
    if (raw === null) return [];
    try {
      return parseNotes(JSON.parse(raw));
    } catch {
      return []; // corrupted JSON: start fresh rather than crash
    }
  },

  async save(notes) {
    localStorage.setItem(key, JSON.stringify(notes));
  },
});