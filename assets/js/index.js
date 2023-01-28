//Selectors
const input = document.getElementById('js-input-val');
const form = document.getElementById('js-search-form');

//Global Vars

// Create a input to take user city - if field empty checks
function grabUserInput(e) {
  //Remove default form submission
  e.preventDefault();

  //check for empty input val
  if (!input.value) {
    console.log('nothing in input');
    return;
  }

  inputValue = input.value;
  console.log(inputValue);
  input.value = '';
}

// Display local storage to show history of cities names
function displaySearchHistory() {
  let storedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
}

//set local storage
function setLocalStorage() {
  localStorage.setItem('searchHistory', JSON.stringify(storedHistory));
}

// Create fetch to get data from open weather api

// display first 6 results

// Grab city name THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed

//5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity

// add event listener to form to grab input value
form.addEventListener('submit', grabUserInput);

function init() {}

init();
