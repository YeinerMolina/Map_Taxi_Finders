const date_picker_element = document.querySelector('.date-picker');
const selected_date_element = document.querySelector('.date-picker .selected-date');
const dates_element = document.querySelector('.date-picker .dates');
const mth_element = document.querySelector('.date-picker .dates .month .mth');
const next_mth_element = document.querySelector('.date-picker .dates .month .next-mth');
const prev_mth_element = document.querySelector('.date-picker .dates .month .prev-mth');
const days_element = document.querySelector('.date-picker .dates .days');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let date = new Date();
let day = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();

let selectedDate = date;
let selectedDay = day;
let selectedMonth = month;
let selectedYear = year;

//Initialice the map
var map = L.map('map-template');
TileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
L.tileLayer(TileURL).addTo(map);
PolyArray = [];

//Create icon for marker
var MapIcon = L.Icon.extend({
    options: {
        iconSize: [40,40],
        iconAnchor: [22,94],
        popupAnchor: [-3,-76]
    }
})

//id of each row in the coords table
id = document.getElementById('id')
latitud = document.getElementById('latitud')
longitud = document.getElementById('longitud')
fecha = document.getElementById('fecha')
hora = document.getElementById('hora')  

//id for historics button
HistoricsForm = document.querySelector('#Historicos');
Real = document.querySelector('#Real');
//Sockets for connection to the backend 
const socket  = io();

//Connection for changed coords
socket.on('Server: NewUserCoordenates',(data) =>{
    Actualizar(data[data.length-1]);
    UpdateMap(data);
})

//Connection for historics required
socket.on('Server: NewHistorics',(data)=>{
    ActualizarHistoricos(data);
    Actualizar(data[data.length-1]);
})

HistoricsForm.addEventListener('click',()=>{
    TimeArray = [{Date: '2022-03-27', TimeI: '10:00', TimeF:'10:50'}];
    socket.emit("Client: RequiredHistoricos", TimeArray);
})

Real.addEventListener('click',()=>{
    socket.emit("Client: RequiredRealTimeLocation");
})


//Actualice the table data
function Actualizar(data){
    id.innerHTML = data.ID             // innerHTML establece la conexion en los id's 
    latitud.innerHTML = data.latitud
    longitud.innerHTML = data.longitud
    fecha.innerHTML = data.fecha.replace("T00:00:00.000Z","")
    hora.innerHTML = data.hora
}

//Actualice the marker position and poliline
function UpdateMap(data){
    Lat = data[0].latitud;
    Lon = data[0].longitud;
    PolyArray.push([Lat,Lon]);
    if (typeof marker !== 'undefined'){
        map.removeLayer(marker);
    }else{
        map.setView([Lat,Lon],14);
    }
    if (typeof PolyLine !== 'undefined'){
        map.removeLayer(PolyLine);
    }

    map.setView([Lat,Lon]);
    marker = L.marker([Lat,Lon]);
    PolyLine = L.polyline(PolyArray,{color:'red'})
    marker.bindPopup("Posición actual");
    map.addLayer(marker);
    map.addLayer(PolyLine);
}

function ActualizarHistoricos(data){
    HistoricsArray = [];
    center = [data[data.length-1].latitud,data[data.length-1].longitud];
    if (typeof marker !== 'undefined'){
        map.removeLayer(marker);
    }else{
        map.setView(center,14);
    }
    if (typeof PolyLine !== 'undefined'){
        map.removeLayer(PolyLine);
    }
    
    data.forEach(data => {
        HistoricsArray.push([data.latitud,data.longitud])
    })
    map.setView(center);
    marker = L.marker(center);
    PolyLine = L.polyline(HistoricsArray,{color:'blue'})
    marker.bindPopup("Última posición");
    
    mth_element.textContent = months[month] + ' ' + year;

selected_date_element.textContent = formatDate(date);
selected_date_element.dataset.value = selectedDate;

populateDates();

// EVENT LISTENERS
date_picker_element.addEventListener('click', toggleDatePicker);
next_mth_element.addEventListener('click', goToNextMonth);
prev_mth_element.addEventListener('click', goToPrevMonth);

// FUNCTIONS
function toggleDatePicker (e) {
	if (!checkEventPathForClass(e.path, 'dates')) {
		dates_element.classList.toggle('active');
	}
}

function goToNextMonth (e) {
	month++;
	if (month > 11) {
		month = 0;
		year++;
	}
	mth_element.textContent = months[month] + ' ' + year;
	populateDates();
}

function goToPrevMonth (e) {
	month--;
	if (month < 0) {
		month = 11;
		year--;
	}
	mth_element.textContent = months[month] + ' ' + year;
	populateDates();
}

function populateDates (e) {
	days_element.innerHTML = '';
	let amount_days = 31;

	if (month == 1) {
		amount_days = 28;
	}

	for (let i = 0; i < amount_days; i++) {
		const day_element = document.createElement('div');
		day_element.classList.add('day');
		day_element.textContent = i + 1;

		if (selectedDay == (i + 1) && selectedYear == year && selectedMonth == month) {
			day_element.classList.add('selected');
		}

		day_element.addEventListener('click', function () {
			selectedDate = new Date(year + '-' + (month + 1) + '-' + (i + 1));
			selectedDay = (i + 1);
			selectedMonth = month;
			selectedYear = year;

			selected_date_element.textContent = formatDate(selectedDate);
			selected_date_element.dataset.value = selectedDate;

			populateDates();
		});

		days_element.appendChild(day_element);
	}
}

// HELPER FUNCTIONS
function checkEventPathForClass (path, selector) {
	for (let i = 0; i < path.length; i++) {
		if (path[i].classList && path[i].classList.contains(selector)) {
			return true;
		}
	}
	
	return false;
}
function formatDate (d) {
	let day = d.getDate();
	if (day < 10) {
		day = '0' + day;
	}

	let month = d.getMonth() + 1;
	if (month < 10) {
		month = '0' + month;
	}

	let year = d.getFullYear();

	return day + ' / ' + month + ' / ' + year;
}
    map.addLayer(marker);
    map.addLayer(PolyLine);
}

