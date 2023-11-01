const myKey = '299a0a4e74df403fa4c230227232310';
const myLocation = {
    q: '',
    scale: 'f'
};

async function getWeather (q) {
    const threeDaysWeather = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${myKey}&q=${q}&days=3&alerts=yes`);
    weatherData = await threeDaysWeather.json();
    console.log(weatherData);
    return weatherData;
}

function toggleLocKnownView () {
    const locUnknown = document.querySelector('.loc-unknown');
    const locKnown = document.querySelector('.loc-acquired');

    if (!myLocation.q) {
        locKnown.classList.add('hidden');
        locUnknown.classList.remove('hidden');
    } else {
        locKnown.classList.remove('hidden');
        locUnknown.classList.add('hidden');
    }
}

const goButton = document.querySelector('button');
goButton.addEventListener('click', async () => {
    let locationValue = document.querySelector('.location-search');
    myLocation.q = locationValue.value;
    locationValue.value = '';
    toggleLocKnownView();
    nowLayout();
    let data = await getWeather(myLocation.q);
    setLocationTitle(data);
    populateCurrentWeather(data);
});

function setLocationTitle (loc) {
    const locTitle = document.querySelector('.loc-indicator');
    locTitle.textContent = `${loc.location.name}, ${loc.location.region}, ${loc.location.country}`;
}

function populateCurrentWeather (weatherObj) {
    let nowTemp = document.querySelector('.left');
    let nowCondition = document.querySelector('.right');
    nowTemp.textContent = weatherObj.current.temp_f;
    nowCondition.textContent = weatherObj.current.condition.text;
}

function populateDayWeather (weatherObj, day) {
    let todayMax = document.querySelector('.left-top');
    let todayMin = document.querySelector('.left-bottom');
    let todayCondition = document.querySelector('.right');
    todayMax.textContent = weatherObj.forecast.forecastday[day].day.maxtemp_f;
    todayMin.textContent = weatherObj.forecast.forecastday[day].day.mintemp_f;
    todayCondition.textContent = weatherObj.forecast.forecastday[day].day.condition.text;
}

function populateThreeDaysWeather (weatherObj) {
    const columns = document.querySelectorAll('.col');
    let counter = 0;
    columns.forEach(col => {
        let top = col.querySelector(`.top`);
        let bottom = col.querySelector(`.bottom`);
        top.textContent = weatherObj.forecast.forecastday[counter].day.maxtemp_f;
        bottom.textContent = weatherObj.forecast.forecastday[counter].day.condition.text;
        counter++;
    })
}

function clearLayout () {
    weatherDisplay = document.querySelector('.weather-display');
    while (weatherDisplay.firstChild) {
        weatherDisplay.removeChild(weatherDisplay.lastChild);
    }
}

function nowLayout () {
    clearLayout();
    const weatherDisplay = document.querySelector('.weather-display');
    const mainDisplay = document.createElement('div');
    const leftCol = document.createElement('div');
    const rightCol = document.createElement('div');

    mainDisplay.classList.add('display', 'main');
    leftCol.classList.add('left', 'col');
    rightCol.classList.add('right', 'col');

    mainDisplay.appendChild(leftCol);
    mainDisplay.appendChild(rightCol);
    weatherDisplay.appendChild(mainDisplay);
}

function todayTmrwLayout () {
    clearLayout();
    nowLayout();
    const weatherDisplay = document.querySelector('.weather-display');
    const leftCol = document.querySelector('.left');

    const leftTop = document.createElement('div');
    const leftBottom = document.createElement('div');

    leftTop.classList.add('left-top');
    leftBottom.classList.add('left-bottom');

    leftCol.appendChild(leftTop);
    leftCol.appendChild(leftBottom);

    const hourly = document.createElement('div');
    hourly.classList.add('hourly');

    for (let i = 0; i < 24; i++) {
        const hourDiv = document.createElement('div');
        hourDiv.classList.add('hour', `hour-${i}`);
        hourly.appendChild(hourDiv);
    }
    weatherDisplay.appendChild(hourly);
}

function threeDaysLayout () {
    clearLayout();
    const weatherDisplay = document.querySelector('.weather-display');
    const mainDisplay = document.createElement('div');

    mainDisplay.classList.add('display', 'main');

    const leftCol = document.createElement('div');
    const middleCol = document.createElement('div');
    const rightCol = document.createElement('div');

    leftCol.classList.add('left', 'col', '3');
    middleCol.classList.add('middle', 'col', '3');
    rightCol.classList.add('right', 'col', '3');

    mainDisplay.appendChild(leftCol);
    mainDisplay.appendChild(middleCol);
    mainDisplay.appendChild(rightCol);
    weatherDisplay.appendChild(mainDisplay);

    const columns = document.querySelectorAll('.col');
        columns.forEach(col => {
        const topCell = document.createElement('div');
        const bottomCell = document.createElement('div');
        topCell.classList.add('top', 'cell');
        bottomCell.classList.add('bottom', 'cell');
        col.appendChild(topCell);
        col.appendChild(bottomCell);
    })
}

const nowButton = document.querySelector('.now');
const todayButton = document.querySelector('.today');
const tomorrowButton = document.querySelector('.tomorrow');
const threeDaysButton = document.querySelector('.three-days');

nowButton.addEventListener('click', async () => {
    nowLayout();
    let data = await getWeather(myLocation.q);
    populateCurrentWeather(data);
})

todayButton.addEventListener('click', async () => {
    todayTmrwLayout();
    let data = await getWeather(myLocation.q);
    populateDayWeather(data, 0);
})

tomorrowButton.addEventListener('click', async () => {
    todayTmrwLayout();
    let data = await getWeather(myLocation.q);
    populateDayWeather(data, 1);
})

threeDaysButton.addEventListener('click', async () => {
    threeDaysLayout();
    let data = await getWeather(myLocation.q);
    populateThreeDaysWeather(data);
})