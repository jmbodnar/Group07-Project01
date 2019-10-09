//***********************************V A R I A B L E S***************************************************************** */

var latitude;
var longitude;

//********************************************E N D _ _ _ O F _ _ _ V A R I A B L E S********************************** */

// ************************************G E O L O C A T I O N _ _ _ C O D E *******************************************************
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(position => {
    console.log(position);
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
  });
  /* geolocation is available */
} else {
  // example http://open.mapquestapi.com/geocoding/v1/address?key=KEY&location=1600+Pennsylvania+Ave+NW,Washington,DC,20500
  $.ajax(
    'https://open.mapquestapi.com/geocoding/v1/address?key=hCje36DnsPrbL6oI4rXEVFDlZDB6HxPLhCje36DnsPrbL6oI4rXEVFDlZDB6HxP&location=1600+Pennsylvania+Ave+NW,Washington,DC,20500'
  ).then(function (data) {
    console.log(data);
  });

  /* geolocation IS NOT available */
  // render the city/state input
}

// **************************************E N D _ _ _ O F _ _ G E O L O C A T I O N _ _ C O D E*****************************************

//*********************************M A P Q U E S T _ _ A P I _ _ C O D E ************************************************** */

$.ajax(
  'https://open.mapquestapi.com/geocoding/v1/address?key=hCje36DnsPrbL6oI4rXEVFDlZDB6HxPL&location=1600+Pennsylvania+Ave+NW,Washington,DC,20500'
).then(function (data) {
  console.log('ajax', data.results[0].locations[0].latLng);
  let latLng = data.results[0].locations[0].latLng;
  latitude = latLng.lat;
  longitude = latLng.lng;

  $('body').append(`<h1>${latitude}</h1><h2>${longitude}</h2>`);
});

//   added w3 schools code
var x = document.getElementById('lat');

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    // x.innerHTML = "Geolocation is not supported by this browser.";
    console.log('hello');
  }
}

function showPosition(position) {
  x.innerHTML =
    'Latitude: ' +
    position.coords.latitude +
    '<br>Longitude: ' +
    position.coords.longitude;
  console.log(position.coords.latitude);
  console.log(position.coords.longitude);
}
getLocation();

// *******************************************D R I N K _ _ A P I _ _ C O D E ****************************************************

// var mildIngredient = ["grape", "lime", "lemon", "orange"];
// var coldIngredient = ["cinnamon", "cider", "coffee", "vanilla"];
// var hotIngredient = ["mango", "pineapple", "strawberries", "banana"];
// var ingredient = apple;
var queryURL =
  'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=coffee';

$.ajax({
  url: queryURL,
  method: 'GET'
}).then(function (response) {
  console.log(response);
  var results = response.drinks;
  // console.log(results);

  var htmlString = '';

  for (let d = 0; d < results.length; d++) {
    var drinkName = results[d].strDrink;
    var drinkImage = results[d].strDrinkThumb;
    var drinkID = results[d].idDrink;
    var ingredientsURL = "https://www.thecocktaildb.com/drink.php?c=" + drinkID;


    htmlString += `
        <div class="drink-card">
        <div class="drink-card__header">${drinkName}</div>
        <div class="drink-card__body">
            <img
              src="${drinkImage}"
              alt="drink"
              class="drink-card__image"
            />
          <div>
          <a href="${ingredientsURL}" target="_blank">Drink Me</a>
    
          </div>
        </div>
      </div>
        `;
  }

  $('.drinks').html(htmlString);

  // var nameOfDrink = $("<h3>").text(drinkName)
  // $(".drink-card__header").append(nameOfDrink);

  // var image = $("<img>");
  // image.attr("src", results[d].strDrinkThumb);

  // $(".drink-image").append(image);
});

// ********************************************O N - C L I C K _ _ F U N C T I O N S

$('#userSubmit').on('click', function () { });
$('#geoSubmit').on('click', function () {
  getLocation();
});
$('#chuck').on('click', function () { });

// ===== Jon's Form Stuff ===== //

// ----- Functions ----- //

function getCityWeather(event) {
  var city = event.target.city.value.trim().toLowerCase();

  if (!city) {
    alert('You need a city');
    return;
  }

  var queryString = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=9d43fd3ba9edb19355aa0760b84ba2f2`;

  $.ajax({
    url: queryString,
    method: 'GET'
  }).then(function (response) {
    var c = response.main.temp;
    var f = Math.round((c - 273.15) * 1.8 + 32);
    console.log('Fahrenheit in', city, 'is', f);

    updateLocationDetails(city, f);
    return f;
  });
}

function updateLocationDetails(city, temp) {
  var cityName = document.querySelector('#city-name');
  var currentTemp = document.querySelector('#current-temp');

  cityName.textContent = city;
  currentTemp.textContent = temp;

}

// ----- Listeners and Initializations ----- //

document.addEventListener('submit', getCityWeather, false);
