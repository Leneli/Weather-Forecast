/*
https://home.openweathermap.org/api_keys
http://openweathermap.org/weather-conditions
http://openweathermap.org/forecast5
http://openweathermap.org/weather-data#
http://api.openweathermap.org/data/2.5/weather?q=krasnodar&units=imperial&mode=html&appid=45490891dd760d7b77f361cc37f5a1c2

http://api.openweathermap.org/data/2.5/forecast/daily?q=moscow&units=imperial&cnt=5&appid=45490891dd760d7b77f361cc37f5a1c2#
*/


jQuery(function () {

	//переменные
	var cities, //json data
		input = $("#city-input"),
		h1 = $("#header"),
		more = $("#more"),
		table = $("#weather_tbody"),
		cityName,
		cityID,
		weather; //объект с погодными данными

	//Дни недели
	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	//Текущая дата
	var date = new Date;

	//шаблон для вставки строки в таблицу с погодой (underscore)
	var tbody_template = _.template("<tr><td><%= date %></td><td><img src='http://openweathermap.org/img/w/<%= icon %>.png' alt='<%= description %>' title='<%= description %>'></td><td><%= day %></td><td><%= night %></td><td><%= rain %></td><td><%= clouds %></td><td><%= humidity %></td><td><%= speed %></td><td><%= pressure %></td></tr>");


	//город по умолчанию - Москва
	cityName = "Moscow";
	cityID = 524901;
	//сразу после загрузки страницы вызывается функция, заполняющая виджет данными по городу по умолчанию (Москва)
	$(document).ready(showWeather(cityName, cityID));


	//заполнение списка городов названиями из файла /owm/city_list.json
	$.getJSON("/owm/city_name.json", function (data) {
		cities = data.cities;

		for (var i = 0; i < cities.length; ++i) {
			$("#city-list").append('<option value="' + cities[i].name + '">' + cities[i].name + '</option>');
		}
	});


	//выбор города из списка
	input.keyup(function (e) {
		if (e.keyCode === 13) {
			e = e || window.event;

			cityName = input[0].value;

			//определяем ID по названию города
			for (var i = 0; i < cities.length; ++i) {
				if (cities[i].name === cityName) {
					cityID = cities[i]._id;
					break;
				}
			}

			showWeather(cityName, cityID);
		}
	});


	//заполнение виджета данными
	function showWeather(city, _id) {

		//запрос к openweathermap.org для получения данных по погоде
		$.ajax({
			type: "GET",
			url: 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + city + '&units=imperial&cnt=5&appid=45490891dd760d7b77f361cc37f5a1c2#city',
			dataType: "json",
			success: function (jcondata) {
				weather = jcondata.list;

				table.empty();

				for (var i = 0; i < weather.length; ++i) {

					var day;

					if (i === 0) {
						day = "Today";
					} else {
						var j;
						j = date.getDay() + i;
						if (j > 6) {
							j -= 7;
						}
						day = days[j];
					}

					table.append(tbody_template({
						date: day,
						icon: weather[i].weather[0].icon,
						description: weather[i].weather[0].description,
						day: weather[i].temp.day,
						night: weather[i].temp.night,
						rain: weather[i].rain || 0,
						clouds: weather[i].clouds,
						humidity: weather[i].humidity,
						speed: Math.round(weather[i].speed),
						pressure: Math.round(weather[i].pressure),
					}));
				}
			}
		});

		//Заголовок виджета
		h1.html(cityName);

		//ссылка внизу виджета на страницу сайта http://openweathermap.org с подробной информацией по погоде
		more.attr("href", "http://openweathermap.org/city/" + _id);
	}
});