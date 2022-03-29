const router = require('express').Router();
const { exec } = require('child_process');


//Routes
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
router.post('/github',(req,res)=>{
    exec('git pull')
})
const connection = require('../../database/db.js');
module.exports = router;
