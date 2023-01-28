//Selectors
const input = document.getElementById('js-input-val');
const form = document.getElementById('js-search-form');
const searchHistoryEl = document.getElementById('js-search-history');

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

  userCity = input.value;
  addToLocalStorage(userCity);

  // input.value = '';
}

// Display local storage to show history of cities names
function displaySearchHistory() {
  let storedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

  storedHistory.forEach((city) => {
    console.log(city);
  });
  let cityName = `
  <button class="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline grow" type="buttonblock	">
            CITY NAME
    </button>`;

  searchHistoryEl.innerHTML = cityName;
}

//add to local storage
function addToLocalStorage(cityName) {
  let storedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

  let newCity = {
    cityName,
  };

  storedHistory.push(newCity);

  //update local storage
  localStorage.setItem('searchHistory', JSON.stringify(storedHistory));
}

// Create fetch to get data from open weather api

// display first 6 results

// Grab city name THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed

//5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity

// add event listener to form to grab input value
form.addEventListener('submit', grabUserInput);

function init() {
  //Show Search History
  displaySearchHistory();
}

init();
