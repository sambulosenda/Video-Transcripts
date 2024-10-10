"use client";
import React, { useState } from "react";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Play,
  ArrowRight,
  Video,
  FileText,
  Clock,
  Globe,
  Menu,
  Check,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default function LandingPage() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      label: "Features",
      href: "/features",
      subItems: [
        { label: "Transcription", href: "/features/transcription" },
        { label: "Translation", href: "/features/translation" },
        { label: "Subtitles", href: "/features/subtitles" },
      ],
    },
    { label: "Pricing", href: "/pricing" },
    { label: "Resources", href: "/resources" },
  ];

  const benefits = [
    "Free trial with no credit card required",
    "Accurate transcriptions in minutes",
    "Support for multiple languages",
    "Easy-to-use interface",
  ];

  const features = [
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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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

            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    {item.subItems ? (
                      <>
                        <NavigationMenuTrigger className="text-base font-medium">
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            {item.subItems.map((subItem) => (
                              <li key={subItem.href}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={subItem.href}
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  >
                                    <div className="text-sm font-medium leading-none">
                                      {subItem.label}
                                    </div>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className="text-base font-medium px-4 py-2 hover:text-accent-foreground transition-colors"
                        >
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/sign-in"
                className="text-base font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Log In
              </Link>
              <Link href="/sign-up" passHref>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-base">
                  Get Started
                </Button>
              </Link>
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open main menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-6">
                  {navItems.map((item) => (
                    <div key={item.href}>
                      <Link
                        href={item.href}
                        className="text-xl font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                      {item.subItems && (
                        <ul className="ml-4 mt-2 space-y-2">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.href}>
                              <Link
                                href={subItem.href}
                                className="text-base text-gray-600 hover:text-indigo-600 transition-colors"
                                onClick={() => setIsOpen(false)}
                              >
                                {subItem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                  <Link
                    href="/sign-in"
                    className="text-xl font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/sign-up"
                    passHref
                    onClick={() => setIsOpen(false)}
                  >
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-base">
                      Get Started
                    </Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-left space-y-8">
                <div>
                  <h2 className="inline-block px-4 py-2 rounded-full bg-blue-500 bg-opacity-50 text-sm font-semibold tracking-wide uppercase mb-4">
                    AI-Powered Transcription
                  </h2>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                    Convert Video to Text in Minutes
                  </h1>
                </div>
                <p className="text-xl sm:text-2xl text-blue-100">
                  Transcribe your videos quickly and accurately with our
                  cutting-edge AI platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="px-8 py-6 text-lg font-semibold text-blue-600 bg-white border-2 border-white rounded-full hover:bg-blue-600 hover:text-white transition-colors duration-300"
                  >
                    Start Transcribing Now
                    <ArrowRight
                      className="ml-2 -mr-1 h-5 w-5 inline"
                      aria-hidden="true"
                    />
                  </Button>
                  <Button
                    variant="outline"
                    className="px-8 py-6 text-lg font-semibold text-white bg-blue-600 bg-opacity-50 border-2 border-white rounded-full transition-colors duration-300 ease-in-out"
                    size="lg"
                  >
                    Watch Demo
                    <Play
                      className="ml-2 -mr-1 h-5 w-5 inline"
                      aria-hidden="true"
                    />
                  </Button>
                </div>
                <p className="text-base text-white font-medium bg-blue-500 bg-opacity-50 px-4 py-2 rounded-full inline-block">
                  No credit card required | Free trial available
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 bg-opacity-50 backdrop-blur-md rounded-2xl transform rotate-3"></div>
                <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="aspect-w-16 aspect-h-9">
                    <Image
                      src="/transcript.png"
                      alt="Video transcription preview"
                      width={1280}
                      height={720}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play
                        className="h-16 w-16 text-white opacity-75"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-sm font-semibold tracking-wide uppercase text-indigo-600">
                Features
              </h2>
              <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-gray-900">
                Why Choose Audioscriber?
              </h3>
              <p className="max-w-2xl mx-auto text-xl text-gray-600">
                Experience the power of AI-driven transcription with our
                cutting-edge features.
              </p>
            </div>
            <div className="grid mx-auto gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-colors duration-300 hover:border-indigo-300 group"
                >
                  <div className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200 transition-colors duration-300">
                        <feature.icon className="w-6 h-6" aria-hidden="true" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div className="space-y-8 text-left">
                <div className="space-y-4">
                  <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-gray-900">
                    Ready to start transcribing?
                  </h2>
                  <p className="text-xl text-gray-600">
                    Join thousands of users who trust Go Transcribe for their
                    video-to-text needs. Experience the power of AI-driven
                    transcription today.
                  </p>
                </div>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Check
                        className="h-5 w-5 text-indigo-500 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <SignUpButton mode="modal">
                  <Button className="inline-flex items-center justify-center rounded-md text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-indigo-600 text-white hover:bg-indigo-700 h-12 px-8 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Get started for free
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Button>
                </SignUpButton>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative p-8 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex flex-col items-start justify-start space-y-6 shadow-2xl">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-slate-800">
                      Get started in seconds
                    </h3>
                    <p className="text-slate-600">
                      Our intuitive interface makes it easy to upload your video
                      and get accurate transcriptions quickly.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 group-hover:bg-indigo-50 transition-colors"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Audioscriber</h3>

              <p className="text-gray-400">
                Audioscriber leverages cutting-edge AI technology to provide
                accurate, efficient, and affordable video transcription
                services. Whether you're a content creator, journalist, or
                business professional, our platform streamlines your workflow,
                making it easier to create subtitles, generate searchable
                content, and improve accessibility. With support for multiple
                languages and formats, Audioscriber is your go-to solution for
                all your transcription needs.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  { href: "/features", text: "Features" },
                  { href: "/pricing", text: "Pricing" },
                  { href: "/about", text: "About Us" },
                  { href: "/contact", text: "Contact" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                {[
                  { href: "/privacy", text: "Privacy Policy" },
                  { href: "/terms", text: "Terms of Service" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Go Transcribe. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
