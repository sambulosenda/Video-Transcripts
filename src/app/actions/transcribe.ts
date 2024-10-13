"use server";

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

    console.log("Sending transcription request to Groq API");
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
    console.log("Transcription API response:", JSON.stringify(result, null, 2));

    if (!result || typeof result.text !== "string") {
      throw new Error(
        "Unexpected response format: missing or invalid 'text' field"
      );
    }

    const transcriptionResult: TranscriptionResult = {
      text: result.text,
      segments: Array.isArray(result.segments) ? result.segments : undefined,
    };

    console.log(
      "Processed transcription result:",
      JSON.stringify(transcriptionResult, null, 2)
    );
    return transcriptionResult;
  } catch (error) {
    console.error("Error in transcribe action:", error);
    throw error;
  }
}
