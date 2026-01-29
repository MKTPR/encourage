import { z } from "zod";

export const ReflectionSchema = z.object({
  emotion: z.string().min(1, "emotion is required"),
  core_thought: z.string().min(1, "core_thought is required"),
  reframe: z.string().min(1, "reframe is required"),
  one_action: z.string().min(1, "one_action is required"),
});

export type Reflection = z.infer<typeof ReflectionSchema>;
