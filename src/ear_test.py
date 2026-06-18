import cv2
import mediapipe as mp
import numpy as np
from scipy.spatial import distance

# Left eye landmarks
LEFT_EYE = [33, 160, 158, 133, 153, 144]

# Right eye landmarks
RIGHT_EYE = [362, 385, 387, 263, 373, 380]


def calculate_ear(eye_points):
    """
    EAR Formula:
    (p2-p6 + p3-p5) / (2 * p1-p4)
    """

    vertical_1 = distance.euclidean(eye_points[1], eye_points[5])
    vertical_2 = distance.euclidean(eye_points[2], eye_points[4])

    horizontal = distance.euclidean(eye_points[0], eye_points[3])

    ear = (vertical_1 + vertical_2) / (2.0 * horizontal)

    return ear


mp_face_mesh = mp.solutions.face_mesh

video_path = "videos/scripted_driver.mp4"

cap = cv2.VideoCapture(video_path)

with mp_face_mesh.FaceMesh(
        static_image_mode=False,
        max_num_faces=1,
        refine_landmarks=True,
        min_detection_confidence=0.3,
        min_tracking_confidence=0.3) as face_mesh:

    while cap.isOpened():

        success, frame = cap.read()

        if not success:
            break

        h, w, _ = frame.shape

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = face_mesh.process(rgb)

        if results.multi_face_landmarks:

            for face_landmarks in results.multi_face_landmarks:

                left_eye_points = []
                right_eye_points = []

                for idx in LEFT_EYE:
                    landmark = face_landmarks.landmark[idx]
                    x = int(landmark.x * w)
                    y = int(landmark.y * h)

                    left_eye_points.append((x, y))

                    cv2.circle(frame, (x, y), 2, (0, 255, 0), -1)

                for idx in RIGHT_EYE:
                    landmark = face_landmarks.landmark[idx]
                    x = int(landmark.x * w)
                    y = int(landmark.y * h)

                    right_eye_points.append((x, y))

                    cv2.circle(frame, (x, y), 2, (0, 255, 0), -1)

                left_ear = calculate_ear(left_eye_points)
                right_ear = calculate_ear(right_eye_points)

                ear = (left_ear + right_ear) / 2

                cv2.putText(
                    frame,
                    f"EAR: {ear:.3f}",
                    (20, 50),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    (0, 255, 0),
                    2
                )

        cv2.imshow("EAR Test", frame)

        if cv2.waitKey(25) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()