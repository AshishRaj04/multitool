import { NextRequest, NextResponse } from "next/server";

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, action, format_id } = body;

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    let endpoint = `${PYTHON_API_URL}/youtube/info`;
    let fetchBody: Record<string, string> = { url };

    if (action === "download" && format_id) {
      endpoint = `${PYTHON_API_URL}/youtube/download?format_id=${format_id}`;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fetchBody),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.detail || "Failed to process video" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("YouTube API error:", error);
    return NextResponse.json(
      { error: "Failed to connect to download service" },
      { status: 500 }
    );
  }
}
