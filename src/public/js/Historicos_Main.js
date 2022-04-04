const socket  = io();
socket.emit('Client: HistoricsPage')

//Initialice the map
var map = L.map('map-template');
TileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
L.tileLayer(TileURL).addTo(map);
PolyArray = [];

Lat = 10.994326;
Lon = -74.805578;
map.setView([Lat,Lon],14);

//Create icon for marker
var MapIcon = L.Icon.extend({
    options: {
        iconSize: [40,40],
        iconAnchor: [22,94],
        popupAnchor: [-3,-76]
    }
})



//id for historics button
HistoricsForm = document.querySelector('#Historicos');
HistoricsFormLocation = document.querySelector('#LocationButton')
//Sockets for connection to the backend 

//Connection for historics required
socket.on('Server: NewHistorics',(data)=>{
    if (typeof PolylineGroup !== 'undefined'){
        //Delete all polylines
        PolylineGroup.removeFrom(map)
    }
    if(data.length!==0){
        ActualizarHistoricos(data);
    }
})
socket.on('Server: NewHistoricsLocation',(data)=>{
    //Recives the new historics from location
    ActualizarHistoricosLocation(data);
})


HistoricsForm.addEventListener('click',()=>{
    //Function to send the range of time for the historics query and send it to the web server
    InitialDate = document.getElementById('Date').value.split(' ');
    FinalDate = document.getElementById('Hour').value.split(' ');
    TimeIVar = InitialDate[1];
    DateIvar = InitialDate[0];
    TimeFVar = FinalDate[1];
    DateFvar = FinalDate[0];

    TimeArray = {DateI: DateIvar,DateF:DateFvar, TimeI: TimeIVar, TimeF: TimeFVar};
    socket.emit("Client: RequiredHistoricos", TimeArray);
})

HistoricsFormLocation.addEventListener('click',()=>{
    //Function to send the center and the radious for the query of requiring historics of the location range
    point = 0;
    socket.emit("Client: RequiredHistoricosLocation", point);
})


function ActualizarHistoricos(data){
    //Function to load the historics to the web page

    PolylineGroup = L.layerGroup();//Group for the polylines

    LastPosition = data.length-1;
    center = [data[LastPosition].latitud,data[LastPosition].longitud];
    HistoricsArray = [];
    if (typeof marker == 'undefined'){ 
        map.setView(center,14);
    }else{
        map.setView(center);
    }
    if (typeof PolyLine !== 'undefined'){
        PolylineGroup.removeFrom(map) //Remove polylines group 
    }
    
    data.forEach((data,idx,array) => {

        FechaAct = data.fecha;
        if(typeof FechaAnt !== 'undefined'){
            if ((FechaAct !== FechaAnt)||(idx === array.length - 1)){
                var color;
                var r = Math.floor(Math.random() * 255);
                var g = Math.floor(Math.random() * 255);
                var b = Math.floor(Math.random() * 255);
                color= "rgb("+r+" ,"+g+","+ b+")"; 

                PolyLine = L.polyline(HistoricsArray,{ 
                    color: color,
                    weight: 5,
                    smoothFactor: 1
                })
                PolylineGroup.addLayer(PolyLine);
                HistoricsArray=[];
            }
        }
        HistoricsArray.push([data.latitud,data.longitud])
        FechaAnt = data.fecha;
    })
    PolylineGroup.addTo(map)
}

function ActualizarHistoricosLocation(data){
    //function to add the polylines of the location moment
    if (typeof marker !== 'undefined'){
        
    }else{
        map.setView([data[data.length-1].latitud,data[data.length-1].longitud],14);
    }
    if (typeof PolyLine !== 'undefined'){
        map.removeLayer(PolyLine);
    }
    data.forEach(data => {
        center = [data.latitud,data.longitud];
        marker = L.marker(center);
        marker.bindPopup();
        map.addLayer(marker);
    })
    map.setView([data[data.length-1].latitud,data[data.length-1].longitud]);

}