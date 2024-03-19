const express = require('express')
//const mysql = require('mysql2')
const db = require('../../../database')
const bodyParser = require('body-parser')
const router = express.Router()

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.get('/', (req, res, next) => {
  
  let errMsg = {"status": 401, "message": "Invalid access token"}
  let error_message = {"status": 401, "message": "missing access token"}
  let auth = req.headers.authorization
  const sql = 'select * from token where access_token = ? or refresh_token = ?'
  const sqlDel = 'update token set del = 1 where access_token = ?'
  let now = new Date()
  const time = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
  //console.log(time)
  if (auth == undefined) {
    console.log(time, req.baseUrl, req.ip,'auth is undefined')
    res.status(401).send({"status": 401, "message": "missing auth parameter"})
  }
  else if (auth.indexOf('Bearer') != -1) {
    const token = auth.split('Bearer ', 2)[1]
    db.execute(sql, [token, token], (err, results) => {
      if(err) {
        res.status(500).send('Internal server error')
        console.log(time, req.baseUrl, req.ip, 'db select error')
        console.log(err)
      }
      else if(results.length === 0 || results[0].del === 1) {
        console.log(time, req.baseUrl, req.ip, 'token expired')
        res.status(401).send(errMsg)
      }
      else if(results[0].exp < fetch_unix_timestamp(new Date())){
        db.execute(sqlDel, [token], (err, updateResults) => {
          if(err) {
            res.status(500).send('Internal server error')
            console.log(time, req.baseUrl, req.ip, 'db update error')
            console.log(err)
          }
          else {
            console.log(time, req.baseUrl, req.ip, 'token expired')
            res.status(401).send(errMsg)
          }
        })
      }
      else {
        let valMsg = { client_id: results[0].client_id, scope: results[0].scope.split(' '), expires_in: results[0].exp - results[0].iss }
        console.log(time, req.baseUrl, req.ip, 'token valid')
        res.json(valMsg)
      }
    })

  }
  else {
    console.log(time, req.baseUrl, req.ip, 'auth is not Bearer')
    res.status(401).json(error_message)
  }
}).post('/', (req, res) => {res.status(400).send('Bad request'); console.log(time, req.baseUrl, req.ip, 'post request')})

fetch_unix_timestamp = (date) => {
  return Math.floor(date.getTime() / 1000)
}

module.exports = router