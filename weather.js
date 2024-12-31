function parseCurrentWeather({ current, daily }) {
  return {
    currentTemp: Math.round(current.temperature_2m),
    highTemp: Math.round(daily.temperature_2m_max[0]),
    lowTemp: Math.round(daily.temperature_2m_min[0]),
    highFeelsLike: Math.round(daily.apparent_temperature_max[0]),
    lowFeelsLike: Math.round(daily.apparent_temperature_min[0]),
    windSpeed: Math.round(current.wind_speed_10m),
    precip: daily.precipitation_sum[0],
    iconCode: daily.weather_code[0],
  };
}
function parseDailyWeather({ daily }) {
  return daily.time.map((time, index) => {
    return {
      timestamp: time * 1000,
      iconCode: daily.weather_code[index],
      highTemp: Math.round(daily.temperature_2m_max[index]),
    };
  });
}
function parseHourlyWeather({ hourly, current }) {
  return hourly.time
    .map((time, index) => {
      return {
        timestamp: time * 1000,
        iconCode: hourly.weather_code[index],
        temp: Math.round(hourly.temperature_2m[index]),
        feelsLike: Math.round(hourly.apparent_temperature[index]),
        windSpeed: Math.round(hourly.wind_speed_10m[index]),
        precip: Math.round(hourly.precipitation[index]),
      };
    })
    .filter(({ timestamp }) => timestamp >= current.time * 1000);
}

export async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&timeformat=unixtime&timezone=auto`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    let data = {
      current: parseCurrentWeather(json),
      daily: parseDailyWeather(json),
      hourly: parseHourlyWeather(json),
    };
    console.log("Parsed JSON", data);
    return data;
  } catch (error) {
    console.error("Error in getWeather function ", error.message);
  }
}

export function getPosition(lat, lon) {
  console.log(lat, lon)
}
