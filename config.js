require("dotenv")
const mysql =require("mysql");

const db = mysql.createConnection({
    host:process.env.host,
    port:process.env.port,
    user:process.env.user,
    password:process.env.password,
    database:process.env.database
});

db.connect();
console.log("dbbbbb")
module.exports=db