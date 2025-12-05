"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type VideoFormat = {
  format_id: string;
  resolution: string;
  ext: string;
  filesize_mb: number;
  has_video: boolean;
  has_audio: boolean;
};

type VideoInfo = {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  channel: string;
  formats: VideoFormat[];
};

export default function YouTubePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("FETCHING...");
  const [showSlowWarning, setShowSlowWarning] = useState(false);
  const [error, setError] = useState("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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

  const fetchVideoInfo = async () => {
    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    setLoading(true);
    setLoadingMessage("CONTACTING_SERVER...");
    setError("");
    setVideoInfo(null);
    setShowSlowWarning(false);

    try {
      setTimeout(() => setLoadingMessage("EXTRACTING_DATA..."), 1500);

      const response = await fetch("/api/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 500) {
          throw new Error("SERVER_OVERLOAD // TRY_AGAIN");
        }
        throw new Error(data.error || "Failed to fetch video info");
      }

      setVideoInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const downloadFormat = async (format: VideoFormat) => {
    setDownloading(format.format_id);

    try {
      const response = await fetch("/api/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          action: "download",
          format_id: format.format_id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 500) {
          throw new Error("SERVER_OVERLOAD // TRY_AGAIN");
        }
        throw new Error(data.error || "Failed to get download link");
      }

      window.open(data.url, "_blank");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setDownloading(null);
    }
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
            📥 YT_DOWNLOADER
          </h1>
          <p className="font-mono text-sm text-gray-600 mt-2">
            // PASTE URL → GET VIDEO → PROFIT
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white border-[3px] border-[var(--color-neo-black)] neo-shadow p-6 mb-6">
          <label className="font-mono text-xs text-gray-500 mb-2 block">
            // YOUTUBE_URL
          </label>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="flex-1 border-[3px] border-[var(--color-neo-black)] p-4 font-mono text-base focus:outline-none focus:bg-[var(--color-neo-yellow)]"
              onKeyDown={(e) =>
                e.key === "Enter" && !loading && fetchVideoInfo()
              }
              disabled={loading}
            />
            <button
              onClick={fetchVideoInfo}
              disabled={loading}
              className="bg-[var(--color-neo-yellow)] border-[3px] border-[var(--color-neo-black)] neo-shadow px-8 py-4 font-bold uppercase tracking-tight hover:translate-x-[3px] hover:translate-y-[3px] hover:neo-shadow-pressed transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-neo"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {loading ? loadingMessage : "FETCH_"}
            </button>
          </div>

          {/* Slow server warning */}
          {showSlowWarning && (
            <p className="font-mono text-xs text-gray-500 mt-3 animate-pulse">
              // This might take a moment on the free server...
            </p>
          )}
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
                onClick={fetchVideoInfo}
                className="mt-3 font-mono text-xs bg-[var(--color-neo-black)] text-white px-3 py-1 hover:bg-gray-800"
              >
                RETRY_
              </button>
            )}
          </div>
        )}

        {/* Video Info */}
        {videoInfo && (
          <div className="bg-white border-[3px] border-[var(--color-neo-black)] neo-shadow p-6">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="w-full md:w-64 flex-shrink-0">
                <img
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  className="w-full border-[3px] border-[var(--color-neo-black)]"
                />
              </div>

              <div className="flex-1">
                <h2
                  className="text-2xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {videoInfo.title}
                </h2>
                <p className="font-mono text-sm text-gray-600 mb-2">
                  {videoInfo.channel}
                </p>
                <div className="flex gap-4 font-mono text-xs">
                  <span className="bg-[var(--color-neo-black)] text-white px-2 py-1">
                    {formatDuration(videoInfo.duration)}
                  </span>
                  <span className="bg-gray-200 px-2 py-1">
                    ID: {videoInfo.id}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-mono text-xs text-gray-500 mb-3">
                // AVAILABLE_FORMATS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {videoInfo.formats.map((format) => (
                  <button
                    key={format.format_id}
                    onClick={() => downloadFormat(format)}
                    disabled={downloading === format.format_id}
                    className="flex justify-between items-center border-[2px] border-[var(--color-neo-black)] p-3 hover:bg-[var(--color-neo-yellow)] transition-colors text-left disabled:opacity-50"
                  >
                    <div>
                      <span className="font-bold uppercase">
                        {format.resolution}
                      </span>
                      <span className="font-mono text-xs text-gray-500 ml-2">
                        .{format.ext}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-gray-500">
                        {format.filesize_mb} MB
                      </span>
                      <span className="text-lg">
                        {downloading === format.format_id ? "⏳" : "↓"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
