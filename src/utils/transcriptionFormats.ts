export interface TranscriptionSegment {
  text: string;
  start: number;
  end: number;
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);

  return `${padZero(hours)}:${padZero(minutes)}:${padZero(secs)},${padZero(
    milliseconds,
    3
  )}`;
}

function padZero(num: number, length: number = 2): string {
  return num.toString().padStart(length, "0");
}

export function convertToSRT(input: string | TranscriptionSegment[]): string {
  if (typeof input === "string") {
    // If input is a string, create multiple segments
    const words = input.split(" ");
    const wordsPerSegment = 10;
    const secondsPerWord = 0.5;
    const segments: TranscriptionSegment[] = [];

    for (let i = 0; i < words.length; i += wordsPerSegment) {
      const segmentWords = words.slice(i, i + wordsPerSegment);
      segments.push({
        text: segmentWords.join(" "),
        start: i * secondsPerWord,
        end: (i + segmentWords.length) * secondsPerWord,
      });
    }

    return formatSRT(segments);
  }
  return formatSRT(input);
}
export function convertToVTT(input: string | TranscriptionSegment[]): string {
  if (typeof input === "string") {
    // If input is a string, create a single segment
    const segments = [
      { text: input, start: 0, end: input.split(" ").length * 0.5 },
    ];
    return formatVTT(segments);
  }
  return formatVTT(input);
}

function formatSRT(segments: TranscriptionSegment[]): string {
  let srtContent = "";
  segments.forEach((segment, index) => {
    srtContent += `${index + 1}\n`;
    srtContent += `${formatTime(segment.start)} --> ${formatTime(
      segment.end
    )}\n`;
    srtContent += `${segment.text}\n\n`;
  });
  return srtContent.trim();
}

function formatVTT(segments: TranscriptionSegment[]): string {
  let vttContent = "WEBVTT\n\n";
  segments.forEach((segment) => {
    vttContent += `${formatTime(segment.start).replace(
      ",",
      "."
    )} --> ${formatTime(segment.end).replace(",", ".")}\n`;
    vttContent += `${segment.text}\n\n`;
  });
  return vttContent.trim();
}
