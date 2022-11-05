var recentSearch = JSON.parse(localStorage.getItem("Searches")) || [];
var citySearchVal = "New York" //New York by Default. 
currentDateTime = moment().format('LLLL')
var iconPath = "https://openweathermap.org/img/wn/"
var displayDate; 
var dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var baseCoordURL = "https://api.openweathermap.org/data/2.5/weather?appid=a373a52d933305394e8b248c3c11f5bd&units=imperial&"
//search form and saved list elements
var searchFormEl = $("#searchFormEl")

//function to handle the search query
function searchCardSubmit(event) {
    $('#savedList').html("")
    event.preventDefault()
    citySearchVal = $("#cityInput").val()
    if (!citySearchVal) {
        renderRecent()
        window.alert('Insert a City before Searching')
        // console.error('Insert a City before Searching')
    } else {
        getWeather()  
    }
}

//function to append list items to recent searches UL
var renderRecent = function() {
    var savedSearches = JSON.parse(localStorage.getItem("Searches"));
    if (!savedSearches) {
        return
    }
    //creates a new list item for each city saved in local storage
    for (var i = 0; i < savedSearches.length; i++) {
        $("#savedList").append("<li id = savedItemsList class=list-group-item customList>" + savedSearches[i] + "</li>")
    }
    
};

function getWeather() {
    //search weather api using the input city name as a parameter
    var cityCoordQuery = "q=" + citySearchVal 
    var finalCoordURL = baseCoordURL + cityCoordQuery
    
    fetch(finalCoordURL) 
        .then(function (response) { 
            //error logic if city is not found in the api
            if (!response.ok) {
                window.alert("Invalid City - Returning to Default City New York")
                window.location.reload()
                renderRecent()
                throw response.json();
                
            }
            return response.json(); 
        })
      
              
        .then(function (returnResults) {
            //search forecast api with coordinate parameters
            cityCoords = "lat=" + returnResults.coord.lat + "&" + "lon=" + returnResults.coord.lon
            cityWeatherQuery = "https://api.openweathermap.org/data/2.5/forecast?" + cityCoords + "&appid=a373a52d933305394e8b248c3c11f5bd&units=imperial"
            //fetch date from openweathermap api with coordinate parameters 
            
            fetch(cityWeatherQuery) 
                .then(function (newResponse) {
                //error checking if api fetch is not valid.
                    if (!newResponse.ok) {
                        console.error("Bad Response")
                        throw newResponse.json();
                    }
                    return newResponse.json();
                })
                  
              //render data to page
                .then(function (weatherData) {

                    //convert the country code to country name
                    var CountryName = new Intl.DisplayNames(['en'], { type: 'region' });
                    //converts unixtimestamp to a date value
                    displayDate = new Date((returnResults.dt) * 1000)

                    //grab elements by id and replace their inner html with the index of the api
                    $("#featuredCityEl").html(returnResults.name + ", " + CountryName.of(returnResults.sys.country))
                    $("#coordDay").html("Latitude: " + returnResults.coord.lat+ " Longitude: " + returnResults.coord.lon)
                    $("#dateDay").html(dayOfWeek[displayDate.getDay()] + " - " + displayDate.toLocaleDateString())
                    $("imgDay").attr("src", iconPath + returnResults.weather[0].icon + "@2x.png");
                    $("#tempDay").html(returnResults.main.temp.toFixed() + "°F")
                    $("#windDay").html(returnResults.wind.speed.toFixed() + "mph")
                    $("#humidityDay").html(returnResults.main.humidity.toFixed() + "%")
                    $("#conditionsDay").html(returnResults.weather[0].description)
                    $("#timeDay").html("Data from: " + displayDate.toString())

                // loop through data in increments of 8 to display different days (data comes back in 3 hour increments)
                    for (var i = 7; i <= 39; i += 8){
                        //converts unixtimestamp to a date value
                        displayDate = new Date((weatherData.list[i].dt) * 1000)
                        //grab elements by id and replace their inner html with the index of the api
                        $("#imgDay" + (i)).attr("src", iconPath + weatherData.list[i].weather[0].icon + "@2x.png");
                        $("#tempDay" + (i)).html(weatherData.list[i].main.temp.toFixed() + "°F")
                        $("#windDay" + (i)).html(weatherData.list[i].wind.speed.toFixed() + "mph")
                        $("#humidityDay" + (i)).html(weatherData.list[i].main.humidity.toFixed() + "%")
                        $("#dayDay" + (i)).html(dayOfWeek[displayDate.getDay()])
                        $("#dateDay" + (i)).html(displayDate.toLocaleDateString())
                        $("#conditionsDay" + (i)).html(weatherData.list[i].weather[0].description)
                    }
                    //called the saved functions and click listener inside the fetch in order to access asynchronous data. This will help ensure only true city names are pushed to the renderRecent list. 
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
                        getWeather()
                    });
                   
                })
        })

}
//Clear local storage -- Default City Returns
$("#clearBtn").click(function () {
    localStorage.clear() 
    window.location.reload()
});
//on page load run the fetch. This will load the date automatically from the default city. in this case the default city is new york. Future development would allow the default city to be users location.
getWeather()
searchFormEl.on('submit', searchCardSubmit);