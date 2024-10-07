export function convertToSRT(transcription: string): string {
  // Implement SRT conversion logic here
  // This is a placeholder implementation
  return `1\n00:00:00,000 --> 00:00:05,000\n${transcription}`;
}

export function convertToVTT(transcription: string): string {
  // Implement VTT conversion logic here
  // This is a placeholder implementation
  return `WEBVTT\n\n00:00:00.000 --> 00:00:05.000\n${transcription}`;
}
