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
            console.log(TimeArray)
            HistoricosFecha(socket,TimeArray)
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
    Query = "SELECT * FROM coordenadas WHERE fecha= ? AND hora>? AND hora<? ORDER BY DataNumber";
    const Date = TimeArray[0].Date;
    const InitialTime = TimeArray[0].TimeI;
    const EndTime = TimeArray[0].TimeF;
    data = [Date, InitialTime, EndTime];
    connection.query(Query,data, (error,data) => {
        if(error){
            console.log(error);
        }else{
            socket.emit('Server: NewHistorics',data)
        }

    })
}

const connection = require('../database/db');