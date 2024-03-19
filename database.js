const mysql = require('mysql2')
const conn = {
  host: 'db',
  port: 3306,
  user: 'issue',
  password: 'issue',
  database: 'oauth',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}
const pool = mysql.createPool(conn)
/* 
  데이터베이스 연결을 위한 설정
  보안을 위해 외부 파일로 분리
  gitignore에 추가하여 github에 올리지 않음
*/

module.exports = pool