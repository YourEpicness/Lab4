"require strict";

const form = document.querySelector(".form");
const locBtn = document.querySelector("#find-me");
const forecast = document.querySelector(".forecast");
const forecastTitle = document.querySelector(".forecast-title");
const days = document.querySelector(".info");
const seven_days = document.querySelector(".seven-day");

const apiUrl = "https://weatherdbi.herokuapp.com/data/weather";
let apiUrlLatLong = "empty";
const errorText = document.querySelector(".error");
const loc = navigator.geolocation;
let createdDashboard = false;
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
  if (!createdDashboard) {
    createCompleteForecast(data);
  }
  console.log(data);
};

const createCompleteForecast = (data) => {
  const { region, next_days, currentConditions } = data;
  const { humidity, dayhour, temp, wind, comment, iconURL, precip } =
    currentConditions;

  const dayInfo = createForecastElement(
    region,
    dayhour,
    temp,
    precip,
    humidity,
    comment,
    iconURL,
    wind
  );
  const predictDayInfo = createForecastPrediction(next_days);

  createForecastDashboard(region);
  days.appendChild(dayInfo);
  seven_days.appendChild(predictDayInfo);
  createdDashboard = true;
};

const handleLocation = async (e) => {
  const infoPos = await loc.getCurrentPosition(success, error);
};

const createForecastDashboard = (region) => {
  forecastTitle.innerHTML = "Weather forecast for " + region;
};

const createForecastPrediction = (next_days) => {
  const article = document.createElement("article");

  next_days.forEach((day) => {
    const h2_tag = document.createElement("h2");
    const p_tag = document.createElement("p");
    const p_tag_2 = document.createElement("p");
    const p_tag_3 = document.createElement("p");
    const img = document.createElement("img");

    h2_tag.innerHTML = day.day;
    p_tag.innerText = day.comment;
    p_tag_2.innerText = `${day.max_temp.f}\u00B0 F/${day.max_temp.c}\u00B0 C`;
    p_tag_3.innerText = `${day.min_temp.f}\u00B0 F/${day.min_temp.c}\u00B0 C`;
    img.src = day.iconURL;

    article.appendChild(h2_tag);
    article.appendChild(p_tag);
    article.appendChild(p_tag_2);
    article.appendChild(p_tag_3);
    article.appendChild(img);
  });
  return article;
};

const createForecastElement = (
  region,
  day,
  temp,
  precip,
  humidity,
  comment,
  iconURL,
  wind
) => {
  const article = document.createElement("article");
  const h2_tag = document.createElement("h2");
  const p_tag = document.createElement("p");
  const p_tag_2 = document.createElement("p");
  const p_tag_3 = document.createElement("p");
  const img = document.createElement("img");

  //   const infoTags = [day, temp, precip, humidity];
  //   infoTags.forEach((tag) => {
  //     if (typeof tag !== "object") {
  //       console.log(tag);
  //       const p = document.createElement("p");
  //       p.innerText = tag;
  //       article.appendChild(p);
  //     }
  //   });

  h2_tag.innerText = day;
  p_tag.innerText = `${temp.f}\u00B0 F/${temp.c}\u00B0 C`;
  p_tag_2.innerText = "Precipitation:" + precip;
  p_tag_3.innerText = "Humidity:" + humidity;
  p_tag_3.innerText += "\n" + comment;
  img.src = iconURL;
  p_tag_3.innerText += "\n" + wind.km + " KM/" + wind.mile + " M";

  article.appendChild(h2_tag);
  article.appendChild(p_tag);
  article.appendChild(p_tag_2);
  article.appendChild(p_tag_3);
  article.appendChild(img);

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

  createCompleteForecast(data);
  return data;
}

function error() {
  alert("Unable to retrieve location");
}

form.addEventListener("submit", handleForm);
locBtn.addEventListener("click", handleLocation);
