// Server-Side Modules
const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const path = require('path');

const fetch = require('node-fetch');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

app.use(express.static('dist'));

module.exports = app;

// API Access Variables
// Geonames API
const geoNamesUrl = 'http://api.geonames.org/searchJSON?q=';
const geoNamesUrlArgs = `&maxRows=1&fuzzy=0.6&username=${process.env.GEONAMES_USERNAME}`; //&fuzzy=0.6

// Weatherbit API
const weatherBitUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?'; // Add &lat= & &lon=
const weatherBitUrlArgs1 = `&key=${process.env.WEATHERBIT_API_KEY}`;
const weatherBitUrlArgs2 = '&lang=en';

// Rest Countries API
const restCountriesUrl = 'https://restcountries.eu/rest/v2/alpha/'; //Add partial country name

// Pixabay API
const pixabayUrl = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=`; //Add city name with spaces as '+' 
const pixabayUrlArgs = '&image_type=photo&order=popular';

// Travel Advisory (COVID-19) API
const travelAdviceUrl = 'https://www.travel-advisory.info/api?countrycode='; // Add two digit ISO country code

app.get('/test', async (req, res) => {
  res.json({message: 'pass!'})
})

// Data Storage Object
let tripData = {};

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

app.post('/createTrip', (req, res) => {
    let newData = req.body;
    let newEntry = {
      location: newData.Location,
      startDate: newData.Start,
      endDate: newData.End,
      duration: newData.Duration,
      daysToTrip: newData.DaysToGo
    }
    
    tripData = newEntry;

    res.send('ok');
})


app.get('/getGeonames', (req, res) => {
  console.log('GET geonamesData')
  const url = `${geoNamesUrl}${fixSpaces(tripData.location)}${geoNamesUrlArgs}`;
  console.log(url);
    fetch(url)
      .then(res => res.json())
        .then(response =>{
          try {
            console.log('Data From GeoNames')
            console.log(response);
            tripData['long'] = response.geonames[0].lng;
            tripData['lat'] = response.geonames[0].lat;
            tripData['name'] =response.geonames[0].name; 
            tripData['adminName'] = response.geonames[0].adminName1;
            tripData['countryName'] = response.geonames[0].countryName;
            tripData['code'] = response.geonames[0].countryCode;
            res.send(true);
          } catch (e) {
            console.log("Error: ", e);
          }
    })
    .catch(error => {
      res.send(JSON.stringify({error: error}));
    })
})

app.get('/getWeather', (req, res) => {
  console.log('GET weather');
  const url = `${weatherBitUrl}lat=${tripData.lat}&lon=${tripData.long}${weatherBitUrlArgs1}${weatherBitUrlArgs2}`;
  console.log(url);
    fetch(url)
      .then(response => response.json())
        .then(response =>{
          let forecastDay = tripData.daysToTrip;
          const data = response.data[forecastDay]
          console.log(data)

          tripData.maxTemp = data.max_temp;
          tripData.minTemp = data.min_temp;
          tripData.humidity = data.rh;
          tripData.precipProb = data.pop; 
          tripData.weatherDesc = data.weather.description
          tripData.weatherIcon = data.weather.icon

          res.send(true)
    })
    .catch(error => {
      res.send(JSON.stringify({error: "An error occured"}));
    })
})

app.get('/getCountries', (req, res) => {
  console.log('GET Countries')
  const url = `${restCountriesUrl}${tripData.code}`;
  console.log(url);
    fetch(url)
      .then(response => response.json())
        .then(response =>{
          console.log(response)
          tripData['capital'] = response.capital;
          tripData['demonym'] = response.demonym;
          tripData['currencyInfo'] = {code: response.currencies[0].code, 
            name: response.currencies[0].name, 
            symbol: response.currencies[0].symbol}
          tripData['flag'] = response.flag
          
          if(response.languages.length > 1){
            langArray = [];
            for (let lang of response.languages) {
              langArray.push(lang.name)
            }
            tripData['languages'] = langArray
          }else {
            tripData['languages'] = response.languages[0].name
          }

          res.send(true);
    })
    .catch(error => {
      res.send(JSON.stringify({error: "An error has occured"}));
    })
})

app.get('/getTravelAdvice', (req, res) => {
  console.log('GET Travel Advice Info')
  const url = `${travelAdviceUrl}${tripData.code}`;
  console.log(url);
    fetch(url)
      .then(response => response.json())
        .then(response =>{
          let travelAdvisoryMessage = response.data[tripData.code].advisory.message 
          console.log(travelAdvisoryMessage);
          tripData.advise = travelAdvisoryMessage;

          res.send(true);
    })
    .catch(error => {
      res.send(JSON.stringify({error: "An error has occured"}));
    })
})

app.get('/getCityImage', (req, res) => {
  console.log('GET Image')
  const url = `${pixabayUrl}${fixSpaces(tripData.name)}+${fixSpaces(tripData.countryName)}${pixabayUrlArgs}`;
  console.log(url);
    fetch(url)
      .then(response => response.json())
        .then(response =>{
          const cityArray = [];
          const result1 = response.hits[0].webformatURL;
          const result2 = response.hits[1].webformatURL;
          const result3 = response.hits[2].webformatURL;

          cityArray.push(result1);
          cityArray.push(result2);
          cityArray.push(result3);
          tripData.cityArray = cityArray
          res.send(true);
        })
        .catch(error => {
          res.send(JSON.stringify({error: "An error has occured"}));
        })
})

app.get('/getCountryImage', (req, res) => {
  console.log('GET Image')
  const url = `${pixabayUrl}${fixSpaces(tripData.countryName)}${pixabayUrlArgs}`;
  console.log(url);
    fetch(url)
      .then(response => response.json())
        .then(response =>{
          const countryArray = [];
          const result1 = response.hits[0].webformatURL;
          const result2 = response.hits[1].webformatURL;
          const result3 = response.hits[2].webformatURL;
          countryArray.push(result1);
          countryArray.push(result2);
          countryArray.push(result3);
          tripData.countryArray = countryArray
          res.send(true);
        })
        .catch(error => {
          res.send(JSON.stringify({error: "An error has occured"}));
        })
})

app.get('/getTrip', (req, res) => {
    console.log(tripData);
    res.send(tripData);
})

// Helper function to convert all place names with spaces to include "+" between them
const fixSpaces = (stringWithSpace) => {
  let regex = new RegExp(' ', 'g')
  let stringWithPlus = stringWithSpace.replace(regex, '+');
  return stringWithPlus;
}


// Server instance and respective callback function
const port = 8082;
const server = app.listen(port, () => {
    const ServerStart = new Date();
    console.log('Server Running');
    console.log(`Running on localhost: ${port}`);
});