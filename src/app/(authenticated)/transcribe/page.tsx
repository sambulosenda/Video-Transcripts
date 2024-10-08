"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  Upload,
  Download,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import { transcribe } from "@/app/actions/transcribe";
import { convertToSRT, convertToVTT } from "@/utils/transcriptionFormats";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { SignOutButton } from "@clerk/nextjs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let FFmpeg: any;

interface Transcripts {
  txt: string;
  srt: string;
  vtt: string;
}

export default function Page() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<Transcripts | null>(null);
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false);
  const [transcribedText, setTranscribedText] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    import("@ffmpeg/ffmpeg").then((FFmpegModule) => {
      FFmpeg = FFmpegModule.FFmpeg;
      setFFmpegLoaded(true);
    });
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        setError("File size exceeds 25MB limit. Please choose a smaller file.");
        return;
      }
      setVideoFile(file);
      setError(null);
      setTranscripts(null);
    }
  };

  const processVideo = async () => {
    if (!videoFile || !FFmpeg || !ffmpegLoaded) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const ffmpeg = new FFmpeg();
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd";
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
      });

      setProgress(10);

      await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

      setProgress(20);

      await ffmpeg.exec([
        "-i",
        "input.mp4",
        "-vn",
        "-acodec",
        "pcm_s16le",
        "-ar",
        "16000",
        "-ac",
        "1",
        "output.wav",
      ]);

      setProgress(40);

      const data = await ffmpeg.readFile("output.wav");
      const audioBlob = new Blob([data], { type: "audio/wav" });

      const formData = new FormData();
      formData.append("file", audioBlob, "audio.wav");
      formData.append("model", "whisper-large-v3");

      setProgress(50);

      const result = await transcribe(formData);

      setProgress(75);

      const transcribedText = result.text;
      const segments = result.segments || [];

      const srtContent = convertToSRT(
        segments.length > 0 ? segments : transcribedText
      );
      const vttContent = convertToVTT(
        segments.length > 0 ? segments : transcribedText
      );

      setTranscribedText(transcribedText);
      setTranscripts({
        txt: transcribedText,
        srt: srtContent,
        vtt: vttContent,
      });
      setProgress(100);
    } catch (err) {
      console.error(err);
      setError("An error occurred during processing. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTranscript = (format: keyof Transcripts) => {
    if (!transcripts) return;

    const content = transcripts[format];
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcript.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetApp = () => {
    setVideoFile(null);
    setTranscripts(null);
    setError(null);
    setProgress(0);
  };

  const copyTranscribedText = async () => {
    if (transcribedText) {
      try {
        await navigator.clipboard.writeText(transcribedText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset copied state after 2 seconds
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Video Transcription for Content Creators
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!videoFile ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition duration-300"
              onClick={() => document.getElementById("file-input")?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith("video/")) {
                  handleFileUpload({ target: { files: [file] } } as any);
                } else {
                  setError("Please upload a valid video file.");
                }
              }}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop your video file here, or click to browse
              </p>
              <p className="mt-1 text-xs text-gray-500">
                MP4, MOV, or AVI up to 25MB
              </p>
              <input
                id="file-input"
                type="file"
                className="hidden"
                accept="video/*"
                onChange={handleFileUpload}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700">
                Selected file: {videoFile.name}
              </p>
              {isProcessing ? (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-gray-600 text-center">
                    {progress}% -
                    {progress < 40
                      ? "Extracting audio..."
                      : progress < 75
                      ? "Transcribing your video..."
                      : "Generating transcript files..."}
                  </p>
                </div>
              ) : transcripts ? (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-green-600">
                    Transcription complete!
                  </p>
                  <div className="bg-gray-100 p-4 rounded-md h-40 relative">
                    <div className="overflow-y-auto h-full pr-8">
                      <p className="text-sm text-gray-700">{transcribedText}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={copyTranscribedText}
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {(["txt", "srt", "vtt"] as const).map((format) => (
                      <Button
                        key={format}
                        variant="outline"
                        className="w-full"
                        onClick={() => downloadTranscript(format)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download {format.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                  <Button onClick={resetApp} className="w-full mt-4">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Process Another Video
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={processVideo}
                  className="w-full"
                  disabled={!ffmpegLoaded}
                >
                  {ffmpegLoaded ? "Start Transcription" : "Loading FFmpeg..."}
                </Button>
              )}
            </div>
          )}
          {error && (
            <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
              <AlertCircle className="mr-2 h-4 w-4" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
      <SignOutButton>
        <button>My custom button</button>
      </SignOutButton>
    </div>
  );
}
