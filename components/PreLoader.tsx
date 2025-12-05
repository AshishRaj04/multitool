"use client";

import { useState, useEffect } from "react";

export default function PreLoader() {
  const [visible, setVisible] = useState(true);
  const [lines, setLines] = useState<string[]>([]);

  const bootSequence = [
    "INITIALIZING MODULES...",
    "LOADING ADS...",
    "STEALING COOKIES...",
    "CALIBRATING FLUX CAPACITOR...",
    "OK",
  ];

  useEffect(() => {
    let currentLine = 0;

    const interval = setInterval(() => {
      if (currentLine < bootSequence.length) {
        setLines((prev) => [...prev, bootSequence[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => setVisible(false), 500);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[var(--color-neo-black)] flex items-center justify-center">
      <div className="font-mono text-[var(--color-neo-yellow)] text-lg md:text-xl max-w-md p-8">
        <div className="mb-4 text-2xl font-bold">MULTITOOL v1.0.0</div>
        <div className="border-b border-[var(--color-neo-yellow)] mb-4 opacity-50"></div>
        {lines.map((line, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <span className="text-[var(--color-neo-pink)]">&gt;</span>
            <span
              className={
                index === lines.length - 1 && line === "OK"
                  ? "text-green-400"
                  : ""
              }
            >
              {line}
            </span>
          </div>
        ))}
        {lines.length < bootSequence.length && (
          <span className="animate-pulse">█</span>
        )}
      </div>
    </div>
  );
}
