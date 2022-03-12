module.exports = io => {
    io.on('connection',(socket) => {
        io.on('NewData',()=>{
            console.log('NewDataRecived')    
        })
        console.log('New user connected');
        QueryActualizar = "SELECT * FROM taxi.coordenadas ORDER BY fecha, hora DESC LIMIT 1";
            connection.query(QueryActualizar, function(error,data){
                if(error){
                    console.log(error);
                }
                else{
                    socket.broadcast.emit('NewUserCoordenates', data);
                    console.log('Sended data')
                }
            })
    })
}

const connection = require('../database/db');