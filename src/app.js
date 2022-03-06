const express = require('express');
const dotenv = require('dotenv');
const engine = require('ejs-mate');
const path = require('path');

//Inicializar
const app = express();
app.engine('ejs', engine);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
dotenv.config({path:'./env/.env'});

//routes 
app.use(require('./routes/routes.js'));


//Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')))

//Inicial servidor 
app.listen(3000, ()=>{
    console.log('Server on port 3000');
})

const connection = require('../database/db');