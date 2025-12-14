"""Import all images from main/img and main/card-img into `static_images` table.
Run with environment variables DB_* set like in the other import script.
"""
import os
import mimetypes
from pathlib import Path
import base64
import psycopg

ROOT = Path(__file__).resolve().parents[1]
MAIN = ROOT / 'main'
IMG_DIRS = [MAIN / 'img', MAIN / 'card-img']

DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_PORT = int(os.environ.get('DB_PORT', 5432))
DB_NAME = os.environ.get('DB_NAME', 'befree_shop')
DB_USER = os.environ.get('DB_USER', 'postgres')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'postgres')

def gather_files():
    files = []
    for d in IMG_DIRS:
        if not d.exists():
            continue
        for p in d.rglob('*'):
            if p.is_file():
                rel = p.relative_to(MAIN)
                files.append((str(rel).replace('\\','/'), p))
    return files


def main():
    files = gather_files()
    if not files:
        print('No image files found in', IMG_DIRS)
        return

    conn = psycopg.connect(host=DB_HOST, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, port=DB_PORT)
    cur = conn.cursor()

    cur.execute("CREATE TABLE IF NOT EXISTS static_images (name TEXT PRIMARY KEY, data BYTEA NOT NULL, mime VARCHAR(255) DEFAULT 'image/jpeg')")
    conn.commit()

    for name, path in files:
        print('Importing', name)
        with open(path, 'rb') as f:
            b = f.read()
        mime, _ = mimetypes.guess_type(str(path))
        if not mime:
            mime = 'image/jpeg'
        try:
            cur.execute("INSERT INTO static_images (name, data, mime) VALUES (%s, %s, %s) ON CONFLICT (name) DO UPDATE SET data = EXCLUDED.data, mime = EXCLUDED.mime",
                        (name, psycopg.Binary(b), mime))
            conn.commit()
        except Exception as e:
            print('Error importing', name, e)
    cur.close()
    conn.close()
    print('Done')

if __name__ == '__main__':
    main()
