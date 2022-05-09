//Initialice the map
var map = L.map('map-template');
TileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
L.tileLayer(TileURL).addTo(map);
PolyArrayT1 = [];
PolyArrayT2 = [];

toggle = document.querySelector(".toggle");
toggle.addEventListener('click', () => {
    toggle.classList.toggle("active");
    if(toggle.classList.contains("active")){
        socket.emit('Client: TaxiSelected',(2));
    
    }else{
        socket.emit('Client: TaxiSelected',(1));
    }
})

TaxiCenter = document.getElementById('Location-fixer');


TaxiDefiner = document.getElementById('Taxi');

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

    ID = Seleccionado.substring(5);
    socket.emit('Client: TaxiSelected',(ID));

    if (Seleccionado == 'Taxi 1'){

        id1.style.display = '' 
        latitud1.style.display = ''
        longitud1.style.display = ''
        fecha1.style.display = ''
        hora1.style.display = ''
        Velocidad1.style.display = ''
        
        TaxiCenter.style.display = 'none'

        id2.style.display = 'none' 
        latitud2.style.display = 'none'
        longitud2.style.display = 'none'
        fecha2.style.display = 'none'
        hora2.style.display = 'none'
        Velocidad2.style.display = 'none'

        document.getElementById('LastPositiontable-container').style.width = '20%';

        map.addLayer(markerT1);
        map.addLayer(PolyLineT1);  

    }else if (Seleccionado == 'Taxi 2'){
       

        id1.style.display = 'none' 
        latitud1.style.display = 'none'
        longitud1.style.display = 'none'
        fecha1.style.display = 'none'
        hora1.style.display = 'none'
        Velocidad1.style.display = 'none'

        TaxiCenter.style.display = 'none'

        id2.style.display = '' 
        latitud2.style.display = ''
        longitud2.style.display = ''
        fecha2.style.display = ''
        hora2.style.display = ''
        Velocidad2.style.display = ''

        document.getElementById('LastPositiontable-container').style.width = '20%';
        
        map.addLayer(markerT2);
        map.addLayer(PolyLineT2);

    }else{

        id1.style.display = '' 
        latitud1.style.display = ''
        longitud1.style.display = ''
        fecha1.style.display = ''
        hora1.style.display = ''
        Velocidad1.style.display = ''

        id2.style.display = '' 
        latitud2.style.display = ''
        longitud2.style.display = ''
        fecha2.style.display = ''
        hora2.style.display = ''
        Velocidad2.style.display = ''

        TaxiCenter.style.display = '';

        document.getElementById('LastPositiontable-container').style.width = '30%';

        map.addLayer(markerT1);
        map.addLayer(PolyLineT1);  
        map.addLayer(markerT2);
        map.addLayer(PolyLineT2);


    }
    
})

//Actualice the table data
function Actualizar(data){
    if(data.ID==1){
        id1.innerHTML = data.ID             // innerHTML establece la conexion en los id's 
        latitud1.innerHTML = data.latitud
        longitud1.innerHTML = data.longitud
        fecha1.innerHTML = data.fecha.replace("T00:00:00.000Z","")
        hora1.innerHTML = data.hora
        Velocidad1.innerHTML = data.Velocidad;
    }else if(data.ID==2){
        id2.innerHTML = data.ID             // innerHTML establece la conexion en los id's 
        latitud2.innerHTML = data.latitud
        longitud2.innerHTML = data.longitud
        fecha2.innerHTML = data.fecha.replace("T00:00:00.000Z","")
        hora2.innerHTML = data.hora
        Velocidad2.innerHTML = data.Velocidad;
    }
    

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

        if(TaxiDefiner.value == 'Taxi 1'){
            map.setView([Lat,Lon]);
        }
        
    }else if(data[0].ID == 2){
        PolyArrayT2.push([Lat,Lon]);
        markerT2 = L.marker([Lat,Lon]);
        PolyLineT2 = L.polyline(PolyArrayT2,{color:'red'})
        markerT2.bindPopup("Posición actual taxi 2");

        if(TaxiDefiner.value == 'Taxi 2'){
            map.setView([Lat,Lon]);
        }

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

        if(toggle.classList.contains("active")){
            if(data[0].ID == 2){
                map.setView([Lat,Lon]);
            }
        }else{
            if(data[0].ID == 1){
                map.setView([Lat,Lon]);
            }
        }
    }
}

