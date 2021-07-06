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

// Geonames API
const geoNamesUrl = 'http://api.geonames.org/searchJSON?q=';
const geoNamesUrlArgs = `&maxRows=1&username=${process.env.GEONAMES_USERNAME}`; 

// Weatherbit API
const weatherBitUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?'; 
const weatherBitUrlArgs1 = `&key=${process.env.WEATHERBIT_API_KEY}`;
const weatherBitUrlArgs2 = '&lang=en';

// Rest Countries API
const restCountriesUrl = 'https://restcountries.eu/rest/v2/alpha/'; 

// Pixabay API
const pixabayUrl = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=`; 
const pixabayUrlArgs = '&image_type=photo&order=popular';

// Travel Advisory (COVID-19) API
const travelAdviceUrl = 'https://www.travel-advisory.info/api?countrycode='; 


//Added testing endpoint.
app.get('/test', async (req, res) => {
  res.json({message: 'done'})
})

// Data Storage Object
let trip = {};

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

app.post('/addTrip', (req, res) => {
    let newTrip = req.body;
    let newEntry = {
      location: newTrip.Location,
      startDate: newTrip.Start,
      endDate: newTrip.End,
      duration: newTrip.Duration,
      daysToTrip: newTrip.DaysToGo
    }
    
    trip = newEntry;

    res.send('ok');
})


app.get('/getGeonames', (req, res) => {
  console.log('GET geonamesData')
  const url = `${geoNamesUrl}${fixSpaces(trip.location)}${geoNamesUrlArgs}`;
  console.log(url);
    fetch(url)
      .then(res => res.json())
        .then(response =>{
          try {
            console.log('Data From GeoNames')
            console.log(response);
            trip['long'] = response.geonames[0].lng;
            trip['lat'] = response.geonames[0].lat;
            trip['name'] =response.geonames[0].name; 
            trip['adminName'] = response.geonames[0].adminName1;
            trip['countryName'] = response.geonames[0].countryName;
            trip['code'] = response.geonames[0].countryCode;
            trip['population'] = response.geonames[0].population;
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
  const url = `${weatherBitUrl}lat=${trip.lat}&lon=${trip.long}${weatherBitUrlArgs1}${weatherBitUrlArgs2}`;
  console.log(url);
    fetch(url)
      .then(response => response.json())
        .then(response =>{
          let forecastDay = trip.daysToTrip;
          const data = response.data[forecastDay]
          console.log(data)

          trip.maxTemp = data.max_temp;
          trip.minTemp = data.min_temp;
          trip.humidity = data.rh;
          trip.precipProb = data.pop; 
          trip.weatherDesc = data.weather.description
          trip.weatherIcon = data.weather.icon

          res.send(true)
    })
    .catch(error => {
      res.send(JSON.stringify({error: "An error occured"}));
    })
})

app.get('/getCountries', (req, res) => {
  console.log('GET Countries')
  const url = `${restCountriesUrl}${trip.code}`;
  console.log(url);
    fetch(url)
      .then(response => response.json())
        .then(response =>{
          console.log(response)
          trip['capital'] = response.capital;
          trip['currencyInfo'] = {code: response.currencies[0].code, 
            name: response.currencies[0].name, 
            symbol: response.currencies[0].symbol}
          trip['flag'] = response.flag
          
          if(response.languages.length > 1){
            langArray = [];
            for (let lang of response.languages) {
              langArray.push(lang.name)
            }
            trip['languages'] = langArray
          }else {
            trip['languages'] = response.languages[0].name
          }

          res.send(true);
    })
    .catch(error => {
      res.send(JSON.stringify({error: "An error has occured"}));
    })
})

app.get('/getTravelAdvice', (req, res) => {
  console.log('GET Travel Advice Info')
  const url = `${travelAdviceUrl}${trip.code}`;
  console.log(url);
    fetch(url)
      .then(response => response.json())
        .then(response =>{
          let travelAdvisoryMessage = response.data[trip.code].advisory.message 
          console.log(travelAdvisoryMessage);
          trip.advise = travelAdvisoryMessage;

          res.send(true);
    })
    .catch(error => {
      res.send(JSON.stringify({error: "An error has occured"}));
    })
})

app.get('/getCityImage', (req, res) => {
  console.log('GET Image')
  const url = `${pixabayUrl}${fixSpaces(trip.name)}+${fixSpaces(trip.countryName)}${pixabayUrlArgs}`;
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
          trip.cityArray = cityArray
          res.send(true);
        })
        .catch(error => {
          res.send(JSON.stringify({error: "An error has occured"}));
        })
})

app.get('/getCountryImage', (req, res) => {
  console.log('GET Image')
  const url = `${pixabayUrl}${fixSpaces(trip.countryName)}${pixabayUrlArgs}`;
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
          trip.countryArray = countryArray
          res.send(true);
        })
        .catch(error => {
          res.send(JSON.stringify({error: "An error has occured"}));
        })
})

app.get('/getTrip', (req, res) => {
    console.log(trip);
    res.send(trip);
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