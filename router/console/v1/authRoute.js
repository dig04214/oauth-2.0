/*
function auth (req, res, next) {
  let now = Date.now() / 1000
   
  if (!req.session.user || now > req.session.exp) {
    return {'isAuth': false, 'error': true}
  }
  else {
    next()
  }
}

module.exports = auth*/

const express = require('express')
//const mysql = require('mysql2')
//const db = require('../database')
const bodyParser = require('body-parser')
//const randomString = require('randomstring')
const session = require('express-session')
const router = express.Router()

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.get('/', (req, res) => {
  let now_date = new Date()
  const time = now_date.getFullYear() + '-' + (now_date.getMonth() + 1) + '-' + now_date.getDate() + ' ' + now_date.getHours() + ':' + now_date.getMinutes() + ':' + now_date.getSeconds()
  let now = Date.now() / 1000
  //console.log(time, req.baseUrl, req.ip, req.session)
  if (!req.session.user) {
    console.log(time, req.baseUrl, req.session.id, 'not login')
    res.send({'status': 401, 'user': null, 'isAuth': false, 'id': null})
  }
  else if (now > req.session.exp) {
    console.log(time, req.baseUrl, req.session.id, 'session expired')
    res.send({'status': 401, 'user': null, 'isAuth': false, 'id': null})
  }
  else {
    console.log(time, req.baseUrl, req.session.id, 'login')
    res.send({'status': 200, 'user': req.session.user, 'isAuth': true, 'id': req.session.id})
  }
})



module.exports = router