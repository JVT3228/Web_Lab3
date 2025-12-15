"""
Strip comments from files (JS, CSS, HTML, PY) under a given root.
Creates a backup for each modified file with suffix `.comment_bak`.

Usage: run from workspace root (script auto-detects files).
"""
import io 
import os 
import sys 
import glob 
import tokenize 

ROOT =os .path .abspath (os .path .join (os .path .dirname (__file__ ),'..'))
EXTS =['.js','.css','.html','.htm','.py']

def strip_html_comments (text ):
    out =[]
    i =0 
    n =len (text )
    while i <n :
        if text .startswith ('<!--',i ):
            j =text .find ('-->',i +4 )
            if j ==-1 :

                break 
            i =j +3 
        else :
            out .append (text [i ])
            i +=1 
    return ''.join (out )


def strip_js_css_comments (text ):
    out =[]
    i =0 
    n =len (text )
    in_single =in_double =in_back =False 
    in_block =False 
    in_line =False 
    escape =False 
    while i <n :
        ch =text [i ]
        nxt =text [i +1 ]if i +1 <n else ''
        if in_block :
            if ch =='*'and nxt =='/':
                in_block =False 
                i +=2 
                continue 
            else :
                i +=1 
                continue 
        if in_line :
            if ch =='\n':
                in_line =False 
                out .append (ch )
            i +=1 
            continue 
        if escape :
            out .append (ch )
            escape =False 
            i +=1 
            continue 
        if ch =='\\':

            out .append (ch )
            escape =True 
            i +=1 
            continue 

        if not (in_single or in_double or in_back ):
            if ch =='/'and nxt =='*':
                in_block =True 
                i +=2 
                continue 
            if ch =='/'and nxt =='/':
                in_line =True 
                i +=2 
                continue 

        if ch =='"'and not (in_single or in_back ):
            in_double =not in_double 
            out .append (ch );i +=1 ;continue 
        if ch =="'"and not (in_double or in_back ):
            in_single =not in_single 
            out .append (ch );i +=1 ;continue 
        if ch =='`'and not (in_single or in_double ):
            in_back =not in_back 
            out .append (ch );i +=1 ;continue 
        out .append (ch )
        i +=1 
    return ''.join (out )

def strip_python_comments (text ):
    try :
        bytes_io =io .BytesIO (text .encode ('utf-8'))
        out_tokens =[]
        prev_end =(0 ,0 )
        last_lineno =0 
        last_col =0 
        for tok in tokenize .tokenize (bytes_io .readline ):
            tok_type =tok .type 
            tok_string =tok .string 
            if tok_type ==tokenize .COMMENT :

                continue 
            if tok_type ==tokenize .ENCODING or tok_type ==tokenize .NL :

                out_tokens .append ((tok_type ,tok_string ))
                continue 
            out_tokens .append ((tok_type ,tok_string ))

        return tokenize .untokenize (out_tokens ).decode ('utf-8')
    except Exception :

        lines =[]
        for line in text .splitlines (True ):
            stripped =line .lstrip ()
            if stripped .startswith ('#'):
                continue 

            if '#'in line :

                parts =line .split ('#')
                leading =parts [0 ]
                lines .append (leading .rstrip ()+'\n')
            else :
                lines .append (line )
        return ''.join (lines )

def process_file (path ):
    ext =os .path .splitext (path )[1 ].lower ()
    try :
        with open (path ,'r',encoding ='utf-8')as f :
            text =f .read ()
    except Exception :
        try :
            with open (path ,'r',encoding ='latin-1')as f :
                text =f .read ()
        except Exception as e :
            print ('SKIP (read error):',path ,e )
            return False 
    orig =text 
    new =text 
    if ext in ('.html','.htm'):
        new =strip_html_comments (text )
    elif ext in ('.js','.css'):
        new =strip_js_css_comments (text )
    elif ext =='.py':
        new =strip_python_comments (text )
    else :
        return False 
    if new !=orig :
        bak =path +'.comment_bak'
        if not os .path .exists (bak ):
            with open (bak ,'w',encoding ='utf-8')as f :
                f .write (orig )
        with open (path ,'w',encoding ='utf-8')as f :
            f .write (new )
        print ('Updated:',path )
        return True 
    else :
        print ('No change:',path )
        return False 

if __name__ =='__main__':
    matches =[]
    for ext in EXTS :
        matches .extend (glob .glob (os .path .join (ROOT ,'**','*'+ext ),recursive =True ))
    matches =sorted (set (matches ))
    print ('Found',len (matches ),'files')
    changed =0 
    for p in matches :
        if process_file (p ):changed +=1 
    print ('Done. Modified',changed ,'files. Backups have suffix .comment_bak')
