//Initialice the map
var map = L.map('map-template');
TileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
L.tileLayer(TileURL).addTo(map);
TimeLayerGroup1 = L.featureGroup();//Group for the polylines
TimeLayerGroup2 = L.featureGroup();//Group for the polylines
LocationLayerGroup = L.featureGroup();
LocationLayerGroup2 = L.featureGroup();
PolyArray = [];
DataTaxi1 = [];
DataTaxi2 = [];
DataTaxiT = [];
click = false;


var greenIcon = new L.Icon({
    iconUrl: 'https://www.nicepng.com/png/full/23-230399_google-maps-pin-png-red-map-marker-png.png',
     shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });


Cargando = document.getElementById('CargaContainer');


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

LocationLayerGroup2.on('click',(e)=>{
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
        ActualizarHistoricosTime(data);       
    }else{
        alert('No se encontraron resultados');
    }

    Cargando.style.display = 'none';
})

socket.on('Server: NewHistoricsLocation',(data)=>{
    //Recives the new historics from location
    Cargando.style.display = 'none';
    if(data.length !== 0){
        ActualizarHistoricosLocation(data);
        ContainerResult.style.display = '';
    }else{
        alert('No se encontraron resultados');
    }
})


//--------------------id from documents-------------------------

TaxiDefiner = document.getElementById('Taxi');

RadioSearch = document.getElementById('RadioSearch');

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

Taxi1Range = document.getElementById('Taxi1Range');

Taxi2Range = document.getElementById('Taxi2Range');

taxi1Slider = document.getElementById('taxi1Slider');

taxi2Slider = document.getElementById('taxi2Slider');

Taxi1Range.oninput = ()=>{
    data = DataTaxi1[Taxi1Range.value];
    LocationDetails(data);
}
Taxi2Range.oninput = ()=>{
    data = DataTaxi2[Taxi2Range.value];
    LocationDetails(data);
}
RadioSearch.oninput = ()=>{
    RadioVar = RadioSearch.value;
    if(RadioVar>=1000){
        RadioText = 'Radio: ' + RadioVar/1000 + ' km';
    }else{
        RadioText = 'Radio: ' + RadioVar + ' m';
    }
    document.getElementById('RadioLabel').innerHTML = RadioText;
    if(Object.keys(theMarker).length !== 0 && theMarker.constructor !== Object && RadioVar!==''){
        lat = theMarker.getLatLng().lat;
        lon = theMarker.getLatLng().lng;
        if(circle !== 'undefined'){
            map.removeLayer(circle);
        }
        circle = L.circle([lat,lon],{radius: RadioVar}).addTo(map);
    }else{
        alert('Debe indicar el punto de busqueda en el mapa')
    }
}

RadioSearch.onchange = ()=>{
    requestRadioLocation();
}

TaxiDefiner.addEventListener('change',(event)=>{

    Seleccionado = event.target.value;

        if(LocationLayerGroup != 'undefined'){
            LocationLayerGroup.removeFrom(map)
        }
        if(LocationLayerGroup2 != 'undefined'){
            LocationLayerGroup2.removeFrom(map)
        }
        if(TimeLayerGroup1 != 'undefined'){
            TimeLayerGroup1.removeFrom(map)
        }
        if(TimeLayerGroup2 != 'undefined'){
            TimeLayerGroup2.removeFrom(map)
        }
    
        if (Seleccionado == 'Taxi 1'){
    
            TimeLayerGroup1.addTo(map)
            LocationLayerGroup.addTo(map)
            if(DataTaxi1 !== 'undefined' && DataTaxi1.length > 0){
                taxi1Slider.style.display = '';
                taxi2Slider.style.display = 'none';
            }
            
    
        }else if (Seleccionado == 'Taxi 2'){
    
            if(DataTaxi2 !== 'undefined' && DataTaxi2.length > 0){
                taxi1Slider.style.display = 'none';
                taxi2Slider.style.display = '';
            }
            TimeLayerGroup2.addTo(map)
            LocationLayerGroup2.addTo(map)
    
        }else{
            TimeLayerGroup1.addTo(map)
            TimeLayerGroup2.addTo(map)
            LocationLayerGroup.addTo(map)
            LocationLayerGroup2.addTo(map)
            taxi1Slider.style.display = '';
            taxi2Slider.style.display = '';
        }
    
})

HistoricsForm.addEventListener('click',()=>{
    //Function to send the range of time for the historics query and send it to the web server
    InitialDate = document.getElementById('DateI').value.split(' ');
    FinalDate = document.getElementById('DateF').value.split(' ');

    TimeIVar = InitialDate[1];
    DateIvar = InitialDate[0];
    TimeFVar = FinalDate[1];
    DateFvar = FinalDate[0];

    document.getElementById('LocationButton').style.display = '';

    TimeArray = {DateI: DateIvar,DateF:DateFvar, TimeI: TimeIVar, TimeF: TimeFVar};
    socket.emit("Client: RequiredHistoricos", TimeArray,1); 
    
    Cargando.style.display = '';
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

function ClearMap(){
    LocationLayerGroup.clearLayers()
    LocationLayerGroup2.clearLayers()
    TimeLayerGroup1.clearLayers()
    TimeLayerGroup2.clearLayers()
    TimeLayerGroup1.removeFrom(map);
    TimeLayerGroup2.removeFrom(map);
    LocationLayerGroup.removeFrom(map);
    LocationLayerGroup2.removeFrom(map);
    ContainerResult.style.display='none';
}

function ActualizarHistoricosTime(data){    
    //Function to load the historics to the web page

    LastPosition = data.length-1;
    HistoricsArray1 = [];
    HistoricsArray2 = [];
    if (typeof TimeLayerGroup1 !== 'undefined'){
        TimeLayerGroup1.clearLayers()
        TimeLayerGroup1.removeFrom(map) //Remove polylines group 
    }
    if (typeof TimeLayerGroup2 !== 'undefined'){
        TimeLayerGroup2.clearLayers()
        TimeLayerGroup2.removeFrom(map) //Remove polylines group 
    }
    
    data.forEach((data,idx,array) => {

        FechaAct = data.fecha.replace("T00:00:00.000Z","");
        if(data.ID==1){
            HistoricsArray1.push([data.latitud,data.longitud])
        }else{
            HistoricsArray2.push([data.latitud,data.longitud])
        }
        
        if ((idx <= array.length - 2)){
            FechaNext = array[idx+1].fecha.replace("T00:00:00.000Z","");
        }
        if(typeof FechaNext !== 'undefined'){
            if ((FechaAct !== FechaNext)||(idx === array.length - 1)){
                if(data.ID==1){
                    marker = L.marker([data.latitud,data.longitud]);
                    PolyLine1 = NewPolyline(HistoricsArray1,'B');
                    TimeLayerGroup1.addLayer(marker);
                    TimeLayerGroup1.addLayer(PolyLine);
                    if(TaxiDefiner.value=='Taxi 1' || TaxiDefiner.value=='Todos'){
                        center = [data.latitud,data.longitud];
                    }
                }else{
                    if(TaxiDefiner.value=='Taxi 2' || TaxiDefiner.value=='Todos'){
                        center = [data.latitud,data.longitud];
                    }
                    marker = L.marker([data.latitud,data.longitud],{icon:greenIcon});
                    PolyLine2 = NewPolyline(HistoricsArray2,'R');
                    TimeLayerGroup2.addLayer(marker);
                    TimeLayerGroup2.addLayer(PolyLine2);
                }
                marker.bindPopup("Última ubicación del día: " + data.fecha.replace("T00:00:00.000Z","") + "<br> Taxi " + data.ID);



                if (typeof marker == 'undefined'){ 
                    map.setView(center,14);
                }else{
                    map.setView(center);
                }


                HistoricsArray1=[];
                HistoricsArray2=[];
            }
        }
    })
    if(TaxiDefiner.value=='Taxi 1'){
        TimeLayerGroup1.addTo(map)            
    }else if(TaxiDefiner.value == 'Taxi 2'){
        TimeLayerGroup2.addTo(map)
    }else{
        TimeLayerGroup1.addTo(map)
        TimeLayerGroup2.addTo(map)
    }
}

function ActualizarHistoricosLocation(data){
    //function to add the polylines of the location moment
    
    if (typeof LocationLayerGroup !== 'undefined'){
        LocationLayerGroup.clearLayers()
        LocationLayerGroup.removeFrom(map);
    }
    if (typeof LocationLayerGroup2 !== 'undefined'){
        LocationLayerGroup2.clearLayers()
        LocationLayerGroup2.removeFrom(map);
    }
    
    LocationArray = [];
    LocationArray2 = [];
    DataTaxi1 = [];
    DataTaxi2 = [];
    data.forEach((data,idx,array) => {
        FechaAct = data.fecha.replace("T00:00:00.000Z","");
        if ((idx <= array.length - 2)){
            FechaNext = array[idx+1].fecha.replace("T00:00:00.000Z","");
        }
        if(data.ID==1){
            LocationArray.push([data.latitud,data.longitud])
            DataTaxi1.push(data)
        }else{
            LocationArray2.push([data.latitud,data.longitud])
            DataTaxi2.push(data)
        }
        
        if(typeof FechaNext !== 'undefined'){
            if ((FechaAct !== FechaNext)||(idx === array.length - 1)){
                if(data.ID==1){
                    PolyLine1 = NewPolyline(LocationArray,'B');
                    LocationLayerGroup.addLayer(PolyLine1);
                }else{
                    PolyLine2 = NewPolyline(LocationArray2,'R');
                    LocationLayerGroup2.addLayer(PolyLine2);
                }
                LocationArray=[];
                LocationArray2=[];
            }
        }        
    })
    if(TaxiDefiner.value=='Taxi 1'){
        LocationLayerGroup.addTo(map)
        taxi1Slider.style.display = '';
        taxi2Slider.style.display = 'none';
    }else if(TaxiDefiner.value == 'Taxi 2'){
        LocationLayerGroup2.addTo(map);
        taxi1Slider.style.display = 'none';
        taxi2Slider.style.display = '';
    }else{
        LocationLayerGroup.addTo(map)
        LocationLayerGroup2.addTo(map);
        taxi1Slider.style.display = '';
        taxi2Slider.style.display = '';

    }
    Taxi1Range.max = DataTaxi1.length-1   
    Taxi1Range.value = 1;
    Taxi2Range.max = DataTaxi2.length-1   
    Taxi1Range.value = 2;
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
        
        if(circle !== 'undefined'){
            map.removeLayer(circle);
        }
        circle = L.circle([lat,lon],{radius: RadioSearch.value}).addTo(map);
        requestRadioLocation();
     }
})

function NewPolyline(PolylineArray,Type){
    var color;
    if(Type=='R'){
        var r = Math.floor(Math.random() * 50 + 200) ;
        var g = Math.floor(Math.random() * 150);
        var b = Math.floor(Math.random() * 100);
    }if(Type=='B'){
        var r = Math.floor(Math.random() * 150) ;
        var g = Math.floor(Math.random() * 150);
        var b = Math.floor(Math.random() * 100 + 150);
    }
    

    color= "rgb("+r+" ,"+g+","+ b+")"; 

    PolyLine = L.polyline(PolylineArray,{ 
        color: color,
        weight: 5,
        smoothFactor: 1
    })

    return PolyLine
}

function LocationDetails(data){
    PopUP=L.popup().setContent("Fecha: " + data.fecha.replace("T00:00:00.000Z","") + '<br>  Hora: ' + data.hora + '<br> Taxi ' + data.ID).setLatLng([data.latitud,data.longitud]).openOn(map);
}

function LocationMarker(data){
    if (typeof DateTimeLocationMarker !== 'undefined'){
        DateTimeLocationMarker.removeFrom(map)
    }
    DateTimeLocationMarker = L.marker([data[0].latitud,data[0].longitud]);
    DateTimeLocationMarker.bindPopup("Fecha: " + data[0].fecha.replace("T00:00:00.000Z","") + '<br>  Hora: ' + data[0].hora + '<br> Taxi ' + data[0].ID);
    DateTimeLocationMarker.addTo(map)
}

function requestRadioLocation(){
    RadioVar = RadioSearch.value;
    if(Object.keys(theMarker).length !== 0 && theMarker.constructor !== Object && RadioVar>1){
        ContainerResult.style.display = 'none';
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
        Cargando.style.display = '';
    }
}


$(document).on('click','#tbl-body-results','tr',(e)=>{
    RowSelected = (String($(e.target).get(0).outerHTML));
    TimeStamp = RowSelected.replace("<td>",'').replace("</td>",'');
    socket.emit('Client: TimeStampLocationDetails', TimeStamp)
})