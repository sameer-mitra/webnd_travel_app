// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
var path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('src/client'));

// Setup Server
const port = process.env.PORT || 8000;
const server = app.listen(port, listening);

function listening(){
    console.log("server running"); 
    console.log(`running on localhost: ${port}`);
}

app.get('/', function (req, res) {
    res.sendFile(path.resolve('src/client/views/index.html'))
});

app.get('/hello', function (req, res) {
    res.send('hello world');
})

app.get('/all', function (req, res){
    console.log('Getting data..');
    res.send(projectData);
  });

//Post route
app.post('/create', function(req, res){
    console.log('Adding new entry: ' + req.body);
    projectData["newEntry"] = req.body;
});