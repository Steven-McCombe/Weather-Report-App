
var recentSearch = []
var citySearchVal = ""
var cityLat = ""
var cityLon = ""
var cityCoords = "" 

// Get elements by ID
var searchFormEl = document.querySelector("#searchFormEl")
var featuredCityEl = document.querySelector("#featuredCityEl")
var featuredLatEl = document.querySelector("#featuredLatEl")
var featuredLonEl = document.querySelector("#featuredLonEl")

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
            featuredLatEl.innerHTML = returnResults.coord.lat
            featuredLonEl.innerHTML = returnResults.coord.lon
        
        })  
}

//Event Listeners
searchFormEl.addEventListener('submit', searchCardSubmit);