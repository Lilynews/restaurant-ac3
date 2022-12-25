const express = require('express')
const router = express.Router()
const RestaurantList = require('../../models/restaurants')

// new page
router.get('/new', (req, res) => {
  res.render('new', { title: 'Add New One' })
})

router.post('/', (req, res) => {
  return RestaurantList.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// edit page
router.get('/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  RestaurantList.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { title: 'Edit Page', restaurant }))
    .catch(error => console.log(error))
})

router.post('/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return RestaurantList.findByIdAndUpdate(id, req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// delete page
router.delete('/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return RestaurantList.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// show page
router.get('/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return RestaurantList.findById(id)
    .lean()
    .then(restaurant => {
      // console.log(restaurant._id)
      res.render('show', { title: 'Show Page', restaurant })
    })
    .catch(error => console.log(error))
})

module.exports = router