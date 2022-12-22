//////// setting variable, file, 3rd-party-tool
const express = require('express') //install express
const app = express()
const port = 3000
const mongoose = require('mongoose')// install mongoose
const exphbs = require('express-handlebars')
const RestaurantList = require('./models/restaurants') // install restaurant model



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
// Home page
app.get('/', (req, res) => {
  RestaurantList.find() // data from restaurant model
    .lean() // data transfer to plain javascript object
    .then(restaurants => res.render('index', { restaurants })) // send data to index and render
    .catch(error => console.error(error)) // error handling
})
// show page
app.get('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return RestaurantList.findById(id)
    .lean()
    .then(restaurant => {
      // console.log(restaurant._id)
      res.render('show', { restaurant })
    })
    .catch(error => console.log(error))
})
//search
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const sort = req.query.sort
  const regex = new RegExp(keyword, 'i')
  RestaurantList.find({ $or: [{ name: { $regex: regex } }, { category: { $regex: regex } }] })
    .lean()
    .sort(sort)
    .then(filteredRestaurants => res.render('index', { restaurants: filteredRestaurants, keyword, sort }))
})


/////// use public static files
app.use(express.static('public'))

//////// setting listening
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})