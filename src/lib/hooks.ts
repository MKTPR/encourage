import { useSyncExternalStore, useCallback } from "react";
import { getEntries, getEntry } from "./store";
import { JournalEntry } from "./types";

const emptyEntries: JournalEntry[] = [];

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function useEntries(): JournalEntry[] {
  return useSyncExternalStore(subscribe, getEntries, () => emptyEntries);
}

export function useEntry(id: string | undefined): JournalEntry | null {
  const getSnapshot = useCallback(
    () => (id ? getEntry(id) ?? null : null),
    [id]
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
