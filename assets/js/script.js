
// variables
var userCitySearchEl  = document.querySelector( "#city-form" );
var cityNameEl = document.querySelector( "#cityname" );
var cityButtonsEl = document.querySelector( "#previous-cities" );
var clearButtonEl = document.querySelector( "#clear-all" );
var returnValue;
var curDay;
var weatherTemperature;
var weatherHumidity;
var weatherWindSpeed;
var weatherUV;
var cityLat;
var cityLong;
var numPreviousCities;
var previousCities = [10];

var getCityWeather = function ( city ) {

    returnValue = 0;

    // Get the current date
    var date = moment().format('L');
    curDay = moment().format("dddd");

 
    // Personal API Key for 'openweather.com'
    var apiKey = "4ac62930f02efe4befd5f739a4de35e6";

    // Format the 'Weather' API URL to obtain the current day's forecast.
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

    // request current day's weather
    fetch(apiUrl)
        .then(function (response) {

            return response.json();
        })
        .then(function (response) {

            // error handler
            if( response.cod == 404 ) {
                returnValue = -1;
                return( returnValue );
            }
 
            // display city date and weather
            displayCityNameDate( city, date );
            displayToday( response );

            cityLat = response.coord.lat;
            cityLon = response.coord.lon;

            // get UV
            var apiUrl = "https://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + apiKey + "&lat=" + cityLat + "&lon=" + cityLon + "&cnt=1";

            return fetch(apiUrl)
 
        })
        .then( function( response ) {
            return response.json();
        })
        .then( function(response) {
             displayUvValue(response);
        })
        .catch(function (error) {
            // error handler if API fails
            alert("Unable to connect to OpenWeather");
            returnValue = -1;
            return( returnValue );
        });

    if( returnValue < 0 ) {
        return( returnValue );
    }
    var apiUrl2 = "https://api.openweathermap.org/data/2.5/forecast/?q=" + city + "&units=imperial&appid=" +apiKey;

    // request current day's weather
    fetch(apiUrl2)
        .then(function (response) {

            if (response.ok) {
                response.json().then(function (data) {

                    display5Days(data);
                });

            } else {
                alert("Error: " + response.statusText);
                return;
            };
            return response;
        })

}

// get city and date
var displayCityNameDate = function( city, date ) {

    var cityInfo = city.split(",");
    var cityDisplayNameEl = document.querySelector( "#citytext" );
    cityDisplayNameEl.textContent = cityInfo[0] + ", " + date + ", " + curDay;
    var cityLocationNameEl = document.querySelector( "#citylocation" );

    if( !cityInfo[2] ) {
        cityInfo[2] = " ";
    }
    else {
        cityInfo[2] = ", " + cityInfo[2];
    }
    
    if( !cityInfo[1] ) {
        cityInfo[1] = " ";
    }

    cityLocationNameEl.textContent = cityInfo[1] + cityInfo[2];

    pushCity( city );
}

// get current day weather
var displayToday = function( data ) {

    weatherTemperature = data.main.temp;
    weatherHumidity    = data.main.humidity;
    weatherWindSpeed   = data.wind.speed;

    var tempDisplayEl = document.querySelector("#temperature");
    var weatherString = "Temperature: " + weatherTemperature + " \xB0F";                 
    tempDisplayEl.textContent = weatherString;

    var humidDisplayEl = document.querySelector("#humidity");
    humidDisplayEl.textContent = "Humidity: " + weatherHumidity + " %";

    var windDisplayEl = document.querySelector("#wind");
    windDisplayEl.textContent = "Wind Speed: " + weatherWindSpeed + " MPH";

}

// get current day UV
var displayUvValue = function( data2 ) {

    weatherUV = data2[0].value;

    var uvDisplayEL = document.querySelector("#uv");
    uvDisplayEL.textContent = "UV Index: " ;
    var uvDisplayValEl = document.querySelector("#uv-value");
    uvDisplayValEl.textContent = weatherUV ;
}

// display 5-day weather forecast
var display5Days = function( data ) {
    // "refresh" the page that may have old data
    empty5Days();

    // display 5 days
    showDayInfo( "#day1", data, 2 )    // display 1st day, pass in ID and weather index
    showDayInfo( "#day2", data, 10 )   // display 2nd day, pass in ID and weather index
    showDayInfo( "#day3", data, 18 )   // display 3rd day, pass in ID and weather index
    showDayInfo( "#day4", data, 26 )   // display 4th day, pass in ID and weather index
    showDayInfo( "#day5", data, 34 )   // display 5th day, pass in ID and weather index

}


// get current day weather forecast
var showDayInfo = function( ulId, data, weatherIndex ) {
    var genericLi;
    var dateDisplay1;
    var dateDisplay2;
    var imgDisplay;
    var iconDisplayUrl = "http://openweathermap.org/img/wn/";
    var iconDisplay;
    var usDate;
    var showDate;
  
    dateDisplay1 = document.querySelector( ulId );

    genericLi = document.createElement("li");
    dateDisplay2 = data.list[weatherIndex].dt_txt.split(" ");

    dayOfWeek = moment(dateDisplay2[0]).format('dddd');

    // date format
    usDate = dateDisplay2[0].split("-");
    showDate = usDate[1] + "-" + usDate[2] + "-" + usDate[0] + ", " + dayOfWeek;
    genericLi.textContent = showDate;
    dateDisplay1.appendChild(genericLi);

    // display the weather icon
    genericLi = document.createElement("li");
    dateDisplay2 = data.list[weatherIndex].weather[0].icon;
    imgDisplay = document.createElement( "img" );
    iconDisplay = iconDisplayUrl + dateDisplay2 + "@2x.png";
    imgDisplay.setAttribute( "src", iconDisplay );
    genericLi.appendChild( imgDisplay );
    dateDisplay1.appendChild(genericLi);

    // display the weather description
    genericLi = document.createElement("li");
    dateDisplay2 = data.list[weatherIndex].weather[0].description;
    genericLi.textContent = "Looks like: " + dateDisplay2;
    dateDisplay1.appendChild(genericLi);

    // display the temperature
    genericLi = document.createElement("li");
    dateDisplay2 = data.list[weatherIndex].main.temp;
    genericLi.textContent = "Temperature: " + dateDisplay2 + " \xB0F";
    dateDisplay1.appendChild(genericLi);

    // display the humidity
    genericLi = document.createElement("li");
    dateDisplay2 = data.list[weatherIndex].main.humidity;
    genericLi.textContent = "Humidity: " + dateDisplay2;
    dateDisplay1.appendChild(genericLi);

}

// clear 5-day forecast
var empty5Days = function() {

    var ulItem;

    ulItem = document.querySelector( "#day1" );  
    ulItem.innerHTML = '' ;

    ulItem = document.querySelector( "#day2" );
    ulItem.innerHTML = '' ;

    ulItem = document.querySelector( "#day3" );
    ulItem.innerHTML = '' ;

    ulItem = document.querySelector( "#day4" );
    ulItem.innerHTML = '' ;

    ulItem = document.querySelector( "#day5" );
    ulItem.innerHTML = '' ;
}


// hold search history
var pushCity = function( city ) {

    var localCity = city.toUpperCase().trim();

    for( var i = 0; i < numPreviousCities; i++ ) {
        if( localCity === previousCities[i] ) {
            return;
        }
    }

    var maxIndex = Math.min(10, numPreviousCities);
    
    if (maxIndex) {
        for (var j = maxIndex; j > 0; j--) {
            previousCities[j] = previousCities[j - 1];
        }
    }

    previousCities[0] = localCity;
    numPreviousCities = Math.min( 10, ++numPreviousCities );

    // Update the city list on the page and save to local Storage.

    updateCityList();
    saveCityList();
}

// update with city result
var updateCityList = function() {

    var idValue;
    var displayItem;

    if( numPreviousCities == 0 ) {
        return;
    }

    var attributeName;
    for( var i = 0; i < numPreviousCities; i++ ) {
        idValue = "p" + i;
        displayItem = document.getElementById( idValue );
        displayItem.innerHTML = previousCities[i];
        displayItem.setAttribute( "previous", previousCities[i] );
    }
}
// store in local storage
var saveCityList = function() {

    localStorage.setItem( "cityCount", numPreviousCities );

    if (numPreviousCities > 0) {
        var key;
        for (var i = 0; i < numPreviousCities; i++) {
            key = "citiesForecast" + i;
            localStorage.setItem(key, previousCities[i] );
        }
    }
}

// load from local storage
var retrieveCityList = function() {

    numPreviousCities = localStorage.getItem( "cityCount" );

    if( numPreviousCities > 0 ) {
        var key;
        for( var i = 0; i < numPreviousCities; i++ ) {
            key = "citiesForecast" + i;
            previousCities[i] = localStorage.getItem( key );
        }
    }
    else {
        numPreviousCities = 0;
        previousCities = [];
    }

    if( numPreviousCities > 0 ) {
        updateCityList();
    }

}


var formSubmitHandler = function( event ) {
    event.preventDefault();

    var searchCity = cityNameEl.value.trim();
    var returnCode;

    if( searchCity ) {
        getCityWeather( searchCity );
        cityNameEl.value = "";
    }
    else {
        alert( "Please enter a City name to search for." );
    }

    if( returnValue < 0 ) {
        alert( "Invalid city name, please re-specify." );
    }
}

var buttonCityClickHandler = function( event ) {

    var cityName = event.target.getAttribute( "previous" );

    getCityWeather( cityName );

}

var buttonClearStackHandler = function () {

    if (numPreviousCities > 0) {
        var key;
        for (var i = 0; i < numPreviousCities; i++) {
            key = "citiesForecast" + i;
            localStorage.removeItem(key);
        }
    }

    for (var i = 0; i < numPreviousCities; i++) {
        idValue = "p" + i;
        displayItem = document.getElementById(idValue);
        displayItem.innerHTML = " ";
    }

    localStorage.removeItem("cityCount");
    numPreviousCities = 0;
}

userCitySearchEl.addEventListener( "submit", formSubmitHandler );
cityButtonsEl.addEventListener( "click", buttonCityClickHandler );
clearButtonEl.addEventListener( "click", buttonClearStackHandler );

retrieveCityList();