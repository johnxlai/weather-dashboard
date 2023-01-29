//Selectors
const input = document.getElementById('js-input-val');
const form = document.getElementById('js-search-form');
const searchHistoryEl = document.getElementById('js-search-history');
const weatherResultsEl = document.getElementById('js-weather-results');
const daysForecastEl = document.getElementById('js-5days-forecast');

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
  userCity = input.value.toLowerCase();

  //Add to local Storage obj
  addToLocalStorage(userCity);
  //Fetch current weather using city name
  getCurrentWeather(userCity);
  //Get Lat and Long to use for another api fetch url
  getCoordinates(userCity);
  // empty input value
  input.value = '';
}

//add to local storage
function addToLocalStorage(cityName) {
  let storedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

  //Add new city to the obj
  let newCity = {
    cityName,
  };

  //if the city name is already in local storage dont allow to add it
  const checkCityName = (storedHistory) =>
    storedHistory.cityName === newCity.cityName;

  //Use .some to check if city name does alrdy exist
  if (!storedHistory.some(checkCityName)) {
    storedHistory.push(newCity);
  }

  //update local storage
  localStorage.setItem('searchHistory', JSON.stringify(storedHistory));

  //Add Btns to display
  displaySearchHistory();
}

///////// Get Information Functions ////////////
// Convert User's city name to coordinates for latitude and longitude
function getCoordinates(cityName) {
  let apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

  fetch(apiUrl)
    .then(function (response) {
      //if response its success, convert it to json and pass the data to the next function
      if (response.ok) {
        response.json().then(function (data) {
          JSON.stringify(data);
          getWeatherForNext5Days(data);
        });
      } else {
        //if it is a unsuccessful response
        alert(
          'Error: ' + response.statusText + '\nPlease enter a vaild city name'
        );
      }
    })
    .catch(function (error) {
      alert('Unable to get weather info');
    });
}

//get Today's Weather
function getCurrentWeather(cityName) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;

  fetch(apiUrl)
    .then(function (response) {
      //if response its success, convert it to json and pass the data to the next function
      if (response.ok) {
        response.json().then(function (data) {
          JSON.stringify(data);
          displayCurrentDay(data);
        });
      } else {
        //if it is a unsuccessful response
        alert(
          'Error: ' + response.statusText + '\nPlease enter a vaild city name'
        );
      }
    })
    .catch(function (error) {
      alert('Unable to get weather info');
    });
}

// get Weather for 5 Days
function getWeatherForNext5Days(cityData) {
  let lat = cityData[0].lat;
  let lon = cityData[0].lon;

  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  fetch(apiUrl)
    .then(function (response) {
      //if response its success, convert it to json and pass the data to the next function
      if (response.ok) {
        response.json().then(function (data) {
          JSON.stringify(data);
          // displayWeatherResults(data);
          reduceToFiveDays(data);
        });
      } else {
        //if it is a unsuccessful response
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
  //this arr returns 40
  const fiveDaysRaw = data.list;
  // init empty arr
  let reducedFiveDays = [];

  //In order to get a daily value - get every 8 element in the main array
  for (let i = 0; i < fiveDaysRaw.length; i += 8) {
    //Add to item to the new array;
    reducedFiveDays.push(fiveDaysRaw[i]);
  }

  //Display to dom
  displayWeatherResults(reducedFiveDays);
}

///////// DISPLAY FUNCTIONS ///////////////

// Display local storage to show history of cities names
function displaySearchHistory() {
  //Clear old buttons
  searchHistoryEl.innerHTML = '';
  //Set var to the parsed json, if it is empty add empty array.
  let storedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

  //Loop thru in city to create btn
  storedHistory.forEach((city) => {
    let cityBtn = `
    <button data-city-name="${city.cityName}" class="bg-blue-900 hover:bg-blue-700 text-white font-bold mb-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline grow capitalize"     type="buttonblock">
           ${city.cityName}
    </button>`;

    //add btns to html
    searchHistoryEl.innerHTML += cityBtn;
  });
}

//display todays weather details
function displayCurrentDay(today) {
  //display today's day with vanilla js and breaking down obj to show details
  weatherResultsEl.firstElementChild.innerHTML = `
    <h1 class="font-bold">${today.name} ${new Date().toLocaleDateString()} </h1>
    <p>Temp: ${today.main.temp}</p>
    <p><img src="http://openweathermap.org/img/wn/${
      today.weather[0].icon
    }.png" alt="Today's weather icon" />
    <p>Wind: ${today.wind.speed} MPH</p>
    <p>Humidity: ${today.main.humidity}%</p>
    `;
}

//Display next five days weather
function displayWeatherResults(fiveDays) {
  let card = '';

  fiveDays.forEach((day) => {
    //Use to locale date string to convert the object's date and remove time from returned string
    let date = new Date(day.dt_txt.split(' ')[0]).toLocaleDateString();

    card += `
     <div class="bg-white col-span-2 p-3">
      <h1>${date}</h1>
      <p>Temp: ${day.main.temp}</p>
      <p>Wind: ${day.wind.speed} MPH</p>
      <p>Humidtiy: ${day.main.humidity} MPH</p>
      <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="" />
     </div>
    `;
  });
  //Append all 5 days to html container
  daysForecastEl.innerHTML = card;
}

//Event Delegation for btns to grab data attr for city name and trigger search
function searchHistoryBtn(e) {
  let historyCity = e.target.getAttribute('data-city-name');
  if (historyCity) {
    //Fetch current weather using city name
    getCurrentWeather(historyCity);
    //Get Lat and Long to use for another api fetch url
    getCoordinates(historyCity);
  }
}

// add event listener for form submission
form.addEventListener('submit', grabUserInput);
// add event listener for search history btns
searchHistoryEl.addEventListener('click', searchHistoryBtn);

function init() {
  //Show Search History
  displaySearchHistory();
}
init();
