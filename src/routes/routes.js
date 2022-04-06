const router = require('express').Router();
const { exec } = require('child_process');


//Routes
router.get('/', (req,res) =>{
    res.render('index');
})

router.get('/Historicos', (req,res) =>{
    res.render('Historicos');
})

router.post('/github',(req,res)=>{
    exec('git pull')

})
const connection = require('../../database/db.js');
module.exports = router;
