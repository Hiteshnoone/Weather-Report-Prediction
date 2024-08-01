document.getElementById('weatherForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const city = document.getElementById('city').value;
    fetchWeatherData(city);
});

document.getElementById('currentLocationButton').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherData(null, latitude, longitude);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

function fetchWeatherData(city, lat = null, lon = null) {
    const apiKey = 'fe2dd1e1f7de087197fbab9e862fe0f2'; // Replace with your actual OpenWeatherMap API key
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric`;
    if (city) {
        url += `&q=${city}`;
    } else if (lat && lon) {
        url += `&lat=${lat}&lon=${lon}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateCurrentWeather(data);
            return fetch(`https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=metric&lat=${data.coord.lat}&lon=${data.coord.lon}`);
        })
        .then(response => response.json())
        .then(data => {
            updateForecast(data);
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
        });
}

function updateCurrentWeather(data) {
    const currentWeather = document.getElementById('currentWeather');
    const date = new Date(data.dt * 1000).toISOString().split('T')[0];
    currentWeather.innerHTML = `
        <h2>${data.name} (${date})</h2>
        <div class="weather-details">
            <div class="weather-info">
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Wind: ${data.wind.speed} M/S</p>
                <p>Humidity: ${data.main.humidity}%</p>
            </div>
            <div class="weather-icon">
                <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="Weather Icon">
                <p>${data.weather[0].description}</p>
            </div>
        </div>
    `;
}

function updateForecast(data) {
    const forecast = document.getElementById('forecast');
    forecast.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const forecastData = data.list[i * 8]; // Get data at 24-hour intervals
        const date = new Date(forecastData.dt * 1000).toISOString().split('T')[0];
        forecast.innerHTML += `
            <div class="forecast-card">
                <h4>${date}</h4>
                <img src="https://openweathermap.org/img/w/${forecastData.weather[0].icon}.png" alt="Weather Icon">
                <p>Temp: ${forecastData.main.temp}°C</p>
                <p>Wind: ${forecastData.wind.speed} M/S</p>
                <p>Humidity: ${forecastData.main.humidity}%</p>
            </div>
        `;
    }
}
