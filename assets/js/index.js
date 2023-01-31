//Selectors
const input = document.getElementById('js-input-val');
const form = document.getElementById('js-search-form');
const searchHistoryEl = document.getElementById('js-search-history');
const weatherResultsEl = document.getElementById('js-weather-results');
const hidden5daysLabel = weatherResultsEl.querySelector('.hidden');
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

          //Add to local Storage obj
          addToLocalStorage(cityName);
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
  displayNextFiveDays(reducedFiveDays);
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
    <button data-city-name="${city.cityName}" class="bg-indigo-600 hover:bg-blue-600 text-white font-bold mb-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline grow capitalize" type="buttonblock">
           ${city.cityName}
    </button>`;

    //add btns to html
    searchHistoryEl.innerHTML += cityBtn;
  });
}

//display todays weather details
function displayCurrentDay(today) {
  console.log(today);
  //display today's day with vanilla js and breaking down obj to show details
  weatherResultsEl.firstElementChild.innerHTML = `
        <div
          class="col-span-full text-white grid grid-cols-1 md:grid-cols-6 grid-rows-2 gap-4">
          <div
            class="row-span-full col-span-2 bg-black/50 text-gray-300 rounded p-3 flex flex-col justify-center items-center relative">
            <h3 class="font-bold text-2xl relative -bottom-10">
            ${today.name}, ${today.sys.country}</h3>
            <img src="https://openweathermap.org/img/wn/${
              today.weather[0].icon
            }@4x.png" alt="Today's weather icon" />
          </div>
          <div
            class="col-span-2 bg-black/50 text-gray-300 rounded p-3 flex flex-col justify-center items-center">
            <h4 class="mb-2"><span class="text-xs mr-1">Date:</span>${new Date().toLocaleString()}</h4>
            <div>
              <span class="text-xs mr-1">lon:</span>${today.coord.lon}
              <p><span class="text-xs mr-1">lat:</span>${today.coord.lat}</p>
            </div>
          </div>
          <div
            class="col-span-1 row-span-2 bg-black/50 text-gray-300 rounded p-3 flex flex-col justify-center items-center">
            <span class="text-xs">Temp</span>
            <span class="md:text-2xl xl:text-4xl mb-5">${today.main.temp}</span>
            <span class="text-xs">Feels Like</span>
            <span class="md:text-2xl xl:text-4xl">${
              today.main.feels_like
            }</span>
          </div>
          <div
            class="col-span-1 bg-black/50 text-gray-300 rounded p-3 flex flex-col justify-center items-center">
            <span class="text-xs">Wind:</span>
            <span class="text-3xl my-1">${today.wind.speed}</span>
            <span class="text-xs">MPH</span>
          </div>

          <div class="col-span-1 grid grid-rows-2 gap-y-4">
            <div class="bg-black/50 text-gray-300 rounded p-3 text-center">
              <span class="text-xs">Sunset: </span>
              <span>${today.sys.sunset}</span>
            </div>
            <div class="bg-black/50 text-gray-300 rounded p-3 text-center">
              <span class="text-xs">Sunrise: </span>
              <span>${today.sys.sunrise}</span>
            </div>
          </div>
          <div
            class="col-span-1 bg-black/50 text-gray-300 rounded p-3 flex flex-col justify-center items-center">
            <span class="text-xs mb-1">Humidity </span>
            <span class="text-3xl font-bold">${today.main.humidity}%</span>
          </div>
          <div
            class="col-span-1 bg-black/50 text-gray-300 rounded p-3 flex flex-col justify-center items-center">
            <span class="text-xs">Wind:</span>
            <span class="text-3xl my-1">${today.wind.deg}</span>
            <span class="text-xs">Degree</span>
          </div>
        </div>
    `;
}

//Display next five days weather
function displayNextFiveDays(fiveDays) {
  let card = '';

  fiveDays.forEach((day) => {
    //Remove time form day.dt_text, just grabbing the day
    console.log(day.dt_txt);
    let date = day.dt_txt.split(' ')[0];
    //Use Day.js to format date
    date = dayjs(date).format('MMM DD,YYYY');

    card += `
     <div class="bg-black/50 text-gray-300 col-span-full md:col-span-2 lg:col-span-1 p-3 rounded flex flex-col items-center  md:flex-row md:flex-wrap md:justify-around">
      <div class="flex flex-col justify-center items-center mb-4 md:flex-row md:mb-0">
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="" />
        <h6>${date}</h6>
      </div>
      <div class="flex justify-around items-center gap-4">
        <p class="flex flex-col items-center">
          <span class="text-xs">Temp</span>
            ${day.main.temp}
        </p>
        <p class="flex flex-col items-center">
          <span class="text-xs">wind</span>
            ${day.wind.speed}
          <span class="text-xs">mph</span>
        </p>
        <p class="flex flex-col items-center">
          <span class="text-xs">Humidtiy</span>
          ${day.main.humidity}
        </p>
      </div>
    </div>
    `;
  });
  //Append all 5 days to html container
  hidden5daysLabel.classList.remove('hidden');
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
