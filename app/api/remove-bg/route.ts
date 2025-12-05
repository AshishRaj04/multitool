import { NextRequest, NextResponse } from "next/server";

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Forward to Python API
    const pythonFormData = new FormData();
    pythonFormData.append("file", file);

    const response = await fetch(`${PYTHON_API_URL}/remove-bg`, {
      method: "POST",
      body: pythonFormData,
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.detail || "Failed to process image" },
        { status: response.status }
      );
    }

    // Return the image directly
    const imageBuffer = await response.arrayBuffer();
    
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": "attachment; filename=removed_bg.png",
      },
    });
  } catch (error) {
    console.error("Background removal error:", error);
    return NextResponse.json(
      { error: "Failed to connect to processing service" },
      { status: 500 }
    );
  }
}
