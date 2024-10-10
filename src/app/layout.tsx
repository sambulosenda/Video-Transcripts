import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AudioScriber | AI-Powered Audio Transcription Service",
  description:
    "Transform your audio and video content into accurate, editable text with AudioScriber. Our AI-powered transcription service offers fast, reliable results for podcasts, interviews, and more.",
  keywords: [
    "audio transcription",
    "video transcription",
    "AI transcription",
    "speech to text",
    "podcast transcription",
  ],
  authors: [{ name: "Your Company Name" }],
  openGraph: {
    title: "AudioScriber | AI-Powered Audio Transcription",
    description:
      "Convert audio and video to text quickly and accurately with AudioScriber.",
    url: "https://www.audioscriber.com",
    siteName: "AudioScriber",
    images: [
      {
        url: "https://www.audioscriber.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AudioScriber - AI Transcription Service",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AudioScriber | AI-Powered Audio Transcription",
    description:
      "Convert audio and video to text quickly and accurately with AudioScriber.",
    images: ["https://www.audioscriber.com/twitter-image.jpg"],
    creator: "@AudioScriber",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  viewport: "width=device-width, initial-scale=1.0",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
