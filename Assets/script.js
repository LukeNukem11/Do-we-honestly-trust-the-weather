const API_KEY = "ff020f39c3028a28ea52a76a8978508a";

function fetchWeatherData(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${API_KEY}&units=metric`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => data.daily)
    .catch((error) => console.log(error));
}

function getCoordinates(city, state, country) {
  let url = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&appid=${API_KEY}`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        console.log(data);
        return { lat, lon };
      } else {
        throw new Error(
          "Unable to retrieve coordinates for the specified location."
        );
      }
    })
    .catch((error) => console.log(error));
}

function displayForecast(forecastData) {
  const forecastContainer = document.getElementById("forecastContainer");
  forecastContainer.innerHTML = "";

  forecastData.forEach((day) => {
    const date = new Date(day.dt * 1000);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    const temperature = day.temp.day;
    const description = day.weather[0].description;
    const icon = day.weather[0].icon;

    const forecastItem = document.createElement("div");
    forecastItem.classList.add("forecast-item");

    forecastItem.innerHTML = `
      <div class="day">${dayName}</div>
      <div class="icon"><img src="http://openweathermap.org/img/wn/${icon}.png" alt="${description}" /></div>
      <div class="temperature">${temperature}°C</div>
      <div class="description">${description}</div>
    `;

    forecastContainer.appendChild(forecastItem);
  });
}

const locationForm = document.getElementById("locationForm");
locationForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const cityInput = document.getElementById("cityInput").value;
  const stateInput = document.getElementById("stateInput").value;

  getCoordinates(cityInput, stateInput)
    .then((coordinates) => {
      const { lat, lon } = coordinates;

      fetchWeatherData(lat, lon)
        .then((forecastData) => {
          displayForecast(forecastData);
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
});
