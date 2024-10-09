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
  LogOut,
  Home,
  FileText,
  Settings,
  CreditCard,
  Menu,
  X,
} from "lucide-react";
import { transcribe } from "@/app/actions/transcribe";
import { convertToSRT, convertToVTT } from "@/utils/transcriptionFormats";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { UserButton, SignOutButton } from "@clerk/nextjs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let FFmpeg: any;

interface Transcripts {
  txt: string;
  srt: string;
  vtt: string;
}

export default function DashboardPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<Transcripts | null>(null);
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false);
  const [transcribedText, setTranscribedText] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="bg-indigo-800 text-white p-4 flex justify-between items-center md:hidden">
        <h1 className="text-xl font-bold">Go Transcribe</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </Button>
      </header>

      {/* Sidebar */}
      <div
        className={`bg-indigo-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out md:flex md:flex-col z-20`}
      >
        <nav>
          <ul className="space-y-2">
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Transcriptions
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </Button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Desktop Header */}
        <header className="bg-white shadow-sm p-4 hidden md:block">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            <div className="flex items-center space-x-4">
              <UserButton afterSignOutUrl="/" />
              <SignOutButton>
                <Button variant="outline" size="sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </SignOutButton>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">
              Video Transcription
            </h1>

            <div className="bg-white shadow-md rounded-lg p-8">
              {!videoFile ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition duration-300"
                  onClick={() => document.getElementById("file-input")?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file && file.type.startsWith("video/")) {
                      handleFileUpload({
                        target: { files: [file] },
                      } as unknown as React.ChangeEvent<HTMLInputElement>);
                    } else {
                      setError("Please upload a valid video file.");
                    }
                  }}
                >
                  <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Drag and drop your video file here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
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
                    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
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
                            ? "Transcribing your video..."
                            : progress < 100
                            ? "Generating transcript files..."
                            : "Transcription complete!"}
                        </p>
                      </div>
                    </div>
                  ) : transcripts ? (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                        <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                          <h2 className="text-lg font-semibold text-gray-800">
                            Transcription Result
                          </h2>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={copyTranscribedText}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            {isCopied ? (
                              <Check className="h-4 w-4 mr-2 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4 mr-2" />
                            )}
                            {isCopied ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                        <div className="p-3 max-h-60 overflow-y-auto">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {transcribedText}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(["txt", "srt", "vtt"] as const).map((format) => (
                          <Button
                            key={format}
                            variant="outline"
                            size="sm"
                            onClick={() => downloadTranscript(format)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <Download className="mr-1 h-4 w-4" />
                            Download {format.toUpperCase()}
                          </Button>
                        ))}
                      </div>
                      <Button
                        onClick={resetApp}
                        className="w-full bg-black text-white hover:bg-gray-800"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Process Another Video
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={processVideo}
                      className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                      disabled={!ffmpegLoaded}
                    >
                      {ffmpegLoaded
                        ? "Start Transcription"
                        : "Loading FFmpeg..."}
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
    </div>
  );
}
