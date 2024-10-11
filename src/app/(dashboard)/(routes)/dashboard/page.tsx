"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let FFmpeg: any;
interface Transcripts {
  txt: string;
  srt: string;
  vtt: string;
}

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
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

  const processFile = async () => {
    if (!file || !FFmpeg || !ffmpegLoaded) return;

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

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white shadow-md rounded-lg p-8">
            {!file ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition duration-300"
                onClick={() => document.getElementById("file-input")?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const droppedFile = e.dataTransfer.files[0];
                  if (
                    droppedFile &&
                    (droppedFile.type.startsWith("video/") ||
                      droppedFile.type.startsWith("audio/"))
                  ) {
                    handleFileUpload({
                      target: { files: [droppedFile] },
                    } as unknown as React.ChangeEvent<HTMLInputElement>);
                  } else {
                    setError("Please upload a valid video or audio file.");
                  }
                }}
              >
                <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drag and drop your video or audio file here, or click to
                  browse
                </p>
                <p className="text-sm text-gray-500">
                  MP4, MOV, MP3, WAV, or M4A up to 25MB
                </p>
                <div className="flex justify-center mt-10">
                  <Button className="text-white font-semibold py-3 px-6 rounded-full transition duration-300 ease-in-out flex items-center justify-center bg-indigo-600 hover:bg-indigo-700">
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Select file
                  </Button>
                </div>

                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  accept="video/*,audio/*"
                  onChange={handleFileUpload}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-md font-medium text-gray-700">{file.name}</p>
                {isProcessing ? (
                  <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <p className="text-md font-medium text-gray-700">
                      {file.name}
                    </p>
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
                ) : transcripts ? (
                  <div className="space-y-4">
                    <div className="bg-white p-6 mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                          Transcription Result
                        </h2>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyTranscribedText}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          {isCopied ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <Copy className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
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
                ) : (
                  <Button
                    onClick={processFile}
                    className="w-full text-white font-semibold py-3 px-6 rounded-full transition duration-300 ease-in-out flex items-center justify-center bg-indigo-600 hover:bg-indigo-700"
                    disabled={!ffmpegLoaded}
                  >
                    {ffmpegLoaded ? "Start Transcription" : "Loading FFmpeg..."}
                  </Button>
                )}
              </div>
            )}
            {error && (
              <div className="mt-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
                <AlertCircle className="mr-2 h-4 w-4" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
