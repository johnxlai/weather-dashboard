//Selectors
const input = document.getElementById('js-input-val');
const form = document.getElementById('js-search-form');

// Create a input to take user city - if field empty checks
function grabUserInput(e) {
  //Remove default form submission
  e.preventDefault();
  console.log(this.classList.contains('#js-input-val'));
}

// add event listener to form to grab input value
form.addEventListener('submit', grabUserInput);

// Local storage to show history of cities names

// Create fetch to get data from open weather api

// display first 6 results

// Grab city name THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed

//5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
