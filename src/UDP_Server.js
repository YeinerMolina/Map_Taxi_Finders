const UDPPORT = 10000
const dgram =  require('dgram');
const server = dgram.createSocket('udp4');
const {io} = require('./sockets.js')

server.on('error',(err)=>{
    console.log('Server error: ' + err);
    server.close();
})

console.log("UDP Server on");
server.on('message',(msg,rinfo)=>{
        const Mensaje = msg.toString().split(', ')
        QueryInsert = `INSERT INTO taxi.coordenadas (ID,fecha,latitud,longitud,hora) value ?`;
        value = [[1,Mensaje[2],parseFloat(Mensaje[0]),parseFloat(Mensaje[1]),Mensaje[3]]];
        connection.query(QueryInsert,[value], (error,data) =>{
            if(error){
                console.log(error);
            }
            else{
                console.log('Data enviada: ' + Mensaje);
            }
        })
})
server.bind(UDPPORT)


const connection = require('../database/db.js');