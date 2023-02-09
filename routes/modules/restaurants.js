const express = require('express')
const router = express.Router()
const RestaurantList = require('../../models/restaurants')

// new page
router.get('/new', (req, res) => {
  res.render('new', { title: 'Add New One' })
})

router.post('/', (req, res) => {
  const userId = req.user._id

  return RestaurantList.create({ ...req.body, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// show page
router.get('/:restaurant_id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.restaurant_id

  return RestaurantList.findOne({ _id, userId })
    .lean()
    .then(restaurant => {
      // console.log(restaurant._id)
      res.render('show', { title: 'Show Page', restaurant })
    })
    .catch(error => console.log(error))
})

// edit page
router.get('/:restaurant_id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.restaurant_id

  RestaurantList.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('edit', { title: 'Edit Page', restaurant }))
    .catch(error => console.log(error))
})

router.put('/:restaurant_id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.restaurant_id

  return RestaurantList.findByIdAndUpdate({ _id, userId }, { ...req.body, userId })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))
})

// delete page
router.delete('/:restaurant_id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.restaurant_id

  return RestaurantList.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})



module.exports = router