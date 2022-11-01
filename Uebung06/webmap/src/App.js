import React from 'react';
import "./App.css";
import "leaflet/dist/leaflet.css";

import { Circle, MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'


function App() {

  React.useEffect(() => {
    const L = require("leaflet");

    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });
  }, []);

  // source KKW: https://opendata.swiss/de/dataset/kernkraftwerke
  const KKW = [
    {pos: [46.97792, 7.25792],
    name: "Kernkraftwerk Mühleberg",
    betriebsphase: "06.11.1972 - 20.12.2019",
    canton: "BE"},
    {pos: [47.37264, 7.96492],
    name: "Kernkraftwerk Gösgen",
    betriebsphase:"01.11.1979 -",
    canton: "SO"},
    {pos: [47.60540, 8.16671],
    name: "Kernkraftwerk Leibstadt",
    betriebsphase:"15.12.1984 -",
    canton: "AG"},
    {pos: [47.55097, 8.22325],
    name: "Kernkraftwerk Beznau",
    betriebsphase:"04.1972 -",
    canton: "AG"}
  ];

  const circleStyle = {color: "yellow"};
  const circleRadius = 50000 //50 km

return (
  <MapContainer center={[47.5349, 7.6416]} zoom={15} scrollWheelZoom={true}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  />

  <Marker position={KKW[0].pos}>
    <Popup>
      <b>{KKW[0].name}</b><br/>
      {KKW[0].betriebsphase}<br/>
      Kanton {KKW[0].canton}
    </Popup>
  </Marker>

  <Marker position={KKW[1].pos}>
    <Popup>
      <b>{KKW[1].name}</b><br/>
      {KKW[1].betriebsphase}<br/>
      Kanton {KKW[1].canton}
    </Popup>
  </Marker>

  <Marker position={KKW[2].pos}>
    <Popup>
      <b>{KKW[2].name}</b><br/>
      {KKW[2].betriebsphase}<br/>
      Kanton {KKW[2].canton}
    </Popup>
  </Marker>

  <Marker position={KKW[3].pos}>
    <Popup>
      <b>{KKW[3].name}</b><br/>
      {KKW[3].betriebsphase}<br/>
      Kanton {KKW[3].canton}
    </Popup>
  </Marker>

  <Circle center={KKW[0].pos} radius={circleRadius} pathOptions={circleStyle}></Circle>;
  <Circle center={KKW[1].pos} radius={circleRadius} pathOptions={circleStyle}></Circle>;
  <Circle center={KKW[2].pos} radius={circleRadius} pathOptions={circleStyle}></Circle>;
  <Circle center={KKW[3].pos} radius={circleRadius} pathOptions={circleStyle}></Circle>;

</MapContainer>
  );
}

export default App;
