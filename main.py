import cv2
import json
import mediapipe as mp
from ultralytics import YOLO

VIDEO_PATH = "videos/scripted_driver.mp4"

# Reset events file
with open("outputs/events.json", "w") as f:
    json.dump([], f)

# -----------------------
# MediaPipe
# -----------------------
mp_face_mesh = mp.solutions.face_mesh

# -----------------------
# YOLO
# -----------------------
model = YOLO("yolov8n.pt")

# -----------------------
# Video Input
# -----------------------
cap = cv2.VideoCapture(VIDEO_PATH)

fps = cap.get(cv2.CAP_PROP_FPS)

width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

# -----------------------
# Output Video
# -----------------------
fourcc = cv2.VideoWriter_fourcc(*'mp4v')

out = cv2.VideoWriter(
    "outputs/final_output.mp4",
    fourcc,
    fps,
    (width, height)
)

frame_number = 0

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

        current_time = frame_number / fps

        # -----------------------
        # Face Mesh
        # -----------------------
        rgb = cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2RGB
        )

        face_results = face_mesh.process(rgb)

        # -----------------------
        # YOLO
        # -----------------------
        yolo_results = model(
            frame,
            verbose=False
        )

        # Timestamp
        cv2.putText(
            frame,
            f"Time: {current_time:.2f}s",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 0),
            2
        )

        out.write(frame)

cap.release()
out.release()

print("Done!")