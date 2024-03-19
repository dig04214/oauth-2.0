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
//router.get('/login', (req, res, next) => {res.render('user/login')})
//router.get('/logout', (req, res, next) => {res.redirect('/console')})
//router.post('/login', (req, res, next) => {})
//router.post('/register', (req, res, next) => {})



module.exports = router