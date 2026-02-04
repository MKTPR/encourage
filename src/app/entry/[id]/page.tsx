"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useEntry } from "@/lib/hooks";
import { getReflection, saveReflection } from "@/lib/store";
import { Reflection } from "@/lib/reflectionSchema";
import { PageShell, Button, Card, ErrorBanner, Spinner, EmptyState } from "@/components";

export default function EntryDetailPage() {
  const params = useParams<{ id: string }>();
  const entry = useEntry(params.id);

  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  if (!entry) {
    return (
      <PageShell title="Entry not found">
        <EmptyState
          title="This entry doesn't exist or may have been deleted."
          action={
            <Button href="/" variant="secondary">
              Back to Home
            </Button>
          }
        />
      </PageShell>
    );
  }

  return (
    <PageShell backLink={{ href: "/", label: "Back to Home" }}>
      <article className="mt-6">
        <time className="text-sm text-text-muted">
          {new Date(entry.createdAt).toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </time>

        <div className="mt-4 whitespace-pre-wrap text-text-secondary leading-relaxed">{entry.content}</div>
      </article>

      <section className="mt-10">
        <h2 className="text-sm font-medium text-text-muted mb-4">Reflection</h2>

        {error && (
          <div className="mb-4">
            <ErrorBanner
              message={error}
              action={
                <button
                  onClick={handleGenerateReflection}
                  disabled={isLoading}
                  className="text-sm text-error hover:underline"
                >
                  Try again
                </button>
              }
            />
          </div>
        )}

        {isLoading && (
          <Card className="bg-muted">
            <Spinner message="Generating reflection..." />
          </Card>
        )}

        {reflection && !isLoading && (
          <Card className="space-y-4">
            <div>
              <h3 className="text-xs font-medium text-text-muted uppercase tracking-wide">Emotion</h3>
              <p className="mt-1 text-text-secondary">{reflection.emotion}</p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-text-muted uppercase tracking-wide">Core Thought</h3>
              <p className="mt-1 text-text-secondary">{reflection.core_thought}</p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-text-muted uppercase tracking-wide">Reframe</h3>
              <p className="mt-1 text-text-secondary">{reflection.reframe}</p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-text-muted uppercase tracking-wide">One Action</h3>
              <p className="mt-1 text-text-secondary">{reflection.one_action}</p>
            </div>

            <button
              onClick={handleGenerateReflection}
              disabled={isLoading}
              className="mt-4 text-sm text-text-muted hover:text-text-secondary underline transition-colors"
            >
              Regenerate
            </button>
          </Card>
        )}

        {!reflection && !isLoading && !error && (
          <Card variant="dashed">
            <p className="text-sm text-text-muted mb-4">Get an AI-assisted reflection on your journal entry.</p>
            <Button onClick={handleGenerateReflection} disabled={isLoading}>
              Generate Reflection
            </Button>
          </Card>
        )}
      </section>
    </PageShell>
  );
}
