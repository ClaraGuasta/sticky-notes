export function EmptyState() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 bg-stone-900/25">
      <div className="absolute top-16 right-10 flex flex-col items-end gap-1 text-white">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 36 V6" />
          <path d="M11 15 L20 6 L29 15" />
        </svg>
        <p className="rounded-md bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-lg">
          Add a note to start
        </p>
      </div>
    </div>
  );
}