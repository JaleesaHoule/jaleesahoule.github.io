#!/usr/bin/env python3
"""Local preview server that behaves like GitHub Pages.

Why this exists instead of `python -m http.server`:

The stdlib server ignores the HTTP `Range` header — it answers every request
with 200 and the entire file. Safari refuses to play a <video> served that
way, so videos silently fail to autoplay locally while working fine once
deployed (GitHub Pages answers 206 Partial Content). Chrome tolerates the
stdlib behaviour, which makes the problem look browser-specific when it is
really server-specific.

This adds byte-range support so the local preview matches production.

    ./serve.py [port]          # default 8000
"""

import http.server
import os
import re
import sys

RANGE_RE = re.compile(r"bytes=(\d*)-(\d*)$")


class _Slice:
    """File wrapper that yields at most `remaining` bytes, for copyfileobj."""

    def __init__(self, fileobj, remaining):
        self.fileobj = fileobj
        self.remaining = remaining

    def read(self, size=-1):
        if self.remaining <= 0:
            return b""
        if size is None or size < 0 or size > self.remaining:
            size = self.remaining
        data = self.fileobj.read(size)
        self.remaining -= len(data)
        return data

    def close(self):
        self.fileobj.close()


class RangeHandler(http.server.SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def end_headers(self):
        # Advertise range support on every response, as Pages does.
        self.send_header("Accept-Ranges", "bytes")
        # Never cache during development, so a swapped image or video shows up
        # on a plain reload instead of needing a hard refresh.
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_head(self):
        header = self.headers.get("Range")
        if not header:
            return super().send_head()

        match = RANGE_RE.match(header.strip())
        path = self.translate_path(self.path)
        if not match or os.path.isdir(path):
            return super().send_head()

        try:
            fileobj = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        size = os.fstat(fileobj.fileno()).st_size
        start_raw, end_raw = match.group(1), match.group(2)

        if start_raw == "":
            # Suffix form: the last N bytes.
            if end_raw == "":
                fileobj.close()
                return super().send_head()
            start = max(0, size - int(end_raw))
            end = size - 1
        else:
            start = int(start_raw)
            end = int(end_raw) if end_raw else size - 1

        if start >= size:
            fileobj.close()
            self.send_response(416, "Requested Range Not Satisfiable")
            self.send_header("Content-Range", "bytes */%d" % size)
            self.send_header("Content-Length", "0")
            self.end_headers()
            return None

        end = min(end, size - 1)
        length = end - start + 1
        fileobj.seek(start)

        self.send_response(206, "Partial Content")
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", "bytes %d-%d/%d" % (start, end, size))
        self.send_header("Content-Length", str(length))
        self.end_headers()
        return _Slice(fileobj, length)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    # Threading matters: Safari opens several range requests at once.
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), RangeHandler)
    print("Serving %s at http://localhost:%d  (Ctrl-C to stop)"
          % (os.getcwd(), port))
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nstopped")


if __name__ == "__main__":
    main()
