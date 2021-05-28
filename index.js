// Required packages
const express = require('express')
// rowdy logger for logging our routes
rowdy = require('rowdy-logger')
const fs = require('fs')

// Config app
const app = express()
const rowdyResults = rowdy.begin(app)
const PORT = 3000
app.use(express.urlencoded({ extended: false }))

// Define routes
app.get('/', (req, res) => {
  res.json({ msg: 'Hello, Dinos 🦕' })
})

// Stub out my routes
// GET /dinosaurs -- read all dinos
app.get('/dinosaurs', (req, res) => {
  // read the dinosaurs.json
  const dinosaurs = fs.readFileSync('./dinosaurs.json')
  // parsed the json buffer to clean it up! -
  const dinoData = JSON.parse(dinosaurs)
  console.log(dinoData)
  // send back the json to Postman
  res.json({ dinoData })
})

// POST /dinosaurs -- CREATE new dinos - redirect to /dinosaurs
app.post('/dinosaurs', (req, res) => {
  // Read dino file
  const dinosaurs = fs.readFileSync('./dinosaurs.json')
  const dinoData = JSON.parse(dinosaurs)
  console.log(req.body)
  // Add data from the request body to the dino.json
  fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData))
  // Write the file
  dinoData.push(req.body)
  // redirect to /dinosaurs
  res.redirect('/dinosaurs')
})

// GET /dinosaurs/new -- READ (show) a form to edit one dino
app.get('/dinosaurs/new', (req, res) => {
  res.json({ msg: 'Show form to add a dino' })
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

// PUT /dinsosaurs/:id -- update (edit) one dino -- redirect to /dinosaurs

// DELETE /dinosaur/:id -- destroy one specific dino

//
// List on port
app.listen(PORT, () => {
  rowdyResults.print()
  console.log(`Is that dinosaurs that I hear on port${PORT}`)
})
