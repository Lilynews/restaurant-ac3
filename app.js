// setting variable, file
const express = require('express')
const app = express()
const port = 3000

// setting routes
app.get('/', (req, res) => {
  res.send('yooo~~ A7 HW')
})

// setting listening
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})