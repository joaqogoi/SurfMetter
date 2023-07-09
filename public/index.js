
let lat;
let long;

const nortBeachArea = [
    {id:1,name:"Luna Azul",handicap:10},
    {id:2,name:"Arenas del Norte",handicap:10},
    {id:3,name:"Playa Almar",handicap:50},
    {id:4,name:"Sun Riders",handicap:70},
    {id:5,name:"Bahia Estrada",handicap:50},
    {id:6,name:"Complejo Morgan",handicap:40},
    {id:7,name:"Costa del Sol",handicap:40},
    {id:8,name:"Playa Daprotis",handicap:50},
    {id:9,name:"Playas Constitucion",handicap:40},
    {id:10,name:"Puerto Cardiel",handicap:60}
];
const middleBeachArea = [
    {id:1,name:"Playa Varese",handicap:50},
    {id:2,name:"Playa las Toscas",handicap:30},
    {id:3,name:"Playa Bristol",handicap:30},
    {id:4,name:"Paseo Davila",handicap:60},
    {id:5,name:"El Torreon",handicap:70},
    {id:6,name:"Cabo Corrientes",handicap:10}
];
const southBeachArea = [
    {id:1,name:"Playa Chica",handicap:60},
    {id:2,name:"Playa Grande",handicap:40},
    {id:3,name:"Punta Mogotes",handicap:50},
    {id:4,name:"Mirador Waikiki",handicap:70}
];

const data1h = {
    mean_wavedirection:[],
    mean_waveperiod:[],
    mean_surfacetemperature:[],
    mean_significantwaveheight: [],
    mean_windwavedirection:[],
}

//DOM elements
const homeButton = document.getElementById("homeButton");
const usersButton = document.getElementById("usersButton");
const aboutButton = document.getElementById("aboutButton");
const searchBtn = document.getElementById("searchBtn");
const locationInput = document.getElementById("locationInput");
const hotSpotsBtn = document.getElementById("hotSpotBtn");
const hotSpotsContainer = document.getElementById("hotSpotsContainer");

homeButton.addEventListener("click", () => {
    window.location.href = "/";
});

usersButton.addEventListener("click", () => {
    window.location.href = "/users";
});

aboutButton.addEventListener("click", () => {
    window.location.href = "/about";
});

//Default api location
apiCall("Mar del plata");

//Search location
searchBtn.addEventListener("click" , () => {
    //obtener valor de la ubicacion de busqueda
    if (locationInput.value != "") {
        const location = locationInput.value;
        apiCall(location);
    } else {
        alert ("No se ingreso ninguna ubicación");
    }
});

//HotSpots Creation
hotSpotsBtn.addEventListener("click", () => {
    hotSpotsCreation();
});

//Current location funcition
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                lat = position.coords.latitude;
                long = position.coords.longitude;
                console.log("Latitud:" + lat + "Longitud:" + long);
                tideApiCall();
            },
            error => {
                console.error("Error al obtener la ubicacion", error.message);
            }
        );
    } else {
        console.error("La geolocalizacion no es compatible con el navegador");
    }
}

//ApiCalls
async function apiCall(location) {
    const apiKey = "q8WvKXDpS35BpZ2uR5nQjrUB7irRI5Sk";
    try { 
        const response = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${apiKey}&q=${location}&language=en`)
        const data = await response.json();
            if(data.length > 0) {
                //se obtiene el codigo de localizacion de la primera coincidencia
                const locationKey = data[0].Key;
                const weatherResponse = await fetch(`http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}&language=en-us&details=true`)
                const weatherData = await weatherResponse.json();
                
                console.log(weatherData);
                updateGeneralWeather(weatherData);
            } else {
                alert("Ubicación no disponible");
            }
        } catch(error) {
            console.error("Error al obtener la ubicacion", error);
        }
}

let tideApiData; 
async function tideApiCall(lat,long) {
    const url = `https://my.meteoblue.com/packages/sea-1h?apikey=mJewkKxTLhlfiS65&lat=${lat}&lon=${long}&asl=180&format=json`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        tideApiData = data;
        console.log(tideApiData);
        updateWaterWeather();
    } catch (error) {
        console.error("Error al realizar la solicitud", error);
    }
}

//Weather States Update
function updateGeneralWeather(weatherData) {
    const generalWeatherT = document.getElementById("generalWeatherT");
    const generalWeatherDescription = document.getElementById("generalWeatherDescription");
    const generalWeatherImg = document.getElementById("generalWeatherImg");
    const windWeatherStatus = document.getElementById("windWeatherStatus");
    const windWeatherDescription = document.getElementById("windWeatherDescription");
    const windWeatherImg = document.getElementById("windWeatherImg");

    //General weather status
    const ApparentTemperature = weatherData[0].ApparentTemperature;
    generalWeatherT.textContent = Math.round(ApparentTemperature.Metric.Value) + "°";

    const weatherText = weatherData[0].WeatherText;
    const visibility = weatherData[0].CloudCover;
    const presipitation = weatherData[0].HasPrecipitation;
    let weatherDescription;

    if (weatherText.includes("Sunny") || visibility < 50) {
        weatherDescription = "Despejado";
        generalWeatherImg.src = "img/2.png";
    } else if (visibility > 50) {
        weatherDescription = "Cielo cubierto"
        generalWeatherImg.src = "img/3.png";
    } else if (visibility >= 50) {
        weatherDescription = "Nublado"
        generalWeatherImg.src = "img/4.png";
    } else if (weatherText.includes("Rain") || (presipitation = true)) {
        weatherDescription = "Lluvias"
        generalWeatherImg.src = "img/7.png";
    } else if (weatherText.includes("Fog")) {
        weatherDescription = "Niebla"
        generalWeatherImg.src = "img/6.png";
    } else if (weatherText.includes("Thenderstorm") || (presipitation = true)) {
        weatherDescription = "Tormentas"
        generalWeatherImg.src = "img/8.png";
    } else if (weatherText.includes("Hail") || (presipitation = true)) {
        weatherDescription = "Granizo"
        generalWeatherImg.src = "img/9.png";
    } else if (weatherText.includes("Sleet") || (presipitation = true)) {
        weatherDescription = "Agua nieve"
        generalWeatherImg.src = "img/10.png";
    } else {
        weatherDescription = "Desconocido"
        generalWeatherImg.src = "img/25.png";

    }
    generalWeatherDescription.textContent = weatherDescription;

    //Wind status
    const windSpeed = weatherData[0].WindGust.Speed.Metric.Value;
    let windStatus;

    
    if (windSpeed <= 10) {
        windStatus = "Ligero";
        windWeatherImg.src = "img/11.png";
    } else if (windSpeed <=20) {
        windStatus = "Moderado";
        windWeatherImg.src = "img/12.png";
    } else {
        windStatus = "Fuerte";
        windWeatherImg.src = "img/13.png";
    }
    windWeatherDescription.textContent = windStatus;
}


function updateWaterWeather() {
    //DOM elements
    const waterWeatherT = document.getElementById("waterWeatherT");
    const tideWeatherDescription = document.getElementById("tideWeatherDescription");
    const tideWeatherImg = document.getElementById("tideWeatherImg");

    let apiData = tideApiData;
    
    for (let i = 7; i <= 22; i++) {
        data1h.mean_wavedirection.push(apiData.data_1h.mean_wavedirection[i]);
        data1h.mean_waveperiod.push(apiData.data_1h.mean_waveperiod[i]);
        data1h.mean_surfacetemperature.push(apiData.data_1h.seasurfacetemperature[i]);
        data1h.mean_significantwaveheight.push(apiData.data_1h.significantwaveheight[i]);
        data1h.mean_windwavedirection.push(apiData.data_1h.windwave_direction[i]);
      }
    console.log(data1h);

    const averageSurfaceTemp = average(data1h.mean_surfacetemperature);
    const wavesHeight = average(data1h.mean_significantwaveheight);
    const wavesPeriod = average(data1h.mean_waveperiod);
    waterWeatherT.textContent = Math.round(averageSurfaceTemp) + "°";

    if (wavesHeight <= 1.5 && wavesPeriod >= 8) {
        tideWeatherDescription.textContent = "Calmado";
        tideWeatherImg.src = "img/15.png";
    } else if (wavesHeight > 1.5 && wavesHeight <= 2.5 && wavesPeriod >= 5 && wavesPeriod <= 10) {
        tideWeatherDescription.textContent = "Intenso";
        tideWeatherImg.src = "img/16.png";
    } else if (wavesHeight > 2.5 && wavesPeriod <= 5) {
        tideWeatherDescription.textContent = "Peligroso";
        tideWeatherImg.src = "img/17.png";
    } else {
        tideWeatherDescription.textContent = "Indeterminado";
        tideWeatherImg.src = "img/17.png";
    }
}

function average(values) {
    const sum = values.reduce((total, value) => total + value,0);
    const average = sum / values.length;
    return average;
}

function BestSurfHours(){
    //recordar completar esta funcion
}

function hotSpotsCreation() {
    const selectedZone = selectSurfZone(data1h);

    addHtml();
    
    const easyBeach = beachSelection(selectedZone.zone, 0,30);
    const mediumBeach = beachSelection(selectedZone.zone, 30,60);
    const highBeach = beachSelection(selectedZone.zone, 60,100);
    const zoneDificultity = selectedZone.dificulty;
    const zoneName = selectedZone.name;

    const easyHandicap = document.getElementById("easyHandicap");
    const mediumHandicap = document.getElementById("mediumHandicap");
    const highHandicap = document.getElementById("highHandicap");
    const dayDificulty = document.getElementById("dayDificulty");
    const recomendationZone = document.getElementById("recomendationZone");

    easyHandicap.innerText = easyBeach;
    mediumHandicap.innerText = mediumBeach;
    highHandicap.innerText = highBeach;
    dayDificulty.innerHTML = `Hoy:<br> ${zoneDificultity}`;
    recomendationZone.innerText = zoneName;

}

function selectSurfZone(data1h) {
    const windDirection = average(data1h.mean_windwavedirection);
    const waveDirection = average(data1h.mean_wavedirection);

    if (waveDirection >= 180 && waveDirection <= 270) {
        if (windDirection >= 0 && windDirection <= 90) {
            return { zone:nortBeachArea, dificulty:"olas lentas", name: "NortBeach" }
        } else if ((windDirection >= 90 && windDirection <= 180) || (windDirection >= 270 && windDirection <= 360)) {
            return { zone:nortBeachArea, dificulty:"viento cruzado", name: "NortBeach" }
        } else {
            return { zone:nortBeachArea, dificulty:"olas rapidas", name: "NortBeach" }
        }
    } else if (waveDirection >= 270 && waveDirection <= 360) {
        if ((windDirection >= 0 && windDirection <= 90) || (windDirection >= 180 && windDirection <= 270)) {
            return { zone:southBeachArea, dificulty:"viento cruzado", name:"SouthBeach" }
        } else if (windDirection >= 90 && windDirection <= 180) {
            return { zone:southBeachArea, dificulty:"olas lentas", name:"SouthBeach" }
        } else {
            return { zone:southBeachArea, dificulty:"olas rapidas", name:"SouthBeach" }
        }
    } else {
        if (windDirection >= 45 && windDirection <= 135) {
            return { zone: middleBeachArea, dificulty:"olas lentas", name:"MiddleBeach" }
        } else if (((windDirection >= 0 && windDirection <= 45) || (windDirection >= 305 && windDirection <= 360)) || (windDirection >= 135 && windDirection <= 225)) {
            return { zone: middleBeachArea, dificulty:"viento cruzado", name:"MiddleBeach" }
        } else {
            return { zone: middleBeachArea, dificulty:"olas rapidas", name:"MiddleBeach" }
        } 
    }
}

function addHtml(){
    const hotSpotsContainer = document.getElementById("hotSpotsContainer");
    const htmlCode = `
    <h3>Dificultad</h3>
    <div class="categoriContainer">
            <div class="handicapContainer">
                <img src="img/26.png">
                <li id="easyHandicap">Playa Playa</li>
                <p>Carnalo</p>
            </div>
            <div class="handicapContainer">
                <img src="img/23.png">
                <li id="mediumHandicap">Playa Grande</li>
                <p>Corvina</p>
            </div>
            <div class="handicapContainer">
                <img src="img/24.png">
                <li id="highHandicap">Playa Chica</li>
                <p>Tiburon</p>
            </div>

        </div>
        <div class="surfStatusContenedor">
            <img src="img/20.png">
            <h3 id="dayDificulty">Hoy:<br> olas rapidas</h3>
        </div>
        <div class="dayStatus">
        <h3>Zona recomendada:</h3>
        <p id="recomendationZone"></p>
        </div>
    `;
    hotSpotsContainer.innerHTML = htmlCode;
}

function beachSelection(array, handicapMin, handicapMax) {
    const filtereddArea = array.filter( e => e.handicap >= handicapMin && e.handicap <= handicapMax);
    const selectedBeach = filtereddArea[Math.floor(Math.random() * filtereddArea.length)];
    return selectedBeach.name;
}


getCurrentLocation();