
"""Import images from disk into products.image_bytes/image_mime columns.

Usage (from repo root):
    .\.venv\Scripts\Activate.ps1
    python scripts/import_images_to_db.py

It will look at `products.images` JSON (first image path) and try to read that file
relative to repository root or `main/` folder. For each product it writes image_bytes and image_mime.
"""
import os 
import json 
import mimetypes 
from pathlib import Path 
import psycopg 

ROOT =Path (__file__ ).resolve ().parents [1 ]

def get_conn ():
    return psycopg .connect (
    host =os .environ .get ('DB_HOST','localhost'),
    dbname =os .environ .get ('DB_NAME','befree_shop'),
    user =os .environ .get ('DB_USER','postgres'),
    password =os .environ .get ('DB_PASSWORD','postgres'),
    port =int (os .environ .get ('DB_PORT',5432 ))
    )

def find_file (path_str ):
    p =Path (path_str )
    if p .is_absolute ()and p .exists ():
        return p 
    candidates =[ROOT /path_str ,ROOT /'main'/path_str ,ROOT /path_str .lstrip ('./')]
    for c in candidates :
        if c .exists ():
            return c 
    return None 

def main ():
    conn =get_conn ()
    cur =conn .cursor ()
    cur .execute ("SELECT id, images FROM products")
    rows =cur .fetchall ()
    updated =0 
    for r in rows :
        pid =r [0 ]
        imgs =r [1 ]
        if not imgs :
            continue 
        if isinstance (imgs ,str ):
            try :
                imgs =json .loads (imgs )
            except Exception :
                imgs =[]
        if not imgs :
            continue 
        first =imgs [0 ]
        fpath =find_file (first )
        if not fpath :
            print (f"Product {pid }: file not found for {first }")
            continue 
        mime ,_ =mimetypes .guess_type (str (fpath ))
        if not mime :
            mime ='application/octet-stream'
        b =fpath .read_bytes ()
        cur .execute ("UPDATE products SET image_bytes = %s, image_mime = %s WHERE id = %s",(psycopg .Binary (b ),mime ,pid ))
        updated +=1 
    conn .commit ()
    cur .close ()
    conn .close ()
    print (f"Updated {updated } products")

if __name__ =='__main__':
    main ()
