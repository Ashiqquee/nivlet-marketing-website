#!/usr/bin/env python3
"""Local static-export preview with byte ranges and the production security headers."""
import json
import re
import shutil
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


def production_headers():
    """Headers from vercel.json, minus the HTTPS-only parts that don't apply on http://127.0.0.1."""
    config = json.loads((Path(__file__).resolve().parents[1] / 'vercel.json').read_text())
    headers = []
    for rule in config.get('headers', []):
        for header in rule['headers']:
            if header['key'] == 'Strict-Transport-Security':
                continue
            value = header['value'].replace('; upgrade-insecure-requests', '')
            headers.append((header['key'], value))
    return headers


class PreviewHandler(SimpleHTTPRequestHandler):
    security_headers = production_headers()

    def send_head(self):
        self.byte_range = None
        path = Path(self.translate_path(self.path))
        requested = self.headers.get('Range')
        if not requested or not path.is_file():
            return super().send_head()
        match = re.fullmatch(r'bytes=(\d*)-(\d*)', requested)
        size = path.stat().st_size
        if not match or not any(match.groups()) or not size:
            return self.unsatisfiable(size)
        first, last = match.groups()
        if first:
            start = int(first)
            end = min(int(last), size - 1) if last else size - 1
        else:
            suffix = int(last)
            if suffix == 0:
                return self.unsatisfiable(size)
            start, end = max(0, size - suffix), size - 1
        if start >= size or start > end:
            return self.unsatisfiable(size)
        source = path.open('rb')
        source.seek(start)
        self.byte_range = (start, end)
        self.send_response(206)
        self.send_header('Content-type', self.guess_type(str(path)))
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.send_header('Content-Length', str(end - start + 1))
        self.end_headers()
        return source

    def unsatisfiable(self, size):
        self.send_response(416)
        self.send_header('Content-Range', f'bytes */{size}')
        self.send_header('Content-Length', '0')
        self.end_headers()
        return None

    def end_headers(self):
        for key, value in self.security_headers:
            self.send_header(key, value)
        if self.byte_range is None:
            self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

    def copyfile(self, source, outputfile):
        if self.byte_range is None:
            shutil.copyfileobj(source, outputfile)
            return
        remaining = self.byte_range[1] - self.byte_range[0] + 1
        while remaining:
            chunk = source.read(min(65536, remaining))
            if not chunk:
                break
            outputfile.write(chunk)
            remaining -= len(chunk)


if __name__ == '__main__':
    export = Path(__file__).resolve().parents[1] / 'out'
    server = ThreadingHTTPServer(('127.0.0.1', 4173), partial(PreviewHandler, directory=str(export)))
    print('Preview: http://127.0.0.1:4173', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
