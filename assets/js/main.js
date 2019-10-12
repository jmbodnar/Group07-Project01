$(document).ready(function() {
  // -----FUNCTIONS----- //

  async function getJSON(url, settings) {
    return await (await fetch(url, settings)).json();
  }

  // Use temperature to pull random drink ingredient based on temperature //
  function getDrinkIngredient(temp) {
    var coldIngredients = ["cinnamon", "cider", "coffee", "vanilla"];
    var mildIngredients = ["grape", "line", "lemon", "orange"];
    var hotIngredients = ["mango", "pineapple", "strawberries", "banana"];

    if (temp <= 40) {
      return coldIngredients[
        Math.floor(Math.random() * coldIngredients.length)
      ];
    }

    if (temp <= 60) {
      return mildIngredients[
        Math.floor(Math.random() * mildIngredients.length)
      ];
    }

    return hotIngredients[Math.floor(Math.random() * hotIngredients.length)];
  }

  // convert kelvin to fahrenheit
  function kelToFah(c) {
    var f = Math.round((c - 273.15) * 1.8 + 32);
    return f;
  }

  // Display city, temp //
  function updateLocationDetails(city, temp) {
    //var cityName = document.querySelector("#city-name");
    var cityName = $("#city-name");
    // var currentTemp = document.querySelector("#current-temp");
    var currentTemp = $("#current-temp");

    //cityName.textContent = city;
    cityName.text(city);
    // currentTemp.textContent = temp;
    currentTemp.text(temp);
  }

  // Build Drink Display Cards //
  function makeDrinkCards(results) {
    var drinkCardsHTML = "";

    // Array.forEach(callback) method loops through each element in an array and executes the callback on it
    // Arrow method syntax ( (prop) => {}) operates in this context like a regular method call (function(prop) {})
    results.drinks.forEach(drink => {
      var drinkName = drink.strDrink;
      var drinkImage = drink.strDrinkThumb;
      var ingredientsURL = `https://www.thecocktaildb.com/drink.php?c=${drink.idDrink}`;
      //the $ below is not jQuery, it is template literals, which allow making strings out of variables and expressions
      drinkCardsHTML += `
    <div class="drink-card">
    <div clas="drink-card__header">${drinkName}</div>
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
    // document.querySelector(".drinks").innerHTML = drinkCardsHTML;
    $(".drinks").html(drinkCardsHTML);
  }

  function getUserWeather() {
    // Another use of arrow function syntax: const methodName = (prop) => { // code here}
    navigator.geolocation.getCurrentPosition(position => {
      //object destructuring lat and long from coords
      // Pull the latitude and longitude varaibles from position.coords object and assign them...
      //  to the variables latitude and longitude at this level
      var { latitude, longitude } = position.coords;

      var queryString = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=9d43fd3ba9edb19355aa0760b84ba2f2`;

      getJSON(queryString).then(response => {
        //basically an ajax call
        var city = response.name;
        var k = response.main.temp;
        var f = kelToFah(k);
        getNumberFact(f);

        updateLocationDetails(city, f);

        var ingredient = getDrinkIngredient(f);
        var drinkURL = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`;

        getJSON(drinkURL).then(response => {
          makeDrinkCards(response);
        });
      });
    });
  }

  function getNumberFact(stringToAppend) {
    if (!stringToAppend) {
      var month = new Date().getMonth() + 1;
      var day = new Date().getDate();
      var numbersApiURL = `http://numbersapi.com/${month}/${day}`;
    } else {
      var numbersApiURL = `http://numbersapi.com/${stringToAppend}`;
    }
    $.ajax({
      url: numbersApiURL,
      method: "Get"
    }).then(function(response) {
      console.log(response);
      $(".alert").remove();
      var numberDiv = $("<div>");
      numberDiv.addClass("alert alert-dark my-5");

      $(".drinks").after(numberDiv);
      $(".alert").text(response);
    });
  }

  // Process form submssion //
  function handleCityForm(event) {
    var city = event.target.city.value.trim().toLowerCase();
    event.preventDefault();

    // For form checking, if no data entered or if empty string, replace with dissmissable alert
    // Also, consider doing this for cases where city name entered doesn't exist or doens't result in information back from openweather api
    if (!city) {
      alert("You need a city"); //TODO remove alert
      return;
    }

    var weatherQuery = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=9d43fd3ba9edb19355aa0760b84ba2f2`;

    getJSON(weatherQuery).then(response => {
      var k = response.main.temp;
      var f = kelToFah(k);
      updateLocationDetails(city, f);

      getNumberFact(f);

      var ingredient = getDrinkIngredient(f);
      var drinkURL = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`;

      getJSON(drinkURL).then(response => {
        makeDrinkCards(response);
      });
    });

    event.target.reset();
  }

  function handleLocationButton(event) {
    if (event.target.matches("#location-button")) {
      getUserWeather();
    }
  }

  // function getChuckStuff() {
  //   var queryString = `https://api.chucknorris.io/jokes/random?category=food`;
  //   $.ajax({
  //     url: queryString,
  //     method: "GET"
  //   }).then(function(response) {
  //     var saying = response.value;
  //     var chuckDiv = $("<div>");
  //     chuckDiv.addClass("alert alert-dark my-5");

  //     $(".drinks").after(chuckDiv);
  //     $(".alert").text(saying);
  //     //  alert(saying);
  //   });
  // }

  // ----- Start Up and Event Listeners ----- //
  // document.addEventListener("submit", handleCityForm, false);
  $(document).on("submit", handleCityForm);

  // document.addEventListener("click", handleLocationButton, false);
  $(document).on("click", handleLocationButton);

  getNumberFact();
});
