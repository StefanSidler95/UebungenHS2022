#Stefan Sidler
#Programm ausführen mit Intepreter "web"

import uvicorn
from fastapi import FastAPI

app = FastAPI()

#Aufbau CSV-File:
#Ortschaftsname;PLZ;Zusatzziffer;Gemeindename;BFS-Nr;Kantonskürzel;E;N;Sprache

d = {}
file = open("PLZO_CSV_LV95.csv", encoding="utf-8")
next(file)
for line in file:
    daten = line.strip().split(";")
    ortschaft = daten[0]
    zip = daten[1]
    gemeinde = daten[3]
    bfs = daten[4]
    kanton = daten[5]
    d[gemeinde] = {"PLZ": zip, "BFSNr.": bfs, "Ortschaft": ortschaft, "Gemeinde":gemeinde, "Kanton": kanton}


@app.get("/gemeinde")
async def gemeinde(gemeinde: str):
    if gemeinde in d:
        return d[gemeinde]
    
    return {"ERROR": "Gemeinde NOT FOUND"}
        
    
    file.close()

uvicorn.run(app, host="127.0.0.1", port=8000) 

#Beispiel: -----------------------------------------------------------------------------
#Eingabe im Webbrowser:
#http://127.0.0.1:8000/ort?ort=Muttenz
#Ausgabe:
#{"PLZ":"4132","BFSNr.":"2770","Ortschaft":"Muttenz","Gemeinde":"Muttenz","Kanton":"BL"}