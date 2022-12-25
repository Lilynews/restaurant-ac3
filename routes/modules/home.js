const express = require('express')
const router = express.Router()
const RestaurantList = require('../../models/restaurants')

// search & sort
router.get('/', (req, res) => {
  const keyword = (req.query.keyword) ? req.query.keyword.trim() : ''
  const sort = req.query.sort || 'default'
  const sortBy = {
    default: { _id: 'asc' },
    AtoZ: { name: 'asc' },
    ZtoA: { name: 'desc' },
    category: { category: 'asc' },
    location: { location: 'asc' }
  }
  const sortSelected = { [sort]: true }

  RestaurantList.find()
    .lean()
    .sort(sortBy[sort])
    .then(restaurants => {
      const searchResult = restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.includes(keyword))

      if (!keyword) {
        res.render('index', { restaurants, sortSelected })
      } else {
        res.render('index', { restaurants: searchResult, keyword, sortSelected })
      }
    })
    .catch(error => console.log(error))
})

module.exports = router