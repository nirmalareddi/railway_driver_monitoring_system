import cv2
import mediapipe as mp

# MediaPipe Face Detection
mp_face_detection = mp.solutions.face_detection
mp_drawing = mp.solutions.drawing_utils

video_path = "videos/test.mp4"

cap = cv2.VideoCapture(video_path)

with mp_face_detection.FaceDetection(
        model_selection=1,
        min_detection_confidence=0.5) as face_detection:

    while cap.isOpened():

        success, frame = cap.read()

        if not success:
            break

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = face_detection.process(rgb_frame)

        if results.detections:

            for detection in results.detections:
                mp_drawing.draw_detection(
                    frame,
                    detection
                )

        cv2.imshow("Face Detection", frame)

        if cv2.waitKey(25) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()