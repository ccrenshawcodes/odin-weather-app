const myKey = '299a0a4e74df403fa4c230227232310';
const myLocation = {
    q: '',
    scale: 'f'
};

async function getWeather (q) {
    try {
        const threeDaysWeather = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${myKey}&q=${q}&days=3&alerts=yes`);
        if (!threeDaysWeather.ok) {
            throw new Error(threeDaysWeather.status);
        }
        weatherData = await threeDaysWeather.json();
        console.log(weatherData);
        return weatherData;
    } catch (err) {
        alert('An error occurred. Please try again');
        console.log(err);
        return null;
    }
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
goButton.addEventListener('click', () => {
    setCurrentLocation();
    toggleLocKnownView();
    showInitial();
});

const locInput = document.querySelector('.location-search');
locInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        goButton.click();
    }
})

function setCurrentLocation () {
    let locationValue = document.querySelector('.location-search');
    if (locationValue.value) {
        myLocation.q = locationValue.value;
        locationValue.value = '';
    }
}

function setTempScale (val) {
    myLocation.scale = val;
    if (myLocation.q) {
        showInitial();
    }
}

function setLocationTitle (loc) {
    const locTitle = document.querySelector('.loc-indicator');
    locTitle.textContent = ` ${loc.location.name}, ${loc.location.region}, ${loc.location.country}`;
}

async function showInitial () {
    loadingScreen();
    let data = await getWeather(myLocation.q);
    if (data) {
        nowLayout();
        setLocationTitle(data);
        changePageAppearance(data);
        populateCurrentWeather(data);
        showAlerts(data);
        toggleActiveTab(document.querySelector('.now'));
    } else {
        myLocation.q = '';
        toggleLocKnownView();
    }
}

function showAlerts (weatherObj) {
    const alerts = weatherObj.alerts.alert;
    const banner = document.querySelector('.weather-alerts');

    if (alerts.length > 0) {
        alerts.forEach(item => {
            if (item.msgtype === 'Alert') {
                banner.classList.remove('hidden');
                banner.textContent = item.event;
            }
        })
    } else {
        banner.classList.add('hidden');
        banner.textContent = '';
    }
}

function populateCurrentWeather (weatherObj) {
    const scale = `temp_${myLocation.scale}`;
    let nowTemp = document.querySelector('.left');
    let nowCondition = document.querySelector('.right');
    nowTemp.textContent = `${weatherObj.current[scale]}*${myLocation.scale}`;
    nowCondition.textContent = weatherObj.current.condition.text;
}

function populateDayWeather (weatherObj, day) {
    const maxScale = `maxtemp_${myLocation.scale}`;
    const minScale = `mintemp_${myLocation.scale}`;
    let todayMax = document.querySelector('.left-top');
    let todayMin = document.querySelector('.left-bottom');
    let todayCondition = document.querySelector('.right');
    todayMax.textContent = `High: ${weatherObj.forecast.forecastday[day].day[maxScale]}`;
    todayMin.textContent = `Low: ${weatherObj.forecast.forecastday[day].day[minScale]}`;
    todayCondition.textContent = weatherObj.forecast.forecastday[day].day.condition.text;
}

function populateThreeDaysWeather (weatherObj) {
    const columns = document.querySelectorAll('.col');
    const maxScale = `maxtemp_${myLocation.scale}`;
    const minScale = `mintemp_${myLocation.scale}`;
    let counter = 0;
    columns.forEach(col => {
        let topHi = col.querySelector('.top-high');
        let topLo = col.querySelector('.top-low');
        let bottom = col.querySelector(`.bottom`);
        topHi.textContent = `High: ${weatherObj.forecast.forecastday[counter].day[maxScale]}`;
        topLo.textContent = `Low: ${weatherObj.forecast.forecastday[counter].day[minScale]}`;
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

function loadingScreen () {
    const display = document.querySelector('.weather-display');
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('loading-screen');
    loadingDiv.textContent = 'loading...';

    clearLayout();
    display.appendChild(loadingDiv);
}

function nowLayout () {
    clearLayout();
    const weatherDisplay = document.querySelector('.weather-display');
    const mainDisplay = document.createElement('div');
    const leftCol = document.createElement('div');
    const rightCol = document.createElement('div');

    mainDisplay.classList.add('display', 'main');
    leftCol.classList.add('left', 'col', 'n');
    rightCol.classList.add('right', 'col', 'n');

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

    leftCol.classList.add('left', 'col', 'three');
    middleCol.classList.add('middle', 'col', 'three');
    rightCol.classList.add('right', 'col', 'three');

    mainDisplay.appendChild(leftCol);
    mainDisplay.appendChild(middleCol);
    mainDisplay.appendChild(rightCol);
    weatherDisplay.appendChild(mainDisplay);

    const columns = document.querySelectorAll('.col');
        columns.forEach(col => {
        const topCell = document.createElement('div');
        const topHigh = document.createElement('div');
        const topLow = document.createElement('div');
        const bottomCell = document.createElement('div');
        topCell.classList.add('top', 'cell');
        topHigh.classList.add('top-high');
        topLow.classList.add('top-low');
        bottomCell.classList.add('bottom', 'cell');
        topCell.appendChild(topHigh);
        topCell.appendChild(topLow);
        col.appendChild(topCell);
        col.appendChild(bottomCell);
    })
}

function toggleActiveTab (tab) {
    const tabs = document.querySelectorAll('.time');
    tabs.forEach(one => {
        if (one.classList.contains('active')) {
            one.classList.remove('active');
        }
    })
    tab.classList.add('active');
}

const nowButton = document.querySelector('.now');
const todayButton = document.querySelector('.today');
const tomorrowButton = document.querySelector('.tomorrow');
const threeDaysButton = document.querySelector('.three-days');

nowButton.addEventListener('click', async () => {
    toggleActiveTab(nowButton);
    loadingScreen();
    let data = await getWeather(myLocation.q);
    if (data) {
        nowLayout();
        populateCurrentWeather(data);
    } else {
        myLocation.q = '';
        toggleLocKnownView();
    }
})

todayButton.addEventListener('click', async () => {
    toggleActiveTab(todayButton);
    loadingScreen();
    let data = await getWeather(myLocation.q);
    if (data) {
        todayTmrwLayout();
        populateDayWeather(data, 0);
    } else {
        myLocation.q = '';
        toggleLocKnownView();
    }
})

tomorrowButton.addEventListener('click', async () => {
    toggleActiveTab(tomorrowButton);
    loadingScreen();
    let data = await getWeather(myLocation.q);
    if (data) {
        todayTmrwLayout();
        populateDayWeather(data, 1);
    } else {
        myLocation.q = '';
        toggleLocKnownView();
    }
})

threeDaysButton.addEventListener('click', async () => {
    toggleActiveTab(threeDaysButton);
    loadingScreen();
    let data = await getWeather(myLocation.q);
    if (data) {
        threeDaysLayout();
        populateThreeDaysWeather(data);
    } else {
        myLocation.q = '';
        toggleLocKnownView();
    }
})

const scaleSelector = document.querySelector('#temp-type');
scaleSelector.addEventListener('input', (e) => {
    setTempScale(e.target.value);
})

function changePageAppearance (weatherObj) {
    const background = document.querySelector('.content');
    if (weatherObj.current.is_day === 0) {
        background.style.cssText = 'background-color: var(--night);';
    } else {
        switch (weatherObj.current.condition.code) {
            case 1000:
            case 1003:
                background.style.cssText = 'background-color: var(--sunny-color);';
                break;
            case 1006:
            case 1009:
            case 1030:
                background.style.cssText = 'background-color: var(--cloudy-one);';
                break;
            case 1063:
            case 1135:
            case 1147:
            case 1150:
            case 1153:
            case 1180:
            case 1183:
            case 1186:
            case 1189:
            case 1240:
                background.style.cssText = 'background-color: var(--cloudy-two);';
                break;
            case 1168:
            case 1171:
            case 1192:
            case 1195:
            case 1201:
            case 1243:
            case 1246:
                background.style.cssText = 'background-color: var(--precip-two);';
                break;
            case 1066:
            case 1069:
            case 1072:
            case 1114:
            case 1117:
            case 1204:
            case 1207:
            case 1210:
            case 1213:
            case 1216:
            case 1219:
            case 1222:
            case 1225:
            case 1237:
            case 1249:
            case 1252:
            case 1255:
            case 1258:
            case 1261:
            case 1264:
                background.style.cssText = 'background-color: var(--snowy);';
                break;
            case 1287:
            case 1273:
            case 1276:
            case 1279:
            case 1282:
                background.style.cssText = 'background-color: var(--thunder);';
                break;
            default:
                background.style.cssText = 'background-color: var(--cloudy-one);';
        }
    }
}