var mysql = require('mysql');
require('dotenv').config()
const database = {
    host: process.env.HOST, 
    user: process.env.USERR, 
    database: process.env.DATABASE, 
    password: process.env.PASS 
};
console.log(database)
const connection = mysql.createConnection(database)

connection.connect((err) => {
    if (err) {
        console.error('error conecting: ' + err.stack);
        return;
    }
    else{
        console.log("Connected to DB")
    }
});
//a
module.exports = connection;
