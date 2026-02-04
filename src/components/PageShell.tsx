import { ReactNode } from "react";
import Link from "next/link";

interface PageShellProps {
  title?: string;
  children: ReactNode;
  headerAction?: ReactNode;
  backLink?: { href: string; label: string };
}

export function PageShell({
  title,
  children,
  headerAction,
  backLink,
}: PageShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="mx-auto max-w-2xl px-4 py-10 flex-1">
        {backLink && (
          <Link
            href={backLink.href}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            &larr; {backLink.label}
          </Link>
        )}

        {(title || headerAction) && (
          <div className={`flex items-center justify-between ${backLink ? "mt-6" : ""}`}>
            {title && <h1 className="text-2xl font-semibold text-text-primary">{title}</h1>}
            {headerAction}
          </div>
        )}

        {children}
      </main>

      <footer className="border-t border-border py-6 px-4">
        <div className="mx-auto max-w-2xl text-center text-xs text-text-muted space-y-1">
          <p>This app is not a substitute for professional mental health care.</p>
          <p>Your entries are stored locally in your browser and are not sent to any server.</p>
        </div>
      </footer>
    </div>
  );
}
