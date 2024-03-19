const express = require('express')
const mysql = require('mysql2')
const db = require('../../../database')
const bodyParser = require('body-parser')
const randomString = require('randomstring')
const router = express.Router()

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
now_time = new Date()
const time = now_time.getFullYear() + '-' + (now_time.getMonth() + 1) + '-' + now_time.getDate() + ' ' + now_time.getHours() + ':' + now_time.getMinutes() + ':' + now_time.getSeconds()

router.post('/', (req, res, next) => {
  /*서비스 등록 관련 api*/
  let client_name = req.body.client_name
  let service_id = req.body.service_id
  let redirect_url = req.body.redirect_url
  let client_id = randomString.generate(32)
  let client_secret = randomString.generate(32)


  let sql = 'INSERT INTO client (client_name, service_id, redirect_url) VALUES (?, ?, ?)'
  
  db.execute(sql, [client_name, service_id, redirect_url], (err, result) => {
    if (err) {
      console.log(time, req.baseUrl, req.ip)
      console.log(err)
      res.status(500).send({error: 'Internal server error'})
    }
    else {
      res.status(200).send({})
    }
  })

})






module.exports = router