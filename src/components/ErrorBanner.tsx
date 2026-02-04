import { ReactNode } from "react";

interface ErrorBannerProps {
  message: string;
  action?: ReactNode;
}

export function ErrorBanner({ message, action }: ErrorBannerProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <p className="text-sm text-red-700">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
