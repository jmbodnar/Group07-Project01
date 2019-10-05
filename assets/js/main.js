var latitude;
var longitude;


if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position)=>
    {console.log(position)
        latitude=position.coords.latitude
        longitude=position.coords.longitude
    })
    /* geolocation is available */
  } else {
      // example http://open.mapquestapi.com/geocoding/v1/address?key=KEY&location=1600+Pennsylvania+Ave+NW,Washington,DC,20500
      $.ajax("http://open.mapquestapi.com/geocoding/v1/address?key=hCje36DnsPrbL6oI4rXEVFDlZDB6HxPLhCje36DnsPrbL6oI4rXEVFDlZDB6HxP&location=1600+Pennsylvania+Ave+NW,Washington,DC,20500").then(function(data){
          console.log(data)
      })
      
      /* geolocation IS NOT available */
      // render the city/state input
    }
                  $.ajax("http://open.mapquestapi.com/geocoding/v1/address?key=hCje36DnsPrbL6oI4rXEVFDlZDB6HxPL&location=1600+Pennsylvania+Ave+NW,Washington,DC,20500").then(function(data){
                      console.log("ajax",data.results[0].locations[0].latLng)
                      let latLng= data.results[0].locations[0].latLng
                      latitude= latLng.lat
                      longitude= latLng.lng

                      $('body').append(`<h1>${latitude}</h1><h2>${longitude}</h2>`)
                  })


                //   added w3 schools code 
                  var x = document.getElementById("lat");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    // x.innerHTML = "Geolocation is not supported by this browser.";
    console.log("hello");
  }
}

function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude + 
  "<br>Longitude: " + position.coords.longitude;
  console.log(position.coords.latitude)
  console.log(position.coords.longitude);

}
getLocation();
 
                  

                 