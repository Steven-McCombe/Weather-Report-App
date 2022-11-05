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
var coordDay = document.getElementById("coordDay")
var imgDay = document.getElementById("imgDay")
var tempDay = document.getElementById("tempDay")
var windDay = document.getElementById("windDay")
var humidityDay = document.getElementById("humidityDay")
var dateDay = document.getElementById("dateDay")
var conditionsDay = document.getElementById("conditionsDay")
var timeDay = document.getElementById("timeDay")

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

function convertCityToCoords() {
    //convert the input city name to co-ordinates.
    var cityCoordQuery = "q=" + citySearchVal 
    var baseCoordURL = "https://api.openweathermap.org/data/2.5/weather?appid=a373a52d933305394e8b248c3c11f5bd&units=imperial&"
    var finalCoordURL = baseCoordURL + cityCoordQuery
    
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
            //fetch date from openweathermap api with coordinate parameters 
            
            fetch(cityWeatherQuery) 
                .then(function (newResponse) {
                //error checking
                    if (!newResponse.ok) {
                        console.error("Bad Response")
                        throw newResponse.json();
                    }
                    return newResponse.json();
                })
                  
              //render data to page
                .then(function (weatherData) {
                    //converts unixtimestamp to a date value
                    displayDate = new Date((returnResults.dt) * 1000)
                    //grab elements by id and replace their inner html with the index of the api
                    featuredCityEl.innerHTML = returnResults.name
                    coordDay.innerHTML = "Country " + returnResults.sys.country + " -  Latitude: " + returnResults.coord.lat+ " Longitude: " + returnResults.coord.lon
                    imgDay.setAttribute("src", iconPath + returnResults.weather[0].icon + "@2x.png");
                    tempDay.innerHTML = returnResults.main.temp + "°F"
                    windDay.innerHTML = returnResults.wind.speed + "mph"
                    humidityDay.innerHTML = returnResults.main.humidity + "%"
                    dateDay.innerHTML = dayOfWeek[displayDate.getDay()]
                    conditionsDay.innerHTML = returnResults.weather[0].description
                    timeDay.innerHTML = "Data from: " + displayDate.toDateString() 
                // loop through data in increments of 8 to display different days (data comes back in 3 hour increments)
                    for (var i = 4; i <= 36; i += 8){
                        //converts unixtimestamp to a date value
                        displayDate = new Date((weatherData.list[i].dt) * 1000)
                        //grab elements by id and replace their inner html with the index of the api
                        document.getElementById("imgDay" + (i)).setAttribute("src", iconPath + weatherData.list[i].weather[0].icon + "@2x.png");
                        document.getElementById("tempDay" + (i)).innerHTML = weatherData.list[i].main.temp + "°F"
                        document.getElementById("windDay" + (i)).innerHTML = weatherData.list[i].wind.speed + "mph"
                        document.getElementById("humidityDay" + (i)).innerHTML = weatherData.list[i].main.humidity + "%"
                        document.getElementById("dateDay" + (i)).innerHTML = dayOfWeek[displayDate.getDay()]
                        document.getElementById("conditionsDay" + (i)).innerHTML = weatherData.list[i].weather[0].description
                        document.getElementById("timeDay" + (i)).innerHTML = "Data from: " +
                        displayDate.toDateString()
                    }
                })
        })

}



searchFormEl.addEventListener('submit', searchCardSubmit);