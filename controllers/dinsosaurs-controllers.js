// Required packages
const express = require('express')
// rowdy logger for logging our routes
rowdy = require('rowdy-logger')
const fs = require('fs')
const layouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
// Config app
const router = express()
const rowdyResults = rowdy.begin(router)
const PORT = 3000
router.set('view engine', 'ejs')
router.use(express.urlencoded({ extended: true }))
// Site starts at /public ->
router.use(express.static(__dirname + '/public'))
router.use(layouts)
// method override so we can put and delete
router.use(methodOverride('_method'))

// Stub out my routes
// GET /dinosaurs -- read all dinos
router.get('/dinosaurs', (req, res) => {
  // read the dinosaurs.json
  const dinosaurs = fs.readFileSync('./dinosaurs.json')
  // parsed the json buffer to clean it up! -
  const dinoData = JSON.parse(dinosaurs)
  console.log(dinoData)
  // send back the json to Postman
  res.render('dinosaurs/index.ejs', { dinoData: dinoData })
})

module.exports = router
