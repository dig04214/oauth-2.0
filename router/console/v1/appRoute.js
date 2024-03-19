const express = require('express')
const mysql = require('mysql2')
const db = require('../../../database')
const bodyParser = require('body-parser')
const randomString = require('randomstring')
const session = require('express-session')
const router = express.Router()

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.get('/', (req, res, next) => {})
router.get('/register', (req, res, next) => {res.render('app/register', {user_name: "test"})
})
router.post('/approve', (req, res, next) => {
  let clientName = req.body.client_name
  let redirectUrl = req.body.redirect_url
  let serviceId = req.body.service_id
  let clientId = token_generate(20)
  let clientSecret = token_generate(32)
  let now = fetch_unix_timestamp(new Date())
  db.execute('select service_id from client where service_id = "?"', [serviceId], (err, results) => {
    if (err) {
      console.log(err)
      if(err.errno == 1062) {
        res.render('./authorize/error', {error: 'Service ID already exists'})
        return null
      }
      else {
        res.render('./authorize/error', {error: 'Internal server error'})
        return null
      }
    }
    else {
      enroll_client(clientId, clientName, redirectUrl, serviceId, clientSecret, now, res)
    }
  })
})
router.get('/check/:id', (req, res, next) => {
  let clientId = req.params.id
  console.log(typeof(clientId))
  let result = check_client(clientId, res)
  if (result != null) {
    res.render('app/check', {client_id: clientId, redirect_url: result.redirect_url, client_name: result.client_name, service_id: result.service_id, client_secret: null})
  }
})

let fetch_unix_timestamp = (date) => {
  return Math.floor(date.getTime() / 1000)
}

let token_generate = (num) => {
  return randomString.generate({length: num, capitalization: 'lowercase'})
}

let enroll_client = (clientId, clientName, redirectUrl, serviceId, clientSecret, now, res) => {
  const sqlIns = 'insert into client (client_id, client_name, redirect_url, service_id, client_secret, iss) values (?, ?, ?, ?, ?, ?)'
  db.execute(sqlIns, [clientId, clientName, redirectUrl, serviceId, clientSecret, now], (err, results) => {
    if (err) {
      console.log(err)
      if (err.errno == 1062) {
        let regenClientId = token_generate(20)
        let regenClientSecret = token_generate(32)
        enroll_client(regenClientId, clientName, redirectUrl, serviceId, regenClientSecret, now, res)
      }
      else {
      res.render('./authorize/error', {error: 'Internal server error'})
      }
    }
    else {
      res.render('app/check', {client_id: clientId, redirect_url: redirectUrl, client_name: clientName, service_id: serviceId, client_secret: clientSecret})
    }
  })
}

let check_client = (clientId, res) => {
  const sqlSelId = 'select * from client where client_id = ?'
  db.execute(sqlSelId, [clientId], (err, results) => {
    if(err) {
      console.log(err)
      res.render('./authorize/error', {error: 'Internal server error'})
      return null
    }
    else if(results.length === 0 || results[0].del === 1){
      console.log(results)
      res.render('./authorize/error', {error: 'Invalid client'})
      return null
    }
    else {return results[0]}
  })
}


module.exports = router