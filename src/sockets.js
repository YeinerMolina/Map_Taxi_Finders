module.exports = io => {
    io.on('connection',(socket) => {

        console.log('New user connected');
        ActualizarDatos(socket);
        
        io.on('Server: NewData',()=>{
            ActualizarDatos(socket);
        })
    })
}

function ActualizarDatos(socket){
    QueryActualizar = "SELECT * FROM taxi.coordenadas ORDER BY fecha, hora DESC LIMIT 1";
    connection.query(QueryActualizar, function(error,data){
        if(error){
            console.log(error);
        }
        else{
            socket.emit('server: NewUserCoordenates', data);
            console.log('Sended data')
        }
    })
}

const connection = require('../database/db');