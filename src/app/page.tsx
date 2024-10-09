'use client'

import React, { useState } from "react";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Video,
  FileText,
  Clock,
  Globe,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl sm:text-2xl font-bold text-indigo-600">
                Go Transcrib
              </span>
            </div>
            {/* Desktop menu */}
            <div className="hidden sm:flex items-center space-x-4">
              <Link href="/sign-up">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Sign Up
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Log In
                </Button>
              </Link>
            </div>
            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu, show/hide based on menu state */}
        <div className={`sm:hidden ${isMenuOpen ? "block" : "hidden"}`}>
          <div className="px-2 pt-2 pb-3 space-y-2">
            {" "}
            {/* Changed space-y-1 to space-y-2 */}
            <Link href="/sign-up" className="block w-full">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                Sign Up
              </Button>
            </Link>
            <Link href="/sign-in" className="block w-full">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-10 pb-12 px-4 sm:px-6 text-center sm:pt-16 sm:pb-20 lg:pt-32">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight font-extrabold text-gray-900">
          <span className="block">Convert any video format</span>
          <span className="block text-indigo-600">to Text in minutes!</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Have a video recording that you need to convert into text? Go
          Transcribe provides an automated way to transcribe{" "}
          <strong>Video to text</strong> with results back in minutes.
        </p>
        <div className="mt-5 max-w-md mx-auto">
          <Button className="w-full flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 sm:px-8 sm:py-3 md:py-4 md:text-lg md:px-10">
            Get Started
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose Go Transcribe?
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {[
                {
                  icon: Video,
                  title: "Multiple Video Formats",
                  description:
                    "Support for various video formats ensuring compatibility with your content.",
                },
                {
                  icon: Clock,
                  title: "Fast Turnaround",
                  description:
                    "Get your transcriptions back in minutes, not hours or days.",
                },
                {
                  icon: FileText,
                  title: "Accurate Transcriptions",
                  description:
                    "High-quality transcriptions powered by advanced AI technology.",
                },
                {
                  icon: Globe,
                  title: "Multi-language Support",
                  description:
                    "Transcribe videos in multiple languages to reach a global audience.",
                },
              ].map((feature, index) => (
                <div key={index} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white sm:h-12 sm:w-12">
                      <feature.icon
                        className="h-5 w-5 sm:h-6 sm:w-6"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="ml-14 sm:ml-16 text-base sm:text-lg leading-6 font-medium text-gray-900">
                      {feature.title}
                    </p>
                  </dt>
                  <dd className="mt-2 ml-14 sm:ml-16 text-sm sm:text-base text-gray-500">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-12 px-4 sm:py-16 sm:px-6 lg:py-20 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to start transcribing?</span>
            <span className="block">Sign up for Go Transcribe today.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-6 text-indigo-200">
            Join thousands of users who trust Go Transcribe for their
            video-to-text needs.
          </p>
          <SignUpButton mode="modal">
            <Button className="mt-8 w-full sm:w-auto px-5 py-3 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50">
              Get started for free
            </Button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
}
