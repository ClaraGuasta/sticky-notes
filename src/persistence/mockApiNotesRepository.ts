import type { NotesRepository } from './NotesRepository';
import { parseNotes } from './parseNotes';

interface MockApiOptions {
  latencyMs?: { min: number; max: number };
  /** Probability (0..1) that a request fails, to exercise error handling. */
  failureRate?: number;
  storageKey?: string;
}

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Simulates a REST backend (GET/PUT /api/notes) with network latency and optional failures.
 * localStorage acts as the fake server's database so data survives reloads.
 */
export const createMockApiNotesRepository = ({
  latencyMs = { min: 200, max: 600 },
  failureRate = 0,
  storageKey = 'sticky-notes:mock-api:v1',
}: MockApiOptions = {}): NotesRepository => {
  const simulateRequest = async <T>(handler: () => T): Promise<T> => {
    await delay(latencyMs.min + Math.random() * (latencyMs.max - latencyMs.min));
    if (Math.random() < failureRate) throw new Error('Mock API: 503 Service Unavailable');
    return handler();
  };

  return {
    async load() {
      // GET /api/notes
      const body = await simulateRequest(() => localStorage.getItem(storageKey) ?? '[]');
      return parseNotes(JSON.parse(body));
    },

    async save(notes) {
      // PUT /api/notes. Serialize up front, like a real request body
      const body = JSON.stringify(notes);
      await simulateRequest(() => localStorage.setItem(storageKey, body));
    },
  };
};