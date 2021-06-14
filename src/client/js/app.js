/* Global Variables */
let baseURL = 'https://api.openweathermap.org/data/2.5/weather?';
let unitURL = '&units=metric'

//Store API key in const
const apiKey = '&appid=02d9b7117d21441439c2fe54a03e4738';


// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getDate()+'/' + (d.getMonth()+1) + '/'+ d.getFullYear();

let bZipOption = true;

// Add Click Event Listener.
document.getElementById('generate').addEventListener('click', performAction);
document.getElementById('typeBtn1').addEventListener('click', selectZipOption);
document.getElementById('typeBtn2').addEventListener('click', selectCityOption);

function selectZipOption(e){
    console.log('Zip option selected!');
    resetOptions();
    bZipOption=true;

    document.getElementById('typeBtn1').classList.add('active-btn');

    const zip = document.getElementById('zip');
    zip.placeholder = 'Enter zip code here (For example, 94040)';
    const zipLabel = document.getElementById('zipLabel');
    zipLabel.innerHTML = 'Enter Zipcode here';

};
function selectCityOption(e){
    console.log('City option selected!');
    resetOptions();
    bZipOption=false;

    document.getElementById('typeBtn2').classList.add('active-btn');

    const zip = document.getElementById('zip');
    zip.placeholder = 'Enter City here (For example, London)';
    const zipLabel = document.getElementById('zipLabel');
    zipLabel.innerHTML = 'Enter City here';

};

function resetOptions() {    
    document.getElementById('typeBtn1').classList.remove('active-btn');
    document.getElementById('typeBtn2').classList.remove('active-btn');
    const zip = document.getElementById('zip');
    zip.value = '';
};

/* Main Function wired to Click Event */
function performAction(e){
    console.log('button clicked!');
    resetUI();

    var defaultZip = '';
    if(bZipOption){
        defaultZip = 94040;
    } else {
        defaultZip = 'London';
    }

    const zip = document.getElementById('zip').value || defaultZip;
    const feelings = document.getElementById('feelings').value || 'Happy!';
    const country = 'us'; 

    getWeatherData(zip, country)
    .then(function(newData){
        postData('/create', {
            name: newData.name,
            temp: newData.main,
            feelings: feelings,
            date: newDate
        })
    })
    .then(() => getData('/all'))
    .then(function(data){
        // Add data
        console.log(data);  
        updateUI(data);      
    });
};

/* Function to GET weather data */
const getWeatherData = async (zip, country)=>{
    let url = baseURL + 'zip=' + zip + ',' + country + unitURL + apiKey;
    if (!bZipOption){
        url = baseURL + 'q=' + zip + unitURL + apiKey;
    }
    const res = await fetch(url);    
    try {

        const data = await res.json();
        console.log(data);  
        return data;      
    }  catch(error) {
        // appropriately handle the error
        console.log("error", error);
    }
};

/* Function to POST data */
const postData = async (url = '', data = {}) => {
    console.log(data);
    const response = await fetch(url, {
    method: 'POST', 
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    });

    try {
        const newData = await response.json();
        console.log(newData);
    } catch(error) {
        console.log("error", error)
    }
};

/* Function to GET Project Data */
const getData = async (url='') => {
    const request = await fetch(url);
    try {
        let allData = await request.json();
        console.log(allData);
        return allData;
    }
    catch(error) {
        console.log("error",error);
    }
};

/* Function to UPDATE UI */
const updateUI = async (allData) => {    
    try{
        document.getElementById('entrytitle').innerHTML = 'Most Recent Entry (' + allData['newEntry'].name + ')';
        document.getElementById('temp').innerHTML = 'Current temperature: ' + allData['newEntry'].temp.temp + ' celsius.';
        document.getElementById('content').innerHTML = 'I am feeling: ' + allData['newEntry'].feelings;
        document.getElementById('date').innerHTML = 'Today is: ' + allData['newEntry'].date;
  
    }catch(error){
      console.log("error", error);
    }
};

/* Function to RESET UI */
const resetUI = async (allData) => {    
    try{
        document.getElementById('entrytitle').innerHTML = 'Most Recent Entry';
        document.getElementById('temp').innerHTML = 'Loading...';
        document.getElementById('content').innerHTML = '';
        document.getElementById('date').innerHTML = '';
  
    }catch(error){
      console.log("error", error);
    }
};