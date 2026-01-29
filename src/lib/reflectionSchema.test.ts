import { describe, it, expect } from "vitest";
import { ReflectionSchema } from "./reflectionSchema";

describe("ReflectionSchema", () => {
  it("accepts a valid reflection with all required fields", () => {
    const valid = {
      emotion: "hopeful",
      core_thought: "I realized I can handle challenges",
      reframe: "Difficulties are opportunities for growth",
      one_action: "Take a 10-minute walk today",
    };

    const result = ReflectionSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(valid);
    }
  });

  it("rejects when a required field is missing", () => {
    const missingField = {
      emotion: "anxious",
      core_thought: "Work has been stressful",
      // missing: reframe
      one_action: "Practice deep breathing",
    };

    const result = ReflectionSchema.safeParse(missingField);
    expect(result.success).toBe(false);
  });

  it("rejects when a field is an empty string", () => {
    const emptyField = {
      emotion: "",
      core_thought: "Something happened",
      reframe: "It will be okay",
      one_action: "Rest",
    };

    const result = ReflectionSchema.safeParse(emptyField);
    expect(result.success).toBe(false);
  });

  it("rejects when a field has wrong type", () => {
    const wrongType = {
      emotion: 123,
      core_thought: "A thought",
      reframe: "A reframe",
      one_action: "An action",
    };

    const result = ReflectionSchema.safeParse(wrongType);
    expect(result.success).toBe(false);
  });

  it("accepts extra fields but strips them", () => {
    const withExtra = {
      emotion: "calm",
      core_thought: "Life is good",
      reframe: "Appreciate the moment",
      one_action: "Smile",
      extra_field: "should be ignored",
    };

    const result = ReflectionSchema.safeParse(withExtra);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty("extra_field");
    }
  });
});
