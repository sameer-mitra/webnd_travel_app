// Function to create a date string "yyyy-mm-dd"
const formatDate = (day, month, year) => {

    day = day.toString();
    month = month.toString();
    year = year.toString();

    if(day.length === 1){
        day = `0${day}`;
    }
    if(month.length === 1){
        month = `0${month}`;
    }

    return `${year}-${month}-${day}`
}

// Converts time from miliseconds to days
const convertTimeUnits = (timeInMilliseconds) => {
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
const formatLanguages = (languageArray) => {
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

export {
    formatDate, convertTimeUnits, splitDate, formatLanguages
}