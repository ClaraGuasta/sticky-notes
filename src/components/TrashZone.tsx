import type { Ref } from 'react';

interface TrashZoneProps {
  ref: Ref<HTMLDivElement>;
  isActive: boolean;
}

export function TrashZone({ ref, isActive }: TrashZoneProps) {
  return (
    <div
      ref={ref}
      aria-label="Trash: drop a note here to delete it"
      className={`pointer-events-none fixed right-6 bottom-6 z-10 flex h-24 w-24 flex-col items-center justify-center rounded-2xl border-2 border-dashed text-xs transition ${
        isActive
          ? 'scale-110 border-red-500 bg-red-100 text-red-600'
          : 'border-stone-400 bg-white/70 text-stone-500'
      }`}
    >
      <span className="text-2xl">🗑</span>
      Drop to delete
    </div>
  );
}