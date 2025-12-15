import sys 
try :
    import psycopg 
    print ('psycopg imported')
    tried =[]
    creds =[
    ('postgres','password'),
    ('postgres','postgres'),
    ('postgres',''),
    ]
    success =False 
    for user ,pwd in creds :
        try :
            print (f"Trying user={user !r } pwd={pwd !r }")
            conn =psycopg .connect (host ='localhost',dbname ='befree_shop',user =user ,password =pwd ,port =5432 ,connect_timeout =5 )
            print ('connected with',user ,pwd )
            conn .close ()
            success =True 
            break 
        except Exception as e :
            print ('failed:',type (e ).__name__ ,e )
            tried .append ((user ,pwd ,str (e )))
    if not success :
        print ('All attempts failed')
        for t in tried :
            print (t [0 ],t [1 ],t [2 ])
        sys .exit (1 )
except Exception as e :
    print ('ERROR:',type (e ).__name__ ,e )
    sys .exit (1 )
