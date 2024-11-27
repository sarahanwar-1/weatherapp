// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Create an instance of an Express app
const app = express();

// Middleware
// Here we are configuring express to use body-parser as middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Initialize the main project folder (where static files are located)
app.use(express.static('website'));

// Setup Routes

// Get route to fetch all stored data
app.get('/all', (req, res) => {
  res.send(projectData);
});

// Post route to add weather data and feelings to projectData
app.post('/add', (req, res) => {
  // Update the projectData object with the new data from the client
  projectData = {
    temp: req.body.temp,
    feel: req.body.feel,
    date: req.body.date
  };
  res.send({ message: 'Data added successfully' }); // Acknowledgment message sent to the client
});

// Setup Server to listen on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log("Feedback: Server is up and running");
});
