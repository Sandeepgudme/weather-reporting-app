const APIKEY = '0f9955c0369740ca82425850261404' ;

const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const cityInput = document.getElementById('cityInput');

// Referencing output fields
const cityName = document.getElementById('city-name');
const countryName = document.getElementById('countryName');
const localTime = document.getElementById('loc-time');
const temp = document.getElementById('temp');
const sup = document.getElementById('sup');
const outputCard = document.getElementById('outputCard');
const forecastCard = document.getElementById('forecastCard');
const forecastList = document.getElementById('forecastList');

async function getData(APIKEY, cityName) {
    const promise = await fetch(`https://api.weatherapi.com/v1/current.json?key=${APIKEY}&q=${cityName}&aqi=yes`);
    return await promise.json();
}

async function getForecast(APIKEY, lat, lon) {
    const promise = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${APIKEY}&q=${lat},${lon}&days=4&aqi=no&alerts=no`);
    return await promise.json();
}

searchBtn.addEventListener('click', async () => {
    const input = cityInput.value;
    showOutput();
    const result = await getData(APIKEY, input);
    updateWeatherInfo(result);
    const lat = result.location.lat;
    const lon = result.location.lon;
    const forecast = await getForecast(APIKEY, lat, lon);
    updateForecast(forecast.forecast.forecastday);
});

locationBtn.addEventListener('click', async () => {
    try {
        const position = await getPosition();
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const result = await getData(APIKEY, `${lat},${lon}`);
        updateWeatherInfo(result);
        const forecast = await getForecast(APIKEY, lat, lon);
        updateForecast(forecast.forecast.forecastday);
        showOutput();
    } catch (error) {
        console.error("Error getting location:", error);
        alert("Unable to get your location. Please allow location access.");
    }
});

function showOutput() {
    outputCard.classList.remove('hidden');
    forecastCard.classList.remove('hidden');
}

function updateWeatherInfo(result) {
    cityName.innerText = `${result.location.name}, ${result.location.region}`;
    countryName.innerText = result.location.country;
    temp.innerText = result.current.temp_c;
    sup.innerText = '°C';
    localTime.innerText = result.location.localtime;
}

function updateForecast(forecastData) {
    forecastList.innerHTML = '';
    
    forecastData.forEach((day) => {
        const forecastItem = document.createElement('div');
        forecastItem.className = 'flex flex-col items-center bg-blue-700 rounded-lg p-4 min-w-[120px]';
        
        const date = document.createElement('p');
        date.className = 'text-base font-bold mb-2';
        date.innerText = new Date(day.date).toLocaleDateString();

        const icon = document.createElement('img');
        icon.src = `https:${day.day.condition.icon}`;
        icon.alt = day.day.condition.text;
        icon.className = 'w-12 h-12 mb-2';

        const condition = document.createElement('p');
        condition.className = 'text-sm opacity-70 mb-2';
        condition.innerText = day.day.condition.text;

        const tempRange = document.createElement('p');
        tempRange.className = 'font-bold';
        tempRange.innerText = `${day.day.mintemp_c}°C - ${day.day.maxtemp_c}°C`;

        forecastItem.appendChild(date);
        forecastItem.appendChild(icon);
        forecastItem.appendChild(condition);
        forecastItem.appendChild(tempRange);

        forecastList.appendChild(forecastItem);
    });
}

async function getPosition() {
    if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
    }

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}
