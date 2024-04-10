const now = new Date();
const yr = now.getFullYear();
const titlePage = document.querySelector("h2");
const box = document.querySelector("#cards");
const search = document.querySelector("#searchBtn");
const userInput = document.querySelector("#city");
const history = document.querySelector("#history");

//Js to insert footer
const footerMsg = `&copy; ${yr} Heye Ma<br>WDD330 Final Project`;
document.querySelector("footer").innerHTML = footerMsg;

//async function that initially loads a page based on the user location.
//uses a geolocation API to retrieve name of user's location which is
//used as the arguement for the getLocalWeather function.
async function getPlace() {
  const response = await fetch("https://geolocation-db.com/json/");
  const data = await response.json();

  getLocalWeather(data.city);
}
getPlace(); //immediately calls the getPlace function on load.

function getLocalWeather(data) {
  let place = data;

  async function getData() {
    try {
      const res = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${place}?unitGroup=metric&key=M8BWB7V6NYYNKB8RAY576LEP8`
      );
      const wea = await res.json();
      localWeatherDisplay(wea);
    } catch {
      throw alert("Location not found");
    }
  }
  function localWeatherDisplay(data) {
    const address = data.resolvedAddress;
    const myHead = `${address} Weather Forecast`;
    //console.log(data.resolvedAddress);
    titlePage.textContent = myHead;
    let i = 0;
    for (i = 0; i < 7; i++) {
      const card = document.createElement("section");
      card.classList.add("card");
      let cardHeader = document.createElement("h2");
      let temp = document.createElement("span");
      temp.classList.add("temp");
      let humidity = document.createElement("p");
      let weatherDescription = document.createElement("p");
      weatherDescription.innerHTML = data.days[i].description;
      let forecastTemp = `${data.days[i].temp} &deg;C`;
      temp.innerHTML = forecastTemp;
      let weatherIcon = document.createElement("img");
      weatherIcon.src = getIcon(data.days[i].icon);
      let date = ` ${getWeekDay(data.days[i].datetime)}`;
      cardHeader.textContent = date;
      let hum = `Humidity: ${data.days[i].humidity}%`;
      humidity.textContent = hum;
      card.appendChild(cardHeader);
      card.appendChild(weatherDescription);
      card.appendChild(weatherIcon);
      card.appendChild(temp);
      card.appendChild(humidity);
      box.append(card);
    }
  }
  getData();
}
function getWeekDay(dateString) {
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(dateString);
  let dayNum = date.getDay();
  let month = date.getMonth();
  let theDate = date.getDate();
  return `${weekDays[dayNum]}, ${months[month]} ${theDate}`;
}

search.addEventListener("click", () => {
  cards.innerHTML = "";
  let place = userInput.value;
  getLocalWeather(place);
  saveHistory(place);
});

function getIcon(item) {
  let newString = item.replace(" ", "-");
  return `images/${newString}.png`;
}

function saveHistory(userInput) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.push(userInput);
  localStorage.setItem("history", JSON.stringify(history));
}

history.addEventListener("click", () => {
  const lastQuery = JSON.parse(localStorage.getItem("history"));
  document.querySelector("#qresult").textContent = lastQuery;
});
