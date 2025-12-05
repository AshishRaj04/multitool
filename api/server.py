from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
import yt_dlp
from rembg import remove
from PIL import Image
import io


app = FastAPI(title="Multitool API")

# CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "*",  # Temporary wildcard for deployment - lock down later
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class VideoRequest(BaseModel):
    url: str


class VideoInfo(BaseModel):
    id: str
    title: str
    thumbnail: str
    duration: int
    channel: str
    formats: list


@app.get("/")
def health_check():
    return {"status": "online", "service": "multitool-api"}


@app.post("/youtube/info")
def get_video_info(request: VideoRequest):
    """Extract video information and available formats."""
    try:
        ydl_opts = {
            "quiet": True,
            "no_warnings": True,
            "extract_flat": False,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(request.url, download=False)
            
            # Filter and simplify formats
            formats = []
            seen = set()
            
            for f in info.get("formats", []):
                # Get video formats with audio or audio-only
                if f.get("vcodec") != "none" or f.get("acodec") != "none":
                    resolution = f.get("resolution", "audio only")
                    ext = f.get("ext", "mp4")
                    format_id = f.get("format_id", "")
                    filesize = f.get("filesize") or f.get("filesize_approx") or 0
                    
                    key = f"{resolution}-{ext}"
                    if key not in seen and filesize > 0:
                        seen.add(key)
                        formats.append({
                            "format_id": format_id,
                            "resolution": resolution,
                            "ext": ext,
                            "filesize": filesize,
                            "filesize_mb": round(filesize / (1024 * 1024), 2),
                            "has_video": f.get("vcodec") != "none",
                            "has_audio": f.get("acodec") != "none",
                        })
            
            # Sort by resolution (video first, then audio)
            formats.sort(key=lambda x: (not x["has_video"], -x.get("filesize", 0)))
            
            return {
                "id": info.get("id", ""),
                "title": info.get("title", "Unknown"),
                "thumbnail": info.get("thumbnail", ""),
                "duration": info.get("duration", 0),
                "channel": info.get("channel", info.get("uploader", "Unknown")),
                "formats": formats[:10],  # Limit to top 10 formats
            }
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/youtube/download")
def get_download_url(request: VideoRequest, format_id: str = "best"):
    """Get direct download URL for a specific format."""
    try:
        ydl_opts = {
            "quiet": True,
            "no_warnings": True,
            "format": format_id,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(request.url, download=False)
            
            # Find the requested format
            for f in info.get("formats", []):
                if f.get("format_id") == format_id:
                    return {
                        "url": f.get("url"),
                        "filename": f"{info.get('title', 'video')}.{f.get('ext', 'mp4')}",
                    }
            
            # Fallback to best format
            return {
                "url": info.get("url"),
                "filename": f"{info.get('title', 'video')}.mp4",
            }
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/remove-bg")
async def remove_background(file: UploadFile = File(...)):
    """Remove background from an uploaded image."""
    try:
        # Read the uploaded image
        contents = await file.read()
        input_image = Image.open(io.BytesIO(contents))
        
        # Remove background using rembg
        output_image = remove(input_image)
        
        # Convert to PNG bytes
        output_buffer = io.BytesIO()
        output_image.save(output_buffer, format="PNG")
        output_buffer.seek(0)
        
        return Response(
            content=output_buffer.getvalue(),
            media_type="image/png",
            headers={"Content-Disposition": "attachment; filename=removed_bg.png"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

