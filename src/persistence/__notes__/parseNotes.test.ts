import { describe, expect, it } from 'vitest';
import { parseNotes } from '../parseNotes';

const validNote = {
  id: 'a',
  text: 'hello',
  position: { x: 10, y: 20 },
  size: { width: 200, height: 200 },
  color: 'pink',
  zIndex: 1,
};

describe('parseNotes', () => {
  it('accepts well-formed notes', () => {
    const data = [validNote];

    const result = parseNotes(data);

    expect(result).toEqual([validNote]);
  });

  it.each([
    { case: 'an unknown color', invalid: { ...validNote, color: 'purple' } },
    { case: 'a non-numeric position', invalid: { ...validNote, position: { x: '10', y: 20 } } },
    { case: 'a NaN size', invalid: { ...validNote, size: { width: NaN, height: 200 } } },
    { case: 'missing fields', invalid: { id: 'b' } },
    { case: 'a null entry', invalid: null },
  ])('drops a note with $case and keeps the valid ones', ({ invalid }) => {
    const data = [validNote, invalid];

    const result = parseNotes(data);

    expect(result).toEqual([validNote]);
  });

  it.each([
    { case: 'null', data: null },
    { case: 'an object', data: { notes: [] } },
    { case: 'a string', data: 'garbage' },
  ])('returns an empty list when data is $case', ({ data }) => {
    const result = parseNotes(data);

    expect(result).toEqual([]);
  });
});