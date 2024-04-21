const cityInput = document.getElementById('city_input');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const currentWeatherCard = document.querySelectorAll('.weather-left .card')[0];
const fiveDaysForecastCard = document.querySelector('.day-forecast');
const sunriseCard = document.querySelectorAll('.highlights .card')[0];
const humidityValue = document.getElementById('humidityVal');
const pressureValue = document.getElementById('pressureVal');
const visibilityValue = document.getElementById('visibilityVal');
const windspeedValue = document.getElementById('windspeedVal');
const feelsValue = document.getElementById('feelsVal');
const hourlyForecastCard = document.querySelector('.hourly-forecast');


// API key for OpenWeatherMap API
const api_key = '2f50eabec0d0a670d089e8c38253a7c2';

function getWeatherDetails(name, lat, lon, country, state) {
    const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;

    days = [ 
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ],
    months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];

    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
        const date = new Date();
        currentWeatherCard.innerHTML = `
            <div class="current-weather">
                <div class="details">
                    <p>Now</p>
                    <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                    <p>${data.weather[0].description}</p>
                </div> 
                <div class="weather-icon">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                </div>
            </div>
            <hr>
            <div class="card-footer">
                <p><i class="fa-light fa-calendar"></i> ${days[date.getDay()]}, ${date.getDate()},
                ${months[date.getMonth()]} ${date.getFullYear()}</p>
                <p><i class="fa-regular fa-location-dot"></i> ${name}, ${country}</p>
            </div>        
        `;

        const {sunrise, sunset} = data.sys;
        const {timezone, visibility} = data;
        const {humidity, pressure, feels_like} = data.main;
        const {speed} = data.wind;
        const sRiseTime = moment.utc(sunrise,'X').add(timezone, 'seconds').format('hh:mm A');
        const sSetTime = moment.utc(sunset,'X').add(timezone, 'seconds').format('hh:mm A');
        sunriseCard.innerHTML = `
            <div class="card-head">
                <p>Sunrise & Sunset</p>
            </div>
            <div class="sunrise-sunset">
                <div class="item">
                    <div class="icon">
                        <i class="fa-light fa-sunrise fa-4x"></i>
                    </div>
                    <div>
                        <p>Sunrise</p>
                        <h2>${sRiseTime}</h2>
                    </div>
                </div>
                <div class="item">
                    <div class="icon">
                        <i class="fa-light fa-sunrise fa-4x"></i>
                    </div>
                    <div>
                        <p>Sunset</p>
                        <h2>${sSetTime}</h2>
                    </div>
                </div>
            </div>
        `; 
 
        humidityValue.innerHTML = `${humidity}%`; 
        pressureValue.innerHTML = `${pressure}hPa`;
        visibilityValue.innerHTML = `${visibility / 1000}km`; 
        windspeedValue.innerHTML = `${speed}m/s`; 
        feelsValue.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`; 

    }).catch(() => {
        alert('An error occurred while fetching the current weather!');
    });

    fetch(FORECAST_API_URL).then(response => response.json()).then(data => {
        const hourlyForecast = data.list;
        hourlyForecastCard.innerHTML = '';
        for(i = 0; i <= 7; i++) {
            const hourForecastDate = new Date(hourlyForecast[i].dt_txt);
            let hour = hourForecastDate.getHours();
            let a = 'PM';
            if(hour < 12) a = 'AM';
            if(hour == 0) hour = 12;
            if(hour > 12) hour = hour - 12;
            hourlyForecastCard.innerHTML += `
                <div class="card">
                    <p>${hour} ${a}</p>
                    <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="">
                    <p>${(hourlyForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
                </div>
            `; 
        }
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });
        fiveDaysForecastCard.innerHTML = '';
        for(i = 1; i < fiveDaysForecast.length; i++) {
            const date = new Date(fiveDaysForecast[i].dt_txt);
            fiveDaysForecastCard.innerHTML += `
                <div class="forecast-item">
                    <div class="icon-wrapper">
                        <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt="">
                        <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                    </div>
                    <p>${date.getDate()} ${months[date.getMonth()]}</p>
                    <p>${days[date.getDay()]}</p>
                </div>
            `;
        }
    }).catch(() => {
        alert('An error occurred while fetching the weather forecast!');
    });
}

function getCityCoordinates(){
    const cityName = cityInput.value.trim();
    cityInput.value = '';
    if(!cityName) return;
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;

    fetch(API_URL).then(response => response.json()).then(data => {
        const {name, lat, lon, country, state} = data[0];
        getWeatherDetails(name, lat, lon, country, state);
    }).catch(() => {
        alert(`Failed to fetch coordinates of ${cityName}`);
    });
}

function getUserCoordinates() {
    function success(position) {
        const {latitude: lat, longitude: lon} = position.coords;
        const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${api_key}`;
        fetch(REVERSE_GEOCODING_URL).then(response => response.json()).then(data => {
            const {name, country, state} = data[0];
            getWeatherDetails(name, lat, lon, country, state);
        }).catch(error => {
            console.error('An error occurred while fetching the user coordinates.', error);
        });
    }

    function error(err) {
        if(error.code === error.PERMISSION_DENIED){
            alert('Geolocation permission denied. please reset location permission to grant access again');
        }
    }

    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(success, error, options);

}

searchBtn.addEventListener('click', getCityCoordinates);
locationBtn.addEventListener('click', getUserCoordinates);
