const express = require('express')
const passport = require('passport')
const { createAccount,loginAccount,logoutAccount } = require('../controllers/auth');
const  authRoute= express.Router()

authRoute.post('/signup', passport.authenticate('signup', { session: false }),
createAccount );

authRoute.post('/login',loginAccount)

authRoute.get('/logout', logoutAccount)


module.exports=authRoute


