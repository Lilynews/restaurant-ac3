module.exports = {
  loginMessage: (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
      // req.flash('warning_msg', 'YOOO 全部都要填喔！')

      return res.render('login', { error: 'YOOO 全部都要填喔！', email, password })

      // return res.redirect('/users/login')
    }

    next()
  }
}