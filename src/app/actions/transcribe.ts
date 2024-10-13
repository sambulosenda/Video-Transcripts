"use server";

// import { createOpenAI } from "@ai-sdk/openai";

// const groq = createOpenAI({
//   baseURL: "https://api.groq.com/openai/v1",
//   apiKey: process.env.GROQ_API_KEY,
// });

interface TranscriptionResult {
  text: string;
  segments?: Array<{
    text: string;
    start: number;
    end: number;
  }>;
}

export async function transcribe(
  formData: FormData
): Promise<TranscriptionResult> {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file provided");
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Transcription request failed: ${response.status} ${response.statusText}. ${errorBody}`
      );
    }

    const result = await response.json();

    console.log("Transcription API response:", result); // Add this line for debugging

    if (!result || typeof result.text !== "string") {
      throw new Error("Unexpected response format: missing or invalid 'text' field");
    }

    return {
      text: result.text,
      segments: Array.isArray(result.segments) ? result.segments : undefined,
    };
  } catch (error) {
    console.error("Error in transcribe action:", error);
    throw error;
  }
}
