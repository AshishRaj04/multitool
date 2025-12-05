"use client";

import Link from "next/link";
import NeoCard from "@/components/NeoCard";
import Marquee from "@/components/Marquee";
import PreLoader from "@/components/PreLoader";
import AdSlot from "@/components/AdSlot";

const tools = [
  {
    title: "YouTube Downloader",
    icon: "📥",
    description: "Grab any video in HD",
    status: "READY",
    size: "large" as const,
    href: "/youtube",
  },
  {
    title: "Grammar Check",
    icon: "✍️",
    description: "Fix your mistakes with AI",
    status: "READY",
    size: "large" as const,
    href: "/grammar",
  },
  {
    title: "BG Remover",
    icon: "🎨",
    description: "AI background removal",
    status: "READY",
    size: "medium" as const,
    href: "/remover",
  },
  {
    title: "Image Converter",
    icon: "🖼️",
    description: "PNG, JPG, WebP, SVG",
    status: "COMING_SOON",
    size: "medium" as const,
    href: "#",
  },
  {
    title: "PDF Tools",
    icon: "📄",
    description: "Merge, split, compress",
    status: "COMING_SOON",
    size: "medium" as const,
    href: "#",
  },
  {
    title: "QR Generator",
    icon: "📱",
    description: "Create instant QR codes",
    status: "COMING_SOON",
    size: "medium" as const,
    href: "#",
  },
];

export default function Home() {
  return (
    <>
      <PreLoader />

      <div className="min-h-screen flex flex-col">
        {/* Marquee */}
        <Marquee />

        {/* Header */}
        <header className="p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <h1
              className="text-4xl md:text-6xl font-bold uppercase tracking-tighter"
              style={{ fontFamily: "var(--font-display)" }}
            >
              MULTITOOL
            </h1>
            <p className="font-mono text-sm md:text-base text-gray-600 mt-2">
              // THE UTILITY OS FOR THE INTERNET
            </p>
          </div>
        </header>

        {/* Main Grid */}
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {tools.map((tool, index) => (
                <Link
                  key={index}
                  href={tool.href}
                  className={tool.size === "large" ? "md:col-span-2" : ""}
                >
                  <NeoCard
                    title={tool.title}
                    icon={tool.icon}
                    description={tool.description}
                    status={tool.status}
                    size={tool.size}
                  />
                </Link>
              ))}

              {/* Ad Slot */}
              <AdSlot label="SPONSOR_01" />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 md:p-8 border-t-[3px] border-[var(--color-neo-black)]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-mono text-sm text-gray-500">
              // BUILT WITH CHAOS AND CAFFEINE
            </p>
            <div className="flex gap-4">
              <span className="font-mono text-xs bg-[var(--color-neo-black)] text-white px-3 py-1">
                STATUS: ONLINE
              </span>
              <span className="font-mono text-xs bg-[var(--color-neo-yellow)] text-[var(--color-neo-black)] px-3 py-1 border-2 border-[var(--color-neo-black)]">
                v1.0.0
              </span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
