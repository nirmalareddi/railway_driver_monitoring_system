import json
import os

EVENT_FILE = "outputs/events.json"

def log_event(event_type, timestamp):

    event = {
        "event": event_type,
        "timestamp": round(timestamp, 2)
    }

    if not os.path.exists(EVENT_FILE):

        with open(EVENT_FILE, "w") as f:
            json.dump([], f)

    with open(EVENT_FILE, "r") as f:
        events = json.load(f)

    events.append(event)

    with open(EVENT_FILE, "w") as f:
        json.dump(events, f, indent=4)

    print(f"[LOGGED] {event}")


if __name__ == "__main__":

    log_event("drowsiness", 26.72)

    log_event("mobile_usage", 74.10)