const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const { loginMessage } = require('../../middleware/login')  


router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  if (!email || !password || !confirmPassword) {
    errors.push({ message: '你是不是忘了填 email or password 了～～' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: 'Typo 囉！再確認一下密碼是否相同！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors, name, email, password, confirmPassword
    })
  }

  User.findOne({ email }).then(user => {
    if (user) {
      console.log('User already exits.')
      errors.push({ message: '抓～～你用誰的!! 這 email 註冊過囉' })
      res.render('register', {
        errors, name, email, password, confirmPassword
      })
    } else {
      return bcrypt
        .genSalt(10) 
        .then(salt => bcrypt.hash(password, salt)) 
        .then(hash => User.create({
          name,
          email,
          password: hash 
        }))
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    }
  }).catch(err => console.log('POST: findOne error', err))
})

router.post('/login', loginMessage, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
}))

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '成功登出啦～～')
  res.redirect('/users/login')
})

module.exports = router