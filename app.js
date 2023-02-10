//////// setting variable, file, 3rd-party-tool
const express = require('express') //install express
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser') // install body-parser
const methodOverride = require('method-override') // install method-override
// 引用路由器
const routes = require('./routes')
// 引入登入 session 驗證
const session = require('express-session')
// 引入 passport 策略驗證
const usePassport = require('./config/passport')
// 引入 flash
const flash = require('connect-flash') 

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}


// app.js 檔案沒有要使用不用設定變數但還是需要設定 Mongoose 連線「被執行」
require('./config/mongoose')


//////// setting express-handlebars
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    selected: (sortSelected) => {
      if (sortSelected) return "selected"
    }
  }
}))
app.set('view engine', 'hbs')

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))
/////// use public static files
app.use(express.static('public'))
// 用 app.use 規定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))
// 做 session 設定
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
// 呼叫 passsport 並 app，在 express 裡使用
usePassport(app)
app.use(flash())
// 透過 middleware 將 req.isAuth 放入 response 裡面
app.use((req, res, next) => {
  // middleware for isAuth 
  // console.log(req.user)
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  // middleware for flash
  res.locals.success_msg = req.flash('success_msg')  
  res.locals.warning_msg = req.flash('warning_msg') 

  next()
})

// 將 request 導入路由器
app.use(routes)


//////// setting listening
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})