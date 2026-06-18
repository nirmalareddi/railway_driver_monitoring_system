import json

EVENT_FILE = "outputs/events.json"
REPORT_FILE = "outputs/report.json"

with open(EVENT_FILE, "r") as f:

    events = json.load(f)

summary = {

    "total_events": len(events),

    "drowsiness_events": sum(
        1
        for e in events
        if e["event"] == "drowsiness"
    ),

    "mobile_usage_events": sum(
        1
        for e in events
        if e["event"] == "mobile_usage"
    ),

    "face_not_visible_events": sum(
        1
        for e in events
        if e["event"] == "face_not_visible"
    ),

    "attention_loss_events": sum(
        1
        for e in events
        if e["event"] == "attention_loss"
    )
}

with open(
    REPORT_FILE,
    "w"
) as f:

    json.dump(
        summary,
        f,
        indent=4
    )

print("\nSummary Report:\n")

print(
    json.dumps(
        summary,
        indent=4
    )
)