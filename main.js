import { ICON_MAP } from "./iconmap.js";
import listCities from "./listCities.js";


const header = document.getElementById('header')
const dayText = document.getElementById('day-text')
const daySection = document.getElementById('day-section')
const cityText = document.getElementById('city-text')
const hourSection = document.getElementById('hour-section')
const displayDiv = document.getElementById('display-div')



const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const searchInput = document.getElementById('search-input')
const searchButton = document.getElementById('search-button')

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    console.log("Searching", searchInput.value)
    listCities(searchInput.value)
    searchInput.value = ''
    header.classList.add('hidden')
    daySection.classList.add('hidden')
    dayText.classList.add('hidden')
    cityText.classList.add('hidden')
    hourSection.classList.add('hidden')
    displayDiv.classList.remove('hidden')
  }
})

searchButton.addEventListener('click', (e) => {
  console.log("Searching", searchInput.value)
  listCities(searchInput.value)
  searchInput.value = ''
  header.classList.add('hidden')
  daySection.classList.add('hidden')
  dayText.classList.add('hidden')
  cityText.classList.add('hidden')
  hourSection.classList.add('hidden')
  displayDiv.classList.remove('hidden')
})

const d = new Date();
let day = weekday[d.getDay()];
const dayElement = document.getElementById("day-text");
dayElement.innerText = day;

const currentIcon = document.getElementById("current-icon");

function setCity(data) {
  console.log(data.city);
  const city = document.getElementById("city");
  const province = document.getElementById("province");
  city.innerText = data.city;
  province.innerText = data.province;
}

// setCity(currentCity);

function getIconUrl(code) {
  return `icons/${ICON_MAP.get(code)}.svg`;
}

function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value;
}

function renderCurrentWeather(current) {
  console.log(currentIcon);
  console.log(current, "Icon Code")
  currentIcon.src = getIconUrl(current.iconCode);
  setValue("current-temp", current.currentTemp);
  setValue("current-high", current.highTemp);
  setValue("current-low", current.lowTemp);
  setValue("current-fl-high", current.highFeelsLike);
  setValue("current-fl-low", current.lowFeelsLike);
  setValue("current-wind", current.windSpeed);
  setValue("current-precip", current.precip);
}

const DAY_FORMATER = new Intl.DateTimeFormat(undefined, { weekday: "long" });
const dailySection = document.querySelector("[data-day-section]");
const dayCardTemplate = document.getElementById("day-card-template");

function renderDailyWeather(daily) {
  daily.shift();
  dailySection.innerHTML = "";
  daily.forEach((day) => {
    const element = dayCardTemplate.content.cloneNode(true);
    setValue("temp", day.highTemp, { parent: element });
    setValue("date", DAY_FORMATER.format(day.timestamp), { parent: element });
    element.querySelector("[data-icon]").src = getIconUrl(day.iconCode);
    dailySection.append(element);
  });
}

const HOUR_FORMATER = new Intl.DateTimeFormat(undefined, { hour: "numeric" });
const hourlySection = document.querySelector("[data-hour-section]");
const hourRowTemplate = document.getElementById("hour-row-template");
function renderHourlyWeather(hourly) {
  hourlySection.innerHTML = "";
  hourly.forEach((hour) => {
    const element = hourRowTemplate.content.cloneNode(true);
    setValue("temp", hour.temp, { parent: element });
    setValue("fl-temp", hour.feelsLike, { parent: element });
    setValue("wind", hour.windSpeed, { parent: element });
    setValue("precip", hour.precip, { parent: element });
    setValue("day", DAY_FORMATER.format(hour.timestamp), { parent: element });
    setValue("time", HOUR_FORMATER.format(hour.timestamp), { parent: element });
    element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode);
    hourlySection.append(element);
  });
}

export function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);

  header.classList.remove('hidden')
  daySection.classList.remove('hidden')
  dayText.classList.remove('hidden')
  cityText.classList.remove('hidden')
  hourSection.classList.remove('hidden')
  displayDiv.classList.add('hidden')

}
