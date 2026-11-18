"""Terminal chatbot:  python chat_cli.py
Selfie scan karne ke liye likhein:  scan C:\\path\\selfie.jpg"""
from assistant import Assistant
import scan

a = Assistant()
print("MINAYSH Skin Assistant (quit likhein band karne ke liye; tasveer ke liye: scan <path>)")
if not a.llm:
    print("Note: .env mein key nahi mili, offline mode.")
while True:
    try:
        q = input("\nAap: ").strip()
    except (EOFError, KeyboardInterrupt):
        break
    if q.lower() in ("quit", "exit"):
        break
    if not q:
        continue
    try:
        if q.lower().startswith("scan "):
            path = q[5:].strip().strip('"')
            print("(tasveer scan ho rahi hai...)")
            result = scan.analyze_file(path)
            print("\nBot:", a.chat("I uploaded a selfie for a skin scan." if a.lang == "en" else "Maine skin scan ke liye selfie upload ki hai.", scan=result))
        else:
            print("\nBot:", a.chat(q))
    except Exception as e:
        print("\n(Masla aa gaya, dobara try karein):", str(e)[:200])
