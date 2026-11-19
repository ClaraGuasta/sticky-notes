import type { Rect } from '../domain/geometry';

interface FirstNoteTipProps {
  anchor: Rect;
  onDismiss: () => void;
}

const TIPS = [
  'Type inside the note to add text',
  'Drag the top bar to move it',
  'Drag the bottom-right corner to resize',
  'Hover the top bar to change its color',
  'Drop it on the trash to delete it',
] as const;

export function FirstNoteTip({ anchor, onDismiss }: FirstNoteTipProps) {
  // Flip above the note when there's no room below
  const placeAbove = anchor.y + anchor.height > window.innerHeight * 0.6;

  return (
    <div
      className="pointer-events-none absolute top-0 left-0 z-20"
      style={{
        transform: `translate(${anchor.x}px, ${anchor.y}px)`,
        width: anchor.width,
        height: anchor.height,
      }}
    >
      <div
        role="dialog"
        aria-label="How to use notes"
        className={`pointer-events-auto absolute left-0 w-64 rounded-lg bg-stone-800 p-4 text-sm text-white shadow-xl ${
          placeAbove ? 'bottom-full mb-3' : 'top-full mt-3'
        }`}
      >
        <ul className="space-y-1.5">
          {TIPS.map((tip) => (
            <li key={tip}>• {tip}</li>
          ))}
        </ul>
        <button
          type="button"
          onClick={onDismiss}
          className="mt-3 w-full cursor-pointer rounded-md bg-white py-1.5 font-medium text-stone-800 hover:bg-stone-100"
        >
          Got it
        </button>
      </div>
    </div>
  );
}