#!/bin/bash
# Regenerate _local/Jaleesa_Houle_CV.pdf from _local/cv.html.
# Edit _local/cv.html, then run: ./build-cv.sh
#
# _local/ is gitignored, so neither the CV page nor the PDF is ever published —
# that is why the site's "CV" links resolve to a 404. To publish the CV:
#     cp _local/Jaleesa_Houle_CV.pdf assets/
set -e

cd "$(dirname "$0")"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CHROME" ] || CHROME="/Applications/Chromium.app/Contents/MacOS/Chromium"
[ -x "$CHROME" ] || { echo "Chrome not found — edit CHROME in this script."; exit 1; }

PORT=8901
python3 -m http.server "$PORT" >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT
sleep 1

"$CHROME" --headless --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="_local/Jaleesa_Houle_CV.pdf" \
  --virtual-time-budget=4000 \
  "http://localhost:$PORT/_local/cv.html" >/dev/null 2>&1

echo "Wrote _local/Jaleesa_Houle_CV.pdf  (not published — see comment above)"
