const express = require('express')
//const mysql = require('mysql2')
const db = require('../../../database')
const bodyParser = require('body-parser')
const randomString = require('randomstring')
const bcrypt = require('bcrypt')
const saltRounds = 10
const session = require('express-session')
const router = express.Router()

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.post('/', (req, res, next) => {
  let id = req.body.id
  let pw = req.body.pw
  let now_date = new Date()
  let time = now_date.getFullYear() + '-' + (now_date.getMonth() + 1) + '-' + now_date.getDate() + ' ' + now_date.getHours() + ':' + now_date.getMinutes() + ':' + now_date.getSeconds()
  let sqlSel = 'select * from user where id = ?'

  db.execute(sqlSel, [id], (err, results) => {
    if (err) {
      console.log(time, req.baseUrl, req.ip, 'login sql error')
      console.log(err)
      res.status(500).send({'status': 500, 'message': 'Internal server error'})
    }
    else {
      if (results.length == 0 || results[0].del == 1) {
        console.log(time, req.baseUrl, req.ip, 'login fail, invalid id')
        res.status(401).send({'status': 401, 'message': 'ID or password is incorrect'})
      }
      else {
        bcrypt.compare(pw, results[0].passwd, (err, result) => {
          if (err) {
            console.log(time, req.baseUrl, req.ip, 'login bcrypt error')
            console.log(err)
            res.status(500).send({'status': 500, 'message': 'Internal server error'})
          }
          else {
            if (result) {
              console.log(time, req.baseUrl, req.ip, 'login success')
              req.session.user = {
                'num': results[0].num,
                'id': results[0].id,
                'admin': results[0].admin,
                'approval': results[0].approval,
                'isLogined': true
              }
              req.session.save(() => {
                //console.log('test session', req.session)
                res.status(200).send({'status': 200, 'message': 'success'})
              })
              
            }
            else {
              console.log(time, req.baseUrl, req.ip, 'login fail, incorrect password')
              res.status(401).send({'status': 401, 'message': 'ID or password is incorrect'})
            }
          }
        })
      }
    }
  })
})






module.exports = router