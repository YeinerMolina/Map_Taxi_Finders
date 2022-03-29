//Initialice the map
var map = L.map('map-template');
TileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
L.tileLayer(TileURL).addTo(map);
PolyArray = [];

//Create icon for marker
var MapIcon = L.Icon.extend({
    options: {
        iconSize: [40,40],
        iconAnchor: [22,94],
        popupAnchor: [-3,-76]
    }
})

//id of each row in the coords table
id = document.getElementById('id')
latitud = document.getElementById('latitud')
longitud = document.getElementById('longitud')
fecha = document.getElementById('fecha')
hora = document.getElementById('hora')  

//id for historics button
HistoricsForm = document.querySelector('#Historicos');
Real = document.querySelector('#Real');
//Sockets for connection to the backend 
const socket  = io();

//Connection for changed coords
socket.on('Server: NewUserCoordenates',(data) =>{
    Actualizar(data[data.length-1]);
    UpdateMap(data);
})

//Connection for historics required
socket.on('Server: NewHistorics',(data)=>{
    ActualizarHistoricos(data);
    Actualizar(data[data.length-1]);
})

HistoricsForm.addEventListener('click',()=>{
    TimeArray = [{Date: '2022-03-27', TimeI: '10:00', TimeF:'10:50'}];
    socket.emit("Client: RequiredHistoricos", TimeArray);
})

Real.addEventListener('click',()=>{
    socket.emit("Client: RequiredRealTimeLocation");
})


//Actualice the table data
function Actualizar(data){
    id.innerHTML = data.ID             // innerHTML establece la conexion en los id's 
    latitud.innerHTML = data.latitud
    longitud.innerHTML = data.longitud
    fecha.innerHTML = data.fecha.replace("T00:00:00.000Z","")
    hora.innerHTML = data.hora
}

//Actualice the marker position and poliline
function UpdateMap(data){
    Lat = data[0].latitud;
    Lon = data[0].longitud;
    PolyArray.push([Lat,Lon]);
    if (typeof marker !== 'undefined'){
        map.removeLayer(marker);
    }else{
        map.setView([Lat,Lon],14);
    }
    if (typeof PolyLine !== 'undefined'){
        map.removeLayer(PolyLine);
    }

    map.setView([Lat,Lon]);
    marker = L.marker([Lat,Lon]);
    PolyLine = L.polyline(PolyArray,{color:'red'})
    marker.bindPopup("Posición actual");
    map.addLayer(marker);
    map.addLayer(PolyLine);
}

function ActualizarHistoricos(data){
    HistoricsArray = [];
    center = [data[data.length-1].latitud,data[data.length-1].longitud];
    if (typeof marker !== 'undefined'){
        map.removeLayer(marker);
    }else{
        map.setView(center,14);
    }
    if (typeof PolyLine !== 'undefined'){
        map.removeLayer(PolyLine);
    }
    
    data.forEach(data => {
        HistoricsArray.push([data.latitud,data.longitud])
    })
    map.setView(center);
    marker = L.marker(center);
    PolyLine = L.polyline(HistoricsArray,{color:'blue'})
    marker.bindPopup("Última posición");
    map.addLayer(marker);
    map.addLayer(PolyLine);
}

