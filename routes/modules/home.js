const express = require('express')
const router = express.Router()
const RestaurantList = require('../../models/restaurants')

// search & sort
router.get('/', (req, res) => {
  // search & sort
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
  // user has own foodie list
  const userId = req.user._id

  RestaurantList.find({ userId })
    .lean()
    .sort(sortBy[sort])
    .then(restaurants => {
      const searchResult = restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.includes(keyword))

      if (!keyword) {
        res.render('index', { title: 'Foodie Bucket List', restaurants, sortSelected })
      } else {
        res.render('index', { title: 'Foodie Bucket List', restaurants: searchResult, keyword, sortSelected })
      }
    })
    .catch(error => console.log(error))
})

module.exports = router