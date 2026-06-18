import cv2
import mediapipe as mp

LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [362, 385, 387, 263, 373, 380]

mp_face_mesh = mp.solutions.face_mesh

video_path = "videos/test.mp4"

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

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = face_mesh.process(rgb)

        if results.multi_face_landmarks:

            h, w, _ = frame.shape

            for face_landmarks in results.multi_face_landmarks:

                for idx in LEFT_EYE + RIGHT_EYE:

                    landmark = face_landmarks.landmark[idx]

                    x = int(landmark.x * w)
                    y = int(landmark.y * h)

                    cv2.circle(
                        frame,
                        (x, y),
                        3,
                        (0, 255, 0),
                        -1
                    )

        cv2.imshow("Eye Landmarks", frame)

        if cv2.waitKey(25) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()