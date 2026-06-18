import cv2
import mediapipe as mp

VIDEO_PATH = "videos/scripted_driver.mp4"

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

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = face_mesh.process(rgb)

        head_direction = "NO FACE"
        diff = 0

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

            # Horizontal direction
            nose_x = nose.x
            left_x = left_face.x
            right_x = right_face.x

            face_center = (left_x + right_x) / 2

            offset = nose_x - face_center

            # Vertical direction
            eye_y = (left_eye.y + right_eye.y) / 2
            nose_y = nose.y

            diff = nose_y - eye_y

            # Priority: DOWN first
            if diff > 0.045:

                head_direction = "LOOKING DOWN"

            elif offset > 0.03:

                head_direction = "LOOKING RIGHT"

            elif offset < -0.03:

                head_direction = "LOOKING LEFT"

            else:

                head_direction = "LOOKING FORWARD"

        # Head Direction
        cv2.putText(
            frame,
            head_direction,
            (20, 50),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 0),
            2
        )

        # Debug value
        cv2.putText(
            frame,
            f"Diff: {diff:.3f}",
            (20, 100),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (255, 255, 0),
            2
        )

        cv2.imshow(
            "Head Pose Detection",
            frame
        )

        if cv2.waitKey(25) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()