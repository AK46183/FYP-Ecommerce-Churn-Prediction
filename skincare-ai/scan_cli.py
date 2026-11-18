"""Scan module ka alag test:  python scan_cli.py C:\\path\\selfie.jpg"""
import json, sys
import scan

if len(sys.argv) < 2:
    print("Use: python scan_cli.py <tasveer ka path>")
    sys.exit(1)
res = scan.analyze_file(sys.argv[1])
print(json.dumps(res, indent=2, ensure_ascii=False))
if res.get("ok"):
    print("\nChatbot ke liye ishare (skin_type, concerns):", scan.to_profile(res))
