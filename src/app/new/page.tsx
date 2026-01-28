"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addEntry } from "@/lib/store";

const MIN_CONTENT_LENGTH = 5;

export default function NewEntryPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (content.trim().length < MIN_CONTENT_LENGTH) {
      setError(`Write a little more (at least ${MIN_CONTENT_LENGTH} characters).`);
      return;
    }

    setIsSubmitting(true);

    try {
      const entry = addEntry(content);
      router.push(`/entry/${entry.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save entry.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold">New entry</h1>

      <form onSubmit={onSubmit} className="mt-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          placeholder="What's on your mind today?"
          disabled={isSubmitting}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? "content-error" : undefined}
          className="w-full rounded-lg border border-zinc-300 p-3 disabled:opacity-50"
        />

        {error && (
          <p id="content-error" className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm text-white disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <Link href="/" className="rounded-full border border-zinc-300 px-5 py-2 text-sm">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
