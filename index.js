// Required packages
const express = require('express')
// rowdy logger for logging our routes
rowdy = require('rowdy-logger')
const fs = require('fs')
const layouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
// Config app
const app = express()
const rowdyResults = rowdy.begin(app)
const PORT = 3000
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
// Site starts at /public ->
app.use(express.static(__dirname + '/public'))
app.use(layouts)
// method override so we can put and delete
app.use(methodOverride('_method'))

// Define routes or 'stubbing' routes
// HOME route
app.get('/', (req, res) => {
  res.render('home')
})

// Stub out my routes
// GET /dinosaurs -- read all dinos
// app.get('/dinosaurs', (req, res) => {
//   // read the dinosaurs.json
//   const dinosaurs = fs.readFileSync('./dinosaurs.json')
//   // parsed the json buffer to clean it up! -
//   const dinoData = JSON.parse(dinosaurs)
//   console.log(dinoData)
//   // send back the json to Postman
//   res.render('dinosaurs/index.ejs', { dinoData: dinoData })
// })

// POST /dinosaurs -- CREATE a new dino -- redirect to /dinosaurs
app.post('/dinosaurs', (req, res) => {
  // read dino file
  const dinosaurs = fs.readFileSync('./dinosaurs.json')
  const dinoData = JSON.parse(dinosaurs)

  console.log(req.body)
  // add data from the request body to the dino data
  dinoData.push(req.body)

  // write the file
  fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData))

  // redirect to /dinosaurs
  res.redirect('/dinosaurs')
})

// GET /dinosaurs/new -- READ (show) a form to edit one dino
app.get('/dinosaurs/new', (req, res) => {
  res.render('dinosaurs/new.ejs')
})

// GET /dinosaurs/:id -- READ one specific dino // GET /dinosaurs/new -- READ (show) a form to add a dino
app.get('/dinosaurs/:id', (req, res) => {
  // get our dino data
  const dinosaurs = fs.readFileSync('./dinosaurs.json')
  const dinoData = JSON.parse(dinosaurs)
  // look up ine dino with the request parameters
  const dino = dinoData[req.params.id]
  // Send one dino back
  res.json({ dino })
})

// GET /dinosaurs/edit/:id -- READ (show) form to edit one dino
app.get('/dinosaurs/edit/:id', (req, res) => {
  // get the dino info to populate the form
  const dinosaurs = fs.readFileSync('./dinosaurs.json')
  const dinoData = JSON.parse(dinosaurs)
  const dino = dinoData[req.params.id]
  console.log(dino)
  // render the template
  res.render('dinosaurs/edit.ejs', { dino: dino, dinoId: req.params.id })
})

// PUT /dinsosaurs/:id -- update (edit) one dino -- redirect to /dinosaurs
app.put('/dinosaurs/:id', (req, res) => {
  console.log(req.body)
  // get dino data from our json
  const dinosaurs = fs.readFileSync('./dinosaurs.json')
  const dinoData = JSON.parse(dinosaurs)
  // get dino data form the req.params.id and use the req.body to update
  dinoData[req.params.id].name = req.body.name
  dinoData[req.params.id].type = req.body.type

  // write the json file
  fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData))

  // redirect to /dinosaurs
  res.redirect('/dinosaurs')
})

// DELETE /dinosaur/:id -- destroy one specific dino
app.delete('/dinosaurs/:id', (req, res) => {
  // get our dino json
  const dinosaurs = fs.readFileSync('./dinosaurs.json')
  const dinoData = JSON.parse(dinosaurs)
  // remove one dino from the array
  dinoData.splice(req.params.id, 1)
  // save dinosaur .json
  fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData))
  // redirect to /dinosaurs
  res.redirect('/dinosaurs')
})
//
// List on port
app.listen(PORT, () => {
  rowdyResults.print()
  console.log(`Is that dinosaurs that I hear on port${PORT}`)
})
