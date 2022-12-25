const Restaurant = require('../restaurants') // refer restaurants model
const restaurantList = require('../../restaurant.json').results

const db = require('../../config/mongoose')
db.once('open', () => {
  Restaurant.create(restaurantList)
  console.log('mongodb connected!')
})