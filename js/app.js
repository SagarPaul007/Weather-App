const API_KEY = "2e61246cf2c95899a87f0b2ae4ccd179"; // don't use the same api key

// dom elements
let timeEl = document.querySelector(".time-element");
let dateEl = document.querySelector(".date-element");
let pos = document.querySelector(".lat-long");
let place = document.querySelector(".place");
let currentDay = document.querySelector(".current-day");

// variable declaration
let lat, long, nextDays = "";
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


setInterval(() => {
    // date and time
    let now = new Date();
    let day = now.getDay();
    let hour = now.getHours() % 12;
    let minute = now.getMinutes();
    let second = now.getSeconds();
    let ampm = now.getHours() < 12 ? "AM" : "PM";
    let [, month, date] = `${now}`.split(" ");

    timeEl.textContent = `${hour < 10 ? "0"+hour : hour}:${minute < 10 ? "0"+minute : minute} ${ampm}`;
    dateEl.textContent = `${days[day]}, ${month} ${date}`;
}, 1000);

function getWeatherData() {
    //getting lat and long and fething data
    navigator.geolocation.getCurrentPosition(x => {
        lat = x.coords.latitude;
        long = x.coords.longitude;
        pos.textContent = `${lat.toFixed(4)}N, ${long.toFixed(4)}E`;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
            showWeatherData(data);
        })
    });
}

function showWeatherData(data) {
    place.textContent = data.timezone; //place

    // current
    let current = data.current;
    let dt = current.dt;
    let day = (new Date(dt * 1000)).getDay();
    let temp = current.temp;
    let {
        humidity,
        sunrise,
        sunset
    } = current;
    let currentIcon = current.weather[0].icon;

    // updating
    sunrise = `${new Date(sunrise * 1000)}`.split(" ")[4];
    sunset = `${new Date(sunset * 1000)}`.split(" ")[4];
    currentDay.textContent = `${days[day]} ${temp}°C`;
    document.querySelector(".humidity").textContent = `${humidity}%`;
    document.querySelector(".sunrise").textContent = `${sunrise}`;
    document.querySelector(".sunset").textContent = `${sunset}`;
    document.querySelector(".current-img").setAttribute("src", `http://openweathermap.org/img/wn/${currentIcon}@4x.png`);


    // next 7 days
    data.daily.forEach((item, index) => {
        if (index === 0) {
            // current day
            let daytemp = item.temp.day;
            let nighttemp = item.temp.night;
            document.querySelector(".day-temp").textContent = `Day: ${daytemp}°C`;
            document.querySelector(".night-temp").textContent = `Night: ${nighttemp}°C`;
        } else {
            // next days
            let newDT = item.dt;
            let newDay = (new Date(newDT * 1000)).getDay();
            currentIcon = item.weather[0].icon;

            // updating
            nextDays +=
                `<div class="item">
                    <div class="item-day">${days[newDay]}</div>
                    <div class="item-icon">
                        <img src="http://openweathermap.org/img/wn/${currentIcon}@2x.png" alt="icon">
                    </div>
                    <div class="item-temp">
                        <div class="item-day-temp">Day: ${item.temp.day}°C</div>
                        <div class="item-night-temp">Night: ${item.temp.night}°C</div>
                    </div>
                </div>`;

            document.querySelector(".next").innerHTML = nextDays;
        }
    });
}

// function call

getWeatherData();
