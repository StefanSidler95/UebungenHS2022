#lokal läuft es, aber nicht geschafft, auf den Server zu laden...

import pyproj
import uvicorn
from fastapi import FastAPI, Response

g = pyproj.Geod(ellps="WGS84")

app = FastAPI()

@app.get("/geodetic/&")
async def line(slat: float, slng: float, elat: float, elng: float): # Eingabe von Start und Endpunkt
    lonlats = g.npts(slng, slat, elng, elat, 50)
    lonlats = [[slng, slat]] + [list(i) for i in lonlats] + [[elng, elat]] 
    lonlats = str(lonlats)
    #s = '"'
    geo = '{"type" : "Feature", "geometry": {"type": "LineString","coordinates": ' + lonlats +'}, "properties": {"about": "Geodetic Line"}}'
    return Response(content=geo)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8002, root_path="/geodetic")

#Eingabebeispiel (Oslo - Mexico City):
#http://127.0.0.1:8002/geodetic/&?slat=59.89&slng=10.62&elat=19.43&elng=-99.07
#Geodätische Linie anschauen unter: https://geojson.tools/

#Eingabebeispiel (auf Server):
#https://vm29.sourcelab.ch/geodetic/&?slat=59.89&slng=10.62&elat=19.43&elng=-99.07