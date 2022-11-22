#Stefan Sidler
#Programm funktioniert nicht vollständig. Stürzt beim Erfassen in die Datenbank ab.

import uvicorn
from fastapi  import FastAPI, Depends, status, Request, Form
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_login import LoginManager
from fastapi_login.exceptions import InvalidCredentialsException
from fastapi.responses import RedirectResponse, HTMLResponse
from fastapi.templating import Jinja2Templates
import sqlalchemy
import databases

app = FastAPI()
templates = Jinja2Templates(directory="templates/")


manager = LoginManager("jsk2e1urh3fku371", token_url="/auth/login", use_cookie=True)
manager.cookie_name ="ch.fhnw.testapp_jsaoifsaoufo" #weltweit eindeutiger Name

database = databases.Database('sqlite:///uebung8.db') #Verbindung zur DB aufbauen

#Mehrfachzugriff möglich:
engine = sqlalchemy.create_engine('sqlite:///uebung8.db', connect_args={"check_same_thread": False})

metadata = sqlalchemy.MetaData()

notes = sqlalchemy.Table(
    "notes", metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key = True),
    sqlalchemy.Column("user", sqlalchemy.String),
    sqlalchemy.Column("title", sqlalchemy.String),
    sqlalchemy.Column("text", sqlalchemy.String)
)

metadata.create_all(engine)

#Usernames
DB = {"user1": {"name": "Stefan Sidler",
                "email": "stefan.sidler@students.fhnw.ch",
                "passwort": "12345"},
      "user2": {"name": "Hanspeter Peterhans",
                "email": "hanspeterpeterhans@gmail.com",
                "passwort": "54321"},
      "user3": {"name": "Reto Muster",
                "email": "musterreto@gmail.com",
                "passwort": "helloworld"}
    }

@manager.user_loader()
def load_user(username: str):
    user = DB.get(username)
    return user

@app.post("/auth/login")
def login(data: OAuth2PasswordRequestForm = Depends()):
    username = data.username
    password = data.password
    user = load_user(username)
    
    if not user: 
        raise InvalidCredentialsException #falls User nicht existiert
    
    if user['passwort'] != password:
        raise InvalidCredentialsException #falls das Passwort nicht stimmt

    access_token = manager.create_access_token(
        data = {"sub": username}
    ) 

    resp = RedirectResponse(url="/new", status_code = status.HTTP_302_FOUND) #geändert von private zu new
    manager.set_cookie(resp, access_token)

    return resp

@app.get("/login")
def login():
    file = open("templates/login.html", encoding="utf-8")
    data = file.read()
    file.close()
    return HTMLResponse(content=data)

# @app.get("/private")
# def getSecretPage(user=Depends(manager)):
#     return "Hello " + user["name"] + " your E-Mail is: " + user["email"]

# @app.get("/notes")
# async def read_notes():
#     query = notes.select()
#     return await database.fetch_all(query)

@app.get("/new")
async def create_note(request: Request, user=Depends(manager)):
    return templates.TemplateResponse('form2.html', context={'request': request})

@app.post("/new")
async def post_note(request: Request, titel=Form(), text=Form(), user = Depends(manager)): #geändert letzter Teil
    query = notes.insert().values(title=titel, text=text, user = user["username"]) #geändert letzter Teil
    print(user)
    myid = await database.execute(query)
    return templates.TemplateResponse('form2.html', context={'request': request})

@app.on_event("startup")
async def startup():
    print("Verbinde Datenbank")
    await database.connect() #wartet bis DB verbunden ist

@app.on_event("shutdown")
async def shutdown():
    print("Beende die Datenbank-Verbindung")
    await database.disconnect()


@app.get(f"""/users/user1""" )
async def read_notes():
    query = notes.select().where(notes.c.user== "user1")
    return await database.fetch_all(query)

@app.get(f"""/users/user2""" )
async def read_notes():
    query = notes.select().where(notes.c.user== "user2")
    return await database.fetch_all(query)

@app.get(f"""/users/user3""" )
async def read_notes():
    query = notes.select().where(notes.c.user== "user3")
    return await database.fetch_all(query)


   

uvicorn.run(app, host="127.0.0.1", port=8000)