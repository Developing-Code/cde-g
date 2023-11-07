
const zoom = 18;
// co-ordinates
const lat = 52.22977;
const lng = 21.01178;

const $latloguser = document.querySelector("#latloguser");
const $lat = document.querySelector("#lat");
const $log = document.querySelector("#log");
const $temperatura = document.querySelector("#temperatura");
const $humedad = document.querySelector("#humedad");

let globalMarker;


// calling map
let map = L.map('map').setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);



map.locate({
  // https://leafletjs.com/reference-1.7.1.html#locate-options-option
  setView: true,
  enableHighAccuracy: true,
})
  // if location found show marker and circle
  .on("locationfound", (e) => {
    console.log(e);

    $latloguser.value = `${e.latitude},${e.longitude}`;
    $lat.value = `${e.latitude}`;
    $log.value = `${e.longitude}`;
    // marker


    const initialCoordinates = [e.latitude,e.longitude];

    if (!globalMarker) {
      globalMarker = L.marker(initialCoordinates, { draggable: true, autoPan: true, }).addTo(map);
    } else {
      globalMarker.setLatLng(initialCoordinates);
    }

    map.setView(initialCoordinates, 14);

    // add circle

    globalMarker.on("dragend", function (e) {
      
      $latloguser.value = `${globalMarker.getLatLng().lat},${globalMarker.getLatLng().lng
        }`;
      $lat.value = `${globalMarker.getLatLng().lat}`;
      $log.value = `${globalMarker.getLatLng().lng}`;
    });





    const apiKey = 'b3ce49c209ac946d3940e0ea82f41940';

    // URL de la API de OpenWeatherMap
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${e.latitude}&lon=${e.longitude}&appid=${apiKey}&units=metric`;

    // Realiza la solicitud a la API solo si el campo de ubicación no está vacío

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        $temperatura.value = `${data.main.temp}`;
        $humedad.value = `${data.main.humidity}`;
        // Procesa los datos y muestra la información en la página
        const weatherData = document.getElementById('weatherData');
        weatherData.innerHTML = `
           <h3>Información del Clima para ${data.name}, ${data.sys.country}</h3>
           <p>Temperatura: ${data.main.temp}°C</p>
           <p>Humedad: ${data.main.humidity}%</p>
           <p>Descripción: ${data.weather[0].description}</p>
       `;
      })
      .catch(error => {
        console.error('Error al obtener datos meteorológicos', error);
      });

  })
  // if error show alert
  .on("locationerror", (e) => {
    console.log(e);
    alert("Location access denied.");
  });




function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};



function locateAddress() {
  const address = document.getElementById('address').value;
  if (address.length < 3) return;  // Opcional: solo busca si hay 3 o más caracteres.

  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?country=CO&access_token=pk.eyJ1IjoiYWxlam9kYzQxMiIsImEiOiJjbGhmY3dsMXQxdHhzM3BvNzh6ajJmMzJtIn0.NyPkV_a02zVnTaJckeDROw`)
    .then(response => response.json())
    .then(data => {
      const suggestionsDiv = document.getElementById('suggestions');
      suggestionsDiv.innerHTML = '';  // Limpia las sugerencias anteriores.

      data.features.forEach(feature => {
        const div = document.createElement('div');
        div.textContent = feature.place_name;
        div.onclick = () => {  // Al hacer clic en una sugerencia, ubícala en el mapa.
          const coordinates = data.features[0].geometry.coordinates;
          const latLng = [coordinates[1],coordinates[0]];
          $latloguser.value = [coordinates[1],coordinates[0]];
          $lat.value = [coordinates[1]];
          $log.value = [coordinates[0]];
          suggestionsDiv.innerHTML = '';

          if (!globalMarker) {
            globalMarker = L.marker(latLng).addTo(mymap);
          } else {
            globalMarker.setLatLng(latLng);
          }
          map.setView(latLng, 14);

          globalMarker.on("dragend", function (e) {
            $latloguser.value = `${globalMarker.getLatLng().lat},${globalMarker.getLatLng().lng
              }`;
            $lat.value = `${globalMarker.getLatLng().lat}`;
            $log.value = `${globalMarker.getLatLng().lng}`;
          });

        };
        suggestionsDiv.appendChild(div);
      });
    });
}

const debouncedLocate = debounce(locateAddress, 300);  // Debounce de 300ms.
