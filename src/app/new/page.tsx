"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addEntry } from "@/lib/store";
import { PageShell, Button, TextArea } from "@/components";

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
    <PageShell title="New entry">
      <form onSubmit={onSubmit} className="mt-6">
        <TextArea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          placeholder="What's on your mind today?"
          disabled={isSubmitting}
          error={error ?? undefined}
        />

        <div className="mt-4 flex gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
          <Link href="/">
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </PageShell>
  );
}
