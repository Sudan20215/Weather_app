const form = document.querySelector(".sidebar form");
const input = document.querySelector(".sidebar input");
const apiKey="668e3d39d52a645e064391881ef3df01"

function DateNow(){
    let presentday = new Date();
    let day = String(presentday.getDate()).padStart(2, '0');
    let month = String(presentday.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = presentday.getFullYear();
    return "("+month+"/"+day+"/"+yyyy+")"
}

function KtoF(value){// kelvin to foreighheight conversion
  return ((value-273.15)*1.8)+32
}

function setToLocalStorage(data){
   const value= JSON.parse(localStorage.getItem("myWeatherData"))
   let newArray=[];
   if(value){
    if(!value.includes(data.toLowerCase())){
        newArray=[...value]
        newArray.push(data)
        localStorage.setItem('myWeatherData',JSON.stringify(newArray))
    }
   }else{
    newArray.push(data)
    localStorage.setItem('myWeatherData',JSON.stringify(newArray))
   }
}

function getFromLocalStorage(){
    const value= JSON.parse(localStorage.getItem("myWeatherData"))
    if(value){
        $('#histryData').show();
        $('#historyMessage').hide()
        value.map((item)=>{
            $('#history-ul').append(`<li class="list-group-item" id="history-item">${item}</li>`)
        })
         
    }else{
        $('#histryData').hide()
        $('#historyMessage').show()
    }       
}

window.onload = function() {
    getFromLocalStorage()
    $('#main-top').hide()
    $('#main-buttom').hide()
    $('#messageText').show()
    $('#messageText1').hide()
  };

  function getSlicedDate(date){
      let newDate=date.slice(0,10);
      let day=newDate.slice(8,10)
      let month=newDate.slice(5,7)
      let year=newDate.slice(0,4)
      return `${month}/${day}/${year}`
  }

async function getFivedayForcast(cityName){
    const possibleValue=[4,12,20,28,36]
    const Url=`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`
    await fetch(Url)
    .then(resp=>resp.json())
    .then(data=>{
        const selectedData = data.list.filter((item,i)=>possibleValue.includes(i))
        selectedData.map((item)=>{
            $("#forecast").append(`  
              <div class="col forcastCard">
                <div class="card card-col">
                  <div class="card-body text-white">
                     <h2 style="font-size: 1.8rem;">${getSlicedDate(item.dt_txt)}</h2>
                     <img height="70" width="70" src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="icon">
                     <p>Temp: ${KtoF(item.main.temp).toFixed(3).replace(/\.(\d\d)\d?$/, '.$1')}°F</p>
                     <p>Humidity: ${item.main.humidity}%</p>
                  </div>
                </div>
               </div> `
            )
            });
        }) 
   }

form.addEventListener("submit", e => {
  e.preventDefault();
  $("#cityName").empty();
  $('#forecast').empty();
  $('#main-top').show()
  $('#main-buttom').show()
  $('#messageText').hide()
  const cityName = input.value;
  const url =`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
   setToLocalStorage(cityName)
    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
          } else {
            $('#main-top').hide()
            $('#main-buttom').hide()
            $('#messageText').hide()
            $('#messageText1').show();
          }
        })
    .then(data=>{
        $("#cityName").append(
            `<h1 id="cityName">${data.name} ${DateNow()} <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="icon"></h1>
            <p>Temperature: ${KtoF(data.main.temp).toFixed(3).replace(/\.(\d\d)\d?$/, '.$1')} °F</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} MPH</p>`
        )
        getUvIndex(data.coord.lat, data.coord.lon)
        getFivedayForcast(cityName)
    }).catch((error) => {
        console.log(error)
  }); 
});


async function getUvIndex(lat,lon){
    const uvUrl=`https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`
      await fetch(uvUrl)
     .then(response=>response.json())
     .then(data=>{
        $("#cityName").append(`<div class="d-flex"><div>UV Index: </div><div class="ml-1 uv">${data.value}</div></div> `);
     })
}

$(document).ready(function(){
    $("#history-item").click(function(){
      alert("The paragraph was clicked.");
    });
  });
  function Clearsearch() {

    document.getElementById("myInput").value = "";
   
}

