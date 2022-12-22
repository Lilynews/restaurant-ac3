//////// setting variable, file, 3rd-party-tool
const express = require('express') //install express
const app = express()
const port = 3000
const mongoose = require('mongoose')// install mongoose
const exphbs = require('express-handlebars')



//////// setting for DB connection 
// only for non-production environment
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// connect to mongoDB
mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true }) 

// DB connected status
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

//////// setting express-handlebars
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

//////// setting routes
app.get('/', (req, res) => {
  res.render('index')
})



/////// use public static files
app.use(express.static('public'))

//////// setting listening
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})