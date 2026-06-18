import cv2
import json

VIDEO_PATH = "videos/scripted_driver.mp4"
EVENT_FILE = "outputs/events.json"
OUTPUT_VIDEO = "outputs/final_output.mp4"

# Load events
with open(EVENT_FILE, "r") as f:
    events = json.load(f)

cap = cv2.VideoCapture(VIDEO_PATH)

fps = cap.get(cv2.CAP_PROP_FPS)
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

fourcc = cv2.VideoWriter_fourcc(*'mp4v')

out = cv2.VideoWriter(
    OUTPUT_VIDEO,
    fourcc,
    fps,
    (width, height)
)

frame_number = 0

while cap.isOpened():

    success, frame = cap.read()

    if not success:
        break

    frame_number += 1

    current_time = frame_number / fps

    # Show timestamp
    cv2.putText(
        frame,
        f"Time: {current_time:.2f}s",
        (20, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 255, 0),
        2
    )

    # Draw events
    for event in events:

        event_time = event["timestamp"]

        # Display event for 3 seconds
        if event_time <= current_time <= event_time + 3:

            event_name = event["event"]

            if event_name == "drowsiness":

                text = "DROWSINESS DETECTED"
                color = (0, 0, 255)

            elif event_name == "mobile_usage":

                text = "MOBILE USAGE"
                color = (0, 165, 255)

            elif event_name == "face_not_visible":
                text = "FACE NOT VISIBLE"
                color = (255, 0, 0)

            elif event_name == "attention_loss":
                text = "ATTENTION LOSS"
                color = (255, 0, 255)

            else:
                text = event_name.upper()
                color = (255, 255, 255)

            cv2.rectangle(
                frame,
                (10, 70),
                (500, 130),
                (0, 0, 0),
                -1
            )

            cv2.putText(
                frame,
                text,
                (20, 110),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                color,
                3
            )

    out.write(frame)

    cv2.imshow(
        "Annotated Video",
        frame
    )

    if cv2.waitKey(25) & 0xFF == ord('q'):
        break

cap.release()
out.release()
cv2.destroyAllWindows()

print(f"\nVideo saved to: {OUTPUT_VIDEO}")