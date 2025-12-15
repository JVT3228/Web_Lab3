from flask import Flask ,request ,jsonify 
from flask_cors import CORS 
from flask_bcrypt import Bcrypt 
from flask_jwt_extended import JWTManager ,create_access_token ,jwt_required ,get_jwt_identity 
from flask import send_file ,Response ,abort 
import psycopg 
from psycopg import sql 
import re 
import os 
import json 
import base64 
import mimetypes 
from pathlib import Path 
from datetime import datetime ,timedelta 
import jwt as pyjwt 

app =Flask (__name__ )
app .config ['SECRET_KEY']=os .environ .get ('SECRET_KEY','dev-secret')
app .config ['JWT_SECRET_KEY']=os .environ .get ('JWT_SECRET_KEY','jwt-secret')
app .config ['JWT_ACCESS_TOKEN_EXPIRES']=timedelta (hours =24 )

CORS (app ,supports_credentials =True )
bcrypt =Bcrypt (app )
jwt =JWTManager (app )

def get_db_connection ():
    """Подключение к PostgreSQL используя psycopg3"""
    conn =psycopg .connect (
    host =os .environ .get ('DB_HOST','localhost'),
    dbname =os .environ .get ('DB_NAME','befree_shop'),
    user =os .environ .get ('DB_USER','postgres'),
    password =os .environ .get ('DB_PASSWORD','password'),
    port =int (os .environ .get ('DB_PORT',5432 ))
    )
    conn .row_factory =psycopg .rows .dict_row 


    try :
        cur =conn .cursor ()
        cur .execute ("""
            ALTER TABLE order_items 
            ADD COLUMN IF NOT EXISTS product_image VARCHAR(255)
        """)
        conn .commit ()
        cur .close ()
    except :
        pass 

    return conn 

def get_user_id_from_token (token ):
    """Decode JWT token and extract user_id"""
    try :
        if not token :
            return None 
        payload =pyjwt .decode (token ,app .config ['JWT_SECRET_KEY'],algorithms =['HS256'])
        user_id =payload .get ('sub')
        if user_id :
            user_id =int (user_id )
        print (f"DEBUG: Token decoded successfully, user_id={user_id }, payload={payload }")
        return user_id 
    except Exception as e :
        print (f"DEBUG: Token decode error: {e }, token={token [:20 ]if token else 'None'}...")
        return None 


def image_to_data_uri (img_val ):
    """Convert image reference (path, bytes, or already data URI) to data URI string.
    Supports:
    - bytes (bytea from DB)
    - strings that are already data: URIs
    - file paths (relative or absolute) — attempts several resolution strategies
    - URLs (http/https) are returned unchanged
    """
    if not img_val :
        return None 


    if isinstance (img_val ,(bytes ,bytearray )):
        b64 =base64 .b64encode (img_val ).decode ('ascii')
        mime ='image/jpeg'
        return f'data:{mime };base64,{b64 }'

    if isinstance (img_val ,str ):
        img_val =img_val .strip ()
        if img_val .startswith ('data:'):
            return img_val 
        if img_val .startswith ('http://')or img_val .startswith ('https://'):
            return img_val 


        try :
            base_dir =Path (__file__ ).resolve ().parents [1 ]
            candidates =[]
            p =Path (img_val )
            if p .is_absolute ():
                candidates .append (p )
            else :

                candidates .append (base_dir /img_val )

                candidates .append (base_dir /'main'/img_val )

                candidates .append (base_dir /img_val .lstrip ('./'))

            found =None 
            for c in candidates :
                try :
                    if c .exists ()and c .is_file ():
                        found =c 
                        break 
                except Exception :
                    continue 

            if not found :
                return img_val 

            mime ,_ =mimetypes .guess_type (str (found ))
            if not mime :
                mime ='image/jpeg'
            with open (found ,'rb')as f :
                b =f .read ()
            b64 =base64 .b64encode (b ).decode ('ascii')
            return f'data:{mime };base64,{b64 }'
        except Exception :
            return img_val 

    return None 


def normalize_product_images (product ):
    """Ensure product['images'] is a list of data-URIs or safe URLs/paths."""
    if not product :
        return product 
    imgs =product .get ('images')
    if not imgs :
        product ['images']=[]
        return product 

    if isinstance (imgs ,str ):
        try :
            imgs =json .loads (imgs )
        except Exception :
            imgs =[]

    new_imgs =[]
    for it in imgs :
        try :
            data_uri =image_to_data_uri (it )
            if data_uri :
                new_imgs .append (data_uri )
        except Exception :
            continue 
    product ['images']=new_imgs 
    return product 


@app .route ('/images/product/<int:product_id>',methods =['GET'])
def serve_product_image (product_id ):
    """Serve image binary for product (first image) from DB if present, otherwise 404."""
    try :
        conn =get_db_connection ()
        cur =conn .cursor ()
        cur .execute ("SELECT image_bytes, image_mime FROM products WHERE id = %s",(product_id ,))
        r =cur .fetchone ()
        cur .close ();conn .close ()
        if not r :
            return abort (404 )

        if isinstance (r ,dict ):
            data =r .get ('image_bytes')
            mime =r .get ('image_mime')or 'image/jpeg'
        else :
            data =r [0 ]
            mime =r [1 ]or 'image/jpeg'
        if not data :
            return abort (404 )
        return Response (data ,mimetype =mime )
    except Exception as e :
        return jsonify ({'error':str (e )}),500 


@app .route ('/images/static/<path:filename>',methods =['GET'])
def serve_static_image (filename ):
    """Serve static images stored in DB table `static_images` by name.
    Filename should be the path relative to `main/`, e.g. `img/logo.png` or `card-img/longsliv11.jpg`.
    """
    try :
        conn =get_db_connection ()
        cur =conn .cursor ()
        cur .execute ("SELECT data, mime FROM static_images WHERE name = %s",(filename ,))
        r =cur .fetchone ()
        cur .close ();conn .close ()
        if not r :
            return abort (404 )
        if isinstance (r ,dict ):
            data =r .get ('data')
            mime =r .get ('mime')or 'image/jpeg'
        else :
            data =r [0 ]
            mime =r [1 ]or 'image/jpeg'
        if not data :
            return abort (404 )
        return Response (data ,mimetype =mime )
    except Exception as e :
        return jsonify ({'error':str (e )}),500 


@app .route ('/api/users/<int:user_id>/avatar',methods =['GET'])
def get_user_avatar (user_id ):
    try :
        conn =get_db_connection ()
        cur =conn .cursor ()
        cur .execute ("SELECT avatar, avatar_mime FROM users WHERE id = %s",(user_id ,))
        r =cur .fetchone ()
        cur .close ();conn .close ()
        if not r :
            return abort (404 )
        if isinstance (r ,dict ):
            data =r .get ('avatar')
            mime =r .get ('avatar_mime')or 'image/jpeg'
        else :
            data =r [0 ]
            mime =r [1 ]or 'image/jpeg'
        if not data :
            return abort (404 )
        return Response (data ,mimetype =mime )
    except Exception as e :
        return jsonify ({'error':str (e )}),500 


@app .route ('/api/users/me/avatar',methods =['POST'])
def upload_my_avatar ():

    user_id =None 
    auth_header =request .headers .get ('Authorization','')
    if auth_header .startswith ('Bearer '):
        token =auth_header [7 :]
        user_id =get_user_id_from_token (token )
    if not user_id :
        return jsonify ({'error':'Not authenticated'}),401 


    try :
        file =None 
        mime =None 
        if 'avatar'in request .files :
            f =request .files ['avatar']
            file =f .read ()
            mime =f .mimetype or mimetypes .guess_type (f .filename )[0 ]or 'image/jpeg'
        else :
            data =request .get_json (silent =True )or {}
            avatar_data =data .get ('avatar')
            if avatar_data and isinstance (avatar_data ,str )and avatar_data .startswith ('data:'):
                header ,b64 =avatar_data .split (',',1 )
                mime =header .split (';')[0 ].split (':')[1 ]if ';'in header else 'image/jpeg'
                file =base64 .b64decode (b64 )

        if not file :
            return jsonify ({'error':'No avatar provided'}),400 

        conn =get_db_connection ()
        cur =conn .cursor ()
        cur .execute ("UPDATE users SET avatar = %s, avatar_mime = %s WHERE id = %s",(psycopg .Binary (file ),mime ,user_id ))
        conn .commit ()
        cur .close ();conn .close ()
        return jsonify ({'message':'Avatar uploaded'})
    except Exception as e :
        return jsonify ({'error':str (e )}),500 


@app .route ('/api/users/me/avatar',methods =['DELETE'])
def delete_my_avatar ():
    user_id =None 
    auth_header =request .headers .get ('Authorization','')
    if auth_header .startswith ('Bearer '):
        token =auth_header [7 :]
        user_id =get_user_id_from_token (token )
    if not user_id :
        return jsonify ({'error':'Not authenticated'}),401 
    try :
        conn =get_db_connection ()
        cur =conn .cursor ()
        cur .execute ("UPDATE users SET avatar = NULL, avatar_mime = NULL WHERE id = %s",(user_id ,))
        conn .commit ()
        cur .close ();conn .close ()
        return jsonify ({'message':'Avatar deleted'})
    except Exception as e :
        return jsonify ({'error':str (e )}),500 

def validate_phone (phone ):
    cleaned =re .sub (r'\D','',phone or '')
    if len (cleaned )==11 and cleaned .startswith ('7'):
        return cleaned 
    elif len (cleaned )==10 :
        return '7'+cleaned 
    else :
        return None 

@app .route ('/api/auth/register',methods =['POST'])
def register ():
    data =request .json or {}
    required =['username','email','phone','password']
    if not all (k in data and data [k ]for k in required ):
        return jsonify ({'error':'Missing required fields'}),400 


    username =(data .get ('username')or '').strip ()
    email =(data .get ('email')or '').strip ()
    phone_clean =validate_phone (data .get ('phone'))
    password =data .get ('password')or ''
    confirm =data .get ('confirmPassword')or data .get ('confirm')

    if not phone_clean :
        return jsonify ({'error':'Invalid phone format'}),400 
    if len (username )<3 or len (username )>50 :
        return jsonify ({'error':'Username must be between 3 and 50 characters'}),400 
    if len (password )<6 :
        return jsonify ({'error':'Password must be at least 6 characters'}),400 
    if confirm is not None and password !=confirm :
        return jsonify ({'error':'Password and confirmation do not match'}),400 

    password_hash =bcrypt .generate_password_hash (password ).decode ('utf-8')

    try :
        conn =get_db_connection ()
        cur =conn .cursor ()

        cur .execute ("""
            SELECT id FROM users WHERE email = %s OR phone_clean = %s OR username = %s
        """,(data ['email'],phone_clean ,data ['username']))

        if cur .fetchone ():
            cur .close ()
            conn .close ()
            return jsonify ({'error':'User already exists'}),400 

        cur .execute ("""
            INSERT INTO users (username, email, phone, phone_clean, password_hash)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, username, email, phone
        """,(data ['username'],data ['email'],data ['phone'],phone_clean ,password_hash ))

        user =cur .fetchone ()
        conn .commit ()
        cur .close ()
        conn .close ()

        access_token =create_access_token (identity =str (user ['id']))
        return jsonify ({'message':'User created','user':user ,'token':access_token }),201 

    except Exception as e :
        return jsonify ({'error':str (e )}),500 

@app .route ('/api/auth/login',methods =['POST'])
def login ():
    data =request .json or {}
    if not data .get ('login')or not data .get ('password'):
        return jsonify ({'error':'Missing credentials'}),400 

    try :
        conn =get_db_connection ()
        cur =conn .cursor ()

        cur .execute ("""
            SELECT id, username, email, phone, phone_clean, password_hash
            FROM users WHERE email = %s OR phone = %s OR phone_clean = %s
        """,(data ['login'],data ['login'],data ['login']))

        user =cur .fetchone ()
        cur .close ()
        conn .close ()

        if not user :
            return jsonify ({'error':'User not found'}),404 

        if not bcrypt .check_password_hash (user ['password_hash'],data ['password']):
            return jsonify ({'error':'Invalid password'}),401 

        access_token =create_access_token (identity =str (user ['id']))
        user .pop ('password_hash',None )
        return jsonify ({'message':'Login successful','user':user ,'token':access_token })

    except Exception as e :
        return jsonify ({'error':str (e )}),500 

@app .route ('/api/auth/me',methods =['GET'])
def me ():

    user_id =None 
    auth_header =request .headers .get ('Authorization','')
    if auth_header .startswith ('Bearer '):
        token =auth_header [7 :]
        user_id =get_user_id_from_token (token )

    if not user_id :
        return jsonify ({'error':'Not authenticated'}),401 

    try :
        conn =get_db_connection ()
        cur =conn .cursor ()
        cur .execute ("SELECT id, username, email, phone, created_at FROM users WHERE id = %s",(user_id ,))
        user =cur .fetchone ()
        cur .close ()
        conn .close ()
        if not user :
            return jsonify ({}),404 
        return jsonify (dict (user ))
    except Exception as e :
        return jsonify ({'error':str (e )}),500 

@app .route ('/api/products',methods =['GET'])
def get_products ():
    try :
        conn =get_db_connection ()
        cur =conn .cursor ()
        cur .execute ("SELECT * FROM products WHERE is_available = TRUE ORDER BY id")
        products =[dict (row )for row in cur .fetchall ()]
        for p in products :
            if p .get ('images')and isinstance (p ['images'],str ):
                try :
                    p ['images']=json .loads (p ['images'])
                except Exception :
                    p ['images']=[]

            normalize_product_images (p )

            if 'image_bytes'in p :
                p .pop ('image_bytes',None )
            if 'image_mime'in p :
                p .pop ('image_mime',None )
        cur .close ()
        conn .close ()
        return jsonify (products )
    except Exception as e :
        return jsonify ({'error':str (e )}),500 

@app .route ('/api/products/<int:product_id>',methods =['GET'])
def get_product (product_id ):
    try :
        conn =get_db_connection ()
        cur =conn .cursor ()
        cur .execute ("SELECT * FROM products WHERE id = %s",(product_id ,))
        p =cur .fetchone ()
        cur .close ()
        conn .close ()
        if not p :
            return jsonify ({'error':'Not found'}),404 

        normalize_product_images (p )

        if isinstance (p ,dict ):
            p .pop ('image_bytes',None )
            p .pop ('image_mime',None )
        return jsonify (p )
    except Exception as e :
        return jsonify ({'error':str (e )}),500 

@app .route ('/api/products/category/<category>',methods =['GET'])
def get_products_by_category (category ):
    try :
        conn =get_db_connection ()
        cur =conn .cursor ()
        cur .execute ("SELECT * FROM products WHERE category = %s AND is_available = TRUE ORDER BY id",(category ,))
        products =[dict (row )for row in cur .fetchall ()]
        cur .close ()
        conn .close ()
        for p in products :
            normalize_product_images (p )

            p .pop ('image_bytes',None )
            p .pop ('image_mime',None )
        return jsonify (products )
    except Exception as e :
        return jsonify ({'error':str (e )}),500 

@app .route ('/api/cart',methods =['GET'])
def get_cart ():
    try :

        user_id =None 
        auth_header =request .headers .get ('Authorization','')
        if auth_header .startswith ('Bearer '):
            token =auth_header [7 :]
            user_id =get_user_id_from_token (token )

        session_id =request .args .get ('session_id')
        conn =get_db_connection ()
        cur =conn .cursor ()
        if user_id :
            cur .execute ("""
                SELECT c.id, c.user_id, c.product_id, c.quantity, p.name, p.price, p.images
                FROM cart c JOIN products p ON c.product_id = p.id
                WHERE c.user_id = %s
            """,(user_id ,))
        elif session_id :
            cur .execute ("""
                SELECT c.id, c.session_id, c.product_id, c.quantity, p.name, p.price, p.images
                FROM cart c JOIN products p ON c.product_id = p.id
                WHERE c.session_id = %s AND c.user_id IS NULL
            """,(session_id ,))
        else :
            return jsonify ([])

        items =[dict (row )for row in cur .fetchall ()]
        total =0.0 
        for it in items :
            if it .get ('images')and isinstance (it ['images'],str ):
                try :
                    imgs =json .loads (it ['images'])
                except Exception :
                    imgs =[]
            else :
                imgs =it .get ('images')or []
            it ['image']=imgs [0 ]if imgs else None 
            it ['subtotal']=float (it ['price'])*int (it ['quantity'])
            total +=it ['subtotal']


            try :
                it ['image']=image_to_data_uri (it .get ('image'))
            except Exception :
                pass 
        cur .close ()
        conn .close ()
        return jsonify ({'items':items ,'total':total ,'total_items':int (total )if total %1 ==0 else len (items )})
    except Exception as e :
        return jsonify ({'error':str (e )}),500 

@app .route ('/api/cart/add',methods =['POST'])
def add_to_cart ():
    data =request .json or {}

    user_id =None 
    auth_header =request .headers .get ('Authorization','')
    if auth_header .startswith ('Bearer '):
        token =auth_header [7 :]
        user_id =get_user_id_from_token (token )

    session_id =data .get ('session_id')
    product_id =data .get ('product_id')
    quantity =int (data .get ('quantity')or 1 )
    if not product_id :
        return jsonify ({'error':'product_id required'}),400 

    try :
        conn =get_db_connection ()
        cur =conn .cursor ()
        if user_id :
            cur .execute ("SELECT id, quantity FROM cart WHERE user_id = %s AND product_id = %s",(user_id ,product_id ))
            r =cur .fetchone ()
            if r :
                cur .execute ("UPDATE cart SET quantity = quantity + %s WHERE user_id = %s AND product_id = %s",(quantity ,user_id ,product_id ))
            else :
                cur .execute ("INSERT INTO cart (user_id, product_id, quantity) VALUES (%s, %s, %s)",(user_id ,product_id ,quantity ))
        else :
            if not session_id :
                return jsonify ({'error':'session_id required for guest cart'}),400 
            cur .execute ("SELECT id, quantity FROM cart WHERE session_id = %s AND user_id IS NULL AND product_id = %s",(session_id ,product_id ))
            r =cur .fetchone ()
            if r :
                cur .execute ("UPDATE cart SET quantity = quantity + %s WHERE session_id = %s AND product_id = %s",(quantity ,session_id ,product_id ))
            else :
                cur .execute ("INSERT INTO cart (session_id, product_id, quantity) VALUES (%s, %s, %s)",(session_id ,product_id ,quantity ))

        conn .commit ()
        cur .close ()
        conn .close ()
        return jsonify ({'message':'Added to cart'})
    except Exception as e :
        return jsonify ({'error':str (e )}),500 

@app .route ('/api/cart/update/<int:item_id>',methods =['PUT'])
def update_cart (item_id ):
    data =request .json or {}
    qty =int (data .get ('quantity')or 1 )
    if qty <=0 :
        return jsonify ({'error':'Quantity must be > 0'}),400 
    try :
        conn =get_db_connection ()
        cur =conn .cursor ()
        cur .execute ("UPDATE cart SET quantity = %s WHERE id = %s",(qty ,item_id ))
        conn .commit ()
        cur .close ()
        conn .close ()
        return jsonify ({'message':'Updated'})
    except Exception as e :
        return jsonify ({'error':str (e )}),500 

@app .route ('/api/cart/remove/<int:item_id>',methods =['DELETE'])
def remove_cart (item_id ):
    try :
        conn =get_db_connection ()
        cur =conn .cursor ()
        cur .execute ("DELETE FROM cart WHERE id = %s",(item_id ,))
        conn .commit ()
        cur .close ()
        conn .close ()
        return jsonify ({'message':'Removed'})
    except Exception as e :
        return jsonify ({'error':str (e )}),500 

@app .route ('/api/cart/total',methods =['GET','OPTIONS'])
def cart_total ():
    if request .method =='OPTIONS':
        return '',200 
    try :

        user_id =None 
        auth_header =request .headers .get ('Authorization','')
        if auth_header .startswith ('Bearer '):
            token =auth_header [7 :]
            user_id =get_user_id_from_token (token )
        session_id =request .args .get ('session_id')
        conn =get_db_connection ()
        cur =conn .cursor ()
        if user_id :
            cur .execute ("SELECT COALESCE(SUM(p.price * c.quantity),0) AS total, COALESCE(SUM(c.quantity),0) AS total_items FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = %s",(user_id ,))
        elif session_id :
            cur .execute ("SELECT COALESCE(SUM(p.price * c.quantity),0) AS total, COALESCE(SUM(c.quantity),0) AS total_items FROM cart c JOIN products p ON c.product_id = p.id WHERE c.session_id = %s AND c.user_id IS NULL",(session_id ,))
        else :
            cur .close ()
            conn .close ()
            return jsonify ({'total':0.0 ,'total_items':0 })

        r =cur .fetchone ()

        if r :
            try :
                row =dict (r )
                total =float (row .get ('total',0 )or 0 )
                total_items =int (row .get ('total_items',0 )or 0 )
            except Exception :

                total =float (r [0 ])if r [0 ]is not None else 0.0 
                total_items =int (r [1 ])if r [1 ]is not None else 0 
        else :
            total =0.0 
            total_items =0 
        cur .close ()
        conn .close ()
        return jsonify ({'total':total ,'total_items':total_items })
    except Exception as e :
        return jsonify ({'error':str (e )}),500 


@app .route ('/api/cart/merge',methods =['POST'])
def merge_cart ():

    user_id =None 
    auth_header =request .headers .get ('Authorization','')
    if auth_header .startswith ('Bearer '):
        token =auth_header [7 :]
        user_id =get_user_id_from_token (token )

    if not user_id :
        return jsonify ({'error':'Not authenticated'}),401 

    data =request .json or {}
    session_id =data .get ('session_id')
    if not session_id :
        return jsonify ({'error':'session_id required'}),400 
    try :
        conn =get_db_connection ()
        cur =conn .cursor ()


        cur .execute ("SELECT product_id, quantity FROM cart WHERE session_id = %s AND user_id IS NULL",(session_id ,))
        session_items =[dict (row )for row in cur .fetchall ()]

        for pid ,qty in session_items :

            cur .execute ("SELECT id FROM cart WHERE user_id = %s AND product_id = %s",(user_id ,pid ))
            existing =cur .fetchone ()
            if existing :
                cur .execute ("UPDATE cart SET quantity = quantity + %s WHERE user_id = %s AND product_id = %s",(qty ,user_id ,pid ))
            else :
                cur .execute ("INSERT INTO cart (user_id, product_id, quantity) VALUES (%s, %s, %s)",(user_id ,pid ,qty ))


        cur .execute ("DELETE FROM cart WHERE session_id = %s AND user_id IS NULL",(session_id ,))
        conn .commit ()
        cur .close ()
        conn .close ()
        return jsonify ({'message':'Cart merged'})
    except Exception as e :
        return jsonify ({'error':str (e )}),500 


@app .route ('/api/orders',methods =['POST'])
def create_order ():

    user_id =None 
    auth_header =request .headers .get ('Authorization','')
    if auth_header .startswith ('Bearer '):
        token =auth_header [7 :]
        user_id =get_user_id_from_token (token )

    if not user_id :
        return jsonify ({'error':'Not authenticated'}),401 

    data =request .json or {}
    customer_name =data .get ('customer_name')
    customer_phone =data .get ('customer_phone')
    customer_email =data .get ('customer_email')
    shipping_address =data .get ('shipping_address')
    payment_method =data .get ('payment_method')

    if not customer_name or not customer_phone :
        return jsonify ({'error':'Customer name and phone required'}),400 

    try :
        conn =get_db_connection ()
        cur =conn .cursor ()


        cur .execute ("SELECT c.product_id, c.quantity, p.name, p.price, p.image_url FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = %s",(user_id ,))
        items =[dict (row )for row in cur .fetchall ()]
        if not items :
            cur .close ();conn .close ();
            return jsonify ({'error':'Cart is empty'}),400 

        total =0.0 
        for it in items :
            total +=float (it ['price'])*int (it ['quantity'])

        order_number ='ORD-'+datetime .utcnow ().strftime ('%Y%m%d%H%M%S')+'-'+str (user_id )

        cur .execute ("""
            INSERT INTO orders (order_number, user_id, customer_name, customer_phone, customer_email, shipping_address, total_amount, payment_method)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """,(order_number ,user_id ,customer_name ,customer_phone ,customer_email ,shipping_address ,total ,payment_method ))

        order_row =cur .fetchone ()
        order_id =order_row ['id']


        for it in items :
            product_image =it .get ('image_url')or ''

            if not product_image :
                product_image =f'/images/products/{it ["product_id"]}'
            try :
                cur .execute ("INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, product_image) VALUES (%s, %s, %s, %s, %s, %s)",
                (order_id ,it ['product_id'],it ['name'],it ['price'],it ['quantity'],product_image ))
            except :

                cur .execute ("INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity) VALUES (%s, %s, %s, %s, %s)",
                (order_id ,it ['product_id'],it ['name'],it ['price'],it ['quantity']))


        cur .execute ("DELETE FROM cart WHERE user_id = %s",(user_id ,))

        conn .commit ()
        cur .close ()
        conn .close ()

        return jsonify ({'message':'Order created','order_id':order_id ,'order_number':order_number }),201 

    except Exception as e :
        return jsonify ({'error':str (e )}),500 


@app .route ('/api/orders',methods =['GET'])
def list_orders ():

    user_id =None 
    auth_header =request .headers .get ('Authorization','')
    if auth_header .startswith ('Bearer '):
        token =auth_header [7 :]
        user_id =get_user_id_from_token (token )

    if not user_id :
        return jsonify ({'error':'Not authenticated'}),401 

    try :
        conn =get_db_connection ()
        cur =conn .cursor ()
        cur .execute ("SELECT * FROM orders WHERE user_id = %s ORDER BY created_at DESC",(user_id ,))
        orders =[dict (row )for row in cur .fetchall ()]


        for order in orders :
            cur .execute ("SELECT COUNT(*) as items_count FROM order_items WHERE order_id = %s",(order ['id'],))
            items_count =cur .fetchone ()
            order ['items_count']=items_count ['items_count']if items_count else 0 

        cur .close ();conn .close ()
        return jsonify (orders )
    except Exception as e :
        return jsonify ({'error':str (e )}),500 


@app .route ('/api/orders/<int:order_id>',methods =['GET'])
def get_order (order_id ):

    user_id =None 
    auth_header =request .headers .get ('Authorization','')
    if auth_header .startswith ('Bearer '):
        token =auth_header [7 :]
        user_id =get_user_id_from_token (token )

    if not user_id :
        return jsonify ({'error':'Not authenticated'}),401 

    try :
        conn =get_db_connection ()
        cur =conn .cursor ()
        cur .execute ("SELECT * FROM orders WHERE id = %s AND user_id = %s",(order_id ,user_id ))
        order =cur .fetchone ()
        if not order :
            cur .close ();conn .close ();
            return jsonify ({'error':'Not found'}),404 
        cur .execute ("SELECT * FROM order_items WHERE order_id = %s",(order_id ,))
        items =[dict (row )for row in cur .fetchall ()]
        cur .close ();conn .close ()
        order_dict =dict (order )
        order_dict ['items']=items 
        return jsonify (order_dict )
    except Exception as e :
        return jsonify ({'error':str (e )}),500 


@app .route ('/api/orders/<int:order_id>/cancel',methods =['PUT'])
def cancel_order (order_id ):

    user_id =None 
    auth_header =request .headers .get ('Authorization','')
    if auth_header .startswith ('Bearer '):
        token =auth_header [7 :]
        user_id =get_user_id_from_token (token )

    if not user_id :
        return jsonify ({'error':'Not authenticated'}),401 

    try :
        conn =get_db_connection ()
        cur =conn .cursor ()
        cur .execute ("SELECT status FROM orders WHERE id = %s AND user_id = %s",(order_id ,user_id ))
        r =cur .fetchone ()
        if not r :
            cur .close ();conn .close ();
            return jsonify ({'error':'Order not found'}),404 
        status =dict (r ).get ('status')if hasattr (r ,'__getitem__')else getattr (r ,'status',None )
        if status in ('shipped','delivered'):
            cur .close ();conn .close ();
            return jsonify ({'error':'Cannot cancel shipped/delivered order'}),400 
        cur .execute ("UPDATE orders SET status = 'cancelled' WHERE id = %s",(order_id ,))
        conn .commit ()
        cur .close ();conn .close ()
        return jsonify ({'message':'Order cancelled'})
    except Exception as e :
        return jsonify ({'error':str (e )}),500 


@app .route ('/api/products/<int:product_id>/reviews',methods =['GET'])
def get_product_reviews (product_id ):
    try :

        user_id =None 
        auth_header =request .headers .get ('Authorization','')
        if auth_header .startswith ('Bearer '):
            token =auth_header [7 :]
            user_id =get_user_id_from_token (token )

        conn =get_db_connection ()
        cur =conn .cursor ()
        cur .execute ("SELECT r.id, r.user_id, u.username, r.rating, r.comment, r.created_at, (u.avatar IS NOT NULL) AS has_avatar FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = %s ORDER BY r.created_at DESC",(product_id ,))
        reviews =[dict (row )for row in cur .fetchall ()]

        for rv in reviews :
            try :
                rv ['is_owner']=(user_id is not None and int (rv .get ('user_id')or 0 )==int (user_id ))
            except Exception :
                rv ['is_owner']=False 

            try :
                if rv .get ('has_avatar'):
                    base =request .host_url .rstrip ('/')
                    rv ['avatar']=f"{base }/api/users/{rv .get ('user_id')}/avatar"
                else :
                    rv ['avatar']=None 
            except Exception :
                rv ['avatar']=None 
        cur .close ();conn .close ()
        return jsonify (reviews )
    except Exception as e :
        return jsonify ({'error':str (e )}),500 


@app .route ('/api/products/search',methods =['GET','POST'])
def search_products ():
    data =(request .json or {})if request .method =='POST'else request .args 
    query =(data .get ('query')or '').strip ()
    category =(data .get ('category')or '').strip ()
    min_price =data .get ('min_price')
    max_price =data .get ('max_price')
    color =(data .get ('color')or '').strip ()
    sort_by =data .get ('sort_by','name')

    try :
        min_price =float (min_price )if min_price else 0 
        max_price =float (max_price )if max_price else 999999 
    except Exception :
        min_price ,max_price =0 ,999999 

    try :
        conn =get_db_connection ()
        cur =conn .cursor ()


        where_parts =["is_available = TRUE"]
        params =[]

        if query and len (query )>=2 :
            where_parts .append ("(to_tsvector('russian', name || ' ' || COALESCE(description, '')) @@ plainto_tsquery('russian', %s) OR name ILIKE %s)")
            params .extend ([query ,f'%{query }%'])

        if category :
            where_parts .append ("category = %s")
            params .append (category )

        if min_price or max_price :
            where_parts .append ("price BETWEEN %s AND %s")
            params .extend ([min_price ,max_price ])

        if color :
            where_parts .append ("characteristics::text ILIKE %s")
            params .append (f'%{color }%')

        where_clause =" AND ".join (where_parts )


        order_clause ="name ASC"
        if sort_by =='price':
            order_clause ="price ASC"
        elif sort_by =='-price':
            order_clause ="price DESC"
        elif sort_by =='newest':
            order_clause ="id DESC"

        query_str =f"""
            SELECT id, name, description, price, category, images, characteristics, stock_quantity
            FROM products
            WHERE {where_clause }
            ORDER BY {order_clause }
            LIMIT 100
        """

        cur .execute (query_str ,params )
        results =[dict (row )for row in cur .fetchall ()]


        for p in results :
            normalize_product_images (p )
            if 'image_bytes'in p :
                p .pop ('image_bytes',None )
            if 'image_mime'in p :
                p .pop ('image_mime',None )

        cur .close ();conn .close ()
        return jsonify ({'results':results ,'count':len (results )})
    except Exception as e :
        return jsonify ({'error':str (e )}),500 

@app .route ('/api/products/search/suggestions',methods =['GET'])
def search_suggestions ():
    """Автодополнение — популярные названия и артикулы товаров"""
    query =(request .args .get ('q')or '').strip ()
    if not query or len (query )<2 :
        return jsonify ([])
    try :
        conn =get_db_connection ()
        cur =conn .cursor ()
        cur .execute ("""
            SELECT DISTINCT name FROM products
            WHERE (name ILIKE %s OR id::text LIKE %s) AND is_available = TRUE
            LIMIT 10
        """,(f'%{query }%',f'%{query }%'))
        suggestions =[row ['name']for row in cur .fetchall ()]
        cur .close ();conn .close ()
        return jsonify (suggestions )
    except Exception as e :
        return jsonify ({'error':str (e )}),500 

@app .route ('/api/products/filters',methods =['GET'])
def get_filters ():
    """Доступные значения для фильтров (категории, цвета, диапазоны цен)"""
    try :
        conn =get_db_connection ()
        cur =conn .cursor ()


        cur .execute ("SELECT DISTINCT category FROM products WHERE is_available = TRUE ORDER BY category")
        categories =[row ['category']for row in cur .fetchall ()]


        cur .execute ("SELECT MIN(price) as min_price, MAX(price) as max_price FROM products WHERE is_available = TRUE")
        price_row =cur .fetchone ()
        min_price =float (price_row ['min_price']or 0 )
        max_price =float (price_row ['max_price']or 0 )


        cur .execute ("SELECT DISTINCT characteristics FROM products WHERE is_available = TRUE AND characteristics IS NOT NULL LIMIT 100")
        colors_set =set ()
        for row in cur .fetchall ():
            try :
                chars =row ['characteristics']
                if isinstance (chars ,str ):
                    chars =json .loads (chars )
                if isinstance (chars ,dict )and 'цвет'in chars :
                    colors_set .add (chars ['цвет'])
            except Exception :
                pass 
        colors =sorted (list (colors_set ))

        cur .close ();conn .close ()
        return jsonify ({
        'categories':categories ,
        'min_price':min_price ,
        'max_price':max_price ,
        'colors':colors 
        })
    except Exception as e :
        return jsonify ({'error':str (e )}),500 


@app .route ('/api/reviews',methods =['POST'])
def add_review ():

    user_id =None 
    auth_header =request .headers .get ('Authorization','')
    if auth_header .startswith ('Bearer '):
        token =auth_header [7 :]
        user_id =get_user_id_from_token (token )

    if not user_id :
        return jsonify ({'error':'Not authenticated'}),401 

    data =request .json or {}
    product_id =data .get ('product_id')
    try :
        rating =int (data .get ('rating')or 0 )
    except Exception :
        rating =0 
    comment =(data .get ('comment')or '').strip ()

    if not product_id :
        return jsonify ({'error':'product_id required'}),400 
    if rating <1 or rating >5 :
        return jsonify ({'error':'rating must be between 1 and 5'}),400 
    if not comment or len (comment )>1000 :
        return jsonify ({'error':'Invalid comment (required, max 1000 chars)'}),400 
    try :
        conn =get_db_connection ()
        cur =conn .cursor ()

        cur .execute ("SELECT id FROM products WHERE id = %s",(product_id ,))
        if not cur .fetchone ():
            cur .close ();conn .close ();
            return jsonify ({'error':'Product not found'}),404 

        cur .execute ("SELECT id FROM reviews WHERE user_id = %s AND product_id = %s",(user_id ,product_id ))
        if cur .fetchone ():
            cur .close ();conn .close ();
            return jsonify ({'error':'Review already exists'}),400 
        cur .execute ("INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (%s, %s, %s, %s) RETURNING id",(user_id ,product_id ,rating ,comment ))
        row =cur .fetchone ()
        conn .commit ()
        cur .close ();conn .close ()
        return jsonify ({'message':'Review added','id':row ['id']}),201 
    except Exception as e :
        return jsonify ({'error':str (e )}),500 


@app .route ('/api/reviews/<int:review_id>',methods =['PUT'])
def edit_review (review_id ):

    user_id =None 
    auth_header =request .headers .get ('Authorization','')
    if auth_header .startswith ('Bearer '):
        token =auth_header [7 :]
        user_id =get_user_id_from_token (token )

    if not user_id :
        return jsonify ({'error':'Not authenticated'}),401 

    data =request .json or {}
    try :
        rating =int (data .get ('rating')or 0 )
    except Exception :
        rating =0 
    comment =(data .get ('comment')or '').strip ()
    if rating <1 or rating >5 :
        return jsonify ({'error':'rating must be between 1 and 5'}),400 
    if not comment or len (comment )>1000 :
        return jsonify ({'error':'Invalid comment (required, max 1000 chars)'}),400 
    try :
        conn =get_db_connection ()
        cur =conn .cursor ()
        cur .execute ("SELECT user_id FROM reviews WHERE id = %s",(review_id ,))
        r =cur .fetchone ()
        if not r or dict (r ).get ('user_id')!=user_id :
            cur .close ();conn .close ();
            return jsonify ({'error':'Not allowed'}),403 
        cur .execute ("UPDATE reviews SET rating = %s, comment = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",(rating ,comment ,review_id ))
        conn .commit ()
        cur .close ();conn .close ()
        return jsonify ({'message':'Updated'})
    except Exception as e :
        return jsonify ({'error':str (e )}),500 


@app .route ('/api/reviews/<int:review_id>',methods =['DELETE'])
def delete_review (review_id ):

    user_id =None 
    auth_header =request .headers .get ('Authorization','')
    if auth_header .startswith ('Bearer '):
        token =auth_header [7 :]
        user_id =get_user_id_from_token (token )

    if not user_id :
        return jsonify ({'error':'Not authenticated'}),401 

    try :
        conn =get_db_connection ()
        cur =conn .cursor ()
        cur .execute ("SELECT user_id FROM reviews WHERE id = %s",(review_id ,))
        r =cur .fetchone ()
        if not r or dict (r ).get ('user_id')!=user_id :
            cur .close ();conn .close ();
            return jsonify ({'error':'Not allowed'}),403 
        cur .execute ("DELETE FROM reviews WHERE id = %s",(review_id ,))
        conn .commit ()
        cur .close ();conn .close ()
        return jsonify ({'message':'Deleted'})
    except Exception as e :
        return jsonify ({'error':str (e )}),500 

if __name__ =='__main__':
    app .run (debug =True ,port =5000 ,use_reloader =False )
