"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Upload,
  Download,
  RefreshCw,
  Copy,
  Check,
  File,
  X,
} from "lucide-react";
import { transcribe } from "@/app/actions/transcribe";
import { convertToSRT, convertToVTT } from "@/utils/transcriptionFormats";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useUser } from "@clerk/nextjs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let FFmpeg: any;

interface Transcripts {
  txt: string;
  srt: string;
  vtt: string;
}

interface FileSelectionProps {
  fileSize: number;
  onRemove: () => void;
}

const FileSelection: React.FC<FileSelectionProps> = ({
  fileSize,
  onRemove,
}) => {
  const maxSize = 25 * 1024 * 1024; // 25MB in bytes
  const sizePercentage = (fileSize / maxSize) * 100;

  return (
    <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-between">
      <div className="flex items-center">
        <File className="h-16 w-16 text-indigo-500 mr-4" />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">File selected</h3>
          <div className="mt-2 w-48 bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{ width: `${sizePercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {(fileSize / (1024 * 1024)).toFixed(2)} MB / 25 MB
          </p>
        </div>
      </div>
      <button
        onClick={onRemove}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-6 w-6" />
      </button>
    </div>
  );
};

export default function DashboardPage() {
  const { isSignedIn, user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<Transcripts | null>(null);
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false);
  const [transcribedText, setTranscribedText] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [trialUsage, setTrialUsage] = useState(0);
  const [hasActiveTrial, setHasActiveTrial] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    import("@ffmpeg/ffmpeg").then((FFmpegModule) => {
      FFmpeg = FFmpegModule.FFmpeg;
      setFFmpegLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      checkTrialStatus();
    }
  }, [isSignedIn]);

  const checkTrialStatus = async () => {
    try {
      const response = await fetch("/api/trial");
      const data = await response.json();
      setTrialUsage(data.transcriptsUsed);
      setHasActiveTrial(data.hasActiveTrial);
    } catch (error) {
      console.error("Error checking trial status:", error);
      setError("Failed to check trial status");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      if (uploadedFile.size > 25 * 1024 * 1024) {
        setError("File size exceeds 25MB limit. Please choose a smaller file.");
        return;
      }
      setFile(uploadedFile);
      setError(null);
      setTranscripts(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile &&
      (droppedFile.type.startsWith("video/") ||
        droppedFile.type.startsWith("audio/"))
    ) {
      if (droppedFile.size > 25 * 1024 * 1024) {
        setError("File size exceeds 25MB limit. Please choose a smaller file.");
        return;
      }
      setFile(droppedFile);
      setError(null);
      setTranscripts(null);
    } else {
      setError("Please upload a valid video or audio file.");
    }
  };

  const processFile = async () => {
    if (!file || !FFmpeg || !ffmpegLoaded || !hasActiveTrial) return;

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

      await ffmpeg.writeFile("input", await fetchFile(file));

      setProgress(20);

      const isAudio = file.type.startsWith("audio/");
      if (isAudio) {
        await ffmpeg.exec([
          "-i",
          "input",
          "-acodec",
          "pcm_s16le",
          "-ar",
          "16000",
          "-ac",
          "1",
          "output.wav",
        ]);
      } else {
        await ffmpeg.exec([
          "-i",
          "input",
          "-vn",
          "-acodec",
          "pcm_s16le",
          "-ar",
          "16000",
          "-ac",
          "1",
          "output.wav",
        ]);
      }

      setProgress(40);

      const audioData = await ffmpeg.readFile("output.wav");
      const audioBlob = new Blob([audioData], { type: "audio/wav" });

      const formData = new FormData();
      formData.append("file", audioBlob, "audio.wav");
      formData.append("model", "whisper-large-v3");

      setProgress(50);

      const transcriptionResult = await transcribe(formData);

      setProgress(75);

      const transcribedText = transcriptionResult.text;
      const segments = transcriptionResult.segments || [];

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

      // Update trial usage
      const trialResponse = await fetch("/api/trial", { method: "PUT" });
      const trialData = await trialResponse.json();
      setTrialUsage(trialData.transcriptsUsed);
      setHasActiveTrial(trialData.hasActiveTrial);

      setProgress(100);
    } catch (err) {
      console.error(err);
      setError("An error occurred during processing. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTranscript = (format: keyof Transcripts) => {
    if (!transcripts || !file) return;

    const content = transcripts[format];
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const originalFileName = file.name.split(".").slice(0, -1).join(".");
    const downloadFileName = `${originalFileName}_transcript.${format}`;
    a.download = downloadFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetApp = () => {
    setFile(null);
    setTranscripts(null);
    setError(null);
    setProgress(0);
  };

  const copyTranscribedText = async () => {
    if (transcribedText) {
      try {
        await navigator.clipboard.writeText(transcribedText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };

  if (!hasActiveTrial) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Trial Expired</h2>
          <p className="mb-4">
            Your trial has expired. Please upgrade to continue using the
            service.
          </p>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Upgrade Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white shadow-md rounded-lg p-8">
            <h1 className="text-2xl font-bold mb-4">
              Welcome, {user?.firstName}!
            </h1>
            <p className="text-md mb-6">
              Transcriptions remaining: {3 - trialUsage}
            </p>
            {!file ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition duration-300"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-20 w-20 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Drag and drop your video or audio file here
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  or click to browse your device
                </p>
                <p className="text-xs text-gray-400">
                  MP4, MOV, MP3, WAV, or M4A up to 25MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="video/*,audio/*"
                  onChange={handleFileUpload}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <FileSelection
                  fileSize={file.size}
                  onRemove={() => setFile(null)}
                />
                <Button
                  onClick={processFile}
                  className="w-full text-white font-semibold py-3 px-6 rounded-full transition duration-300 ease-in-out flex items-center justify-center bg-indigo-600 hover:bg-indigo-700"
                  disabled={!ffmpegLoaded || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="animate-spin mr-2 h-5 w-5" />
                      Processing...
                    </>
                  ) : ffmpegLoaded ? (
                    "Start Transcription"
                  ) : (
                    "Loading FFmpeg..."
                  )}
                </Button>
              </div>
            )}
            {isProcessing && (
              <div className="mt-6 bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Transcription Progress
                </h2>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                        {progress < 100 ? "In Progress" : "Complete"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-teal-600">
                        {progress}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-teal-200">
                    <div
                      style={{ width: `${progress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500 transition-all duration-500 ease-in-out"
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    {progress < 40
                      ? "Extracting audio..."
                      : progress < 75
                      ? "Transcribing your file..."
                      : progress < 100
                      ? "Generating transcript files..."
                      : "Transcription complete!"}
                  </p>
                </div>
              </div>
            )}
            {transcripts && (
              <div className="mt-6 space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 shadow-inner">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Transcription Result
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyTranscribedText}
                      className="text-gray-600 hover:bg-gray-100"
                    >
                      {isCopied ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  <div className="bg-white rounded-lg p-4 max-h-60 overflow-y-auto shadow-sm">
                    <p className="text-gray-700 leading-relaxed">
                      {transcribedText}
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-4 justify-center">
                    {(["txt", "vtt", "srt"] as const).map((format) => (
                      <Button
                        key={format}
                        onClick={() => downloadTranscript(format)}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300 ease-in-out flex items-center"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {format.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                  <Button
                    onClick={resetApp}
                    className="w-full text-white font-semibold py-3 px-6 rounded-full transition duration-300 ease-in-out flex items-center justify-center bg-indigo-600 hover:bg-indigo-700"
                  >
                    <RefreshCw className="mr-2 h-5 w-5" />
                    New Transcription
                  </Button>
                </div>
              </div>
            )}
            {error && (
              <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
                <AlertCircle className="mr-3 h-5 w-5 flex-shrink-0" />
                <p className="text-sm flex-grow">{error}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
