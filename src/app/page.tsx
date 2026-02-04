"use client";

import Link from "next/link";
import { useEntries } from "@/lib/hooks";
import { PageShell, Button, EmptyState } from "@/components";

export default function HomePage() {
  const entries = useEntries();

  return (
    <PageShell
      title="Encourage"
      headerAction={<Button href="/new">New Entry</Button>}
    >
      {entries.length === 0 ? (
        <EmptyState
          title="No entries yet."
          description="Start journaling to see your entries here."
          action={<Button href="/new">New Entry</Button>}
        />
      ) : (
        <ul className="mt-8 space-y-4">
          {entries.map((entry) => (
            <li key={entry.id}>
              <Link
                href={`/entry/${entry.id}`}
                className="block rounded-lg border border-border p-4 hover:border-border-hover hover:bg-muted transition-colors"
              >
                <time className="text-sm text-text-muted">
                  {new Date(entry.createdAt).toLocaleDateString(undefined, {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                <p className="mt-2 line-clamp-2 text-text-secondary">
                  {entry.content}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
