"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useEntry } from "@/lib/hooks";
import { getReflection, saveReflection } from "@/lib/store";
import { Reflection } from "@/lib/reflectionSchema";

export default function EntryDetailPage() {
  const params = useParams<{ id: string }>();
  const entry = useEntry(params.id);

  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing reflection on mount
  useEffect(() => {
    if (params.id) {
      const stored = getReflection(params.id);
      if (stored) {
        setReflection(stored);
      }
    }
  }, [params.id]);

  const handleGenerateReflection = async () => {
    if (!entry) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId: entry.id, content: entry.content }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate reflection");
      }

      const data: Reflection = await response.json();
      saveReflection(entry.id, data);
      setReflection(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Reflection section */}
      <section className="mt-10">
        <h2 className="text-sm font-medium text-zinc-500 mb-4">Reflection</h2>

        {/* Error state */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={handleGenerateReflection}
              disabled={isLoading}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
              <p className="text-sm text-zinc-600">Generating reflection...</p>
            </div>
          </div>
        )}

        {/* Reflection card */}
        {reflection && !isLoading && (
          <div className="rounded-lg border border-zinc-200 bg-white p-6 space-y-4">
            <div>
              <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                Emotion
              </h3>
              <p className="mt-1 text-zinc-700">{reflection.emotion}</p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                Core Thought
              </h3>
              <p className="mt-1 text-zinc-700">{reflection.core_thought}</p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                Reframe
              </h3>
              <p className="mt-1 text-zinc-700">{reflection.reframe}</p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                One Action
              </h3>
              <p className="mt-1 text-zinc-700">{reflection.one_action}</p>
            </div>

            <button
              onClick={handleGenerateReflection}
              disabled={isLoading}
              className="mt-4 text-sm text-zinc-500 hover:text-zinc-700 underline"
            >
              Regenerate
            </button>
          </div>
        )}

        {/* Idle state - no reflection yet */}
        {!reflection && !isLoading && !error && (
          <div className="rounded-lg border border-dashed border-zinc-300 p-6">
            <p className="text-sm text-zinc-400 mb-4">
              Get an AI-assisted reflection on your journal entry.
            </p>
            <button
              onClick={handleGenerateReflection}
              disabled={isLoading}
              className="rounded-full bg-zinc-900 px-5 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Reflection
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
