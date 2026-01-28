"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEntry } from "@/lib/hooks";

export default function EntryDetailPage() {
  const params = useParams<{ id: string }>();
  const entry = useEntry(params.id);

  // Not found state
  if (!entry) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Entry not found</h1>
        <p className="mt-4 text-zinc-500">
          This entry doesn&apos;t exist or may have been deleted.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full border border-zinc-300 px-5 py-2 text-sm hover:bg-zinc-50"
        >
          Back to Home
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Link
        href="/"
        className="text-sm text-zinc-500 hover:text-zinc-700"
      >
        &larr; Back to Home
      </Link>

      <article className="mt-6">
        <time className="text-sm text-zinc-500">
          {new Date(entry.createdAt).toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </time>

        <div className="mt-4 whitespace-pre-wrap text-zinc-700 leading-relaxed">
          {entry.content}
        </div>
      </article>

      {/* Placeholder for reflection UI */}
      <section className="mt-10 rounded-lg border border-dashed border-zinc-300 p-6">
        <h2 className="text-sm font-medium text-zinc-500">Reflection</h2>
        <p className="mt-2 text-sm text-zinc-400">
          AI-assisted reflection will appear here in a future update.
        </p>
      </section>
    </main>
  );
}
