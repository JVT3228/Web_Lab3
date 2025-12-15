import json 
import pytest 
from unittest .mock import MagicMock 

from backend .app import app 


@pytest .fixture 
def client ():
    app .config ['TESTING']=True 
    with app .test_client ()as c :
        yield c 


def make_mock_conn ():
    mock_cur =MagicMock ()
    mock_cur .fetchone =MagicMock ()
    mock_cur .fetchall =MagicMock ()
    mock_conn =MagicMock ()
    mock_conn .cursor =MagicMock (return_value =mock_cur )
    return mock_conn ,mock_cur 


def test_register_success (client ,monkeypatch ):
    mock_conn ,mock_cur =make_mock_conn ()

    mock_cur .fetchone .side_effect =[None ,{'id':1 ,'username':'ivan','email':'ivan@example.com','phone':'+79991112233'}]
    monkeypatch .setattr ('backend.app.get_db_connection',lambda :mock_conn )

    res =client .post ('/api/auth/register',json ={
    'username':'ivan','email':'ivan@example.com','phone':'79991112233','password':'secret'
    })
    assert res .status_code ==201 
    data =res .get_json ()
    assert data ['user']['username']=='ivan'


def test_login_success (client ,monkeypatch ):
    mock_conn ,mock_cur =make_mock_conn ()

    mock_cur .fetchone .return_value ={'id':1 ,'username':'ivan','email':'ivan@example.com','phone':'+79991112233','password_hash':'fake'}
    monkeypatch .setattr ('backend.app.get_db_connection',lambda :mock_conn )

    monkeypatch .setattr ('backend.app.bcrypt.check_password_hash',lambda h ,p :True )

    res =client .post ('/api/auth/login',json ={'login':'ivan@example.com','password':'secret'})
    assert res .status_code ==200 
    data =res .get_json ()
    assert data ['user']['username']=='ivan'


def test_cart_add_guest_requires_session (client ):

    res =client .post ('/api/cart/add',json ={'product_id':1 ,'quantity':1 })
    assert res .status_code ==400 


def test_cart_get_no_args_returns_empty (client ):
    res =client .get ('/api/cart')

    assert res .get_json ()==[]


def test_create_order_requires_auth (client ):
    res =client .post ('/api/orders',json ={'customer_name':'John','customer_phone':'79991234567'})
    assert res .status_code ==401 


def test_add_review_requires_auth (client ):
    res =client .post ('/api/reviews',json ={'product_id':1 ,'rating':5 ,'comment':'Great!'})
    assert res .status_code ==401 


def test_get_product_reviews_no_auth (client ,monkeypatch ):
    mock_conn ,mock_cur =make_mock_conn ()
    mock_cur .fetchall .return_value =[
    {'id':1 ,'user_id':1 ,'username':'user1','rating':5 ,'comment':'Excellent','created_at':'2025-12-14'}
    ]
    monkeypatch .setattr ('backend.app.get_db_connection',lambda :mock_conn )

    res =client .get ('/api/products/1/reviews')
    assert res .status_code ==200 
    reviews =res .get_json ()
    assert len (reviews )==1 
    assert reviews [0 ]['comment']=='Excellent'
