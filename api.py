from fastapi import FastAPI, UploadFile, File
import shutil
import os
import subprocess
import sys
import json
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(
    title="Railway Driver Monitoring API",
    version="1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ==================================
# CONFIG
# ==================================

UPLOAD_FOLDER = "videos"

CURRENT_VIDEO = None

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

# ==================================
# HOME
# ==================================

@app.get("/")
def home():

    return {
        "message":
        "Railway Driver Monitoring API"
    }

# ==================================
# UPLOAD VIDEO
# ==================================

@app.post("/upload-video")
async def upload_video(
    file: UploadFile = File(...)
):

    global CURRENT_VIDEO

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    CURRENT_VIDEO = file_path

    return {
        "status": "success",
        "message": "Video uploaded successfully",
        "filename": file.filename
    }

# ==================================
# ANALYZE VIDEO
# ==================================

@app.post("/analyze")
def analyze_video():

    global CURRENT_VIDEO

    if CURRENT_VIDEO is None:

        return {
            "status": "failed",
            "message": "No video uploaded"
        }

    try:

        result = subprocess.run(
            [
                sys.executable,
                "main_v6.py",
                CURRENT_VIDEO
            ],
            capture_output=True,
            text=True
        )

        print("STDOUT:")
        print(result.stdout)

        print("STDERR:")
        print(result.stderr)

        print("RETURN CODE:")
        print(result.returncode)

        if result.returncode != 0:
            return {
                "status": "failed",
                "return_code": result.returncode,
                "stdout": result.stdout,
                "stderr": result.stderr[-5000:]
            }

        return {
            "status": "success",
            "message": "Analysis completed successfully"
        }

    except Exception as e:

        return {
            "status": "failed",
            "error": str(e)
        }

# ==================================
# HEALTH CHECK
# ==================================

@app.get("/health")
def health_check():

    return {
        "status": "healthy"
    }
@app.get("/events")
def get_events():

    events_path = "outputs/events.json"

    if not os.path.exists(events_path):

        return {
            "status": "failed",
            "message": "Events file not found"
        }

    with open(events_path, "r") as f:

        events = json.load(f)

    return events
@app.get("/report")
def get_report():

    report_path = "outputs/report.json"

    if not os.path.exists(report_path):

        return {
            "status": "failed",
            "message": "Report file not found"
        }

    with open(report_path, "r") as f:

        report = json.load(f)

    return report    
@app.get("/video")
def get_video():

    video_path = "outputs/final_output_browser.mp4"

    if not os.path.exists(video_path):

        return {
            "status": "failed",
            "message": "Video not found"
        }

    return FileResponse(
        video_path,
        media_type="video/mp4"
    )