import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { text } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const prompt = `You are a professional grammar and writing assistant. Fix the grammar, spelling, and punctuation in the following text. Only return the corrected text, nothing else. Do not add explanations or notes.

Text to fix:
${text}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Gemini API error:", error);
      return NextResponse.json(
        { error: "Failed to process text" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const correctedText = data.candidates?.[0]?.content?.parts?.[0]?.text || text;

    return NextResponse.json({
      original: text,
      corrected: correctedText.trim(),
    });
  } catch (error) {
    console.error("Grammar API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
