const router = require('express').Router();

//Routes
router.get('/', (req,rest) =>{
    rest.render('index');
})

router.get('/getData',(req,res) =>{
    QueryActualizar = "SELECT * FROM taxi.coordenadas ORDER BY (fecha and hora) DESC limit 1";
    connection.query(QueryActualizar, function(error,data){
        if(error){
            console.log(error);
        }
        else{
            res.json(data);
        }
    })
})

const connection = require('../../database/db.js');
module.exports = router;
