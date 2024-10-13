"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, FileText, Clock, Lock, Zap, Layers, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <Link
          href="/"
          className="flex items-center space-x-2 transition-transform hover:scale-105"
        >
          <div className="relative w-8 h-8">
            <Image
              src="/logo-blue.png"
              alt="AudioScriber"
              layout="fill"
              objectFit="contain"
              className="rounded-full"
            />
          </div>
          <span className="text-xl font-semibold text-gray-900">
            Audioscriber
          </span>
        </Link>
        <nav className="hidden md:flex gap-4 sm:gap-6">
          <Link href="/sign-up" passHref>
            <Button
              variant="outline"
              className="border-black dark:border-white text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Log in
            </Button>
          </Link>
        </nav>
        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 p-4">
          <nav className="flex flex-col gap-4">
            <Link href="/sign-up" passHref>
              <Button
                variant="outline"
                className="border-black dark:border-white text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Button>
            </Link>
          </nav>
        </div>
      )}

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 text-center">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none max-w-3xl mx-auto">
                Transform Your Audio & Video with AI-Powered Transcription
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Accurate, fast, and effortless transcription for creators,
                businesses, and researchers.
              </p>
              <div className="space-x-4">
                <Link href="/sign-up" passHref>
                  <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
                    Start Transcribing
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-black dark:border-white text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Powerful Transcription Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {[
                {
                  icon: Mic,
                  title: "Advanced Speech Recognition",
                  description:
                    "State-of-the-art AI for unparalleled accuracy across accents and languages",
                },
                {
                  icon: FileText,
                  title: "Multi-Format Support",
                  description:
                    "Transcribe audio and video in various formats, from MP3 to MP4 and beyond",
                },
                {
                  icon: Clock,
                  title: "Lightning-Fast Results",
                  description:
                    "Get your transcripts in minutes, not hours, without compromising on quality",
                },
                {
                  icon: Lock,
                  title: "Bank-Grade Security",
                  description:
                    "Your files and transcripts are encrypted and protected at all times",
                },
                {
                  icon: Zap,
                  title: "Automated Timestamps",
                  description:
                    "Easy navigation with precise timestamps for every section of your transcript",
                },
                {
                  icon: Layers,
                  title: "Custom Vocabulary",
                  description:
                    "Teach our AI your industry-specific terms for even greater accuracy",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center max-w-sm"
                >
                  <feature.icon className="h-12 w-12 mb-4 text-black dark:text-white" />
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold">Start Transcribing Today</h2>
              <p className="max-w-[600px] text-gray-600 dark:text-gray-300">
                Join thousands of professionals using TranscribeAI to save time
                and unlock the potential of their audio and video content.
              </p>
              <div className="w-full max-w-sm space-y-2">
                <Link href="/sign-up" passHref>
                  <Button className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
                    Sign up for free
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full border-black dark:border-white text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  View pricing
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 py-8 mx-auto">
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-300">
            <p>&copy; 2024 TranscribeAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <Button
        className="fixed bottom-4 right-4 bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </Button>
    </div>
  );
}
