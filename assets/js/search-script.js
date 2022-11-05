var recentSearch = JSON.parse(localStorage.getItem("Searches")) || [];
var citySearchVal = "New York" //New York by Default
currentDateTime = moment().format('LLLL')
var iconPath = "https://openweathermap.org/img/wn/"
var displayDate; 
var dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var baseCoordURL = "https://api.openweathermap.org/data/2.5/weather?appid=a373a52d933305394e8b248c3c11f5bd&units=imperial&"
// -----------------Get elements by ID---------------------

//search form and saved list elements
var searchFormEl = $("#searchFormEl")

//function to handle the search query
function searchCardSubmit(event) {
    $('#savedList').html("")
    event.preventDefault()
    citySearchVal = $("#cityInput").val()
    if (!citySearchVal) {
        window.alert('Insert a City before Searching')
        // console.error('Insert a City before Searching')
    } else {
        convertCityToCoords()
        // saveToLocal()
        
        
    }
}

$("#savedList li").click(function () {
    $('#savedList').html("")
    var recentSearchText = $(this)
    citySearchVal = recentSearchText.text()
    console.log(citySearchVal)
    convertCityToCoords()
});
//function to append list items to 
var renderRecent = function() {
    var savedSearches = JSON.parse(localStorage.getItem("Searches"));
    if (!savedSearches) {
        return
    }
    for (var i = 0; i < savedSearches.length; i++) {
        $("#savedList").append("<li class=list-group-item>" + savedSearches[i] + "</li>")
    }
    
};

function convertCityToCoords() {
    //convert the input city name to co-ordinates.
    var cityCoordQuery = "q=" + citySearchVal 
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
                    $("#coordDay").html("Country " + returnResults.sys.country + " -  Latitude: " + returnResults.coord.lat+ " Longitude: " + returnResults.coord.lon)
                    $("imgDay").attr("src", iconPath + returnResults.weather[0].icon + "@2x.png");
                    $("#tempDay").html(returnResults.main.temp + "°F")
                    $("#windDay").html(returnResults.wind.speed + "mph")
                    $("#humidityDay").html(returnResults.main.humidity + "%")
                    $("#dateDay").html(dayOfWeek[displayDate.getDay()])
                    $("#conditionsDay").html(returnResults.weather[0].description)
                    $("#timeDay").html("Data from: " + displayDate.toDateString())

                // loop through data in increments of 8 to display different days (data comes back in 3 hour increments)
                    for (var i = 4; i <= 36; i += 8){
                        //converts unixtimestamp to a date value
                        displayDate = new Date((weatherData.list[i].dt) * 1000)
                        //grab elements by id and replace their inner html with the index of the api
                        $("#imgDay" + (i)).attr("src", iconPath + weatherData.list[i].weather[0].icon + "@2x.png");
                        $("#tempDay" + (i)).html(weatherData.list[i].main.temp + "°F")
                        $("#windDay" + (i)).html(weatherData.list[i].wind.speed + "mph")
                        $("#humidityDay" + (i)).html(weatherData.list[i].main.humidity + "%")
                        $("#dateDay" + (i)).html(dayOfWeek[displayDate.getDay()])
                        $("#conditionsDay" + (i)).html(weatherData.list[i].weather[0].description)
                        $("#timeDay" + (i)).html("Data from: " +
                        displayDate.toDateString())
                    }
                    function saveToLocal() {
                        if (jQuery.inArray(returnResults.name, recentSearch) === -1) {    
                            recentSearch.push(returnResults.name)
                            localStorage.setItem("Searches", JSON.stringify(recentSearch))
                         } 
                    }
                    saveToLocal()
                    renderRecent()
                    $("#savedList li").click(function () {
                        $('#savedList').html("")
                        var recentSearchText = $(this)
                        citySearchVal = recentSearchText.text()
                        console.log(citySearchVal)
                        convertCityToCoords()
                    });
                   
                })
        })

}
convertCityToCoords()
searchFormEl.on('submit', searchCardSubmit);