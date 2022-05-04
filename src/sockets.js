module.exports = io => {
    io.on('connection',(socket) => {

        Historicos = false;

        console.log('New user connected');
        ActualizarDatos(socket,1);
        ActualizarDatos(socket,2);

        socket.on('Server: NewData',()=>{
            ActualizarDatos(socket,1);
        })

        socket.on('Client: TimeStampLocationDetails',(TimeStamp)=>{
            LocationTimeDetails(socket,TimeStamp);
        })

        socket.on('Client: LocationDetailsRequest',(Location)=>{
            LocationDetails(socket,Location);
        })

        socket.on('Client: HistoricsPage',()=>{
            Historicos = true;
        })

        socket.on('Client: StartPage', () => {
            Historicos = false;
        })

        socket.on('Client: RequiredHistoricos',(TimeArray)=>{
            HistoricosFecha(socket,TimeArray)
        })

        socket.on('Client: RequiredHistoricosLocation',(LocationArray)=>{
            HistoricosUbicacion(socket,LocationArray)
        })

        socket.on('Client: RequiredRealTimeLocation',()=>{
            Historicos = false 
            ActualizarDatos(socket);
        })

        socket.on('Hello',(arg)=>{
            console.log(arg)
        })

        setInterval(() => {
        if (!Historicos) {
                ActualizarDatos(socket,1);
                ActualizarDatos(socket,2);
            }    
        }, 3000);
        
    })

}

function ActualizarDatos(socket,ID){
    Query = "SELECT * FROM taxi.coordenadas WHERE ID="+ ID + " ORDER BY DataNumber DESC LIMIT 1";
    connection.query(Query, (error,data)=>{
        if(error){
            console.log(error);
        }
        else{
            socket.emit('Server: NewUserCoordenates', data);
        }
    })
}

function HistoricosFecha(socket,TimeArray){
    Query = "select *, cast(concat(fecha, ' ', hora) as datetime) as TimeStamp from coordenadas HAVING TimeStamp>=? AND TimeStamp<=?";
    const InitialDate = TimeArray.DateI;
    const InitialTime = TimeArray.TimeI;
    const EndDate = TimeArray.DateF;
    const EndTime = TimeArray.TimeF;
    data = [InitialDate + ' ' + InitialTime, EndDate +' '+ EndTime];
    connection.query(Query,data, (error,data) => {
        if(error){
            console.log(error);
        }else{
            socket.emit('Server: NewHistorics',data)
        }

    })
}

function HistoricosUbicacion(socket,LocationArray){

    lan = LocationArray.lat;
    lng = LocationArray.lon;
    Radio = LocationArray.radio;
    const InitialDate = LocationArray.DateI;
    const InitialTime = LocationArray.TimeI;
    const EndDate = LocationArray.DateF;
    const EndTime = LocationArray.TimeF;
    data = [InitialDate + ' ' + InitialTime, EndDate +' '+ EndTime];
    Query = "SELECT *, (6371 * acos (cos ( radians(?) ) * cos( radians( latitud ) )* cos( radians( longitud ) - radians(?) )+ sin ( radians(?) )* sin( radians( latitud ) ))) AS distance, cast(concat(fecha, ' ', hora) as datetime) as TimeStamp FROM taxi.coordenadas HAVING distance < ? AND TimeStamp>=? AND TimeStamp<=? ORDER BY DataNumber;";
    data = [lan,lng,lan,Radio/1000, InitialDate + ' ' + InitialTime, EndDate +' '+ EndTime];
    connection.query(Query,data, (error,data) => {
        if(error){
            console.log(error);
        }else{
            socket.emit('Server: NewHistoricsLocation',data)
        }

    })
}

function LocationDetails(socket,Location){
    lat = Location.lat;
    lon = Location.lng;
    Radio = 0.1;
    DateI = Location.DateI;
    DateF = Location.DateF;
    Query = "SELECT *, (6371 * acos (cos ( radians(?) ) * cos( radians( latitud ) )* cos( radians( longitud ) - radians(?) )+ sin ( radians(?) )* sin( radians( latitud ) ))) AS distance, cast(concat(fecha, ' ', hora) as datetime) as TimeStamp FROM taxi.coordenadas HAVING distance < ? AND TimeStamp>=? AND TimeStamp<=? ORDER BY distance ASC LIMIT 1";
    data = [lat,lon,lat,Radio, DateI, DateF];
    connection.query(Query,data, (error,data) => {
        if(error){
            console.log(error);
        }else{
            socket.emit('Server: LocationDetailsReply',data)
        }
    })
}

function LocationTimeDetails(socket,TimeStamp){
    Query = "Select *, cast(concat(fecha, ' ', hora) as datetime) as TimeStamp From taxi.coordenadas HAVING TimeStamp = ?"
    connection.query(Query,TimeStamp, (error,data) => {
        if(error){
            console.log(error);
        }else{
            socket.emit('Server: NewLatLngLocation',data)
        }
    })
}

const connection = require('../database/db');