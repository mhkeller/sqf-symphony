(function(){
	var CONFIG = {
		marker_number: 2,
		marker_width: 80,
		animation_speed: 50,
		current_month_data: {},
		sunrise_sunset: {},
		night: true,
		isPlaying: false,
		start_lat: 40.81069108268215,
		start_lng: -73.94622802734375,
		na_lat: 40.909361,
		na_lng: -74.230714,
		start_zoom: 10,
		sound_bN: null,
		sound_bY: null,
		sound_hN: null,
		sound_hY: null,
		sound_wN: null,
		sound_wY: null,
		sound_aN: null,
		sound_aY: null,
		sound_oN: null,
		sound_oY: null
	}

	// A function to boil down the multiple race categories to just a few
	var mergeRaces = function(race){
		if (race == 'B'){
			// If Black return Black
			return race.toLowerCase();
		}else if (race == 'P'){
			// Black Hispanic return Hispanic
			return 'h';
		}else if (race == 'Q'){
			// White Hispanic return hispanic
			return 'h';
		}else if (race == 'W'){
			// White return white
			return race.toLowerCase();
		}else if (race == 'A'){
			// Asian return asian
			return race.toLowerCase();
		}else if (race == 'I'){
			// American Indian/Alaskan Native return Other
			return 'o';
		}else if (race == 'X'){
			// Unknown return Other
			return 'o';
		}else if (race == 'Z'){
			// Other return Other
			return 'o';
		}else if (race == 'U'){
			// Another way NYPD marks other, although not officially in the codebook
			return 'o';
		}
	}

	var sunTimes = function(current_time, current_sunrise, current_sunset){
		var time = moment(current_time, "HH:mm");
		var sunrise = moment(current_sunrise, "HH:mm");
		var sunset = moment(current_sunset, "HH:mm");

		if (time < sunrise){
			map.removeLayer(day_layer);
			map.addLayer(night_layer);
		}else if(time < sunset){
	  		map.removeLayer(night_layer);
	  		map.addLayer(day_layer);
	  	}else{
			map.removeLayer(day_layer);
			map.addLayer(night_layer);
	  	}


		// if (changed == false){
		//   	map.removeLayer(night_layer);
		//   	map.addLayer(day_layer);
		// }else{
		//   	map.removeLayer(day_layer);
		//   	map.addLayer(night_layer);
		// }
	}

	// Expands the marker
	// You need the delay so that the CSS transition has something to transition *to*
	// If you just add the class, it doesn't animate, it just takes the styles of that class
	var popMarker = function(mark_number){
		$('#marker_' + mark_number).delay(1)
									.queue(function(n) {
										$(this).addClass('expand-marker');
										n();
									})
		CONFIG.marker_number++;
	}

	var playSound = function(race_arstmade){
		var thisSound = CONFIG['sound_' + race_arstmade];
		var source = context.createBufferSource(); // creates a sound source
		source.buffer = thisSound;                 // tell the source which sound to play
		source.connect(context.destination);       // connect the source to the context's destination (the speakers)
		source.noteOn(0);                          // play the source now
	}

	// Sets one of two possibilities
	// If the person was arrested, it gives it a slower animation
	// This is done for the circles slightly differently, it applies a different duration based on its arrested class
	// TODO change the bar behavior to CSS transitions
	var popBar = function(mark_number){
		var $bar = $('#bar_' + mark_number)
		if ($bar.hasClass('N')){
			$bar.animate({
				height: "20px"
			},20, function(){
				$(this).fadeOut(function(){
					$(this).remove();
				});
			});
		}else{
			$bar.animate({
				height: "20px"
			},500, function(){
				$(this).delay(600).fadeOut(800,function(){
					$(this).remove();
				});
			});
		}
	}

	var addBar = function(mark_number, race_arstmade){
		var arstmade = race_arstmade.substring(1,2);
		var bar_div = '<div id="bar_'+mark_number+'" class="bar '+arstmade+'"></div>'
		$('#col-'+race_arstmade+' .bar-container').append(bar_div);
	}

	var plotData = function(sqf_incident){
		var mark_number = CONFIG.marker_number;
		// If the stop has no lat/lng put it in New Jersey
		if (sqf_incident.lat != 'NA'){
			var lat = sqf_incident.lat;
			var lng = sqf_incident.lng;
		}else{
			var lat = CONFIG.na_lat;
			var lng = CONFIG.na_lng;
		}
		var race = mergeRaces(sqf_incident.race);
		var arstmade = sqf_incident.arstmade;
		var race_arstmade = race + arstmade;

		playSound(race_arstmade);
		addMarker(mark_number, lat, lng, race_arstmade);
		popMarker(mark_number);
		addBar(mark_number, race_arstmade);
		popBar(mark_number);
	}

	var addMarker = function(mark_number, lat, lng, race_arstmade){
		var center = new L.LatLng(lat, lng);
		var marker = new L.CustomMarker(center);
		map.addLayer(marker);

		// This removes the marker when the CSS transition ends
		$('#marker_' + mark_number).bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
			$(this).remove();
		}).addClass(race_arstmade);
	}

	// Used to format the timestamp NYC time, instead of the user's time zone
	// TODO I hear moment.js has an addon that handles timezomes, possibly called timezone.js
	moment.fn.formatInZone = function(format, offset) {
   		return this.clone().utc().add('hours', offset).format(format);
	}


	var calculateDayLightSavings = function(unix_timestamp){
		// 2am March 13th, 2011, NYC Time
		var GMT_begin_daylightsavings = 1299996000;
		// 2am Nov 6, 2011, NYC Time
		var GMT_end_daylightsavings = 1320562800;

		var d = new Date()
		var o = d.getTimezoneOffset()/60*-1;


		if (unix_timestamp < GMT_begin_daylightsavings){
			return o-1
		}else if (unix_timestamp < GMT_end_daylightsavings){
			return o
		}else{
			return o-1
		}
	}


	function figureOutHumanTimesFromUnix(ui_value){
		// calculate the GMT offset based on whether daylight savings is in effect
		var offset = calculateDayLightSavings(Number(ui_value));


		var day_date_string = moment(ui_value*1000).formatInZone('ddd MMM D YYYY', offset);

		var time_string = moment(ui_value*1000).formatInZone('h:mm', offset);
		var time_string24h = moment(ui_value*1000).formatInZone('HH:mm', offset);
		var am_pm = moment(ui_value*1000).formatInZone('a', offset);

		// The month, date and hour for the sunrise, sunset
		var month = moment(ui_value*1000).formatInZone('M', offset);
		var day = moment(ui_value*1000).formatInZone('D', offset);

		var thisMonth_sunriseSunset = CONFIG.sunrise_sunset[month];

		// day-1 so that the day matches the node number
		// a little hacky but avoids renesting the data
		var today_sunriseSunset = CONFIG.sunrise_sunset[month][day-1];

		var today_sunrise = today_sunriseSunset.rise;
		var today_sunset  = today_sunriseSunset.set;

		// Check whether the sun has risen or set
		sunTimes(time_string24h, today_sunrise, today_sunset);


		$('#time-display').html(day_date_string + '<br/><span class="time">' + time_string +'<span class="am_pm">' + am_pm + '</span>'+ '</span>');



	}

	// Starting Jan 1 2011 0:0:00, ending jan 31 2011 23:59:59
    $( "#slider" ).slider({
		// value: 1293858000,
		// min: 1293858000,
		// max: 1296536399,
		step: 60,
		stop: function(event,ui){
			// preventDefault = true;

		},
		change: function(event,ui){
			//Programatically
			figureOutHumanTimesFromUnix(ui.value)

			if (CONFIG.current_month_data[ui.value]){
				var sqf_incident = CONFIG.current_month_data[ui.value];
				$.each(sqf_incident, function(key, value){
					plotData(value);
				})
			}
			// If it's the max, stop
			if (ui.value == $("#slider").slider("option","max")){
				var month = moment(ui.value*1000).format('MM');
				console.log(month);
				clearData();

				var month_display = String('0'+(Number(month)+1));
				pullData(month_display);
				resetSlider(Number(month_display));

				playTimer();
			}


		},
		slide: function(event, ui) {
			//manually

			figureOutHumanTimesFromUnix(ui.value)

			// var offset = calculateDayLightSavings(Number(ui.value))
			// // The human readable time at offset -5
			// // need to add support for daylight savings time
			// var day_date_string = moment(ui.value*1000).formatInZone('ddd MMM D YYYY', offset);
			// var time_string = moment(ui.value*1000).formatInZone('h:mm', offset);
			// var time_string24h = moment(ui.value*1000).formatInZone('HH:mm', offset);
			// var am_pm = moment(ui.value*1000).formatInZone('a', offset);

			// // The month, date and hour for the sunrise, sunset
			// var month = moment(ui.value*1000).formatInZone('M', offset);
			// var day = moment(ui.value*1000).formatInZone('D', offset);

			// var thisMonth_sunriseSunset = CONFIG.sunrise_sunset[month];

			// // day-1 so that the day matches the node number
			// // a little hacky but avoids renesting the data
			// var today_sunriseSunset = CONFIG.sunrise_sunset[month][day-1];

			// var today_sunrise = today_sunriseSunset.rise;
			// var today_sunset  = today_sunriseSunset.set;

			// // Check whether the sun has risen or set
			// sunTimes(time_string24h, today_sunrise, today_sunset);


			// $('#time-display').html(day_date_string + '<br/><span class="time">' + time_string +'<span class="am_pm">' + am_pm + '</span>'+ '</span>');


		}
	});

	function timer(){
		//grab the current tiem from the slider
		var interval = $("#slider").slider("value");
		var one_minute = 60;
		//add a minute to it in unix time
		interval = interval + one_minute;

		//change the name
		unix_timeStamp = interval;

		//generate a pretty time for the time box
		realTime = new Date(unix_timeStamp*1000);
		var realTimeString = String(realTime);

		//set the slider value
		//the slider's events handle the rest
		$("#slider").slider("value",interval);
	}

	function playTimer(){
		window.time_var = setInterval(function(){timer()}, CONFIG.animation_speed);
		$('#play-btn').html('Stop');
		CONFIG.isPlaying = true;
	}

	function stopTimer(){
		var end_int = clearInterval(time_var);
		$('#play-btn').html('Play');
		CONFIG.isPlaying = false;
	}

	var clearData = function(){
		if (CONFIG.isPlaying == true){
			stopTimer();
		};
		CONFIG.current_month_data = {};

	}

	var resetSlider = function(month_id){
		var days;
		if (month_id == 4 || month_id == 6 || month_id == 9 || month_id == 11){
			days = 30
		}else if (month_id == 2){
			days = 28
		}else{
			days = 31
		}

		// I don't know why you need to subtract one for this to work
		var start_date = new Date(2011, (month_id-1), 1).getTime()/1000;
		var end_date   = new Date(2011, (month_id-1), days, 23, 59, 59).getTime()/1000;

		$("#slider").slider('option',{min: start_date, max: end_date});
		$("#slider").slider('value',start_date);
	}

	var pullData = function(month_display){
		d3.csv('data/sqf_edward_subset_'+month_display+'.csv', function(csv){
			// Nest the entries by unix_timestamp
			var nested = d3.nest()
			    .key(function(d) { ;return d.unix_time; })
			    .entries(csv);

			var time_array = [];

			// Create a hash for this month's data that can be accessed
			// via the unix_timestamp
			nested.forEach(function(o){
				var u_t = o.key;
				CONFIG.current_month_data[u_t] = o.values;
			});
			// When done constructing the data, start playing
			$('#play-btn').show();
			$('#slider-container').show();


		});

	}




	// d3.csv('data/sqf_edward_subset_jan.csv', function(csv){
	// 	// Nest the entries by unix_timestamp
	// 	var nested = d3.nest()
	// 	    .key(function(d) { return d.unix_time; })
	// 	    .entries(csv);

	// 	// Create a hash for this month's data that can be accessed
	// 	// via the unix_timestamp
	// 	nested.forEach(function(o){
	// 		var u_t = o.key;
	// 		CONFIG.current_month_data[u_t] = o.values;
	// 	});

	// });


	// Grab some data for the sunrise and sunset times for 2011
	// This will switch the tile background from night to day
	// TODO possibly a slower transition or a twilight tile
	d3.csv('data/sunrise_sunset_clean.csv', function(times){
		// Nest the entries by month
		var nested_times = d3.nest()
		    .key(function(d) { return d.month; })
		    .entries(times);

		// Create a hash that can be accessed by the month as a number
		nested_times.forEach(function(o){
			var m_d = o.key;
			CONFIG.sunrise_sunset[m_d] = o.values;
		});

	});

	$('#animation-drawer').on('click', '.month-select', function(){
		$('#animation-drawer .overlay-select').removeClass('selected');
		$(this).addClass('selected');
	});

	$('#animation-drawer').on('click', '.month-select-text', function(){

		// Only fire if it isn't already selected
		if (!$(this).hasClass('selected')) {
						var month_display = $(this).attr('data-month-select');
			clearData();
			pullData(month_display);
			resetSlider(Number(month_display));

			// Play
			playTimer();


			// CSS
			// $('#animation-drawer .overlay-select').removeClass('selected');
			// $(this).parent().addClass('selected');

   		}
	});

	$('#play-btn').click( function(){
		if (CONFIG.isPlaying == false){
			playTimer();
		}else{
			stopTimer();
		}
	});

	$('#animation-drawer').mousemove(function(e){
		$('#heatmap-hover-window').css({
			'top':e.pageY - 5,
			'left':e.pageX + 25
		})
	});



	var map = new L.Map('map-canvas').setView(new L.LatLng(CONFIG.start_lat, CONFIG.start_lng), CONFIG.start_zoom);

	// Day / night tiles
	var day_url   = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/48535/256/{z}/{x}/{y}.png';
	var night_url = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/82102/256/{z}/{x}/{y}.png';
	var day_layer   = new L.TileLayer(day_url,   {attribution:"Mapbox"});
	var night_layer = new L.TileLayer(night_url, {attribution:"Mapbox"});

	map.addLayer(night_layer);


	initOverlays();

	function initOverlays(){
		var adj_lat = CONFIG.na_lat - .045,
			adj_lng = CONFIG.na_lng - .058;

	  	var center = new L.LatLng(adj_lat, adj_lng);
		var marker = new L.CustomMarker(center);
		map.addLayer(marker);


		var c = '<div class="na-text">non-geotagged stops</div>';
		
		$('#marker_1').css({
			'width':'80px',
			'height': '80px',
			'border': '3px dashed #31D6EC',
			'background-color': 'transparent',
			'border-radius':'0',
			'opacity':'.35'
		}).html(c).removeClass('leaflet-marker-custom').removeClass('leaflet-clickable');
	}











/****************************/
/* H E A T M A P   C O D E  */
/****************************/

	var DATA = {
		max: null,
		min: null
	};

	var SETTINGS = {
		block_width: 34.6,
		color_bins: 7
	}

	var width = 50,
	    height = 65,
	    cellSize = 8; // cell size

	var day = d3.time.format("%w"),
		month = d3.time.format("%m"),
		// D3's %U formatter returns the week number of a given year
		// we want the week number of a given month
	    week = d3.time.format("%U"),
	    day_of_the_month = d3.time.format('%e'),
	    week_of_the_month = function(day_of_the_month){
	    	var week_number = Math.ceil(day_of_the_month/7);
	    	return week_number;
	    },
	    addCommas = function(nStr){
    	    nStr += '';
		    var x = nStr.split('.');
		    var x1 = x[0];
		    var x2 = x.length > 1 ? '.' + x[1] : '';
		    var rgx = /(\d+)(\d{3})/;
		    while (rgx.test(x1)) {
		      x1 = x1.replace(rgx, '$1' + ',' + '$2');
		    }
		    return x1 + x2;
	    }
	    format = d3.time.format("%Y-%m-%d");


	var color = d3.scale.linear()
	    .domain([0, 3500]) // Max of stops on a single day
	    .range([1, SETTINGS.color_bins]);

	function getCurrentClassListAddHighlight(d3_node){
		// Traverse the svg tree to get the list of current classes
		var classes = d3_node[0][0].className.animVal + ' highlighted';
		return classes;
	}
	function getCurrentClassListRemoveHighlight(d3_node){
		// Traverse the svg tree to get the list of current classes
		var classes = d3_node[0][0].className.animVal;
		var no_highlight = classes.replace(' highlighted','');
		return no_highlight;
	}
	function extractMonthDay(d){
		var month = d.substring(5,10)
		// return month
	}
	function jumpToDay(d){
		var month = d.substring(5,7);
		pullData(month);
		var day = d.substring(8,10);
		resetSlider(Number(month))

		var this_date = new Date(2011, (month-1), day).getTime()/1000;
		// // Jump to day
		$("#slider").slider('value',this_date);
		playTimer();


	}

	function showHeatmapHoverInfo(d, data){
		var $heat_vlt = $('#heatmap-hover-window');

		var date = d;
		var stops = data[d];
		var moment_date = moment(d, 'YYY-MM-DD');
		var pretty_date = moment_date.format('ddd, MMM Do')

		$heat_vlt.html(pretty_date + ': ' + addCommas(stops) + ' stops')
		$heat_vlt.show();
	}

	function hideHeatmapHover(){
		$('#heatmap-hover-window').hide();
	}


	function plotMonth(month_key){
		var svg = d3.select("#heat-map-"+month_key).selectAll("svg")
		    .data([month_key])
		    // .data(d3.range(2011, 2012))
		  .enter().append("svg")
		    .attr("width", width)
		    .attr("height", height)
		    .attr("class", "heat-map-box")


		var rect = svg.selectAll(".day")
		    // .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
		    .data(function(d) { return d3.time.days(new Date(2011, d, 1), new Date(2011, d + 1, 1)); })
		  .enter().append("rect")
		    .attr("class", "day")
		    .attr("width", cellSize)
		    .attr("height", cellSize)
		    .attr("x", function(d) { return week(d) * cellSize - (month(d)-1)*SETTINGS.block_width; })
		    // .attr("x", function(d) { return week_of_the_month(day_of_the_month(d)) * cellSize })
		    .attr("y", function(d) { return day(d) * cellSize; })
		    .datum(format)
		    // .on("mouseover", function(d){  })
		    // .on("mouseout",  function(d){  })
		    .on("click", function(d){clearData();jumpToDay(d)});

		// rect.append("title")
		//     .text(function(d) { return d; });

		d3.csv("data/sqf_2011_day_counts.csv", function(error, csv) {
		  var data = d3.nest()
		    .key(function(d) { return '2011-' + d.monthstop + '-' + d.daystop; })
		    .rollup(function(d) { return d[0].stop_counts; })
		    .map(csv);

		    var stop_array = [];
		    csv.forEach(function(n){
		    	stop_array.push(Number(n.stop_counts));
		    });

		  DATA.max = d3.max(stop_array);
		  DATA.min = d3.min(stop_array);
		  rect.filter(function(d) { return d in data; })
		      .attr("class", function(d) { return "day box-" + Math.round(color(data[d])); })
		      .on('mouseover', function(d){showHeatmapHoverInfo(d,data);d3.select(this).attr('class', getCurrentClassListAddHighlight(d3.select(this)));})
		      .on('mouseout', function(d){hideHeatmapHover();d3.select(this).attr('class', getCurrentClassListRemoveHighlight(d3.select(this)))})
		    .select("title")
		      .text(function(d) { return d.replace('2011-0','').replace('2011-','').replace('-','/') + ": " + addCommas(data[d]) + ' stops'; })
		});
	}

	// Hack for plotting the months as separate svg elements
	// so they can have spaces between them and be used as buttons
	for (var i = 0; i < 12; i++){
		plotMonth(i);
	}

	// $('.day').mouseover( function(e){
	// 	var title = $(this).children()[0].textContent;
	// 	// console.log(title)
	// 	var node = $(this).children();
	// 	// console.log(node)

	// });






























































	// Test
	$(document).keyup(function(e) {
	  if (e.keyCode == 27){
	  	console.log('there')
	  	// map.removeLayer(day_layer);
	  	// map.addLayer(night_layer);




	  }
	});

	// Add Sounds
	var context = new webkitAudioContext();

	//#################
	//# First Sound - Black not arrested
	//#################

	var sound_bN_request = new XMLHttpRequest();
	sound_bN_request.open('GET', "sounds/sound_bN.mp3", true);
	sound_bN_request.responseType = 'arraybuffer';

	// Decode asynchronously
	sound_bN_request.onload = function() {
	  context.decodeAudioData(sound_bN_request.response, function(buffer) {
	    CONFIG.sound_bN = buffer;

	  });
	}
	sound_bN_request.send();

	//#################
	//# Next Sound - Black arrested
	//#################

	var sound_bY_request = new XMLHttpRequest();
	sound_bY_request.open('GET', "sounds/sound_bY.mp3", true);
	sound_bY_request.responseType = 'arraybuffer';

	// Decode asynchronously
	sound_bY_request.onload = function() {
	  context.decodeAudioData(sound_bY_request.response, function(buffer) {
	    CONFIG.sound_bY = buffer;

	  });
	}
	sound_bY_request.send();


	//#################
	//# Next Sound - Hispanic not arrested
	//#################

	var sound_hN_request = new XMLHttpRequest();
	sound_hN_request.open('GET', "sounds/sound_hN.mp3", true);
	sound_hN_request.responseType = 'arraybuffer';

	// Decode asynchronously
	sound_hN_request.onload = function() {
	  context.decodeAudioData(sound_hN_request.response, function(buffer) {
	    CONFIG.sound_hN = buffer;

	  });
	}
	sound_hN_request.send();

	//#################
	//# Next Sound - Hispanic arrested
	//#################

	var sound_hY_request = new XMLHttpRequest();
	sound_hY_request.open('GET', "sounds/sound_hY.mp3", true);
	sound_hY_request.responseType = 'arraybuffer';

	// Decode asynchronously
	sound_hY_request.onload = function() {
	  context.decodeAudioData(sound_hY_request.response, function(buffer) {
	    CONFIG.sound_hY = buffer;

	  });
	}
	sound_hY_request.send();


	//#################
	//# Next Sound - White not arrested
	//#################

	var sound_wN_request = new XMLHttpRequest();
	sound_wN_request.open('GET', "sounds/sound_wN.mp3", true);
	sound_wN_request.responseType = 'arraybuffer';

	// Decode asynchronously
	sound_wN_request.onload = function() {
	  context.decodeAudioData(sound_wN_request.response, function(buffer) {
	    CONFIG.sound_wN = buffer;

	  });
	}
	sound_wN_request.send();

	//#################
	//# Next Sound - White arrested
	//#################

	var sound_wY_request = new XMLHttpRequest();
	sound_wY_request.open('GET', "sounds/sound_wY.mp3", true);
	sound_wY_request.responseType = 'arraybuffer';

	// Decode asynchronously
	sound_wY_request.onload = function() {
	  context.decodeAudioData(sound_wY_request.response, function(buffer) {
	    CONFIG.sound_wY = buffer;

	  });
	}
	sound_wY_request.send();



	//#################
	//# Next Sound - Asian not arrested
	//#################

	var sound_aN_request = new XMLHttpRequest();
	sound_aN_request.open('GET', "sounds/sound_aN.mp3", true);
	sound_aN_request.responseType = 'arraybuffer';

	// Decode asynchronously
	sound_aN_request.onload = function() {
	  context.decodeAudioData(sound_aN_request.response, function(buffer) {
	    CONFIG.sound_aN = buffer;

	  });
	}
	sound_aN_request.send();

	//#################
	//# Next Sound - Asian arrested
	//#################

	var sound_aY_request = new XMLHttpRequest();
	sound_aY_request.open('GET', "sounds/sound_aY.mp3", true);
	sound_aY_request.responseType = 'arraybuffer';

	// Decode asynchronously
	sound_aY_request.onload = function() {
	  context.decodeAudioData(sound_aY_request.response, function(buffer) {
	    CONFIG.sound_aY = buffer;

	  });
	}
	sound_aY_request.send();


	//#################
	//# Next Sound - Other not arrested
	//#################

	var sound_oN_request = new XMLHttpRequest();
	sound_oN_request.open('GET', "sounds/sound_oN.mp3", true);
	sound_oN_request.responseType = 'arraybuffer';

	// Decode asynchronously
	sound_oN_request.onload = function() {
	  context.decodeAudioData(sound_oN_request.response, function(buffer) {
	    CONFIG.sound_oN = buffer;

	  });
	}
	sound_oN_request.send();

	//#################
	//# Next Sound - Other arrested
	//#################

	var sound_oY_request = new XMLHttpRequest();
	sound_oY_request.open('GET', "sounds/sound_oY.mp3", true);
	sound_oY_request.responseType = 'arraybuffer';

	// Decode asynchronously
	sound_oY_request.onload = function() {
	  context.decodeAudioData(sound_oY_request.response, function(buffer) {
	    CONFIG.sound_oY = buffer;

	  });
	}
	sound_oY_request.send();



}).call(this);