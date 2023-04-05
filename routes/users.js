const express = require('express');
const router = express.Router({ mergeParams: true});
const catchAsync = require('../utilities/catchAsync')
const User = require('../models/user');
const passport = require('passport');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

// router.get('/register', users.renderRegister);

// router.post('/register', catchAsync(users.register));

// router.get('/login', users.renderLogin);

// router.post('/login',passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

// router.get('/logout', (req, res)=> {
//     req.logout(User);
//     req.flash('success','Successfully Logged out');
//     res.redirect('/campgrounds');
// })

router.get('/logout', users.logout);

module.exports = router;