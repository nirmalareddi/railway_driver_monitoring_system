from fastapi import FastAPI, UploadFile, File
import shutil
import os
import subprocess
import sys
import json
import uuid
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(
    title="Railway Driver Monitoring API",
    version="1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://railway-driver-monitoring-system.vercel.app"
    ],
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

    job_id = str(uuid.uuid4())

    file_extension = os.path.splitext(file.filename)[1]

    file_path = os.path.join(
        UPLOAD_FOLDER,
        f"{job_id}{file_extension}"
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    return {
        "status": "success",
        "message": "Video uploaded successfully",
        "job_id": job_id,
        "filename": file.filename
    }

# ==================================
# ANALYZE VIDEO
# ==================================

@app.post("/analyze/{job_id}")
def analyze_video(job_id: str):

    video_files = [
        f for f in os.listdir(UPLOAD_FOLDER)
        if f.startswith(job_id)
    ]

    if not video_files:
        return {
            "status": "failed",
            "message": "Video not found"
        }

    video_path = os.path.join(
        UPLOAD_FOLDER,
        video_files[0]
    )

    try:

        result = subprocess.run(
            [
                sys.executable,
                "main_v6.py",
                video_path,
                job_id
            ],
            capture_output=True,
            text=True
        )

        return {
            "status": "debug",
            "return_code": result.returncode,
            "stdout": result.stdout[-5000:],
            "stderr": result.stderr[-5000:]
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
#events endpoint    
@app.get("/events/{job_id}")
def get_events(job_id: str):

    events_path = os.path.join(
        "outputs",
        job_id,
        "events.json"
    )

    if not os.path.exists(events_path):

        return {
            "status": "failed",
            "message": "Events file not found"
        }

    with open(events_path, "r") as f:

        events = json.load(f)

    return events
#report endpoint
@app.get("/report/{job_id}")
def get_report(job_id: str):

    report_path = os.path.join(
        "outputs",
        job_id,
        "report.json"
    )

    if not os.path.exists(report_path):

        return {
            "status": "failed",
            "message": "Report file not found"
        }

    with open(report_path, "r") as f:

        report = json.load(f)

    return report 

##video endpoint
@app.get("/video/{job_id}")
def get_video(job_id: str):

    video_path = os.path.join(
        "outputs",
        job_id,
        "final_output.mp4"
    )

    if not os.path.exists(video_path):

        return {
            "status": "failed",
            "message": "Video not found"
        }

    return FileResponse(
        video_path,
        media_type="video/mp4"
    )
@app.get("/status/{job_id}")
def get_status(job_id: str):

    report_exists = os.path.exists(
        os.path.join("outputs", job_id, "report.json")
    )

    events_exists = os.path.exists(
        os.path.join("outputs", job_id, "events.json")
    )

    video_exists = os.path.exists(
        os.path.join("outputs", job_id, "final_output.mp4")
    )

    if report_exists and events_exists and video_exists:
        return {"status": "completed"}

    return {"status": "processing"}    