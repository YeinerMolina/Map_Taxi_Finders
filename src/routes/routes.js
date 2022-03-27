const router = require('express').Router();

//Routes
router.get('/', (req,res) =>{
    res.render('index');
})

const connection = require('../../database/db.js');
module.exports = router;
