const express = require('express')
const mysql = require('mysql2')
const db = require('../../../database')
const bodyParser = require('body-parser')
const randomString = require('randomstring')
const router = express.Router()

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.post('/', async (req, res, next) => {
  let clientId = req.body.client_id
  let clientSecret = req.body.client_secret
  let grantType = req.body.grant_type
  let code = ''
  let accessToken = ''
  let refreshToken = ''
  let now = Date.now() / 1000
  let now_date = new Date()
  let ccTimestamp = now + 2592000   // +30 days
  let acTimeStamp = now + 15768000   // +180 days
  let rtTimestamp = now + 20952000   // +240 days
  const time = now_date.getFullYear() + '-' + (now_date.getMonth() + 1) + '-' + now_date.getDate() + ' ' + now_date.getHours() + ':' + now_date.getMinutes() + ':' + now_date.getSeconds()
  const sqlSelCode = 'select * from token where client_id = ? and access_token = ?'
  const sqlSelRefresh = 'select * from token where client_id = ? and refresh_token = ?'
  
  if(grantType === 'client_credentials'){  //client_id, client_secret, grant_type, scope
    /*
    requests: POST, body: client_id, client_secret, grant_type, scope
    returns: JSON
    {
      "status": 200,
      "data": {
        "access_token": your_access_token,
        "expire_in": expire_in_seconds,
        "scopes": [
          token_scopes
        ],
        "token_type": "bearer"
      }
    }
    */

    let result = await check_client(clientId, clientSecret)
    if (result.status === 500) {
      console.log(time, req.baseUrl, req.ip)
      console.log(result.message)
      res.status(500).send('Internal server error')
    }
    else if (result.status === 406) {
      console.log(time, req.baseUrl, req.ip, result.message)
      res.status(406).send({status: 406, message: 'Invalid client'})
    }
    else if (result.status === 200) {
      console.log(time, req.baseUrl, req.ip, 'success')
      let scopeStr = req.body.scope
      scopeStr = scopeStr.trim()
      let serviceId = result.message.service_id
      if (check_scope(scopeStr, serviceId)) {
        accessToken = token_generate()
        
        enroll_token(clientId, accessToken, null, scopeStr, now, ccTimestamp, null, result.message.redirect_url, res)
      }
      else {
        console.log(time, req.baseUrl, req.ip, 'Invalid scope')
        res.status(406).send({status: 406, message: 'Invalid scope'})
      }
    }
    else {
      console.log(time, req.baseUrl, req.ip, 'Unexpected server error')
      res.status(501).send('Unexpected server error')
    }
    
    /*
    if (result != null) {
      let serviceId = result.service_id
      let scopeStr = req.body.scope
      if(check_scope(scopeStr, serviceId)){
        accessToken = token_generate()
        enroll_token(clientId, accessToken, null, scopeStr, now, ccTimestamp, null, result.redirectUrl, res)
      }
      else {
        res.status(401).send({status: 401, message: 'Invalid scopes'})
      }
    }
    else if (result == undefined) {
      res.status(501).send('Internal server error')
    }
    else {

    }*/
  }
  else if( grantType === 'authorization_code'){  //client_id, client_secret, grant_type, code, redirect_url
    /*
    requests: POST, body: client_id, client_secret, grant_type, code, redirect_url
    returns: JSON
    {
      "status": 200,
      "data": {
        "access_token": your_access_token,
        "refresh_token": your_refresh_token,
        "expire_in": expire_in_seconds,
        "scopes": [
          token_scopes
        ],
        "token_type": "bearer"
      }
    }
    */
    code = 'code ' + req.body.code
    let result = await check_client(clientId, clientSecret)
    if (result.status === 500) {
      console.log(time, req.baseUrl, req.ip)
      console.log(result.message)
      res.status(500).send('Internal server error')
    }
    else if (result.status === 406) {
      console.log(time, req.baseUrl, req.ip, result.message)
      res.status(406).send({status: 406, message: 'Invalid client'})
    }
    else if (result.status === 200) {
      db.execute(sqlSelCode, [clientId, code], (err, results) => {
        if (err) {
          console.log(time, req.baseUrl, req.ip, 'authorization_code sql error')
          console.log(err)
          res.status(500).send('Internal server error')
        }
        else if (results.length === 0 || results[0].del === 1) {
          console.log(time, req.baseUrl, req.ip, 'Invalid code')
          res.status(406).send({status: 406, message: 'Invalid code'})
        }
        else if (req.body.redirect_url != results[0].redirect_url) {
          console.log(time, req.baseUrl, req.ip, 'Invalid redirect_url')
          res.status(406).send({status: 406, message: 'Invalid redirect url'})
        }
        else {
          accessToken = token_generate()
          refreshToken = token_generate()
          db.execute('update token set del = 1 where access_token = ?', [code], (err, results) => {
            if (err) { console.log(time, req.baseUrl, req.ip, 'code delete error\n', err); res.status(500).send('Internal server error') }})
          enroll_token(clientId, accessToken, refreshToken, results[0].scope, now, acTimeStamp, rtTimestamp, results[0].redirect_url, res)
        }
          
        
      })
    }
    /*
    if (result != null) {
      db.execute(sqlSelCode, [clientId, code], (err, results) => {
        if(err) {
          console.log(err)
          res.status(500).send('Internal server error')
        }
        else if(results.length === 0 || results[0].del === 1){
          res.status(406).send({status: 406, message: 'Invalid client'})
        }
        else {
          let redirectUrl = req.body.redirect_url
          if (redirectUrl != results[0].redirect_url || redirectUrl != req.hostname) {
            res.status(401).send({status: 401, message: 'Invalid redirect url'})
          }
          else {
            accessToken = token_generate()
            refreshToken = token_generate()
            db.execute('update token set del = 1 where access_token = ?', [code], (err, results) => {
              if(err){console.log('code error\n' + err)}
            })
            enroll_token(clientId, accessToken, refreshToken, results[0].scope, now, acTimeStamp, rtTimestamp, redirectUrl, res)
          }
        }
      })
    }*/
    
  }
  else if (grantType === 'refresh_token'){  //client_id, client_secret, grant_type, refresh_token
    /*
    requests: POST, body: client_id, client_secret, grant_type, refresh_token
    returns: JSON

     */
    refreshToken = req.body.refresh_token
    result = await check_client(clientId, clientSecret, res)
    if (result.status === 500) {
      console.log(time, req.baseUrl, req.ip)
      console.log(result.message)
      res.status(500).send('Internal server error')
    }
    else if (result.status === 406) {
      console.log(time, req.baseUrl, req.ip, result.message)
      res.status(406).send({status: 406, message: 'Invalid client'})
    }
    else if (result.status === 200) {
      db.execute(sqlSelRefresh, [clientId, refreshToken], (err, results) => {
        if (err) {
          console.log(time, req.baseUrl, req.ip, 'refresh_token sql error')
          console.log(err)
          res.status(500).send('Internal server error')
        }
        else if (results.length === 0 || results[0].del === 1) {
          console.log(time, req.baseUrl, req.ip, 'Invalid client')
          res.status(406).send({status: 406, message: 'Invalid client'})
        }
        else if (results[0].expire_in < now) {
          console.log(time, req.baseUrl, req.ip, 'Refresh token expired')
          db.execute('update token set del = 1 where refresh_token = ?', [refreshToken], (err, results) => {if(err){console.log(time, req.baseUrl, req.ip, 'refresh token delete error\n', err)}})
          res.status(406).send({status: 406, message: 'Refresh token expired'})
        }
        else {
          let new_accessToken = token_generate()
          let new_refreshToken = token_generate()
          db.execute('update token set del = 1 where refresh_token = ?', [refreshToken], (err, results) => {if(err){console.log(time, req.baseUrl, req.ip, 'refresh token delete error\n', err)}})
          enroll_token(clientId, new_accessToken, new_refreshToken, results[0].scope, now, acTimeStamp, rtTimestamp, results[0].redirect_url, res)
        }
      })
    }
    /*
    if (result != null) {
      db.execute(sqlSelRefresh, [clientId, refreshToken], (err, results) => {
        if(err) {
          console.log(err)
          res.status(500).send('Internal server error')
        }
        else if(results.length === 0 || results[0].del === 1){
          res.status(406).send({status: 406, message: 'Invalid client'})
        }
        else if(results[0].refresh_exp < now){
          db.execute('update token set del = 1 where refresh_token = ?', [refreshToken], (err, results) => {if(err){console.log('refresh error\n' + err)}})
          res.status(401).send({status: 401, message: 'Invalid token'})
          
        }
        else {
          accessToken = token_generate()
          regenRefreshToken = token_generate()
          db.execute('update token set del = 1 where refresh_token = ?', [refreshToken], (err, results) => {
            if(err){console.log('refreshToken error\n' + err)}
          })
          enroll_token(clientId, accessToken, regenRefreshToken, results[0].scope, now, acTimeStamp, rtTimestamp, results[0].redirect_url, res)
        }
      })
    }*/
  }

  else if (grantType === 'test'){  // for test
    let test
    test = await check_client(clientId, clientSecret)
    console.log('test: ', test)
    let scopeStr = req.body.scope
    let serviceId = test.message.service_id
    console.log('check_scope:', check_scope(scopeStr, serviceId))
    res.status(300).send(test)
  }

}).get('/', (req, res, next) => {res.status(400).send('Bad request')})

let fetch_unix_timestamp = (date) => {
  return Math.floor(date.getTime() / 1000)
}

let token_generate = () => {
  return randomString.generate({length: 30, capitalization: 'lowercase'})
}


function check_scope(scopeStr, serviceId) {
  //scope 구문 검사
  const arr = []
  scopeStr.split(' ').forEach(element => {
    console.log('element:', element)
    if(element.includes(serviceId)){
      if (element.includes('read') || element.includes('write')) {arr.push(true)}
      else if (element.includes('manage')) {arr.push(true)}
      else {arr.push(false)}
    }
    else {arr.push(false)}
  })
  console.log('arr:', arr)
  if (arr.includes(false)) {return false}
  else {return true}
}

async function check_client(clientId, clientSecret) {
  // select 문을 이용해 client 정보를 불러옴  return: {'status': 500|406|200, 'message': null|sql_query_result}
  // 500: sql error, 406: invalid client, 200: valid client
  const sqlSelId = 'SELECT * FROM client WHERE client_id = ? and client_secret = ?'
  return new Promise((resolve, reject) => {
    db.execute(sqlSelId, [clientId, clientSecret], (err, results) => {
      //console.log(results[0])
      //console.log(err)
      if(err) {
        return resolve({'status': 500, 'message': err})
      }
      else if(results.length === 0 || results[0].del === 1){
        return resolve({'status': 406, 'message': 'invalid client'})
      }
      else {return resolve({'status': 200, 'message': results[0]})}
    })
  })
  /*
  db.execute(sqlSelId, [clientId, clientSecret], (err, results) => {
    //console.log(clientId)
    //console.log(clientSecret)
    //console.log(results)
    console.log(results[0])
    console.log(err)
    if(err) {
      console.log(err)
      res.status(500).send('Internal server error')
      return callback(null)
    }
    else if(results.length === 0 || results[0].del === 1){
      res.status(406).send({status: 406, message: 'Invalid client'})
      return callback(null)
    }
    else {return callback(results[0])}
  })*/
}



function enroll_token (clientId, accessToken, refreshToken, scopeStr, now, timeStamp, rtTimestamp, redirectUrl, res) {
  const sqlIns = 'insert into token(client_id, access_token, refresh_token, scope, iss, exp, refresh_exp, redirect_url) values(?,?,?,?,?,?,?,?)'
  if (refreshToken == '') {
    refreshToken = null
  }

  db.execute(sqlIns, [clientId, accessToken, refreshToken, scopeStr, now, timeStamp, rtTimestamp, redirectUrl], (err, results) => {
    let now_date = new Date()
    const time = now_date.getFullYear() + '-' + (now_date.getMonth() + 1) + '-' + now_date.getDate() + ' ' + now_date.getHours() + ':' + now_date.getMinutes() + ':' + now_date.getSeconds()
    if (err){
      console.log(time + 'client_id: ' + clientId + ' enroll_token sql error')
      console.log(err)
      if(err.errno == 1062){
        console.log('regenerate token, client ID: ' + clientId)
        let regenAccessToken = token_generate()
        let regenRefreshToken = null
        if (refreshToken != null) {regenRefreshToken = token_generate()}
        enroll_token(clientId, regenAccessToken, regenRefreshToken, scopeStr, now, timeStamp, rtTimestamp, redirectUrl, res)
      }
      else {
        res.status(500).send('Internal server error')
      }
    }
    else {
      if (refreshToken == null) {
        console.log(time, '/token client_id:', clientId, 'enroll_token access success')
        res.json({status: 200, data: {access_token: accessToken, expire_in: timeStamp - now, scopes: scopeStr.split(' '), token_type: 'bearer'}})
      }
      else {
        console.log(time, '/token client_id:', clientId, 'enroll_token access and refresh success')
        res.json({status: 200, data: {access_token: accessToken, refresh_token: refreshToken, expire_in: timeStamp - now, scopes: scopeStr.split(' '), token_type: 'bearer'}})
      }
      
    }
  })
}


module.exports = router