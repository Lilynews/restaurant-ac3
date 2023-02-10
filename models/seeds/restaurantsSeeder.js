// import bcrypt to hash password
const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
// refer restaurants & user model
const Restaurant = require('../restaurants')
const User = require('../user')
// refer restaurants & user JSON seed file
const restaurantList = require('./restaurant.json').results
const userList = require('./user.json')

db.once('open', () => {
  Promise.all(
    Array.from(userList, seedUser => {
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(seedUser.password, salt))
        .then(hash => User.create({
          name: seedUser.name,
          email: seedUser.email,
          password: hash
        }))
        .then(user => {
          const userId = user._id
          const restaurant = []

          console.log(seedUser.restaurantIndex)

          Array.from(seedUser.restaurantIndex, index => {
            restaurantList[index].userId = userId
            restaurant.push(restaurantList[index])
          })
          return Restaurant.create(restaurant)
        })
    }))
    .then(() => {
      console.log('seeder is finished!')
      process.exit()
    })
    .catch(err => console.log(err))
})