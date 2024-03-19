const express = require('express')
//const mysql = require('mysql2')
const db = require('../../../database')
const bodyParser = require('body-parser')
const randomString = require('randomstring')
const bcrypt = require('bcrypt')
const saltRounds = 10
const session = require('express-session')
const router = express.Router()

const authRoute = require('./authRoute')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.get('/', (req, res) => {
  let now_date = new Date()
  const time = now_date.getFullYear() + '-' + (now_date.getMonth() + 1) + '-' + now_date.getDate() + ' ' + now_date.getHours() + ':' + now_date.getMinutes() + ':' + now_date.getSeconds()
  //console.log(time, req.baseUrl, req.ip, req.session)
  req.session.destroy(() => {
    //console.log(time, req.baseUrl, req.ip, req.session)
    res.status(200).send({'status': 200, 'message': 'logout success'})
  })
})





module.exports = router