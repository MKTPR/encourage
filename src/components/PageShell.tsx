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
    <main className="mx-auto max-w-2xl px-4 py-10">
      {backLink && (
        <Link
          href={backLink.href}
          className="text-sm text-zinc-500 hover:text-zinc-700"
        >
          &larr; {backLink.label}
        </Link>
      )}

      {(title || headerAction) && (
        <div className={`flex items-center justify-between ${backLink ? "mt-6" : ""}`}>
          {title && <h1 className="text-2xl font-semibold">{title}</h1>}
          {headerAction}
        </div>
      )}

      {children}
    </main>
  );
}
