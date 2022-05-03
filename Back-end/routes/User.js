const express = require('express')
const router = express.Router()
const sauceCtrl = require('../controller/User')
const controlEmail = require('../middleware/controle-email')
const passWord = require('../middleware/control-pass')

router.post('/signup', passWord, controlEmail, sauceCtrl.signup)
router.post('/login', sauceCtrl.login)

module.exports = router