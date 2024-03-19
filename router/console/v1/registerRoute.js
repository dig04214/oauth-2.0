const express = require('express')
//const mysql = require('mysql2')
const db = require('../../../database')
const bodyParser = require('body-parser')
//const randomString = require('randomstring')
const bcrypt = require('bcrypt')
const saltRounds = 10
const session = require('express-session')
const router = express.Router()

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.post('/', (req, res, next) => {
  let id = req.body.id
  let pw = req.body.pw
  //let hash_pw = ''
  let email = req.body.email
  let name = req.body.name
  let now = Date.now() / 1000
  let now_date = new Date()
  let time = now_date.getFullYear() + '-' + (now_date.getMonth() + 1) + '-' + now_date.getDate() + ' ' + now_date.getHours() + ':' + now_date.getMinutes() + ':' + now_date.getSeconds()
  let sql = 'insert into user (id, passwd, email, name, iss) values (?, ?, ?, ?, ?)'

  
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      console.log(time, req.baseUrl, req.ip, 'salt create error')
      console.log(err)
    }
    bcrypt.hash(pw, salt, (err, hash) => {
      if (err) {
        console.log(time, req.baseUrl, req.ip, 'hash create error')
        console.log(err)
      }
      console.log(time, req.baseUrl, req.ip, 'hash create success')
      db.execute(sql, [id, hash, email, name, now], (err, results) => {
        if (err) {
          console.log(time, req.baseUrl, req.ip, 'register sql error')
          console.log(err)
          if (err.errno == 1062) {
            res.status(500).send({'status': 500, 'message': 'ID already exists'})
            
          }
          else {
            res.status(500).send({'status': 500, 'message': 'Internal server error'})
            
          }
        }
        else {
          console.log(time, req.baseUrl, req.ip, 'register success')
          res.status(200).send({'status': 200, 'message': 'success'})
        }
      })
    })
  })
/*
      db.execute(sql, [id, hash_pw, email, name, now], (err, results) => {
        if (err) {
          console.log(time, req.baseUrl, req.ip, 'register sql error')
          console.log(err)
          if (err.errno == 1062) {
            res.status(500).send({'status': 500, 'message': 'ID already exists'})
            
          }
          else {
            res.status(500).send({'status': 500, 'message': 'Internal server error'})
            
          }
        }
        else {
          console.log(time, req.baseUrl, req.ip, 'register success')
          res.status(200).send({'status': 200, 'message': 'success'})
        }
      })
*/
})
.post('/test', (req, res) => {
  let id = req.body.id
  let pw = req.body.pw
  var hash_pw
  let email = req.body.email
  let name = req.body.name
  let now = Date.now() / 1000
  let now_date = new Date()
  let time = now_date.getFullYear() + '-' + (now_date.getMonth() + 1) + '-' + now_date.getDate() + ' ' + now_date.getHours() + ':' + now_date.getMinutes() + ':' + now_date.getSeconds()
  let sql = 'insert into user (id, passwd, email, name, iss) values (?, ?, ?, ?, ?)'

  
  hash_pw = bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      console.log(time, req.baseUrl, req.ip, 'salt create error')
      console.log(err)
    }
    let temp = bcrypt.hash(pw, salt, (err, hash) => {
      if (err) {
        console.log(time, req.baseUrl, req.ip, 'hash create error')
        console.log(err)
      }
      console.log(time, req.baseUrl, req.ip, 'hash create success')
      console.log('hash:', hash)
      return hash
    })
    console.log('temp:', temp)
    return temp
  })
  console.log('hash_pw:', hash_pw)
  res.send({'status': 200, 'message': 'success'})
})









module.exports = router