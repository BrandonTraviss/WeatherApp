import { renderWeather } from "./main.js";
import { getWeather } from "./weather.js";
const cityNameText = document.getElementById('city')
const provinceNameText = document.getElementById('province')

const displayDiv = document.getElementById('display-div')


function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

async function filterResults(array, name) {
    displayDiv.innerHTML = ''
    let cityName = name.toLowerCase()
    console.log(cityName)
    cityName = capitalizeFirstLetter(cityName)
    array.forEach(city => {
        if (city.name === cityName) {
            console.log(city)
            let div = document.createElement('div')
            let cityEle = document.createElement('p')
            let province = document.createElement('p')
            let country = document.createElement('p')
            let flag = document.createElement('img')

            cityEle.innerHTML = city.name + ', ' + '&nbsp;'
            province.innerHTML = city.admin1 + ',' + '&nbsp;'
            country.innerText = city.country
            flag.src = `https://flagsapi.com/${city.country_code}/shiny/64.png`
            flag.classList.add('ml-1')
            div.appendChild(cityEle)
            div.appendChild(province)
            div.appendChild(country)
            div.appendChild(flag)
            div.classList.add('flex-row')
            console.log(div)
            div.addEventListener('click', async () => {
                let data = await getWeather(city.latitude, city.longitude)
                cityNameText.innerText = city.name
                provinceNameText.innerText = city.admin1
                renderWeather(data)
                window.scrollTo(0, 0)
            })
            displayDiv.appendChild(div)
        }
        else {
            return
        }
    })
}

export default async function listCities(name) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=50&language=en&format=json`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        console.log(json.results)
        filterResults(json.results, name)
        return json
    } catch (error) {
        console.error(error.message);
    }
}