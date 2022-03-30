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
    exec('git pull && sudo kill -9 $(sudo lsof -t -i:3000) && npm start')

})

const connection = require('../../database/db.js');
module.exports = router;
