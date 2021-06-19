// Define variables for Document object collectors

// Trip Planner - User Entry Point
const resultID = document.getElementById('result-data');
const departureDate = document.getElementById('departure');
const returnDate = document.getElementById('return');
const daysOut = document.getElementById('days-out');
const tripDuration = document.getElementById('trip-duration');
const entryForm = document.getElementById('plan-create');

// Info Message
const msgInfo = document.getElementById('msg');

// Location Results Selectors
const cityResult = document.getElementById('city');
const provinceResult = document.getElementById('province');
const countryResult = document.getElementById('country');

// Country-specific information Selectors
const countryCapital = document.getElementById('capital');
const languages = document.getElementById('languages');
const currencyName = document.getElementById('curr-name');
const currencySymbol = document.getElementById('curr-symbol');
const flag = document.getElementById('flag-result');

// Weather Selectors
const highTemp = document.getElementById('high-temp');
const lowTemp = document.getElementById('low-temp');
const humidity = document.getElementById('humidity');
const precipProb = document.getElementById('precipitation');
const weatherDesc = document.getElementById('weather-desc');
const weatherIconRef = document.getElementById('weather-icon');

// Travel Advisory Selectors
const advisory = document.getElementById('advisory-result');
const advisoryMessage = document.getElementById('further-info');
const advisoryLink = document.getElementById('advisory-hyperlink');

// Pixabay Image selectors
const image1 = document.getElementById('pixabay1');

async function handleSubmit(event) {
    event.preventDefault();
    console.log("Begin Submission");
    msgInfo.style.display = 'block';
    msgInfo.innerHTML = "Loading...";
    
    // Selectors defined to obtain user input data
    let location = document.getElementById('destination').value;
    let start = document.getElementById('date-departure').value;
    let end = document.getElementById('date-return').value;

    // Variables to initiate date instances for calculations
    const today = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Calculates duration
    const travelTime = endDate.getTime() - startDate.getTime();
    const daysInTravel = timeUnitConversion(travelTime);
    console.log(daysInTravel);

    // Calculates days from today until trip
    const timeUntilTrip = startDate.getTime() - today;
    const daysUntilTrip = timeUnitConversion(timeUntilTrip) + 1;
    console.log(daysUntilTrip);

    if(daysInTravel > 0)
    {
      await postTrip('http://localhost:8082/createTrip', { 
        Location: location, 
        Start : startDate, 
        End: endDate, 
        Duration: daysInTravel,
        DaysToGo: daysUntilTrip
      });

      await fetchLocal(`http://localhost:8082/getGeonames`);

      await fetchLocal(`http://localhost:8082/getWeather`);  

      await fetchLocal(`http://localhost:8082/getCountries`);

      await fetchLocal(`http://localhost:8082/getTravelAdvice`)

      await fetchLocal(`http://localhost:8082/getCityImage`);

      await fetchLocal(`http://localhost:8082/getCountryImage`);

      const tripData = await fetchLocal(`http://localhost:8082/getTrip`);

      console.log(tripData);
      updateUI(tripData)

  }else{
    alert('Please enter a valid trip duration!! Entries must start today or in the future and end at least one day after');
    msgInfo.style.display = 'none';
    msgInfo.innerHTML = "";
  }

}

async function postTrip(url, tripData){
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tripData)
    });
}

const fetchLocal = async(url) => {
  const asyncParams = {
    method: 'GET',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
  };

    const res = await fetch(url, asyncParams);
      try{
        const data = await res.json();
        return data;
      } 
      catch {
        console.log(`Error: ${res.statusText}`)
      }
}

// UI Functions
const updateUI = async (results) => {
  // Show the Travel Plan
  resultID.style.display = 'block';

  // Update Trip Date Info Section
  departureDate.innerHTML = splitDate(results.startDate);
  returnDate.innerHTML = splitDate(results.endDate);
  daysOut.innerHTML = results.daysToTrip;
  tripDuration.innerHTML = results.duration

  //Update City Info Section
  cityResult.innerHTML = results.name;
  if(results.name === results.adminName){
    provinceResult.innerHTML = 'N/A'
  } else {
    provinceResult.innerHTML = results.adminName;
  }
  countryResult.innerHTML = results.countryName;

  //Update Weather Info Section
  highTemp.innerHTML = results.maxTemp;
  lowTemp.innerHTML = results.minTemp;
  humidity.innerHTML = results.humidity;
  precipProb.innerHTML = results.precipProb;
  weatherDesc.innerHTML = results.weatherDesc;
  let weatherIconCall = `/icons/${results.weatherIcon}.png`;
  weatherIconRef.setAttribute('src', weatherIconCall);

  //Update Country Info Section
  countryCapital.innerHTML = results.capital;
  languages.innerHTML = languageFormatter(results.languages);
  currencyName.innerHTML = results.currencyInfo.name;
  currencySymbol.innerHTML = results.currencyInfo.symbol;
  flag.src = results.flag;

  //Update Advisory Info Section
  advisory.innerHTML = results.advise;
  advisoryMessage.innerHTML = 'For further information click on the link here:'
  advisoryLink.href = 'https://www.travel-advisory.info/all-countries'
  advisoryLink.innerHTML = 'https://www.travel-advisory.info/all-countries'

  //Update Images
  if(results.cityArray === undefined || results.cityArray.length < 3){
    image1.setAttribute('src', results.countryArray[0]);    
  } else {
    image1.setAttribute('src', results.cityArray[0]);    
  }

  msgInfo.style.display = 'none';
  msgInfo.innerHTML = "";
  
}

// Print Button Function
const printPage = () => {
  window.print();
  location.reload();
  resultID.style.display = 'none';
}

// Reset Button Function
const resetPage = () => {
  entryForm.reset();
  location.reload();
  msgInfo.style.display = 'none';
  resultID.style.display = 'none';
}

// Converts time from miliseconds to days
const timeUnitConversion = (timeInMilliseconds) => {
  let timeInDays = timeInMilliseconds/(1000 * 60 * 60 * 24);
  return Math.ceil(timeInDays);
}

// Splits the date (yyyy-mm-dd) from the time separated by "T"
const splitDate = (dateAPI) => {
  let newDate = dateAPI.split('T')
  return newDate[0];
}

// This function accounts for when countries have more than 1 national language
// The value returned is either an array (for > 1 language) or a string
const languageFormatter = (languageArray) => {
  if(typeof(languageArray) === 'string'){
    return languageArray;
  } else {
    let langString = ''
    for (let lang of languageArray){
      langString = langString.concat(lang).concat(', ');
    }
    langString = langString.slice(0,langString.length - 2);
    return langString;
    }
}

export { handleSubmit, timeUnitConversion, splitDate, languageFormatter, printPage, resetPage }