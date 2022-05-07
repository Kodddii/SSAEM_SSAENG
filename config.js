const mysql = require('mysql2');
require('dotenv').config();

// mysql 접속 설정
const db = mysql.createConnection({
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});



db.connect();
console.log('db가 연결되었습니다!!!')

module.exports = db;