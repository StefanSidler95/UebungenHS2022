import pyproj
import uvicorn
from fastapi import FastAPI, Response
g = pyproj.Geod(ellps="WGS84")

app = FastAPI()

@app.get("/geodetic/&")
async def line(slat: float, slng: float, elat: float, elng: float):
    lonlats = g.npts(slng, slat, elng, elat, 30)
    lonlats = [[slng, slat]] + [list(i) for i in lonlats] + [[elng, elat]] ## add start and end point
    lonlats = str(lonlats)
    s = '"'
    geo = '{"type" : "Feature", "geometry": {"type": "LineString","coordinates": ' + lonlats +'}, "properties": {"about": "Geodätische Linie"}}'
    return Response(content=geo)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8002, root_path="/geodetic")