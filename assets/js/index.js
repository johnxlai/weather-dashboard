//Selectors
const input = document.getElementById('js-input-val');
const form = document.getElementById('js-search-form');
const searchHistoryEl = document.getElementById('js-search-history');
const weatherResultsEl = document.getElementById('js-weather-results');

//Global Vars

// Create a input to take user city - if field empty checks
function grabUserInput(e) {
  //Remove default form submission
  e.preventDefault();

  //check for empty input val
  if (!input.value) {
    alert('Please enter a city name');
    return;
  }

  //grab user into and store to local storage
  userCity = input.value;
  addToLocalStorage(userCity);
  getWeatherResults(userCity);
  // empty input value
  input.value = '';
}

// Display local storage to show history of cities names
function displaySearchHistory() {
  //Set var to the parsed json, if it is empty add empty array.
  let storedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

  //Loop thru in city to create btn
  storedHistory.forEach((city) => {
    console.log(city);
    let cityBtn = `
  <button class="bg-blue-900 hover:bg-blue-700 text-white font-bold mb-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline grow" type="buttonblock">
           ${city.cityName}
    </button>`;

    //add btns to html
    searchHistoryEl.innerHTML += cityBtn;
  });
}

//add to local storage
function addToLocalStorage(cityName) {
  let storedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

  //Add new city to the obj
  let newCity = {
    cityName,
  };

  // console.log(storedHistory);
  // console.log(storedHistory.find((el) => Object.keys(el === newCity.cityName)));
  //DONT ADD existing items

  storedHistory.push(newCity);

  //update local storage
  localStorage.setItem('searchHistory', JSON.stringify(storedHistory));

  //Add Btns to display
  displaySearchHistory();
}

// Create fetch to get data from open weather api
function getWeatherResults(cityName) {
  const apiKey = `7685af939741ca4a014b811700246193`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          weatherResultsEl.innerHTML = JSON.stringify(data);
          console.log(data);
        });
      } else {
        alert(
          'Error: ' + response.statusText + '\nPlease enter a vaild city name'
        );
      }
    })
    .catch(function (error) {
      alert('Unable to get weather info');
    });
}

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
