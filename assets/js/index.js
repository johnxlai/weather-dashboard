//Selectors
const input = document.getElementById('js-input-val');
const form = document.getElementById('js-search-form');
const searchHistoryEl = document.getElementById('js-search-history');
const weatherResultsEl = document.getElementById('js-weather-results');

//Global Vars
const apiKey = `7685af939741ca4a014b811700246193`;

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
  // getCoordinates(userCity);
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

getCoordinates('Toronto');
function getCoordinates(cityName) {
  let countryCode = 'CA';

  let apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${countryCode}&limit=1&appid=${apiKey}`;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          JSON.stringify(data);
          getWeatherResults(data);
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

function getTodaysWeather() {
  // https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid={API key}
}
//test for now
// getWeatherResults();

// Create fetch to get data from open weather api
function getWeatherResults(cityData) {
  // console.log(cityData[0]);
  // let apiTest = https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}.

  // testing for now
  // cityName = 'Toronto';
  // let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&cnt=5&appid=${apiKey}`;

  let lat = cityData[0].lat;
  let lon = cityData[0].lon;

  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          JSON.stringify(data);
          // displayWeatherResults(data);
          reduceToFiveDays(data);
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

//data returns 5 days every 3 hours which equals to 40 items in the obj (5 * 24/h / 3hr = 40)
function reduceToFiveDays(data) {
  const fiveDaysRaw = data.list;
  // console.log(fiveDaysRaw);
  // const fiveDayFilter = fiveDaysRaw
  console.log(fiveDaysRaw[0].dt_txt);
  console.log(fiveDaysRaw[8].dt_txt);
  console.log(fiveDaysRaw[16].dt_txt);
  console.log(fiveDaysRaw[24].dt_txt);
  console.log(fiveDaysRaw[32].dt_txt);

  for (let i = 0; i < fiveDaysRaw.length; i += 8) {
    console.log(fiveDaysRaw[i].dt_txt);
  }

  let newArr = fiveDaysRaw.filter(function (day, index) {
    return index % 8 == 0;
  });
  console.log(newArr);
}
// display first 6 results
function displayWeatherResults(data) {
  const fiveDays = data.list;
  // console.log(fiveDays);
  weatherResultsEl.firstElementChild.innerHTML = `<h1>${fiveDays[0].weather[0].icon}.png</h1>
  <img src="http://openweathermap.org/img/wn/${fiveDays[0].weather[0].icon}.png" alt="" />
  `;
  // console.log(());
  fiveDays.forEach((day) => {
    // weatherResultsEl.firstChild.innerHTML += 'test';
  });
}

// Grab city name THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed

//5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity

// add event listener to form to grab input value
form.addEventListener('submit', grabUserInput);

function init() {
  //Show Search History
  displaySearchHistory();
}

init();
