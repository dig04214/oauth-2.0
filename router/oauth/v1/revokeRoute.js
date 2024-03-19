const express = require('express')
//const mysql = require('mysql2')
const router = express.Router()
const bodyParser = require('body-parser')
const db = require('../../../database')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.post('/', (req, res, next) => {
  let msg401 = {"status": 401, "message": "Invalid token"}
  let msg406 = {"status": 406, "message": "Invalid client"}
  let token = req.body.token
  let clientId = req.body.client_id
  const sqlUpd = 'update token set del = 1 where access_token = ?'
  const sqlSel = 'select * from token where access_token = ?'
  let now = new Date()
  let time = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
  //console.log(token, clientId)
  db.execute(sqlSel, [token], (err, resultSel) => {
    if(err){
      console.log(time, req.baseUrl, req.ip, 'db select error')
      console.log(err)
      res.status(500).send('Internal server error')
    }
    else if(resultSel.length === 0 || resultSel[0].del === 1){
      console.log(time, req.baseUrl, req.ip, 'token not found', 'resultSel.length', resultSel.length, 'resultSel[0].del', resultSel[0].del)
      res.status(401).json(msg401)
    }
    else if(resultSel[0].client_id != clientId){
      console.log(time, req.baseUrl, req.ip, 'client is not match')
      res.status(406).json(msg406)
    }
    else {
      db.execute(sqlUpd, [token], (err, resultUpd) => {
        if(err){
          console.log(time, req.baseUrl, req.ip, 'db token delete error')
          res.status(500).send('Internal server error')
        }
        else {
          console.log(time, req.baseUrl, req.ip, 'token delete success')
          res.status(200).send()
        }
      })
    }
    
  })
}).get('/', (req, res, next) => {res.status(400).send('Bad request')})

module.exports = router