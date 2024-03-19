const express = require('express')
const mysql = require('mysql2')
const db = require('../../../database')
const bodyParser = require('body-parser')
const randomString = require('randomstring')
const session = require('express-session')
const router = express.Router()

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())


router.get('/', async (req, res, next) => {
  let clientId = req.query.client_id
  let responseType = req.query.response_type
  let redirectUrl = req.query.redirect_url
  let now_date = new Date()
  const time = now_date.getFullYear() + '-' + (now_date.getMonth() + 1) + '-' + now_date.getDate() + ' ' + now_date.getHours() + ':' + now_date.getMinutes() + ':' + now_date.getSeconds()


  if (responseType === 'code') {  // client id, redirect url, scope, response type
    /*
    requests: GET, QUERY: client_id, redirect_url, scope, response_type
    */
    if (clientId == null || redirectUrl == null) {
      res.render('./authorize/error', {error: 'Bad request'})
    }
    else {
      let result = await check_client(clientId, redirectUrl)
      //console.log(result)
      if (result.status == 500) {
        console.log(time, req.baseUrl, req.ip)
        console.log(result.message)
        res.render('./authorize/error', {error: 'Internal server error'})
      }
      else if (result.status == 400) {
        console.log(time, req.baseUrl, req.ip)
        console.log(result.message)
        res.render('./authorize/error', {error: 'Invalid client'})
      }
      else {
        res.render('./authorize/approve', {client_name: result.message.client_name, service_id: result.message.service_id, redirect_url: redirectUrl, response_type: responseType})
      }
      /*
      if (result != null) {
        res.render('./authorize/approve', {client_name: result.client_name, service_id: result.service_id, redirect_url: redirectUrl, response_type: responseType})
      }*/
    }
  }
  else if (responseType === 'token'){  // client id, redirect url, scope, response type
    if (clientId == null || redirectUrl == null) {
      res.render('./authorize/error', {error: 'Bad request'})
    }
    else {
      let result = await check_client(clientId, redirectUrl)

      if (result.status == 500) {
        console.log(time, req.baseUrl, req.ip)
        console.log(result.message)
        res.render('./authorize/error', {error: 'Internal server error'})
      }
      else if (result.status == 400) {
        console.log(time, req.baseUrl, req.ip)
        console.log(result.message)
        res.render('./authorize/error', {error: 'Invalid client'})
      }
      else {
        res.render('./authorize/approve', {client_name: result.message.client_name, service_id: result.message.service_id, redirect_url: redirectUrl, response_type: responseType})
      }
      /*
      if (result != null) {
        res.render('./authorize/approve', {client_name: result.client_name, service_id: result.service_id, redirect_url: redirectUrl, response_type: responseType})
      }*/
    }
  }/*
  else if (responseType === 'test') {
    res.render('./authorize/approve', {client_name: 'test name', service_id: 'test id', redirect_url: redirectUrl,response_type: responseType})
  }*/
  else { res.render('./authorize/error', {error: 'Bad request'})}
}).post('/', (req, res) => {res.status(400).send('Bad request')})
router.post('/approve', (req, res) => {
  //console.log(req.body)
  //res.location(req.body.redirect_url)
  let now_date = new Date()
  const time = now_date.getFullYear() + '-' + (now_date.getMonth() + 1) + '-' + now_date.getDate() + ' ' + now_date.getHours() + ':' + now_date.getMinutes() + ':' + now_date.getSeconds()

  if (req.body.response_type === 'code') {
    if (req.body.approve === 'Approve') {
      let readService = req.body.read
      let writeService = req.body.write
      let manageService = req.body.manage
      let scopeStr = ''
      const sqlSelId = 'select client_id from client where service_id = ? and redirect_url = ?'
      db.execute(sqlSelId, [req.body.service_id, req.body.redirect_url], (err, results) => {
        if(err) {
          console.log(err)
          res.render('./authorize/error', {error: 'Internal server error'})
        }
        else if(results.length === 0 || results[0].del === 1){
          res.render('./authorize/error', {error: 'Invalid client'})
        }
        else {
          let clientId = results[0].client_id
          let redirectUrl = req.body.redirect_url
          if (readService === 'on') {scopeStr += req.body.service_id +':read '}
          if (writeService === 'on') {scopeStr += req.body.service_id +':write '}
          if (manageService === 'on') {scopeStr += req.body.service_id +':manage '}
          scopeStr = scopeStr.trim()
          let accessToken = 'code ' + token_generate()
          let now = Date.now() / 1000
          let timeStamp = now + 86400    // 1day
          enroll_token(clientId, accessToken, scopeStr, now, timeStamp, redirectUrl, 'code', res)
        }
      })
    }
    else {
      res.render('./authorize/error', {error: 'User denied'})
    }
  }
  else if (req.body.response_type === 'token') {
    if (req.body.approve === 'Approve') {
      let readService = req.body.read
      let writeService = req.body.write
      let manageService = req.body.manage
      let scopeStr = ''
      const sqlSelId = 'select client_id from client where service_id = ? and redirect_url = ?'
      db.execute(sqlSelId, [req.body.service_id, req.body.redirect_url], (err, results) => {
        if(err) {
          console.log(err)
          res.render('./authorize/error', {error: 'Internal server error'})
        }
        else if(results.length === 0 || results[0].del === 1){
          res.render('./authorize/error', {error: 'Invalid client'})
        }
        else {
          let clientId = results[0].client_id
          let redirectUrl = req.body.redirect_url
          if (readService === 'on') {scopeStr += req.body.service_id +':read '}
          if (writeService === 'on') {scopeStr += req.body.service_id +':write '}
          if (manageService === 'on') {scopeStr += req.body.service_id +':manage '}
          scopeStr = scopeStr.trim()
          let accessToken = token_generate()
          let now = Date.now() / 1000
          let timeStamp = now + 15768000    // 30day
          enroll_token(clientId, accessToken, scopeStr, now, timeStamp, redirectUrl, 'token', res)
        }
      })
    }
    else {
      res.render('./authorize/error', {error: 'User denied'})
    }
  }
  
})

let fetch_unix_timestamp = (date) => {
  return Math.floor(date.getTime() / 1000)
}

let token_generate = () => {
  return randomString.generate({length: 30, capitalization: 'lowercase'})
}

function check_scope (scopeStr, serviceId) {
  const arr = []
  scopeStr.split(' ').forEach(element => {
    if(element.includes(serviceId)){
      if (element.includes('read') || element.includes('write')) {arr.push(true)}
      else if (element.includes('manage')) {arr.push(true)}
      else {arr.push(false)}
    }
    else {arr.push(false)}
  })
  if (arr.includes(false)) {return false}
  else {return true}
}

async function check_client (clientId, redirectUrl) {
  const sqlSelId = 'select * from client where client_id = ? and redirect_url = ?'
  return new Promise((resolve, reject) => {
    db.execute(sqlSelId, [clientId, redirectUrl], (err, results) => {
      if(err) {
        console.log(err)
        //res.render('./authorize/error', {error: 'Internal server error'})
        resolve({'status': 500, 'message': err})
      }
      else if(results.length === 0 || results[0].del === 1){
        //res.render('./authorize/error', {error: 'Invalid client'})
        resolve({'status': 400, 'message': 'invalid client'})
      }
      else { resolve({'status': 200, 'message': results[0]})}
    })
  })
  
}

function enroll_token (clientId, accessToken, scopeStr, now, timeStamp, redirectUrl, responseType, res) {
  const sqlIns = 'insert into token(client_id, access_token, scope, iss, exp, redirect_url) values(?,?,?,?,?,?)'
  db.execute(sqlIns, [clientId, accessToken, scopeStr, now, timeStamp, redirectUrl], (err, results) => {
    if (err){
      console.log(err)
      if(err.errno == 1062){
        console.log('regenerate token, client ID: ' + clientId)
        let regenAccessToken = token_generate()
        if (responseType === 'code') { regenAccessToken = 'code ' + regenAccessToken }
        enroll_token(clientId, regenAccessToken, scopeStr, now, timeStamp, redirectUrl, responseType, res)
      }
      else {
        res.render('./authorize/error', {error: 'Internal server error'})
      }
    }
    else {
      res.location = redirectUrl
      if (responseType === 'code') {
        res.json({status: 200, data: {client_id: clientId, code: accessToken.split('code ', 2)[1], grant_type: "authorization_code", redirect_url: redirectUrl}})
      }
      else if (responseType === 'token') {
        res.json({status: 200, data: {access_token: accessToken, expire_in: timeStamp - now, scopes: scopeStr.split(' '), token_type: 'bearer'}})
      }
    }
  })
}

module.exports = router