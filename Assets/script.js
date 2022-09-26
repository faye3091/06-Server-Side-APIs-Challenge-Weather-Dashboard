var today = new Date();
var cityFormEl = document.querySelector("#city-form");
var cityNameInputEl = document.querySelector("#cityinput");
var historyButtonsEl = document.querySelector(".history-list");
var historyEl = document.querySelector("#searched-history");
var searchHistoryArray = [];
var currentWeatherEl = document.querySelector(".current-weather");
var currentWeatherHeaderEl = document.querySelector(".current-header");
var fiveDayHeaderEl = document.querySelector(".five-day");
var fiveDayEl = document.querySelector(".five-day-body");
var weatherStatusEl = document.querySelector(".weather-status");
var trashEl = document.querySelector("#trash");
var ownApiWeather = "f97301447cbd41068af8623a398ba1fb";

var formSubmit = function (event) {
  event.preventDefault();
  //get city name value from the input text
  var cityname = cityNameInputEl.value.trim();

  //make the city name to be stored in local storage and generate a history buttons
  if (cityname) {
    searchHistoryArray.push(cityname);
    localStorage.setItem("weatherSearch", JSON.stringify(searchHistoryArray));
    var searchHistoryEl = document.createElement("button");
    searchHistoryEl.className = "btn";
    searchHistoryEl.setAttribute("data-city", cityname);
    searchHistoryEl.innerHTML = cityname;
    historyButtonsEl.appendChild(searchHistoryEl);
    historyEl.removeAttribute("style");
    //will get the function getWeatherInfo with the correct city
    getWeatherInfo(cityname);
    cityNameInputEl.value = "";
    console.log(cityname);
    //var cod = cityResponse.cod === 404
  } else {
    alert("INVALID! NEED to ENTER CITY!");
  }
};

//get weather information from OpenWeather API
var getWeatherInfo = function (cityname) {
  //API Url with API code
  var apiCityUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityname +
    "&units=imperial&appid=" +
    ownApiWeather;
  console.log(apiCityUrl);
  fetch(apiCityUrl)
    .then(function (cityResponse) {
      return cityResponse.json();
    })
    .then(function (cityResponse) {
      //
      console.log(cityResponse);

      if (cityResponse.cod === "404") {
        alert("INVALID! NEED to ENTER CITY!");
        return;
      }
      var latitude = cityResponse.coord.lat;
      var longtitude = cityResponse.coord.lon;
      console.log(longtitude + " " + latitude);
      var city = cityResponse.name;
      var date =
        today.getMonth() +
        1 +
        "/" +
        today.getDate() +
        "/" +
        today.getFullYear();
      var weatherIcon = cityResponse.weather[0].icon;
      var weatherDescription = cityResponse.weather[0].description;
      var weatherIconLink =
        "<img src='http://openweathermap.org/img/wn/" +
        weatherIcon +
        "@2x.png' alt='" +
        weatherDescription +
        "' title='" +
        "'  />";

      //empty current weather element for new data
      currentWeatherEl.textContent = "";
      fiveDayEl.textContent = "";

      //Update <h2> element to show city, data and icon
      weatherStatusEl.innerHTML =
        city +
        " (" +
        date +
        ") " +
        "<p>" +
        weatherDescription +
        weatherIconLink;
      console.log(today);

      //change class name 'hidden' to show current weather
      currentWeatherHeaderEl.style.display = "block";
      fiveDayHeaderEl.style.display = "block";

      return fetch(
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          latitude +
          "&lon=" +
          longtitude +
          "&appid=" +
          ownApiWeather +
          "&units=imperial&cnt=5"
      );
    })
    .then(function (response) {
      //return response in json format
      return response.json();
    })
    .then(function (response) {
      console.log(response);
      //send response data to displayWeather function for final display
      displayWeather(response);
    });
};
//Display the weather on page
var displayWeather = function (weather) {
  //check if API returned any weather data
  if (weather.length === 0) {
    alert("No weather data found!");
    return;
  }
  //Create temperature element
  var temperature = document.createElement("p");
  temperature.id = "temperature";
  temperature.innerHTML =
    "<strong>Temperature: </strong> " + weather.current.temp.toFixed(1) + "°F";
  currentWeatherEl.appendChild(temperature);

  //create Humidity element
  var humidity = document.createElement("p");
  humidity.id = "humidity";
  humidity.innerHTML =
    "<strong>Humidity: </strong> " + weather.current.humidity + "%";
  currentWeatherEl.appendChild(humidity);

  //create wind speed element
  var winSpeed = document.createElement("p");
  winSpeed.id = "wind-speed";
  winSpeed.innerHTML =
    "<strong>Wind Speed: </strong> " +
    weather.current.wind_speed.toFixed(1) +
    "Mph";
  currentWeatherEl.appendChild(winSpeed);

  //create uv-index element
  var uvIndex = document.createElement("p");
  var uvIndexValue = weather.current.uvi.toFixed(1);
  uvIndex.id = "uv-index";
  if (uvIndexValue >= 0) {
    uvIndex.className = "uv-index-green";
  }
  if (uvIndexValue >= 3) {
    uvIndex.className = "uv-index-yellow";
  }
  if (uvIndex >= 8) {
    uvIndex.className = "uv-index-red";
  }
  uvIndex.innerHTML =
    "<strong>UV Index: </strong> <span>" + uvIndexValue + "</span>";
  currentWeatherEl.appendChild(uvIndex);

  //get extended forecast data
  var forecastArray = weather.daily;

  //create day cards for extended forecast
  for (let i = 0; i < forecastArray.length - 3; i++) {
    var date =
      today.getMonth() +
      1 +
      "/" +
      (today.getDate() + i + 1) +
      "/" +
      today.getFullYear();
    var weatherIcon = forecastArray[i].weather[0].icon;
    var weatherDescription = forecastArray[i].weather[0].description;
    var weatherIconLink =
      "<img src='http://openweathermap.org/img/wn/" +
      weatherIcon +
      "@2x.png' alt='" +
      weatherDescription +
      "' title='" +
      weatherDescription +
      "'  />";
    var dayEl = document.createElement("div");
    dayEl.className = "day";
    dayEl.innerHTML =
      "<p><strong>" +
      date +
      "</strong></p>" +
      "<p>" +
      weatherIconLink +
      "</p>" +
      " " +
      weatherDescription +
      "<p><strong>Temp:</strong> " +
      forecastArray[i].temp.day.toFixed(1) +
      "°F</p>" +
      "<p><strong>Humidity:</strong> " +
      forecastArray[i].humidity +
      "%</p>";
    fiveDayEl.appendChild(dayEl);
  }
};

//load any past city weather searches
var loadHistory = function () {
  searchArray = JSON.parse(localStorage.getItem("weatherSearch"));

  if (searchArray) {
    searchHistoryArray = JSON.parse(localStorage.getItem("weatherSearch"));
    historyEl.removeAttribute("style");
    for (let i = 0; i < searchArray.length; i++) {
      var searchHistoryEl = document.createElement("button");
      searchHistoryEl.className = "btn";
      searchHistoryEl.setAttribute("data-city", searchArray[i]);
      searchHistoryEl.innerHTML = searchArray[i];
      historyButtonsEl.appendChild(searchHistoryEl);
      historyEl.removeAttribute("style");
    }
  }
};

//seach weather using search history buttons
var buttonClickHandler = function (event) {
  var cityname = event.target.getAttribute("data-city");
  if (cityname) {
    getWeatherInfo(cityname);
  }
};

//clear search history
var clearHistory = function () {
  localStorage.removeItem("weatherSearch");
  //stays hidden when clear the history
  historyEl.style.visibility = "hidden";
};
cityFormEl.addEventListener("submit", formSubmit);
historyButtonsEl.addEventListener("click", buttonClickHandler);
trashEl.addEventListener("click", clearHistory);

//this loads any past history even if the page is refreshed
loadHistory();
