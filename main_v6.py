import cv2
import json
import mediapipe as mp
import subprocess
import os
from ultralytics import YOLO
from scipy.spatial import distance

# ==================================
# CONFIG
# ==================================

import sys

if len(sys.argv) > 2:

    VIDEO_PATH = sys.argv[1]
    JOB_ID = sys.argv[2]

else:

    VIDEO_PATH = "videos/scripted_driver.mp4"
    JOB_ID = "default"

OUTPUT_FOLDER = os.path.join(
    "outputs",
    JOB_ID
)

os.makedirs(
    OUTPUT_FOLDER,
    exist_ok=True
)

OUTPUT_VIDEO = os.path.join(
    OUTPUT_FOLDER,
    "final_output.mp4"
)

EVENT_FILE = os.path.join(
    OUTPUT_FOLDER,
    "events.json"
)

REPORT_FILE = os.path.join(
    OUTPUT_FOLDER,
    "report.json"
)

EAR_THRESHOLD = 0.15
DROWSINESS_TIME_THRESHOLD = 3.0

PHONE_TIME_THRESHOLD = 2.0
PHONE_COOLDOWN_THRESHOLD = 1.5   # seconds phone must be absent before session resets

FACE_LOST_THRESHOLD = 2.0

ATTENTION_THRESHOLD = 4.0

LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [362, 385, 387, 263, 373, 380]

ALERT_DISPLAY_DURATION = 3.0  # seconds each alert banner stays on screen

# event key  →  (banner label,                BGR color)
ALERT_CONFIG = {
    "drowsiness":       ("DROWSINESS DETECTED",   (0,   0,   200)),
    "mobile_usage":     ("MOBILE USAGE DETECTED",  (0,   140, 255)),
    "face_not_visible": ("FACE NOT VISIBLE",        (0,   0,   180)),
    "attention_loss":   ("ATTENTION LOSS",           (0,   180, 255)),
}

# ==================================
# HELPERS
# ==================================

def calculate_ear(eye_points):
    vertical_1 = distance.euclidean(eye_points[1], eye_points[5])
    vertical_2 = distance.euclidean(eye_points[2], eye_points[4])
    horizontal = distance.euclidean(eye_points[0], eye_points[3])
    ear = (vertical_1 + vertical_2) / (2.0 * horizontal)
    return ear


def log_event(events, event_type, timestamp):
    event = {
        "event": event_type,
        "timestamp": round(timestamp, 2)
    }
    events.append(event)
    print(f"[LOGGED] {event}")


def get_eye_points(face_landmarks, eye_indices, w, h):
    points = []
    for idx in eye_indices:
        landmark = face_landmarks.landmark[idx]
        x = int(landmark.x * w)
        y = int(landmark.y * h)
        points.append((x, y))
    return points


def draw_alert(frame, label, color):
    """Draw a semi-transparent colored banner at the bottom of the frame."""
    h, w = frame.shape[:2]

    banner_h = 60
    y1 = h - banner_h
    y2 = h

    # semi-transparent fill via weighted blend
    overlay = frame.copy()
    cv2.rectangle(overlay, (0, y1), (w, y2), color, thickness=-1)
    cv2.addWeighted(overlay, 0.65, frame, 0.35, 0, frame)

    # centered text
    font       = cv2.FONT_HERSHEY_DUPLEX
    font_scale = 0.9
    thickness  = 2
    (tw, th), _ = cv2.getTextSize(label, font, font_scale, thickness)
    tx = (w - tw) // 2
    ty = y1 + (banner_h + th) // 2
    cv2.putText(frame, label, (tx, ty), font, font_scale, (255, 255, 255), thickness, cv2.LINE_AA)


# ==================================
# RESET EVENTS
# ==================================

with open(EVENT_FILE, "w") as f:
    json.dump([], f)

events = []

# ==================================
# MEDIAPIPE
# ==================================

mp_face_mesh = mp.solutions.face_mesh

# ==================================
# YOLO
# ==================================

model = YOLO("yolov8n.pt")

# ==================================
# VIDEO
# ==================================

cap = cv2.VideoCapture(VIDEO_PATH)
if not cap.isOpened():
    raise Exception(
        f"Cannot open video: {VIDEO_PATH}"
    )

fps = cap.get(cv2.CAP_PROP_FPS)

if fps <= 0:
    fps = 30

width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

fourcc = cv2.VideoWriter_fourcc(*'mp4v')

out = cv2.VideoWriter(OUTPUT_VIDEO, fourcc, fps, (width, height))

print("VIDEO_PATH:", VIDEO_PATH)
print("OUTPUT_VIDEO:", OUTPUT_VIDEO)

print("FPS:", fps)
print("WIDTH:", width)
print("HEIGHT:", height)

print("CAP OPENED:", cap.isOpened())
print("VIDEO WRITER OPENED:", out.isOpened())

frame_number = 0

# ==================================
# STATES
# ==================================

closed_start_time = None
drowsy_detected = False

phone_start_time = None
phone_event_logged = False
phone_detected = False
phone_absent_since = None   # tracks when phone last disappeared (for cooldown)

face_missing_start = None
face_missing_logged = False

attention_start_time = None
attention_logged = False

last_yolo_results = None

# ==================================
# MAIN PROCESSING LOOP
# ==================================

with mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.3,
    min_tracking_confidence=0.3
) as face_mesh:

    while cap.isOpened():

        success, frame = cap.read()

        if not success:
            break

        frame_number += 1

        if frame_number % 100 == 0:
            print(f"Processing frame {frame_number}")

        current_time = frame_number / fps

        h, w, _ = frame.shape

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        face_results = face_mesh.process(rgb)

        face_detected = (face_results.multi_face_landmarks is not None)

        # --------------------------------
        # YOLO EVERY 5 FRAMES
        # --------------------------------

        if frame_number % 5 == 0:
            last_yolo_results = model(frame, verbose=False)

        phone_detected = False

        if last_yolo_results is not None:
            for box in last_yolo_results[0].boxes:
                cls_id = int(box.cls[0])
                class_name = model.names[cls_id]
                if class_name in ["cell phone", "remote"]:
                    phone_detected = True
                    break

        # --------------------------------
        # FACE NOT VISIBLE DETECTION
        # --------------------------------

        if face_detected:
            face_missing_start = None
            face_missing_logged = False
        else:
            if face_missing_start is None:
                face_missing_start = current_time

            missing_duration = current_time - face_missing_start

            if missing_duration >= FACE_LOST_THRESHOLD and not face_missing_logged:
                log_event(events, "face_not_visible", current_time)
                face_missing_logged = True

            cv2.putText(
                frame,
                "FACE NOT VISIBLE",
                (20, 100),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 0, 255),
                3
            )

        # --------------------------------
        # MOBILE DETECTION
        # --------------------------------

        if phone_detected:
            # Phone is visible — clear any pending cooldown and (re)start session
            phone_absent_since = None

            if phone_start_time is None:
                phone_start_time = current_time

            phone_duration = current_time - phone_start_time

            if phone_duration >= PHONE_TIME_THRESHOLD and not phone_event_logged:
                log_event(events, "mobile_usage", current_time)
                phone_event_logged = True
        else:
            # Phone not visible — start / advance the cooldown timer
            if phone_start_time is not None:
                # We were in an active session; begin cooldown
                if phone_absent_since is None:
                    phone_absent_since = current_time

                absent_duration = current_time - phone_absent_since

                if absent_duration >= PHONE_COOLDOWN_THRESHOLD:
                    # Phone has been genuinely absent long enough — end session
                    phone_start_time = None
                    phone_event_logged = False
                    phone_absent_since = None
            # If phone_start_time is already None there was no active session; nothing to do

        # --------------------------------
        # ATTENTION LOSS + DROWSINESS
        # (only when face is detected)
        # --------------------------------

        head_direction = "NO FACE"

        if face_detected:

            landmarks = face_results.multi_face_landmarks[0].landmark

            nose = landmarks[1]
            left_face = landmarks[234]
            right_face = landmarks[454]
            left_eye_lm = landmarks[33]
            right_eye_lm = landmarks[263]

            nose_x = nose.x
            left_x = left_face.x
            right_x = right_face.x

            face_center = (left_x + right_x) / 2
            offset = nose_x - face_center

            eye_y = (left_eye_lm.y + right_eye_lm.y) / 2
            nose_y = nose.y
            diff = nose_y - eye_y

            if diff > 0.045:
                head_direction = "LOOKING DOWN"
            elif offset > 0.05:
                head_direction = "LOOKING RIGHT"
            elif offset < -0.05:
                head_direction = "LOOKING LEFT"
            else:
                head_direction = "LOOKING FORWARD"

            # ---- Attention Loss ----

            if head_direction in ["LOOKING LEFT", "LOOKING RIGHT", "LOOKING DOWN"]:
                if attention_start_time is None:
                    attention_start_time = current_time

                attention_duration = current_time - attention_start_time

                if attention_duration >= ATTENTION_THRESHOLD and not attention_logged:
                    log_event(events, "attention_loss", current_time)
                    attention_logged = True
            else:
                attention_start_time = None
                attention_logged = False

            # ---- Drowsiness ----

            face_landmarks_obj = face_results.multi_face_landmarks[0]

            left_eye_points = get_eye_points(face_landmarks_obj, LEFT_EYE, w, h)
            right_eye_points = get_eye_points(face_landmarks_obj, RIGHT_EYE, w, h)

            left_ear = calculate_ear(left_eye_points)
            right_ear = calculate_ear(right_eye_points)
            ear = (left_ear + right_ear) / 2

            if ear < EAR_THRESHOLD:
                if closed_start_time is None:
                    closed_start_time = current_time

                closed_duration = current_time - closed_start_time

                if closed_duration >= DROWSINESS_TIME_THRESHOLD and not drowsy_detected:
                    log_event(events, "drowsiness", current_time)
                    drowsy_detected = True
            else:
                closed_start_time = None
                drowsy_detected = False

            cv2.putText(
                frame,
                head_direction,
                (20, 50),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2
            )

        # --------------------------------
        # EVENT ALERT OVERLAYS
        # --------------------------------

        # Mobile usage: show banner for the entire active session, not just 3 s
        # after the logged timestamp. The session is live whenever phone_start_time
        # is set and the 2-second qualification threshold has been crossed.
        phone_session_active = (
            phone_start_time is not None
            and (current_time - phone_start_time) >= PHONE_TIME_THRESHOLD
        )
        if phone_session_active:
            label, color = ALERT_CONFIG["mobile_usage"]
            draw_alert(frame, label, color)
        else:
            # For all other event types use the timestamp-window approach
            for event in events:
                if event["event"] == "mobile_usage":
                    continue  # already handled above
                event_t = event["timestamp"]
                if event_t <= current_time <= event_t + ALERT_DISPLAY_DURATION:
                    cfg = ALERT_CONFIG.get(event["event"])
                    if cfg:
                        label, color = cfg
                        draw_alert(frame, label, color)
                        break

        # --------------------------------
        # WRITE FRAME
        # --------------------------------

        out.write(frame)

# ==================================
# RELEASE
# ==================================

cap.release()
out.release()
cv2.destroyAllWindows()

BROWSER_VIDEO = os.path.join(
    OUTPUT_FOLDER,
    "final_output_browser.mp4"
)

result = subprocess.run(
    [
        "ffmpeg",
        "-i",
        OUTPUT_VIDEO,
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        BROWSER_VIDEO
    ],
    capture_output=True,
    text=True
)

print("FFMPEG RETURN CODE:", result.returncode)
print("FFMPEG STDERR:", result.stderr[-1000:])
# ==================================
# SAVE EVENTS
# ==================================

with open(EVENT_FILE, "w") as f:
    json.dump(events, f, indent=2)

print(f"\n[DONE] Events saved to {EVENT_FILE}")

# ==================================
# GENERATE REPORT
# ==================================

from collections import Counter

event_counts = Counter(e["event"] for e in events)

report = {
    "total_events": len(events),
    "event_summary": dict(event_counts),
    "events": events
}

with open(REPORT_FILE, "w") as f:
    json.dump(report, f, indent=2)

print(f"[DONE] Report saved to {REPORT_FILE}")
print(f"[DONE] Video saved to {OUTPUT_VIDEO}")

print("final_output.mp4 exists:", os.path.exists(OUTPUT_VIDEO))
print("final_output_browser.mp4 exists:", os.path.exists(BROWSER_VIDEO))