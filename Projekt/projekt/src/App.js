// Alex Bura, Dominic Schär, Stefan Sidler / FHNW Institut Geomatik / Version 2.0 / 20.12.2022

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet'
import Grid from '@mui/material/Grid';
import Textfield from '@mui/material/Textfield';
import axios from "axios";
import { Typography } from '@mui/material';
import Dropdown from 'react-dropdown';
import L from 'leaflet';
import Slider from '@mui/material/Slider';
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import 'react-dropdown/style.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geometryutil';
import "./App.css";
import { color } from '@mui/system';

const redMarker = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [start_lat, setStart_lat] = useState(50);
  const [start_lng, setStart_lng] = useState(30);
  const [end_lat, setEnd_lat] = useState(20);
  const [end_lng, setEnd_lng] = useState(-100);
  const [tempo, setTempo] = useState(1000);
  const points_num = 100
  const Boundingbox = [[-90, -180], [90, 180]]

  // eine Liste mit 20 Beispielflughäfen aus aller Welt
  const airports = [  
      ["Choose Airport", 0, 0],
      ["Zürich Airport (Switzerland)", 47.46, 8.54],
      ["London Heathrow Airport (United Kingdom)", 51.47, -0.46],
      ["Adolfo Suárez Madrid–Barajas Airport (Spain)", 40.47, -3.56],
      ["Gran Canaria Airport", 27.93, -15.38],
      ["Tromsø Airport (Norway)", 69.68, 18.91],
      ["Helsinki Vantaa Airport (Finland)", 60.31, 24.96],
      ["Istanbul Airport (Turkey)", 41.26, 28.74],
      ["Cairo International Airport (Egypt)", 30.12, 31.41],
      ["Cape Town International Airport (South Africa)", -33.96, 18.61],
      ["Sydney Kingsford Smith International Airport (Australia)", -33.94, 151.17],
      ["Auckland International Airport (New Zealand)", -37.01, 174.79],
      ["Miami International Airport (USA)", 25.79, -80.29],
      ["Los Angeles International Airport (USA)", 33.94, -118.41],
      ["Fairbanks International Airport (Alaska)", 64.81, -147.85],
      ["Tocumen International Airport (Panama)", 9.07, -79.38],
      ["Congonhas Airport (Brazil)", -23.62, -46.65],
      ["Tokyo Haneda International Airport (Japan)", 35.55, 139.77],
      ["Shanghai Pudong International Airport (China)", 31.14, 121.81],
      ["Singapore Changi Airport", 1.35019, 103.994003],
      ["Lukla Airport (Nepal)", 27.68, 86.72]
    ];

  // Optionen für die DropDown-Menüs  
  const options = airports.map((airport) => airport[0]);

  // Fragt die Koordinaten des Starpunktes ab, gemäss Auswahl im DropDown-Menü
  function change_start(option) {
    const selectedAirport = airports.find(airport => airport[0] === option.value);
    setStart_lat(selectedAirport[1]);
    setStart_lng(selectedAirport[2]);
  }

  // Fragt die Koordinaten des Endpunktes ab, gemäss Auswahl im DropDown-Menü
  function change_end(option) {
    const selectedAirport = airports.find(airport => airport[0] === option.value);
    setEnd_lat(selectedAirport[1]);
    setEnd_lng(selectedAirport[2]);

  }
  
  // Seite neu laden, für Reset oder Neue Berechung  
  function reload() {
    window.location.reload();
  }
  
  // Berechnung der geodätischen Linie von Externen Server
  function do_download() {
    var url = `https://vm1.sourcelab.ch/geodetic/line?startlat=${start_lat}&startlng=${start_lng}&endlat=${end_lat}&endlng=${end_lng}&pts=${points_num}`
    setLoading(true);
    axios
      .get(url)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // Berechnet die Länge zwischen den beiden Punkten
  const line = L.polyline([
    L.latLng(start_lat, start_lng),
    L.latLng(end_lat, end_lng)
  ]);
  
  // Anhand der Länge und einer Fluggeschwindigkeit wird die ungefähre Flugzeit ausgegeben.
  const distance = L.GeometryUtil.length(line);
  const distance_km = Math.round(distance / 1000);
  const time = Math.round(distance_km / tempo);

  useEffect(() => {
    const L = require("leaflet");
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });
    }, []);


    // nachfolgende if-Blöcke kontrollieren, ob die Eingaben in die Textfelder gültig sind
    if (start_lat === end_lat && start_lng === end_lng) {
      alert('Fehler: Start- und Endpunkt dürfen nicht identisch sein.');
      reload();
    }

    if (start_lat > 90 || end_lat > 90) {
      alert('Fehler: Breitengrade müssen zwischen -90 und 90 sein.');
      reload();
    }

    if (start_lng > 180 || end_lng > 180) {
      alert('Fehler: Längengrade müssen zwischen -180 und 180 sein.');
      reload();
    }
       
  return (
    <>   
      <AppBar position='sticky' className="appbar">
      <Toolbar>
        <Grid container justifyContent="flex-start">
          <Typography>Geodätische Linie zwischen Flughäfen</Typography>
        </Grid>
        <Grid container justifyContent="flex-end">
          <Button href="https://www.fhnw.ch/de/studium/architektur-bau-geomatik/bachelor-studiengang-geomatik" color="inherit">Über die FHNW</Button>
          <Button href="https://leafletjs.com/" color="inherit">Über Leaflet</Button>
        </Grid>
      </Toolbar>
      </AppBar>
      
      {!data && <>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h3><br/>Wähle zwei Flughäfen aus der Liste aus, um eine geodätische Linie und die ungefähre Flugzeit zu berechnen.</h3>
          <Grid>
          <Grid item xs={6}>
            <p>Startpunkt (blau)</p>              
            <Dropdown style={{margin: '1rem'}} options={options} onChange={change_start} value={airports[0][0]} />          
            <p>Endpunkt (rot)</p>
            <Dropdown style={{margin: '1rem'}} options={options} onChange={change_end} value={airports[0][0]} />
          </Grid>
          </Grid>
          </Grid>
          <Grid item xs = {12}>
            <p>Alternativ können die Koordinaten unten von Hand eingegeben oder geändert werden.</p>
          </Grid>
          <Grid item xs = {3}>
            <Textfield fullWidth label="Start Lat" variant="outlined" style={{marginBottom: '1rem'}} inputProps={{ type: 'number'}} defaultValue={start_lat} onChange={ (event) => (setStart_lat(event.target.value))}/> 
            <Textfield fullWidth label="End Lat" variant="outlined" style={{marginBottom: '1rem'}} inputProps={{ type: 'number'}} defaultValue={end_lat} onChange={ (event) => (setEnd_lat(event.target.value)) }/>
          </Grid>
          <Grid item xs = {3}>             
            <Textfield fullWidth label="Start Lng" variant="outlined" style={{marginBottom: '1rem'}} inputProps={{ type: 'number'}} defaultValue={start_lng} onChange={ (event) => (setStart_lng(event.target.value)) }/>
            <Textfield fullWidth label="End Lng" variant="outlined" style={{marginBottom: '1rem'}} inputProps={{ type: 'number'}} defaultValue={end_lng} onChange={ (event) => (setEnd_lng(event.target.value)) }/> 
          </Grid>
          <Grid item xs={12}>
            <p>Mit "Berechnung starten" wird die geodätische Linie zwischen folgenden Punkten berechnet: <dev style={{color: 'blue'}}>{start_lat} / {start_lng}</dev> und <dev style={{color: 'red'}}>{end_lat} / {end_lng}</dev></p>
            <p>Die gewählten Positionen sind auf der unteren Karte abgebildet</p>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained"  onClick={() => { do_download() }}>Berechnung starten</Button>
            <Button variant="contained" style={{marginLeft: '1rem'}} onClick={() => { reload() }}>Reset</Button>
          </Grid>   
            <Grid item xs = {12}>
            <MapContainer center={[24, 0]} zoom={2} scrollWheelZoom={false} maxBounds={Boundingbox} minZoom={2} style={{ height: "500px", width: "100%"}} >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
              <Marker position={[start_lat, start_lng]}/>
              <Marker position={[end_lat, end_lng]} icon={redMarker}/>
            </MapContainer>
            </Grid>
            <Grid item xs = {12} >
              <h4>Erstellt von Alex Bura, Dominic Schär und Stefan Sidler / FHNW Institut Geomatik / Version 2.0 / 20.12.2022</h4>
            </Grid>
          </Grid>
        </>}

      {loading && <>
                     <p>API Aufruf, bitte warten!</p><br/>
                  </>}

      {error &&   <>
                     <p>ERROR API Aufruf fehlgeschlagen</p>{console.log(error)}<br/>
                  </>}

      {data &&  <>      
                  <Grid container spacing={2}> 
                    <Grid item xs = {12}>
                      <h3>Ausgabe der Distanz und ungefähren Flugzeit zwischen den beiden Destinationen</h3>
                    </Grid>
                    <Grid item xs = {6}>
                      <p>Durchschnittliche Fluggeschwindigkeit (km/h) wälen</p>
                      <Slider defaultValue={1000} max={2000} min={10} aria-label="Default" valueLabelDisplay="auto" onChange={ (event) => (setTempo(event.target.value)) }/>
                    </Grid>
                    <Grid item xs = {12}>
                      <h3>Die Distanz beträgt {distance_km} km. <br/> Die Fluggzeit mit einer Fluggeschwindigkeit von {tempo} km/h beträgt etwa {time} Stunde(n).</h3>
                    </Grid>
                    <Grid item xs = {12}>
                      <Button variant="contained" onClick={() => { reload() }}>Neue Berechnung durchführen</Button>
                    </Grid>
                    <Grid item xs = {12}>
                      <MapContainer center={[24, 0]} zoom={2} scrollWheelZoom={false} maxBounds={Boundingbox} minZoom={2} style={{ height: "500px", width: "100%"}} >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
                      <Marker position={[start_lat, start_lng]}><Popup>Startpunkt <br/>{start_lat} / {start_lng}</Popup></Marker>
                      <Marker position={[end_lat, end_lng]} icon={redMarker}><Popup>Endpunkt <br/>{end_lat} / {end_lng}</Popup></Marker>
                      <GeoJSON data={data} style={{ weight: 8, opacity: '80%', color: 'yellow'}}/>
                      </MapContainer>
                    </Grid>
                    <Grid item xs = {12} >
                      <h4>Erstellt von Alex Bura, Dominic Schär und Stefan Sidler / FHNW Institut Geomatik / Version 1.0 / 19.12.2022</h4>
                    </Grid>
                  </Grid>
                </>}
      </>);
}
export default App;