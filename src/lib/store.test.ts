import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock localStorage before importing store
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Set up global window with localStorage mock
vi.stubGlobal("window", { localStorage: localStorageMock });
vi.stubGlobal("localStorage", localStorageMock);

// Now import store (after mocks are set up)
const { getEntries, getEntry, addEntry, getReflection, saveReflection } = await import("./store");

describe("store", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe("getEntries", () => {
    it("returns empty array when localStorage is empty", () => {
      const entries = getEntries();
      expect(entries).toEqual([]);
    });

    it("returns empty array when localStorage contains invalid JSON", () => {
      localStorageMock.setItem("encourage_entries_v1", "not valid json {{{");
      const entries = getEntries();
      expect(entries).toEqual([]);
    });

    it("returns entries sorted by createdAt descending (newest first)", () => {
      const stored = [
        { id: "1", createdAt: "2024-01-01T10:00:00Z", content: "First" },
        { id: "2", createdAt: "2024-01-03T10:00:00Z", content: "Third" },
        { id: "3", createdAt: "2024-01-02T10:00:00Z", content: "Second" },
      ];
      localStorageMock.setItem("encourage_entries_v1", JSON.stringify(stored));

      const entries = getEntries();
      expect(entries[0].id).toBe("2"); // newest
      expect(entries[1].id).toBe("3");
      expect(entries[2].id).toBe("1"); // oldest
    });
  });

  describe("getEntry", () => {
    it("returns undefined for non-existent entry", () => {
      const entry = getEntry("non-existent-id");
      expect(entry).toBeUndefined();
    });

    it("returns the correct entry by id", () => {
      const stored = [
        { id: "abc", createdAt: "2024-01-01T10:00:00Z", content: "Test" },
      ];
      localStorageMock.setItem("encourage_entries_v1", JSON.stringify(stored));

      const entry = getEntry("abc");
      expect(entry).toBeDefined();
      expect(entry?.content).toBe("Test");
    });
  });

  describe("addEntry", () => {
    it("returns a valid entry object with id, createdAt, and trimmed content", () => {
      const entry = addEntry("  Hello world  ");

      expect(entry.id).toBeDefined();
      expect(entry.id.length).toBeGreaterThan(0);
      expect(entry.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/); // ISO format
      expect(entry.content).toBe("Hello world"); // trimmed
    });

    it("persists the entry to localStorage", () => {
      const entry = addEntry("Persisted content");

      const stored = JSON.parse(localStorageMock.getItem("encourage_entries_v1") || "[]");
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe(entry.id);
    });

    it("prepends new entries (newest first)", () => {
      addEntry("First entry");
      addEntry("Second entry");

      const entries = getEntries();
      expect(entries[0].content).toBe("Second entry");
      expect(entries[1].content).toBe("First entry");
    });
  });

  describe("reflection persistence", () => {
    it("returns undefined for non-existent reflection", () => {
      const reflection = getReflection("no-such-entry");
      expect(reflection).toBeUndefined();
    });

    it("saves and retrieves a reflection", () => {
      const reflection = {
        emotion: "grateful",
        core_thought: "Good day",
        reframe: "Appreciate small wins",
        one_action: "Say thank you",
      };

      saveReflection("entry-123", reflection);
      const retrieved = getReflection("entry-123");

      expect(retrieved).toEqual(reflection);
    });

    it("handles invalid JSON in reflections storage gracefully", () => {
      localStorageMock.setItem("encourage_reflections_v1", "broken json");
      const reflection = getReflection("any-id");
      expect(reflection).toBeUndefined();
    });
  });
});
