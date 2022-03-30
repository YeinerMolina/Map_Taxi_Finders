const router = require('express').Router();
const { exec } = require('child_process');


//Routess
router.get('/', (req,res) =>{
    res.render('index');
})

router.get('/getData',(req,res) =>{
    QueryActualizar = "SELECT * FROM taxi.coordenadas ORDER BY DataNumber DESC LIMIT 1";
    connection.query(QueryActualizar, function(error,data){
        if(error){
            console.log(error);
        }
        else{
            res.json(data);
        }
    })
})
//sEl de la mitad obtiene una lista de los programas que ocupan el puerto 3000. 
router.post('/github',(req,res)=>{
    exec('git pull && sudo kill -9 $(sudo lsof -t -i:3000) && npm start')
    
})
const connection = require('../../database/db.js');
module.exports = router;
