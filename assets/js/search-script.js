// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city



var recentSearch = []
var citySearchVal = ""
var cityLat = ""
var cityLon = ""
var cityCoords = "test"
currentDateTime = moment().format('LLLL')
var iconPath = "https://openweathermap.org/img/wn/"
// -----------------Get elements by ID---------------------
//search form elements
var searchFormEl = document.querySelector("#searchFormEl")
//Feature card elements
var featuredCityEl = document.querySelector("#featuredCityEl")
var featuredTempEl = document.querySelector("#featuredTempEl")
var featuredHumidityEl = document.querySelector("#featuredHumidityEl")
var featuredWindEl = document.querySelector("#featuredWindEl")
var featuredTitleEl = document.querySelector("#featuredTitleEl")
var featuredImgEl = document.querySelector("#featuredImgEl")
var featuredDescriptionEl = document.querySelector("#featuredDescriptionEl")

//Call Functions


//function to handle the search query
function searchCardSubmit(event) {
    event.preventDefault()
    citySearchVal = document.querySelector("#cityInput").value
    if (!citySearchVal) {
        window.alert('Insert a City before Searching')
        // console.error('Insert a City before Searching')
    } else {
        recentSearch.push(citySearchVal)
        localStorage.setItem("Searches", recentSearch)
        convertCityToCoords()

    }
}

// function to change weather elements

function renderTimes() {
    featuredTitleEl.innerHTML = currentDateTime

 }




//function to convert the input city name to co-ordinates.
function convertCityToCoords() {
    var cityCoordQuery = "q=" + citySearchVal 
    var baseCoordURL = "https://api.openweathermap.org/data/2.5/weather?appid=a373a52d933305394e8b248c3c11f5bd&"
    var finalCoordURL = baseCoordURL + cityCoordQuery
    featuredCityEl.innerHTML = citySearchVal
    fetch(finalCoordURL)
        .then(function (response) { 
            if (!response.ok) {
                featuredCityEl.innerHTML = "Error City Not Found Please Check Spelling"
                throw response.json();
            }
            return response.json();
        })
        .then(function (returnResults) {
            cityCoords = "lat=" + returnResults.coord.lat + "&" + "lon=" + returnResults.coord.lon
            cityWeatherQuery = "https://api.openweathermap.org/data/2.5/forecast?" + cityCoords + "&appid=a373a52d933305394e8b248c3c11f5bd&units=imperial"
            fetch(cityWeatherQuery)
                .then(function (newResponse) {
                
                    if (!newResponse.ok) {
                        console.error("Bad Response")
                        throw newResponse.json();
                    }
                    return newResponse.json();
                })
                .then(function (weatherData) {
                    //render featured
                    // THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
                    featuredImgEl.setAttribute("src", iconPath + weatherData.list[0].weather[0].icon + ".png")
                    featuredTempEl.innerHTML = weatherData.list[0].main.temp + "°F"
                    featuredWindEl.innerHTML = weatherData.list[0].wind.speed + "mph"
                    featuredHumidityEl.innerHTML = weatherData.list[0].main.humidity + "%"
                    featuredDescriptionEl.innerHTML = "You should expect to see " + weatherData.list[0].weather[0].description
                    console.log(weatherData.list[0].weather[0].icon)
                })
        })

}


searchFormEl.addEventListener('submit', searchCardSubmit);