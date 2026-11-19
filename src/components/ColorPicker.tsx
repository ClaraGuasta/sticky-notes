import { NOTE_COLORS, type NoteColor } from '../domain/note';
import { SWATCH_CLASSES } from '../styles/noteColors';

interface ColorPickerProps {
  value: NoteColor;
  onChange: (color: NoteColor) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className = '' }: ColorPickerProps) {
  return (
    <div
      role="group"
      aria-label="Note color"
      // Lives inside the drag handle: keep clicks here from starting a drag
      onPointerDown={(e) => e.stopPropagation()}
      className={`flex gap-1.5 ${className}`}
    >
      {NOTE_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          aria-label={color}
          aria-pressed={color === value}
          onClick={() => onChange(color)}
          className={`h-3.5 w-3.5 cursor-pointer rounded-full border border-black/20 ${SWATCH_CLASSES[color]} ${
            color === value ? 'ring-2 ring-black/40 ring-offset-1' : ''
          }`}
        />
      ))}
    </div>
  );
}