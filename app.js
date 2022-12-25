//////// setting variable, file, 3rd-party-tool
const express = require('express') //install express
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const RestaurantList = require('./models/restaurants') // install restaurant model
const bodyParser = require('body-parser') // install body-parser
const methodOverride = require('method-override') // install method-override
// 引用路由器
const routes = require('./routes')
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
// 將 request 導入路由器
app.use(routes)


//////// setting listening
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})