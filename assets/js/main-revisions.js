// ----- Functions ----- //

// Fetch, parse JSON data
async function getJSON(url, settings) {
  return await (await fetch(url, settings)).json();
}

// Use temperature to pull random drink ingredient suitable for temperature
function getDrinkIngredient(temp) {
  var coldIngredients = ['cinnamon', 'cider', 'coffee', 'vanilla'];
  var mildIngredients = ['grape', 'lime', 'lemon', 'orange'];
  var hotIngredients = ['mango', 'pineapple', 'strawberries', 'banana'];

  if (temp <= 40) {
    return coldIngredients[Math.floor(Math.random() * coldIngredients.length)];
  }

  if (temp <= 60) {
    return mildIngredients[Math.floor(Math.random() * mildIngredients.length)];
  }

  return hotIngredients[Math.floor(Math.random() * hotIngredients.length)];
}

// Convert celcius to fahrenheit
function celToFah(c) {
  var f = Math.round((c - 273.15) * 1.8 + 32);
  return f;
}

// Display city, temp
function updateLocationDetails(city, temp) {
  var cityName = document.querySelector('#city-name');
  var currentTemp = document.querySelector('#current-temp');

  cityName.textContent = city;
  currentTemp.textContent = temp;
}

// Build, Display Cards
function makeDrinkCards(results) {
  var drinkCardsHTML = '';

  results.drinks.forEach(drink => {
    var drinkName = drink.strDrink;
    var drinkImage = drink.strDrinkThumb;
    var ingredientsURL = `https://www.thecocktaildb.com/drink.php?c=${drink.idDrink}`;

    drinkCardsHTML += `
    <div class="drink-card">
    <div class="drink-card__header">${drinkName}</div>
    <div class="drink-card__body">
        <img
          src="${drinkImage}"
          alt="drink"
          class="drink-card__image"
        />
      <div>
      <a class="drink-card__link" href="${ingredientsURL}" target="_blank">Drink Me <i class="fa fa-external-link"></i></a>

      </div>
    </div>
  </div>`;
  });

  document.querySelector('.drinks').innerHTML = drinkCardsHTML;
}

function getUserWeather() {
  navigator.geolocation.getCurrentPosition(position => {
    var { latitude, longitude } = position.coords;

    var queryString = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=9d43fd3ba9edb19355aa0760b84ba2f2`;

    getJSON(queryString).then(response => {
      var city = response.name;
      var c = response.main.temp;
      var f = celToFah(c);

      updateLocationDetails(city, f);

      var ingredient = getDrinkIngredient(f);

      var drinkURL = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`;

      getJSON(drinkURL).then(response => {
        makeDrinkCards(response);
      });
    });
  });
}

// Handle form submission...still needs to handle fetching and updating drink
// cards appropriately
function handleCityForm(event) {
  var city = event.target.city.value.trim().toLowerCase();

  if (!city) {
    alert('You need a city');
    return;
  }

  var weatherQuery = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=9d43fd3ba9edb19355aa0760b84ba2f2`;

  getJSON(weatherQuery).then(response => {
    var c = response.main.temp;
    var f = celToFah(c);
    updateLocationDetails(city, f);

    var ingredient = getDrinkIngredient(f);

    var drinkURL = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`;

    getJSON(drinkURL).then(response => {
      makeDrinkCards(response);
    });
  });

  event.target.reset();
}

function handleLocationButton(event) {
  if (event.target.matches('#location-button')) {
    getUserWeather();
  }
}

// ----- Inits & Listeners ----- //

document.addEventListener('submit', handleCityForm, false);

document.addEventListener('click', handleLocationButton, false);
