/**
 * Mock LLM generator for reflections.
 * This will be replaced with a real provider later.
 */

// Simulated delay to mimic real API call
const MOCK_DELAY_MS = 800;

/**
 * Generate a reflection for the given journal entry content.
 * @param content - The journal entry text
 * @param attempt - The attempt number (1 = first try, 2 = retry with stricter generation)
 * @returns A JSON string matching the Reflection schema
 */
export async function generateReflection(content: string, attempt: number): Promise<string> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  // Extract a snippet for personalization
  const snippet = content.slice(0, 50).replace(/\s+/g, " ").trim();

  // On attempt 2, return a strictly formatted response (no extra whitespace)
  if (attempt >= 2) {
    return JSON.stringify({
      emotion: "reflective",
      core_thought: `You shared: "${snippet}..."`,
      reframe: "Every experience offers an opportunity for growth and self-understanding.",
      one_action: "Take 5 minutes today to sit quietly and reflect on what matters most to you.",
    });
  }

  // Attempt 1: return a valid response (could simulate failure here for testing)
  return JSON.stringify({
    emotion: "thoughtful",
    core_thought: `You expressed: "${snippet}..."`,
    reframe: "Consider how this moment contributes to your personal journey.",
    one_action: "Write down one thing you're grateful for related to this experience.",
  });
}
