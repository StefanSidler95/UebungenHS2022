"use strict"


function datetime(event) {

    setInterval(datetime, 500);

    var d = new Date(); 
    var ts = d.toLocaleTimeString();  
    var ds = d.toDateString();

    var zeit = document.querySelector("#zeit");
    var datum = document.querySelector("#datum");

    zeit.innerHTML = ts;
    datum.innerHTML = ds;
    
}