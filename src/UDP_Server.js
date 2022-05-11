const UDPPORT = 10000
const dgram =  require('dgram');
const { connect } = require('../database/db.js');
const server = dgram.createSocket('udp4');

server.on('error',(err)=>{
    console.log('Server error: ' + err);
    server.close();
})

console.log("UDP Server on");
server.on('message',(msg,rinfo)=>{
        const Mensaje = msg.toString().split(', ')
        if (Mensaje.length==6){
            RPM = Mensaje[5];
        }else{
            RPM = 0;
        }
        Velocidad = Math.floor(Math.random() * (60 - 40 + 1) + 40)
        ID = Mensaje[4];
        hora = Mensaje[3];
        fecha = Mensaje[2];
        Longitud = Mensaje[1];
        Latitud = Mensaje[0];
        
        QueryInsert = `INSERT INTO taxi.coordenadas (ID,fecha,latitud,longitud,hora,RPM) value ?`;
        value = [[ID,fecha,parseFloat(Latitud),parseFloat(Longitud),hora,RPM]];
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