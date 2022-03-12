//Crear el mapa
var map = L.map('map-template');
TileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
L.tileLayer(TileURL).addTo(map);


//Sockets
const socket  = io();

socket.on('NewUserCoordenates',(data) =>{
    console.log('New Data Recived')
    Actualizar(data);
    UpdateMap(data);
})

// Usamos selector para asignar el valor de la fila en un id
id = document.getElementById('id')
latitud = document.getElementById('latitud')
longitud = document.getElementById('longitud')
fecha = document.getElementById('fecha')
hora = document.getElementById('hora')  

// crea un long polling para simular un socket y pedir los datos periodicamente con un intervalos de 5seg
/* setInterval(() => {
    $.ajax({
        url: '/getData',
        success: function(data){
            Actualizar(data);
            UpdateMap(data);
        }
    })    

}, 1000);
 */

//Actualizar la ubicación en la tarjeta
function Actualizar(data){
    id.innerHTML = data.ID             // innerHTML establece la conexion en los id's 
    latitud.innerHTML = data.latitud
    longitud.innerHTML = data.longitud
    fecha.innerHTML = data.fecha.replace("T05:00:00.000Z","")
    hora.innerHTML = data.hora
}


//Actualizar la posición en el mapa
function UpdateMap(data){
    Lat = data.latitud;
    Lon = data.longitud;
    if (typeof marker !== 'undefined'){
        map.removeLayer(marker);
    }else{
        map.setView([Lat,Lon],14);
    }
    map.setView([Lat,Lon]);
    marker = L.marker([Lat,Lon]);
    marker.bindPopup("Latitud: " + Lat + ", Longitud: "+ Lon);
    map.addLayer(marker);
}

