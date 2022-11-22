"require strict";

const form = document.querySelector(".form");
const locBtn = document.querySelector("#find-me");
const forecast = document.querySelector(".forecast");
const forecastTitle = document.querySelector(".forecast-title");
const days = document.querySelector(".info");

const apiUrl = "https://weatherdbi.herokuapp.com/data/weather";
let apiUrlLatLong = "empty";
const errorText = document.querySelector(".error");
const loc = navigator.geolocation;

const getWeatherDataCity = async (city) => {
  const res = await fetch(`${apiUrl}/${city}`);

  return res.json();
};

const getWeatherLatLong = async (lat, long) => {
  const res = await fetch(`${apiUrl}/${lat},${long}`);

  return res.json();
};

const handleForm = async (e) => {
  e.preventDefault();
  const data = await getWeatherDataCity(e.target.city.value);
  const { region, next_days, currentConditions } = data;
  const { humidity, dayhour, temp, wind, comment, iconURL } = currentConditions;
  createForecastDashboard(region);
  createForecastElement(region, dayhour);
  console.log(data);
};

const handleLocation = async (e) => {
  const infoPos = await loc.getCurrentPosition(success, error);
};

const createForecastDashboard = (region) => {
  forecastTitle.innerHTML = "Weather forecast for " + region;
};

const createForecastElement = (region, day, temp) => {
  const article = document.createElement("article");
  const h2_tag = document.createElement("h2");
  const p_tag = document.createElement("p");

  h2_tag.innerText = day;
  p_tag.innerText = `${temp.f}\u00B0 F/${temp.c}\u00B0 C`;

  article.appendChild(h2_tag);
  article.appendChild(p_tag);
  return article;
};

async function success(position) {
  console.log(
    "Results retrieved successfully:",
    position.coords.latitude,
    position.coords.longitude
  );

  apiUrlLatLong = `https://weatherdbi.herokuapp.com/data/weather/${position.coords.latitude},${position.coords.longitude}`;
  const data = await getWeatherLatLong(
    position.coords.latitude,
    position.coords.longitude
  );
  console.log(data);

  const { region, next_days, currentConditions } = data;
  const { humidity, dayhour, temp, wind, comment, iconURL } = currentConditions;
  createForecastDashboard(region);
  const dayInfo = createForecastElement(region, dayhour, temp);
  days.appendChild(dayInfo);
  return data;
}

function error() {
  alert("Unable to retrieve location");
}

form.addEventListener("submit", handleForm);
locBtn.addEventListener("click", handleLocation);
