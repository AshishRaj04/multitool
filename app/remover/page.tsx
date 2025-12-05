"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";

export default function RemoverPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("PROCESSING...");
  const [showSlowWarning, setShowSlowWarning] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

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

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setCurrentFile(file);

    // Show original image
    const reader = new FileReader();
    reader.onload = (e) => setOriginalImage(e.target?.result as string);
    reader.readAsDataURL(file);

    // Process image
    setLoading(true);
    setLoadingMessage("CONTACTING_SERVER...");
    setError("");
    setProcessedImage(null);
    setShowSlowWarning(false);

    try {
      setTimeout(() => setLoadingMessage("UPLOADING_IMAGE..."), 1000);
      setTimeout(() => setLoadingMessage("REMOVING_PIXELS..."), 2500);
      setTimeout(() => setLoadingMessage("AI_PROCESSING..."), 5000);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("SERVER_OVERLOAD // TRY_AGAIN");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "SERVER_OVERLOAD // TRY_AGAIN"
      );
    } finally {
      setLoading(false);
    }
  };

  const retryProcessing = () => {
    if (currentFile) {
      handleFile(currentFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "removed_bg.png";
    link.click();
  };

  const reset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError("");
    setCurrentFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
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
            🎨 BG_REMOVER
          </h1>
          <p className="font-mono text-sm text-gray-600 mt-2">
            // AI-POWERED BACKGROUND REMOVAL • DROP IMAGE → GET TRANSPARENT PNG
          </p>
        </div>

        {/* Upload Area */}
        {!originalImage && (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              border-[4px] border-dashed border-[var(--color-neo-black)]
              bg-white p-12 md:p-20 text-center cursor-pointer
              transition-all
              ${
                dragActive
                  ? "bg-[var(--color-neo-yellow)] border-solid"
                  : "hover:bg-gray-50"
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />
            <div className="text-6xl mb-4">📁</div>
            <p
              className="text-2xl font-bold uppercase mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Drop Image Here
            </p>
            <p className="font-mono text-sm text-gray-500">
              // OR CLICK TO BROWSE • PNG, JPG, WEBP
            </p>
          </div>
        )}

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
                onClick={retryProcessing}
                className="mt-3 font-mono text-xs bg-[var(--color-neo-black)] text-white px-3 py-1 hover:bg-gray-800"
              >
                RETRY_
              </button>
            )}
          </div>
        )}

        {/* Results */}
        {originalImage && (
          <div className="space-y-6">
            {/* Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original */}
              <div className="bg-white border-[3px] border-[var(--color-neo-black)] neo-shadow p-4">
                <h3 className="font-mono text-xs text-gray-500 mb-3">
                  // ORIGINAL
                </h3>
                <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={originalImage}
                    alt="Original"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>

              {/* Processed */}
              <div className="bg-[var(--color-neo-yellow)] border-[3px] border-[var(--color-neo-black)] neo-shadow p-4">
                <h3 className="font-mono text-xs text-gray-600 mb-3">
                  // PROCESSED
                </h3>
                <div
                  className="aspect-square flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundImage: processedImage
                      ? 'url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill-opacity=".1"%3E%3Crect x="0" width="10" height="10" fill="%23000"/%3E%3Crect x="10" y="10" width="10" height="10" fill="%23000"/%3E%3C/svg%3E\')'
                      : "none",
                    backgroundColor: processedImage ? "#fff" : "#f3f4f6",
                  }}
                >
                  {loading ? (
                    <div className="text-center">
                      <div className="text-4xl animate-pulse mb-2">⚙️</div>
                      <p className="font-mono text-sm">{loadingMessage}</p>
                      {showSlowWarning && (
                        <p className="font-mono text-xs text-gray-500 mt-2 animate-pulse">
                          This might take a moment on the free server...
                        </p>
                      )}
                    </div>
                  ) : processedImage ? (
                    <img
                      src={processedImage}
                      alt="Processed"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <p className="font-mono text-sm text-gray-400">
                      Waiting for result...
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={downloadImage}
                disabled={!processedImage || loading}
                className="flex-1 bg-[var(--color-neo-yellow)] border-[3px] border-[var(--color-neo-black)] neo-shadow px-6 py-4 font-bold uppercase tracking-tight hover:translate-x-[3px] hover:translate-y-[3px] hover:neo-shadow-pressed transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-neo"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {loading
                  ? loadingMessage
                  : processedImage
                  ? "↓ DOWNLOAD_RESULT"
                  : "PROCESSING..."}
              </button>
              <button
                onClick={reset}
                disabled={loading}
                className="bg-white border-[3px] border-[var(--color-neo-black)] neo-shadow px-6 py-4 font-bold uppercase tracking-tight hover:translate-x-[3px] hover:translate-y-[3px] hover:neo-shadow-pressed transition-all disabled:opacity-50"
                style={{ fontFamily: "var(--font-display)" }}
              >
                ↻ NEW_IMAGE
              </button>
            </div>

            {/* Ad Banner - Below Download Button */}
            <div className="border-[3px] border-[var(--color-neo-black)] bg-gray-100 p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-xs text-gray-500">
                  // SPONSOR
                </span>
                <span className="text-xs bg-[var(--color-neo-black)] text-white px-2 py-1 font-mono">
                  AD
                </span>
              </div>
              <AdBanner
                dataAdSlot={
                  process.env.NEXT_PUBLIC_ADSENSE_SLOT || "1234567890"
                }
                dataAdFormat="horizontal"
                dataFullWidthResponsive={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
