//Initialice the map
var map = L.map('map-template');
TileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
L.tileLayer(TileURL).addTo(map);
TimeLayerGroup = L.featureGroup();//Group for the polylines
LocationLayerGroup = L.featureGroup();
PolyArray = [];
click = false;


Lat = 10.994326;
Lon = -74.805578;
map.setView([Lat,Lon],14);

//Sockets for connection to the backend 
const socket  = io();

//Connetion to say to backend that open page is Historics page
socket.emit('Client: HistoricsPage')

LocationLayerGroup.on('click',(e)=>{
    lat = e.latlng.lat;
    lng = e.latlng.lng;
    InitialDate = document.getElementById('DateI').value.split(' ');
    FinalDate = document.getElementById('DateF').value.split(' ');

    TimeIVar = InitialDate[1];
    DateIvar = InitialDate[0];
    TimeFVar = FinalDate[1];
    DateFvar = FinalDate[0];

    LocationArray = {lat: lat, lng: lng, DateI: DateIvar.concat(' ',TimeIVar), DateF: DateFvar+' '+TimeFVar}
    socket.emit('Client: LocationDetailsRequest',LocationArray)
})


socket.on('Server: NewLatLngLocation',(data) =>{
    LocationMarker(data)
})

socket.on('Server: LocationDetailsReply',(data)=>{
    if(data.length!==0){
        if(typeof MarkerLocationDetails !== 'undefined'){
            PopUP.closeOn(map)
        }
        LocationDetails(data);
    }
})

//Connection for historics required
socket.on('Server: NewHistorics',(data)=>{
    if (typeof TimeLayerGroup !== 'undefined'){
        //Delete all polylines
        TimeLayerGroup.removeFrom(map)
    }
    if(data.length!==0){
        HoverMessage.style.display = 'none';
        ActualizarHistoricosTime(data);
        document.getElementById('LocationButton').disabled=false;
        
    }else{
        alert('No se encontraron resultados');
    }
})

socket.on('Server: NewHistoricsLocation',(data)=>{
    //Recives the new historics from location
    if(data.length !== 0){
        ActualizarHistoricosLocation(data);
        ContainerResult.style.display = '';
    }else{
        alert('No se encontraron resultados');
    }
    
})


//--------------------id from documents-------------------------

//id for form container
ContainerForm = document.querySelector('#HistoricsContainer')

//id for result table
ContainerResult = document.querySelector('#TableContainer')

//id for time form
TimeForm = document.querySelector('#TimeForm');

ConfirmLocationButton = document.querySelector('#ConfirmSearch');

//id for location form
LocationForm = document.querySelector('#LocationForm');


TableRows = document.getElementById('Rowsdiv');

//id for historics time button
HistoricsFormTime = document.querySelector('#TimeButton');

//if for historics location button
HistoricsFormLocation = document.querySelector('#LocationButton');

//Searching button for location
LocationSearch = document.querySelector('#LocationSearch');

//Searching button for time
HistoricsForm = document.querySelector('#TimeSearch');

//Hover message 
HoverMessage = document.querySelector('#LocationHover');



HistoricsForm.addEventListener('click',()=>{
    //Function to send the range of time for the historics query and send it to the web server
    InitialDate = document.getElementById('DateI').value.split(' ');
    FinalDate = document.getElementById('DateF').value.split(' ');

    TimeIVar = InitialDate[1];
    DateIvar = InitialDate[0];
    TimeFVar = FinalDate[1];
    DateFvar = FinalDate[0];

    TimeArray = {DateI: DateIvar,DateF:DateFvar, TimeI: TimeIVar, TimeF: TimeFVar};
    socket.emit("Client: RequiredHistoricos", TimeArray);    
})

HistoricsFormTime.addEventListener('click',()=>{
    HistoricsContainer.style.height = '42%';
    TimeForm.style.display = '';
    LocationForm.style.display = 'none';
    ClearMap();
    click = false;
    if (theMarker != undefined) {
        map.removeLayer(theMarker);
        map.removeLayer(circle);
    };
})

HistoricsFormLocation.addEventListener('click',()=>{
    HistoricsContainer.style.height = '42%';
    TimeForm.style.display = 'none';
    LocationForm.style.display = '';
    click = true;
})

LocationSearch.addEventListener('click',()=>{
    //Function to send the center and the radious for the query of requiring historics of the location range
    if(Object.keys(theMarker).length !== 0 && theMarker.constructor !== Object){
        ClearMap();
        InitialDate = document.getElementById('DateI').value.split(' ');
        FinalDate = document.getElementById('DateF').value.split(' ');
    
        TimeIVar = InitialDate[1];
        DateIvar = InitialDate[0];
        TimeFVar = FinalDate[1];
        DateFvar = FinalDate[0];

        LocationArray = {lat: theMarker.getLatLng().lat,
                        lon: theMarker.getLatLng().lng,
                        radio: RadioVar,
                        DateI: DateIvar,
                        DateF:DateFvar,
                        TimeI: TimeIVar,
                        TimeF: TimeFVar}
        socket.emit("Client: RequiredHistoricosLocation", LocationArray);

    }
})

ConfirmLocationButton.addEventListener('click',()=>{
    RadioVar = document.getElementById('RadioForm').value;
    ContainerResult.style.display = 'none';
    if(Object.keys(theMarker).length !== 0 && theMarker.constructor !== Object && RadioVar!==''){
        lat = theMarker.getLatLng().lat;
        lon = theMarker.getLatLng().lng;
        if(circle !== 'undefined'){
            map.removeLayer(circle);
        }
        circle = L.circle([lat,lon],{radius: RadioVar}).addTo(map);
        LocationSearch.style.display = '';
        TableRows.innerHTML = ''
    }else if(RadioVar==''){
        alert('Ingrese un radio válido')
    }else{
        alert('Debe indicar el punto de busqueda en el mapa')
    }

})

function ClearMap(){
    TimeLayerGroup.removeFrom(map);
    LocationLayerGroup.removeFrom(map);
}

function ActualizarHistoricosTime(data){
    //Function to load the historics to the web page

    LastPosition = data.length-1;
    center = [data[LastPosition].latitud,data[LastPosition].longitud];
    HistoricsArray = [];
    if (typeof marker == 'undefined'){ 
        map.setView(center,14);
    }else{
        map.setView(center);
    }
    if (typeof PolyLine !== 'undefined'){
        TimeLayerGroup.clearLayers()
        TimeLayerGroup.removeFrom(map) //Remove polylines group 

    }
    
    data.forEach((data,idx,array) => {

        FechaAct = data.fecha.replace("T00:00:00.000Z","");
        HistoricsArray.push([data.latitud,data.longitud])
        if ((idx <= array.length - 2)){
            FechaNext = array[idx+1].fecha.replace("T00:00:00.000Z","");
        }
        if(typeof FechaNext !== 'undefined'){
            if ((FechaAct !== FechaNext)||(idx === array.length - 1)){

                PolyLine = NewPolyline(HistoricsArray);

                marker = L.marker([data.latitud,data.longitud]);
                marker.bindPopup("Última ubicación del día: " + data.fecha.replace("T00:00:00.000Z",""));
                TimeLayerGroup.addLayer(marker);
                TimeLayerGroup.addLayer(PolyLine);
                HistoricsArray=[];
            }
        }
    })
    TimeLayerGroup.addTo(map)
}

function ActualizarHistoricosLocation(data){
    //function to add the polylines of the location moment
    
    if (typeof LocationLayerGroup !== 'undefined'){
        LocationLayerGroup.clearLayers()
        LocationLayerGroup.removeFrom(map);
    }
    LocationArray = [];
    data.forEach((data,idx,array) => {
        FechaAct = data.fecha.replace("T00:00:00.000Z","");
        if ((idx <= array.length - 2)){
            FechaNext = array[idx+1].fecha.replace("T00:00:00.000Z","");
            DataNumberNext = array[idx+1].DataNumber;
        }
        LocationArray.push([data.latitud,data.longitud])
        if(typeof FechaNext !== 'undefined'){
            if ((FechaAct !== FechaNext)||(idx === array.length - 1)||((data.DataNumber + 1) !== DataNumberNext)){
                
                PolyLine = NewPolyline(LocationArray);
                LocationLayerGroup.addLayer(PolyLine);
                LocationArray=[];
            }
        }        
    })
    LocationLayerGroup.addTo(map);
    TableResultDeploy(data);
}

function TableResultDeploy(data){
    $('#tbl-body-results').empty();
    Row = '';
    data.forEach((data,idx,array) => {
        FechaAct = data.TimeStamp;
        if ((idx <= array.length - 2)){
            FechaNext = array[idx+1].TimeStamp;
        }
        if (FechaAct!==FechaNext){
            Row  =  "<tr class = 'table-primary' ><td>" + data.fecha.replace("T00:00:00.000Z","") + ' ' + data.hora + "</td></tr>"
            $('#tbl-body-results').append(Row);
        }
    })
    
}


var theMarker = {};
var circle = {};

 map.on('click',function(e){
     if(click){
        lat = e.latlng.lat;
        lon = e.latlng.lng;

        //Clear existing marker, 
            if (theMarker != undefined) {
                    map.removeLayer(theMarker);
            };

        //Add a marker to show where you clicked.
        theMarker = L.marker([lat,lon]).addTo(map);
     }
})

function NewPolyline(PolylineArray){
    var color;
    var r = Math.floor(Math.random() * 200);
    var g = Math.floor(Math.random() * 200);
    var b = Math.floor(Math.random() * 200);
    color= "rgb("+r+" ,"+g+","+ b+")"; 

    PolyLine = L.polyline(PolylineArray,{ 
        color: color,
        weight: 5,
        smoothFactor: 1
    })

    return PolyLine
}

function LocationDetails(data){
    PopUP=L.popup().setContent("Fecha y hora: " + data[0].fecha.replace("T00:00:00.000Z","") + ' ' + data[0].hora).setLatLng([data[0].latitud,data[0].longitud]).openOn(map);
}

function LocationMarker(data){
    if (typeof DateTimeLocationMarker !== 'undefined'){
        DateTimeLocationMarker.removeFrom(map)
    }
    DateTimeLocationMarker = L.marker([data[0].latitud,data[0].longitud]);
    DateTimeLocationMarker.bindPopup("Fecha y hora: " + data[0].fecha.replace("T00:00:00.000Z","") + ' ' + data[0].hora);
    DateTimeLocationMarker.addTo(map)
}

$(document).on('click','#tbl-body-results','tr',(e)=>{
    RowSelected = (String($(e.target).get(0).outerHTML));
    TimeStamp = RowSelected.replace("<td>",'').replace("</td>",'');
    socket.emit('Client: TimeStampLocationDetails', TimeStamp)
})