import cv2
import mediapipe as mp
from event_logger import log_event

VIDEO_PATH = "videos/scripted_driver.mp4"

FACE_LOST_THRESHOLD = 2.0

mp_face_mesh = mp.solutions.face_mesh

cap = cv2.VideoCapture(VIDEO_PATH)

fps = cap.get(cv2.CAP_PROP_FPS)

frame_number = 0

face_missing_start = None
face_missing_logged = False

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

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = face_mesh.process(rgb)

        face_detected = (
            results.multi_face_landmarks is not None
        )

        if face_detected:

            face_missing_start = None
            missing_duration = 0
            face_missing_logged = False

            cv2.putText(
                frame,
                "FACE: VISIBLE",
                (20, 50),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2
            )

        else:

            if face_missing_start is None:

                face_missing_start = current_time

            missing_duration = (
                current_time -
                face_missing_start
            )

            cv2.putText(
                frame,
                "FACE: NOT VISIBLE",
                (20, 50),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 0, 255),
                2
            )

            if (
                missing_duration >= FACE_LOST_THRESHOLD
                and not face_missing_logged
            ):

                log_event(
                    "face_not_visible",
                    current_time
                )

                face_missing_logged = True

        cv2.putText(
            frame,
            f"Missing: {missing_duration:.1f}s",
            (20, 100),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 255),
            2
        )

        cv2.imshow(
            "Face Visibility Monitor",
            frame
        )

        if cv2.waitKey(25) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()