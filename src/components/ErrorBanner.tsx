import { ReactNode } from "react";

interface ErrorBannerProps {
  message: string;
  action?: ReactNode;
}

export function ErrorBanner({ message, action }: ErrorBannerProps) {
  return (
    <div className="rounded-lg border border-error-border bg-error-light p-4">
      <p className="text-sm text-error">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
