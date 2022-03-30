const router = require('express').Router();

//Routes
router.get('/', (req,res) =>{
    res.render('index');
})

router.get('/Historicos', (req,res) =>{
    res.render('Historicos');
})

const connection = require('../../database/db.js');
module.exports = router;
