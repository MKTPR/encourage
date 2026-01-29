/**
 * Typed environment configuration.
 * Reads from process.env with sensible defaults for local development.
 */

export type AIProvider = "mock" | "openai";

export const env = {
  /** Public app name displayed in UI */
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? "Encourage",

  /** AI provider to use for reflections */
  AI_PROVIDER: (process.env.AI_PROVIDER ?? "mock") as AIProvider,

  /** OpenAI API key (required when AI_PROVIDER is "openai") */
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
} as const;

/**
 * Validate that required env vars are set for the current provider.
 * Call this at app startup when using real providers.
 */
export function validateEnv(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (env.AI_PROVIDER === "openai" && !env.OPENAI_API_KEY) {
    errors.push("OPENAI_API_KEY is required when AI_PROVIDER is 'openai'");
  }

  return { valid: errors.length === 0, errors };
}
