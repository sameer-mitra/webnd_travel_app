import './styles/main.scss';

import {handleSubmit} from './js/appFunctions';
import {formatDate} from './js/helperFunctions';
import {printPage} from './js/appFunctions';
import {resetPage} from './js/appFunctions';

import './icons/a01d.png'
import './icons/a02d.png'
import './icons/a03d.png'
import './icons/a04d.png'
import './icons/a05d.png'
import './icons/a06d.png'
import './icons/c01d.png'
import './icons/c02d.png'
import './icons/c03d.png'
import './icons/c04d.png'
import './icons/d01d.png'
import './icons/d02d.png'
import './icons/d03d.png'
import './icons/f01d.png'
import './icons/r01d.png'
import './icons/r02d.png'
import './icons/r03d.png'
import './icons/r04d.png'
import './icons/r05d.png'
import './icons/r06d.png'
import './icons/s01d.png'
import './icons/s02d.png'
import './icons/s03d.png'
import './icons/s04d.png'
import './icons/s05d.png'
import './icons/s06d.png'
import './icons/t01d.png'
import './icons/t02d.png'
import './icons/t03d.png'
import './icons/t04d.png'
import './icons/t05d.png'
import './icons/u00d.png'

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('button-submit').addEventListener('click', handleSubmit);
    document.getElementById('print').addEventListener('click', printPage);
    document.getElementById('reset').addEventListener('click', resetPage);
});

export {
    handleSubmit,
    formatDate,
    printPage,
    resetPage
}

// IIFE function used to restrict the departure dates a user can select starting 
// "today," or the day they use this app, to 15 days from today. This is to 
// work around the weatherbit 16 day, starting from the respective "today," forecast limit

(function () {
    const d = new Date();
    const dateDeparture = document.getElementById('date-departure');
    const dateReturn = document.getElementById('date-return');

    let minDay = d.getDate();
    let minMonth = d.getMonth() + 1; //Add 1 because method is zero based
    let minYear = d.getFullYear();

    d.setDate(d.getDate() + 15);
    // console.log(d);

    let maxDay = d.getDate();
    let maxMonth = d.getMonth() + 1;
    let maxYear = d.getFullYear();
    // console.log(d.getYear());
    // console.log(maxYear);

    let minDate = formatDate(minDay, minMonth, minYear);
    let maxDate = formatDate(maxDay, maxMonth, maxYear);
    // console.log(minDate, maxDate);

    dateDeparture.setAttribute('min', minDate);
    dateDeparture.setAttribute('max', maxDate);
    dateReturn.setAttribute('min', minDate);

    dateDeparture.value = minDate;
    dateReturn.value = maxDate;
})();