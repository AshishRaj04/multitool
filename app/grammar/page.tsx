"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function GrammarPage() {
  const [inputText, setInputText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("PROCESSING...");
  const [showSlowWarning, setShowSlowWarning] = useState(false);
  const [error, setError] = useState("");

  // Handle slow server warning
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => {
        setShowSlowWarning(true);
      }, 3000);
    } else {
      setShowSlowWarning(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const fixGrammar = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to fix");
      return;
    }

    setLoading(true);
    setLoadingMessage("CONTACTING_AI...");
    setError("");
    setCorrectedText("");
    setShowSlowWarning(false);

    try {
      setTimeout(() => setLoadingMessage("ANALYZING_TEXT..."), 1000);
      setTimeout(() => setLoadingMessage("FIXING_GRAMMAR..."), 2000);

      const response = await fetch("/api/grammar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("SERVER_OVERLOAD // TRY_AGAIN");
      }

      if (!response.ok) {
        throw new Error(data.error || "SERVER_OVERLOAD // TRY_AGAIN");
      }

      setCorrectedText(data.corrected);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "SERVER_OVERLOAD // TRY_AGAIN"
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(correctedText);
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-block font-mono text-sm mb-4 hover:underline"
          >
            ← BACK_TO_DASHBOARD
          </Link>
          <h1
            className="text-4xl md:text-5xl font-bold uppercase tracking-tighter"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ✍️ GRAMMAR_FIXER
          </h1>
          <p className="font-mono text-sm text-gray-600 mt-2">
            // POWERED BY GEMINI AI • FIX YOUR TEXT BEFORE YOU GET ROASTED
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-white border-[3px] border-[var(--color-neo-pink)] neo-shadow p-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <span className="font-mono text-sm font-bold text-[var(--color-neo-black)]">
                {error}
              </span>
            </div>
            {error.includes("SERVER_OVERLOAD") && (
              <button
                onClick={fixGrammar}
                className="mt-3 font-mono text-xs bg-[var(--color-neo-black)] text-white px-3 py-1 hover:bg-gray-800"
              >
                RETRY_
              </button>
            )}
          </div>
        )}

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Input */}
          <div className="bg-white border-[3px] border-[var(--color-neo-black)] neo-shadow p-6">
            <label className="font-mono text-xs text-gray-500 mb-2 block">
              // INPUT_TEXT
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your text here... we'll fix it for you."
              className="w-full h-64 border-[3px] border-[var(--color-neo-black)] p-4 font-mono text-base resize-none focus:outline-none focus:bg-gray-50"
              disabled={loading}
            />
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-gray-400">
                  {inputText.length} chars
                </span>
                <button
                  onClick={fixGrammar}
                  disabled={loading}
                  className="bg-[var(--color-neo-yellow)] border-[3px] border-[var(--color-neo-black)] neo-shadow px-6 py-3 font-bold uppercase tracking-tight hover:translate-x-[3px] hover:translate-y-[3px] hover:neo-shadow-pressed transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-neo"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {loading ? loadingMessage : "FIX_GRAMMAR →"}
                </button>
              </div>

              {/* Slow server warning */}
              {showSlowWarning && (
                <p className="font-mono text-xs text-gray-500 animate-pulse text-right">
                  // This might take a moment on the free server...
                </p>
              )}
            </div>
          </div>

          {/* Output */}
          <div className="bg-[var(--color-neo-yellow)] border-[3px] border-[var(--color-neo-black)] neo-shadow p-6">
            <div className="flex justify-between items-center mb-2">
              <label className="font-mono text-xs text-gray-600">
                // CORRECTED_OUTPUT
              </label>
              {correctedText && (
                <button
                  onClick={copyToClipboard}
                  className="font-mono text-xs bg-[var(--color-neo-black)] text-white px-3 py-1 hover:bg-gray-800 transition-colors"
                >
                  COPY_
                </button>
              )}
            </div>
            <div className="w-full h-64 border-[3px] border-[var(--color-neo-black)] bg-white p-4 font-mono text-base overflow-auto">
              {loading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="animate-pulse">█</span>
                  <span>{loadingMessage}</span>
                </div>
              ) : correctedText ? (
                <p className="whitespace-pre-wrap">{correctedText}</p>
              ) : (
                <p className="text-gray-400">
                  Corrected text will appear here...
                </p>
              )}
            </div>
            <div className="mt-4">
              <span className="font-mono text-xs text-gray-600">
                {correctedText.length} chars
              </span>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="border-[3px] border-[var(--color-neo-black)] bg-white p-6">
          <h3 className="font-mono text-xs text-gray-500 mb-3">// PRO_TIPS</h3>
          <ul className="font-mono text-sm space-y-2">
            <li>• Works best with English text</li>
            <li>• Fixes spelling, grammar, and punctuation</li>
            <li>• Preserves your original meaning and style</li>
            <li>• Perfect for tweets, emails, and posts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
