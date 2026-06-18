import cv2
import mediapipe as mp
import json
import os

VIDEO_PATH = "videos/scripted_driver.mp4"

# -----------------------------
# Event Logger
# -----------------------------
EVENT_FILE = "outputs/events.json"

def log_event(event_name, timestamp):

    event = {
        "event": event_name,
        "timestamp": round(timestamp, 2)
    }

    if os.path.exists(EVENT_FILE):

        with open(EVENT_FILE, "r") as f:
            events = json.load(f)

    else:

        events = []

    events.append(event)

    with open(EVENT_FILE, "w") as f:
        json.dump(events, f, indent=4)

    print(f"[LOGGED] {event}")


# -----------------------------
# MediaPipe
# -----------------------------
mp_face_mesh = mp.solutions.face_mesh

cap = cv2.VideoCapture(VIDEO_PATH)

fps = cap.get(cv2.CAP_PROP_FPS)

attention_start_time = None
attention_logged = False

ATTENTION_THRESHOLD = 4.0

with mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.3,
    min_tracking_confidence=0.3
) as face_mesh:

    frame_number = 0

    while cap.isOpened():

        success, frame = cap.read()

        if not success:
            break

        frame_number += 1

        current_time = frame_number / fps

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = face_mesh.process(rgb)

        head_direction = "NO FACE"

        if results.multi_face_landmarks:

            landmarks = results.multi_face_landmarks[0].landmark

            # Nose
            nose = landmarks[1]

            # Face edges
            left_face = landmarks[234]
            right_face = landmarks[454]

            # Eyes
            left_eye = landmarks[33]
            right_eye = landmarks[263]

            # Horizontal
            nose_x = nose.x
            left_x = left_face.x
            right_x = right_face.x

            face_center = (left_x + right_x) / 2

            offset = nose_x - face_center

            # Vertical
            eye_y = (left_eye.y + right_eye.y) / 2
            nose_y = nose.y

            diff = nose_y - eye_y

            # -------------------
            # Head Direction
            # -------------------

            if diff > 0.045:

                head_direction = "LOOKING DOWN"

            elif offset > 0.05:

                head_direction = "LOOKING RIGHT"

            elif offset < -0.05:

                head_direction = "LOOKING LEFT"

            else:

                head_direction = "LOOKING FORWARD"

            # -------------------
            # Attention Loss Logic
            # -------------------

            if head_direction in [
                "LOOKING LEFT",
                "LOOKING RIGHT",
                "LOOKING DOWN"
            ]:

                if attention_start_time is None:

                    attention_start_time = current_time

                attention_duration = (
                    current_time -
                    attention_start_time
                )

                if (
                    attention_duration >= ATTENTION_THRESHOLD
                    and
                    not attention_logged
                ):

                    print(
                        f"Attention Loss: {head_direction} at {current_time:.2f}"
                    )

                    log_event(
                        "attention_loss",
                        current_time
                    )

                    attention_logged = True

            else:

                attention_start_time = None
                attention_logged = False

        # Display
        cv2.putText(
            frame,
            head_direction,
            (20, 50),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 0),
            2
        )

        cv2.imshow(
            "Attention Loss Detection",
            frame
        )

        if cv2.waitKey(25) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()