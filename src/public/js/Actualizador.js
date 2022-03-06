const connection = require('./../../../database/db');

$(document).ready(function(){
  setInterval(
      function(){
        console.log("funcionando");
        QueryActualizar = "SELECT * FROM taxi.coordenadas ORDER BY (fecha and hora) DESC limit 1";
        connection.query(QueryActualizar, function(error,data){
        if(error){
            console.log(error);
        }
        else{
          console.log(data)
          id.innerHTML = data.ID             // innerHTML establece la conexion en los id's 
          latitud.innerHTML = data.latitud
          longitud.innerHTML = data.longitud
          fecha.innerHTML = data.fecha
          hora.innerHTML = data.hora
            }
        
    })			
  },1500);
  });

// Usamos selector para asignar el valor de la fila en un id
id = document.getElementById('id')
latitud = document.getElementById('latitud')
longitud = document.getElementById('longitud')
fecha = document.getElementById('fecha')
hora = document.getElementById('hora')  


// crea un long polling para simular un socket y pedir los datos periodicamente con un intervalos de 5seg




