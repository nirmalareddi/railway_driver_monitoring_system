import cv2
from ultralytics import YOLO
from event_logger import log_event

VIDEO_PATH = "videos/scripted_driver.mp4"

PHONE_TIME_THRESHOLD = 2.0

model = YOLO("yolov8n.pt")

cap = cv2.VideoCapture(VIDEO_PATH)

fps = cap.get(cv2.CAP_PROP_FPS)

frame_number = 0

phone_start_time = None
phone_event_logged = False

while cap.isOpened():

    success, frame = cap.read()

    if not success:
        break

    frame_number += 1

    current_time = frame_number / fps

    results = model(frame, verbose=False)

    phone_detected = False

    for box in results[0].boxes:

        cls_id = int(box.cls[0])

        class_name = model.names[cls_id]

        # YOLO sometimes confuses phone with remote
        if class_name in ["cell phone", "remote"]:

            phone_detected = True

    if phone_detected:

        if phone_start_time is None:

            phone_start_time = current_time

        phone_duration = current_time - phone_start_time

        if (
            phone_duration >= PHONE_TIME_THRESHOLD
            and not phone_event_logged
        ):

            log_event(
                "mobile_usage",
                current_time
            )

            phone_event_logged = True

    else:

        phone_start_time = None

        phone_duration = 0

        phone_event_logged = False

    annotated_frame = results[0].plot()

    cv2.putText(
        annotated_frame,
        f"Phone: {phone_duration:.1f}s",
        (20, 50),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 255, 255),
        2
    )

    cv2.imshow(
        "YOLO Mobile Detection",
        annotated_frame
    )

    if cv2.waitKey(25) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()