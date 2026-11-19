interface StatusMessageProps {
  children: string;
}

export function StatusMessage({ children }: StatusMessageProps) {
  return (
    <div role="status" className="fixed inset-0 grid place-items-center bg-stone-100 text-stone-500">
      {children}
    </div>
  );
}