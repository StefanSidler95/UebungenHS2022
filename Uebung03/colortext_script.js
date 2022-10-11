"use strict"


function randomcolor() {
    var t = document.querySelector("#Text");
    var c = "#" + Math.floor(Math.random()*16777215).toString(16);
    t.innerHTML = document.querySelector("#input").value;
    t.style["color"] = c;
    t.style["font-size"] = "100px";
}

