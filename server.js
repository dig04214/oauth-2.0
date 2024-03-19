const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const mysql = require('mysql2')
const ejs = require('ejs')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const db = require('./database')
const config = require('./config')
const sessionStore = new MySQLStore(config.session_options, db.promise())

const appRoute = require('./router/console/v1/appRoute')
const authRoute = require('./router/console/v1/authRoute')
const userRoute = require('./router/console/v1/userRoute')
const registerRoute = require('./router/console/v1/registerRoute')
const loginRoute = require('./router/console/v1/loginRoute')
const logoutRoute = require('./router/console/v1/logoutRoute')
const authorizeRoute = require('./router/oauth/v1/authorizeRoute')
const tokenRoute = require('./router/oauth/v1/tokenRoute')
const validateRoute = require('./router/oauth/v1/validateRoute')
const revokeRoute = require('./router/oauth/v1/revokeRoute')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))   //application/x-www-form-urlencoded
app.use(bodyParser.json())   //application/json
app.use(session({
  secret: config.session,
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}))
app.set('view engine', 'ejs')
app.set('views', './static')


app.use('/console/app', appRoute)   // 외부 서비스 등록 관련 api(일부 구현, 프론트엔드인 리액트와 연결되어 있지 않음)
app.use('/console/user', userRoute)   // 사용자 관리 관련 api(미구현)
app.use('/console/register', registerRoute)   // 회원가입 관련 api
app.use('/console/login', loginRoute)   // 로그인 관련 api
app.use('/console/logout', logoutRoute)   // 로그아웃 관련 api
app.use('/console/auth', authRoute)   // 로그인 여부 확인 api


app.use('/oauth/v1/authorize', authorizeRoute)   // authorization code 발급 api(일부 구현, 프론트엔드인 리액트와 연결되어 있지 않음, 프로젝트에서는 미사용 기능임)
app.use('/oauth/v1/token', tokenRoute)   // access token 발급 api(client credential, authorization code, refresh token)
app.use('/oauth/v1/validate', validateRoute)   // access token 유효성 검사 api
app.use('/oauth/v1/revoke', revokeRoute)   // access token, refresh token 폐기 api
app.get('/oauth/v1/db', (req, res) => {
  /*db 연결 테스트를 위한 api */
  db.getConnection((err, connection) => {
  if (err) {
    console.log('/oauth/v1/db ' + req.ip)
    console.log(err)
    res.status(404).send(err.message)
  }
  else {
    connection.release()
    console.log('/oauth/v1/db ' + req.ip)
    res.status(200).send('Connected to oauth database')
  }
  })
})


app.listen(9000, function(){
  console.log('OAuth server is running on port 9000')
})
