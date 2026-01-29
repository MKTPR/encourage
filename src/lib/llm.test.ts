import { describe, it, expect } from "vitest";
import { generateReflection } from "./llm";
import { ReflectionSchema } from "./reflectionSchema";

describe("generateReflection", () => {
  it("returns valid JSON that passes schema validation on attempt 1", async () => {
    const content = "Today was a challenging day at work.";
    const rawOutput = await generateReflection(content, 1);

    // Should be valid JSON
    const parsed = JSON.parse(rawOutput);
    expect(parsed).toBeDefined();

    // Should pass Zod validation
    const result = ReflectionSchema.safeParse(parsed);
    expect(result.success).toBe(true);
  });

  it("returns valid JSON that passes schema validation on attempt 2 (stricter)", async () => {
    const content = "I felt anxious about the presentation.";
    const rawOutput = await generateReflection(content, 2);

    const parsed = JSON.parse(rawOutput);
    const result = ReflectionSchema.safeParse(parsed);
    expect(result.success).toBe(true);
  });

  it("includes content snippet in the response", async () => {
    const content = "My unique journal entry about gardening";
    const rawOutput = await generateReflection(content, 1);

    const parsed = JSON.parse(rawOutput);
    // The mock includes a snippet of the content in core_thought
    expect(parsed.core_thought).toContain("My unique journal");
  });

});
