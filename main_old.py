import json
import subprocess
import sys
print("MAIN.PY STARTED")

print("=" * 50)
print("RAILWAY DRIVER MONITORING SYSTEM")
print("=" * 50)

with open("outputs/events.json", "w") as f:
    json.dump([], f)

print("\n[1/4] Running Drowsiness Detection...")
subprocess.run([sys.executable, "src/drowsiness_detector.py"])

print("\n[2/4] Running Mobile Usage Detection...")
subprocess.run([sys.executable, "src/mobile_detection.py"])

print("\n[3/4] Running Face Visibility Detection...")
subprocess.run([sys.executable, "src/face_lost_detector.py"])

print("\n[4/4] Generating Report...")
subprocess.run([sys.executable, "src/report_generator.py"])

print("\nDone!")
print("Check:")
print("outputs/events.json")
print("outputs/report.json")