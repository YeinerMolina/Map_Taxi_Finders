module.exports = io => {
    io.on('connection',(socket) => {

        Historicos = false;

        console.log('New user connected');
        ActualizarDatos(socket);

        socket.on('Server: NewData',()=>{
            ActualizarDatos(socket);
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
                ActualizarDatos(socket);
            }    
        }, 3000);
        
    })

}

function ActualizarDatos(socket){
    Query = "SELECT * FROM taxi.coordenadas ORDER BY DataNumber DESC LIMIT 1";
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
    Query = "select * from coordenadas WHERE cast(concat(fecha, ' ', hora) as datetime)>=? AND cast(concat(fecha, ' ', hora) as datetime)<=?";
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
    Query = "SELECT hora,fecha,latitud,longitud, (6371 * acos (cos ( radians(?) ) * cos( radians( latitud ) )* cos( radians( longitud ) - radians(?) )+ sin ( radians(?) )* sin( radians( latitud ) ))) AS distance FROM taxi.coordenadas HAVING distance < ? ORDER BY DataNumber;";
    data = [lan,lng,lan,Radio/1000];
    connection.query(Query,data, (error,data) => {
        if(error){
            console.log(error);
        }else{
            socket.emit('Server: NewHistoricsLocation',data)
        }

    })
}

const connection = require('../database/db');