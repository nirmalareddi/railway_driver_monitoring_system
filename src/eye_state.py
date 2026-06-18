import cv2
import mediapipe as mp
from scipy.spatial import distance

# -------------------------------
# CONFIG
# -------------------------------

VIDEO_PATH = "videos/scripted_driver.mp4"
EAR_THRESHOLD = 0.15

# Left eye landmarks
LEFT_EYE = [33, 160, 158, 133, 153, 144]

# Right eye landmarks
RIGHT_EYE = [362, 385, 387, 263, 373, 380]


# -------------------------------
# EAR CALCULATION
# -------------------------------

def calculate_ear(eye_points):

    vertical_1 = distance.euclidean(
        eye_points[1],
        eye_points[5]
    )

    vertical_2 = distance.euclidean(
        eye_points[2],
        eye_points[4]
    )

    horizontal = distance.euclidean(
        eye_points[0],
        eye_points[3]
    )

    ear = (vertical_1 + vertical_2) / (2.0 * horizontal)

    return ear


# -------------------------------
# MEDIAPIPE
# -------------------------------

mp_face_mesh = mp.solutions.face_mesh

cap = cv2.VideoCapture(VIDEO_PATH)

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

        h, w, _ = frame.shape

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = face_mesh.process(rgb)

        if results.multi_face_landmarks:

            for face_landmarks in results.multi_face_landmarks:

                left_eye_points = []
                right_eye_points = []

                # LEFT EYE
                for idx in LEFT_EYE:

                    landmark = face_landmarks.landmark[idx]

                    x = int(landmark.x * w)
                    y = int(landmark.y * h)

                    left_eye_points.append((x, y))

                    cv2.circle(
                        frame,
                        (x, y),
                        2,
                        (0, 255, 0),
                        -1
                    )

                # RIGHT EYE
                for idx in RIGHT_EYE:

                    landmark = face_landmarks.landmark[idx]

                    x = int(landmark.x * w)
                    y = int(landmark.y * h)

                    right_eye_points.append((x, y))

                    cv2.circle(
                        frame,
                        (x, y),
                        2,
                        (0, 255, 0),
                        -1
                    )

                left_ear = calculate_ear(left_eye_points)
                right_ear = calculate_ear(right_eye_points)

                ear = (left_ear + right_ear) / 2

                # -----------------------
                # EYE STATE
                # -----------------------

                if ear < EAR_THRESHOLD:
                    eye_state = "CLOSED"
                    color = (0, 0, 255)  # Red
                else:
                    eye_state = "OPEN"
                    color = (0, 255, 0)  # Green

                # EAR Display
                cv2.putText(
                    frame,
                    f"EAR: {ear:.3f}",
                    (20, 50),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    color,
                    2
                )

                # Eye State Display
                cv2.putText(
                    frame,
                    f"EYE: {eye_state}",
                    (20, 100),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    color,
                    2
                )

        cv2.imshow("Eye State Detection", frame)

        if cv2.waitKey(25) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()