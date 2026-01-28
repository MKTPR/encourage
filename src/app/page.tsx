"use client";

import Link from "next/link";
import { useEntries } from "@/lib/hooks";

export default function HomePage() {
  const entries = useEntries();

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Encourage</h1>
        <Link
          href="/new"
          className="rounded-full bg-zinc-900 px-5 py-2 text-sm text-white hover:bg-zinc-800"
        >
          New Entry
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-zinc-500">No entries yet.</p>
          <p className="mt-2 text-sm text-zinc-400">
            Start journaling to see your entries here.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {entries.map((entry) => (
            <li key={entry.id}>
              <Link
                href={`/entry/${entry.id}`}
                className="block rounded-lg border border-zinc-200 p-4 hover:border-zinc-300 hover:bg-zinc-50"
              >
                <time className="text-sm text-zinc-500">
                  {new Date(entry.createdAt).toLocaleDateString(undefined, {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                <p className="mt-2 line-clamp-2 text-zinc-700">
                  {entry.content}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
