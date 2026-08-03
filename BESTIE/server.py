from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import json
import os

ROOT = Path(__file__).resolve().parent
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.mp4', '.mov', '.m4v'}


def discover_media(root: Path):
    images = []
    media = []
    for path in root.rglob('*'):
        if not path.is_file():
            continue
        if any(part in {'.git', '__pycache__', '.vscode'} for part in path.parts):
            continue
        suffix = path.suffix.lower()
        if suffix in {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic'}:
            images.append(path.relative_to(root).as_posix())
        if suffix in {'.mp4', '.mov', '.m4v'}:
            media.append(path.relative_to(root).as_posix())
    return images, media


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        if self.path == '/api/images':
            images, _ = discover_media(ROOT)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'images': images}).encode('utf-8'))
            return
        if self.path == '/api/media':
            _, media = discover_media(ROOT)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'media': media}).encode('utf-8'))
            return
        return super().do_GET()


if __name__ == '__main__':
    httpd = ThreadingHTTPServer(('0.0.0.0', 8000), Handler)
    print('Serving birthday site on http://localhost:8000')
    httpd.serve_forever()
