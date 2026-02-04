import { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export function TextArea({
  className = "",
  error,
  id,
  ...props
}: TextAreaProps) {
  const errorId = id ? `${id}-error` : undefined;

  return (
    <div>
      <textarea
        id={id}
        className={`w-full rounded-lg border border-zinc-300 p-3 disabled:opacity-50 ${className}`}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
