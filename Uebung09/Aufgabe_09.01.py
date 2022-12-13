#lokal läuft es, aber nicht geschafft, auf den Server zu laden...

from pyproj import Transformer
import uvicorn
from fastapi import FastAPI

transformer1 = Transformer.from_crs("epsg:4326", "epsg:2056")
transformer2 = Transformer.from_crs("epsg:2056", "epsg:4326")

app = FastAPI()

@app.get("/transform/wgs84lv95")
async def transform(lat: float, lng: float):
    r1 = transformer1.transform(lng, lat)
    return f"""E: {r1[0]} | N: {r1[1]}"""

@app.get("/transform/lv95wgs84")
async def transform(east: float, north: float):
    r2 = transformer2.transform(east, north)
    return f"""lat: {r2[0]} | lon: {r2[1]}"""

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001, root_path="/transform")

#Eingabe-Beispiel für Luzern (Lokal):
#http://127.0.0.1:8001/transform/wgs84lv95?lng=47.05125&lat=8.30730
#http://127.0.0.1:8001/transform/lv95wgs84?east=2666003&north=1211500

#Eingabe-Beispiel für Luzern (Server):
#https://vm29.sourcelab.ch/transform/wgs84lv95?lng=47.05125&lat=8.30730
#https://vm29.sourcelab.ch/transform/lv95wgs84?east=2666003&north=1211500

