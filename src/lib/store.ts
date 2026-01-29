import { JournalEntry } from "./types";
import { Reflection } from "./reflectionSchema";

const LS_KEY = "encourage_entries_v1";
const REFLECTIONS_KEY = "encourage_reflections_v1";

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

// --- Reflection persistence ---

function getReflectionsMap(): Record<string, Reflection> {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(REFLECTIONS_KEY);
  return safeParse<Record<string, Reflection>>(raw, {});
}

export function getReflection(entryId: string): Reflection | undefined {
  return getReflectionsMap()[entryId];
}

export function saveReflection(entryId: string, reflection: Reflection): void {
  if (typeof window === "undefined") {
    throw new Error("saveReflection must be called in the browser");
  }
  const map = getReflectionsMap();
  map[entryId] = reflection;
  window.localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(map));
}
