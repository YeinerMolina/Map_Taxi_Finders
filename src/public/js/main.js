//Initialice the map
var map = L.map('map-template');
TileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
L.tileLayer(TileURL).addTo(map);
PolyArrayT1 = [];
PolyArrayT2 = [];

//id of each row in the coords table
id = document.getElementById('id')
latitud = document.getElementById('latitud')
longitud = document.getElementById('longitud')
fecha = document.getElementById('fecha')
hora = document.getElementById('hora')  
TaxiDefiner = document.getElementById('Taxi');
Velocidad = document.getElementById('Velocidad')

//Sockets for connection to the backend 
const socket  = io();

socket.emit('Client: StartPage')

//Connection for changed coords
socket.on('Server: NewUserCoordenates',(data) =>{
    Actualizar(data[data.length-1]);
    UpdateMap(data);
})


//List canged
TaxiDefiner.addEventListener('change',(event)=>{

    Seleccionado = event.target.value;

    if(typeof markerT1 !== 'undefined'){
        map.removeLayer(markerT1)
    }
    if (typeof PolyLineT1 !== 'undefined'){
        map.removeLayer(PolyLineT1);
    }

    if(typeof markerT2 !== 'undefined'){
        map.removeLayer(markerT2)
    }
    if (typeof PolyLineT2 !== 'undefined'){
        map.removeLayer(PolyLineT2);
    }

    if (TaxiDefiner.value == 'Taxi 1'){
        map.addLayer(markerT1);
        map.addLayer(PolyLineT1);            
    }else if (TaxiDefiner.value == 'Taxi 2'){
        map.addLayer(markerT2);
        map.addLayer(PolyLineT2);
    }else if (TaxiDefiner.value == 'Todos'){
        map.addLayer(markerT1);
        map.addLayer(PolyLineT1);  
        map.addLayer(markerT2);
        map.addLayer(PolyLineT2);
    }
    
})

//Actualice the table data
function Actualizar(data){
    id.innerHTML = data.ID             // innerHTML establece la conexion en los id's 
    latitud.innerHTML = data.latitud
    longitud.innerHTML = data.longitud
    fecha.innerHTML = data.fecha.replace("T00:00:00.000Z","")
    hora.innerHTML = data.hora
    Velocidad.innerHTML = data.Velocidad;
}


//Actualice the marker position and poliline
function UpdateMap(data){

    Lat = data[0].latitud;
    Lon = data[0].longitud;

    if(typeof markerT1 == 'undefined' && typeof markerT2 == 'undefined'){
        map.setView([Lat,Lon],14);
    }


    if(typeof markerT1 !== 'undefined'){
        map.removeLayer(markerT1)
    }
    if (typeof PolyLineT1 !== 'undefined'){
        map.removeLayer(PolyLineT1);
    }

    if(typeof markerT2 !== 'undefined'){
        map.removeLayer(markerT2)
    }
    if (typeof PolyLineT2 !== 'undefined'){
        map.removeLayer(PolyLineT2);
    }

    if (data[0].ID == 1){
        PolyArrayT1.push([Lat,Lon]);
        markerT1 = L.marker([Lat,Lon]);
        PolyLineT1 = L.polyline(PolyArrayT1,{color:'blue'})
        markerT1.bindPopup("Posición actual taxi 1");
        
    }else{
        PolyArrayT2.push([Lat,Lon]);
        markerT2 = L.marker([Lat,Lon]);
        PolyLineT2 = L.polyline(PolyArrayT2,{color:'red'})
        markerT2.bindPopup("Posición actual taxi 2");
    }

    map.setView([Lat,Lon]);

    if (TaxiDefiner.value == 'Taxi 1'){
        map.addLayer(markerT1);
        map.addLayer(PolyLineT1);            
    }else if (TaxiDefiner.value == 'Taxi 2'){
        map.addLayer(markerT2);
        map.addLayer(PolyLineT2);
    }else if (TaxiDefiner.value == 'Todos'){
        map.addLayer(markerT1);
        map.addLayer(PolyLineT1);  
        map.addLayer(markerT2);
        map.addLayer(PolyLineT2);
    }
}

