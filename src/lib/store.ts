import { JournalEntry } from "./types";

const LS_KEY = "encourage_entries_v1";

// Cache for stable references (required by useSyncExternalStore)
let cachedRaw: string | null = null;
let cachedEntries: JournalEntry[] = [];

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function getEntries(): JournalEntry[] {
  if (typeof window === "undefined") return cachedEntries;
  const raw = window.localStorage.getItem(LS_KEY);

  // Return cached if unchanged (stable reference for useSyncExternalStore)
  if (raw === cachedRaw) return cachedEntries;

  const entries = safeParse<JournalEntry[]>(raw, []);
  entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  cachedRaw = raw;
  cachedEntries = entries;
  return cachedEntries;
}

export function getEntry(id: string): JournalEntry | undefined {
  return getEntries().find((e) => e.id === id);
}

export function addEntry(content: string): JournalEntry {
  if (typeof window === "undefined") {
    throw new Error("addEntry must be called in the browser");
  }
  const now = new Date().toISOString();
  const entry: JournalEntry = {
    id: crypto.randomUUID(),
    createdAt: now,
    content: content.trim(),
  };
  const next = [entry, ...getEntries()];
  window.localStorage.setItem(LS_KEY, JSON.stringify(next));
  return entry;
}
