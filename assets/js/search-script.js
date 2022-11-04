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
var displayDate; 
var dayOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
// -----------------Get elements by ID---------------------
//search form elements
var searchFormEl = document.querySelector("#searchFormEl")
//Feature card elements
var featuredCityEl = document.querySelector("#featuredCityEl")
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
            
                    featuredDescriptionEl.innerHTML = "You should expect to see " + weatherData.list[0].weather[0].description
                    console.log(weatherData.list[0].weather[0].icon)
                    
                    for (var i = 0; i <= 32; i += 8){
                        displayDate = new Date(weatherData.list[i].dt * 1000)
                        console.log(displayDate)
                        console.log(weatherData.list[i].dt * 1000)
                        console.log(i)
                        document.getElementById("imgDay" + (i)).setAttribute("src", iconPath +
                        weatherData.list[i].weather[0].icon
                            + ".png");
                        document.getElementById("tempDay" + (i)).innerHTML = weatherData.list[i].main.temp + "°F"
                        document.getElementById("windDay" + (i)).innerHTML = weatherData.list[i].wind.speed + "mph"
                        document.getElementById("humidityDay" + (i)).innerHTML = weatherData.list[i].main.humidity + "%"
                        document.getElementById("dateDay" + (i)).innerHTML = dayOfWeek[displayDate.getDay()]
                        
                    }
                })
        })

}



searchFormEl.addEventListener('submit', searchCardSubmit);