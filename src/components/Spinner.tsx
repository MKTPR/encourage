interface SpinnerProps {
  message?: string;
}

export function Spinner({ message }: SpinnerProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-light border-t-primary" />
      {message && <p className="text-sm text-text-secondary">{message}</p>}
    </div>
  );
}
