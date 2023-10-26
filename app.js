const myKey = '299a0a4e74df403fa4c230227232310';

async function getCurrentWeather (q, key) {
    const currentWeather = await fetch(`http://api.weatherapi.com/v1/current.json?key=${key}&q=${q}`);
    const weatherData = await currentWeather.json();
    console.log(weatherData);
}

const goButton = document.querySelector('button');
goButton.addEventListener('click', () => {
    let locationValue = document.querySelector('.location-search').value;
    getCurrentWeather(locationValue, myKey);
})