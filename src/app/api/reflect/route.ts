import { NextRequest, NextResponse } from "next/server";
import { generateReflection } from "@/lib/llm";
import { ReflectionSchema } from "@/lib/reflectionSchema";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { entryId, content } = body;

    // Validate input
    if (!entryId || typeof entryId !== "string") {
      return NextResponse.json(
        { error: "entryId is required" },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "content is required" },
        { status: 400 }
      );
    }

    if (content.trim().length < 5) {
      return NextResponse.json(
        { error: "Content is too short (minimum 5 characters)" },
        { status: 400 }
      );
    }

    // Attempt 1
    let rawOutput = await generateReflection(content, 1);
    let reflection = tryParseAndValidate(rawOutput);

    // If failed, retry with stricter generation
    if (!reflection) {
      console.warn("[reflect] Attempt 1 failed, retrying...");
      rawOutput = await generateReflection(content, 2);
      reflection = tryParseAndValidate(rawOutput);
    }

    // If still failed, return error
    if (!reflection) {
      console.error("[reflect] Both attempts failed. Raw output:", rawOutput);
      return NextResponse.json(
        { error: "Unable to generate a valid reflection. Please try again." },
        { status: 500 }
      );
    }

    const duration = Date.now() - startTime;
    console.log(`[reflect] Success for entry ${entryId} in ${duration}ms`);

    return NextResponse.json(reflection);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[reflect] Error after ${duration}ms:`, error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

function tryParseAndValidate(rawOutput: string) {
  try {
    const parsed = JSON.parse(rawOutput);
    return ReflectionSchema.parse(parsed);
  } catch {
    return null;
  }
}
