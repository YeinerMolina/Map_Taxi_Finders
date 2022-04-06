

//Initialice the map
var map = L.map('map-template');
TileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
L.tileLayer(TileURL).addTo(map);
PolylineGroup = L.layerGroup();//Group for the polylines
MarkerGroup = L.layerGroup();
PolyArray = [];


Lat = 10.994326;
Lon = -74.805578;
map.setView([Lat,Lon],14);

//Sockets for connection to the backend 
const socket  = io();

//Connetion to say to backend that open page is Historics page
socket.emit('Client: HistoricsPage')

//Connection for historics required
socket.on('Server: NewHistorics',(data)=>{
    if (typeof PolylineGroup !== 'undefined'){
        //Delete all polylines
        PolylineGroup.removeFrom(map)
    }
    if(data.length!==0){
        ActualizarHistoricos(data);
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


TableRows = document.getElementById('tablediv');

//id for historics time button
HistoricsFormTime = document.querySelector('#TimeButton');

//if for historics location button
HistoricsFormLocation = document.querySelector('#LocationButton');

//Searching button for location
LocationSearch = document.querySelector('#LocationSearch');

//Searching button for time
HistoricsForm = document.querySelector('#TimeSearch');


HistoricsForm.addEventListener('click',()=>{
    //Function to send the range of time for the historics query and send it to the web server
    InitialDate = document.getElementById('Date').value.split(' ');
    FinalDate = document.getElementById('Hour').value.split(' ');

    if (new Date(InitialDate) < new Date(FinalDate)){
        TimeIVar = InitialDate[1];
        DateIvar = InitialDate[0];
        TimeFVar = FinalDate[1];
        DateFvar = FinalDate[0];

        TimeArray = {DateI: DateIvar,DateF:DateFvar, TimeI: TimeIVar, TimeF: TimeFVar};
        socket.emit("Client: RequiredHistoricos", TimeArray);
    }else{
        alert("La fecha final debe ser posterior a la fecha inicial")
    }
    
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
    ClearMap();
    click = true;
})

LocationSearch.addEventListener('click',()=>{
    //Function to send the center and the radious for the query of requiring historics of the location range
    if(Object.keys(theMarker).length !== 0 && theMarker.constructor !== Object){
        LocationArray = {lat: theMarker.getLatLng().lat,
                        lon: theMarker.getLatLng().lng,
                        radio: RadioVar}
        socket.emit("Client: RequiredHistoricosLocation", LocationArray);
    }
})

ConfirmLocationButton.addEventListener('click',()=>{
    RadioVar = document.getElementById('RadioForm').value;
    ContainerResult.style.display = 'none';
    ClearMap();
    if(Object.keys(theMarker).length !== 0 && theMarker.constructor !== Object && !isNaN(RadioVar)){
        lat = theMarker.getLatLng().lat;
        lon = theMarker.getLatLng().lng;
        if(circle !== 'undefined'){
            map.removeLayer(circle);
        }
        circle = L.circle([lat,lon],{radius: RadioVar}).addTo(map);
        LocationSearch.style.display = '';
        TableRows.innerHTML = ''
    }

})


function ClearMap(){
    PolylineGroup.removeFrom(map);
    MarkerGroup.removeFrom(map);
}

function ActualizarHistoricos(data){
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
        PolylineGroup.clearLayers()
        PolylineGroup.removeFrom(map) //Remove polylines group 

    }
    
    data.forEach((data,idx,array) => {

        FechaAct = data.fecha.replace("T00:00:00.000Z","");
        HistoricsArray.push([data.latitud,data.longitud])
        if ((idx <= array.length - 2)){
            FechaNext = array[idx+1].fecha.replace("T00:00:00.000Z","");
        }
        if(typeof FechaNext !== 'undefined'){
            if ((FechaAct !== FechaNext)||(idx === array.length - 1)){
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

                marker = L.marker([data.latitud,data.longitud]);
                marker.bindPopup("Última ubicación del día: " + data.fecha.replace("T00:00:00.000Z",""));
                PolylineGroup.addLayer(marker);
                PolylineGroup.addLayer(PolyLine);
                HistoricsArray=[];
            }
        }
    })
    PolylineGroup.addTo(map)
}

function ActualizarHistoricosLocation(data){
    //function to add the polylines of the location moment
    
    if (typeof MarkerGroup !== 'undefined'){
        MarkerGroup.clearLayers()
        MarkerGroup.removeFrom(map);
    }
    LocationArray = [];
    data.forEach((data,idx,array) => {
        FechaAct = data.fecha.replace("T00:00:00.000Z","");
        if ((idx <= array.length - 2)){
            FechaNext = array[idx+1].fecha.replace("T00:00:00.000Z","");
        }
        LocationArray.push([data.latitud,data.longitud])
        if(typeof FechaNext !== 'undefined'){
            if ((FechaAct !== FechaNext)||(idx === array.length - 1)){
                
                
                var color;
                var r = Math.floor(Math.random() * 255);
                var g = Math.floor(Math.random() * 255);
                var b = Math.floor(Math.random() * 255);
                color= "rgb("+r+" ,"+g+","+ b+")"; 

                PolyLine = L.polyline(LocationArray,{ 
                    color: color,
                    weight: 5,
                    smoothFactor: 1
                })
                marker = L.marker([data.latitud,data.longitud]);
                marker.bindPopup("Fecha: " + data.fecha.replace("T00:00:00.000Z",""));
                MarkerGroup.addLayer(marker);
                MarkerGroup.addLayer(PolyLine);
                LocationArray=[];
            }
        }        
    })
    MarkerGroup.addTo(map);
    TableResultDeploy(data);
}

function TableResultDeploy(data){
    TableRows.innerHTML = '';
    Rows = '';
    data.forEach(data=>{ 
    
        Rows = Rows + `       
                    <tr class = 'table-primary'>
                        <td>` + data.fecha.replace("T00:00:00.000Z","") +`</td>
                        <td>`+ data.hora +`</td>  
                    </tr>`         
    })
    TableRows.innerHTML = `
        <div style="height: 200px;overflow-y: scroll; overflow:auto;">
            <table class="table table-bordered table-striped mb-0">
                <thead>
                
                    <tr class = 'table-primary'>
                        <th scope="col">Fecha</th>
                        <th scope="col">Hora</th>
                    </tr>
                    
                </thead> 
                <tbody>` + Rows + 
             `</tbody>
            </table>
        </div>`
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