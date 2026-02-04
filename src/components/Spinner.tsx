interface SpinnerProps {
  message?: string;
}

export function Spinner({ message }: SpinnerProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
      {message && <p className="text-sm text-zinc-600">{message}</p>}
    </div>
  );
}
