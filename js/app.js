(function(){
	var CONFIG = {
		marker_number: 1,
		marker_width: 80,
		animation_speed: 50,
		current_month_data: {},
		sunrise_sunset: {},
		night: true,
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
		popBar(mark_number);
	}

	var configData = function(sqf_incident){
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
		addBar(mark_number, race_arstmade);
	}

	var addMarker = function(mark_number, lat, lng, race_arstmade){
		var center = new L.LatLng(lat, lng);
		var marker = new L.CustomMarker(center);
		map.addLayer(marker);
		$('#marker_' + mark_number).bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
			$(this).remove();
		}).addClass(race_arstmade);
		popMarker(mark_number);
	}

	// Used to format the timestamp NYC time, instead of the user's time zone
	moment.fn.formatInZone = function(format, offset) {
   		return this.clone().utc().add('hours', offset).format(format);
	}

// moment().formatInZone('HH:mm:ss', -7);

	// Starting Jan 1 2011 0:0:00, ending jan 31 2011 23:59:59
    $( "#slider" ).slider({
		value: 1293858000,
		min: 1293858000,
		max: 1296536399,
		step: 60,
		stop: function(event,ui){
			// preventDefault = true;

		},
		change: function(event,ui){
			//Programatically

			// The human readable time at offset -5
			// need to add support for daylight savings time
			var day_date_string = moment(ui.value*1000).formatInZone('ddd MMM D YYYY', -5);
			var time_string = moment(ui.value*1000).formatInZone('hh:mm', -5);
			var time_string24h = moment(ui.value*1000).formatInZone('HH:mm', -5);
			var am_pm = moment(ui.value*1000).formatInZone('a', -5);

			// The month, date and hour for the sunrise, sunset
			var month = moment(ui.value*1000).formatInZone('M', -5);
			var day = moment(ui.value*1000).formatInZone('D', -5);

			var thisMonth_sunriseSunset = CONFIG.sunrise_sunset[month];

			// day-1 so that the day matches the node number
			// a little hacky but avoids renesting the data
			var today_sunriseSunset = CONFIG.sunrise_sunset[month][day-1];

			var today_sunrise = today_sunriseSunset.rise;
			var today_sunset  = today_sunriseSunset.set;

			// Check whether the sun has risen or set
			sunTimes(time_string24h, today_sunrise, today_sunset);




			$('#time-display').html(day_date_string + '<br/><span class="time">' + time_string +'<span class="am_pm">' + am_pm + '</span>'+ '</span>');

			if (CONFIG.current_month_data[ui.value]){
				var sqf_incident = CONFIG.current_month_data[ui.value];
				$.each(sqf_incident, function(key, value){
					configData(value);
				})
			}


		},
		slide: function(event, ui) {
			//manually

			// The human readable time at offset -5
			// need to add support for daylight savings time
			var day_date_string = moment(ui.value*1000).formatInZone('ddd MMM D YYYY', -5);
			var time_string = moment(ui.value*1000).formatInZone('hh:mm', -5);
			var time_string24h = moment(ui.value*1000).formatInZone('HH:mm', -5);
			var am_pm = moment(ui.value*1000).formatInZone('a', -5);

			// The month, date and hour for the sunrise, sunset
			var month = moment(ui.value*1000).formatInZone('M', -5);
			var day = moment(ui.value*1000).formatInZone('D', -5);

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
		realTime = new Date(unix_timeStamp*1000)
		var realTimeString = String(realTime)

		//set the slider value
		//the slider's events handle the rest
		$("#slider").slider("value",interval)
	}

	function playTimer(){
		window.time_var = setInterval(function(){timer()}, CONFIG.animation_speed);
	}

	function stopTimer(){
		var end_int = clearInterval(time_var);
	}


	d3.csv('data/sqf_edward_subset_jan.csv', function(csv){
		// Nest the entries by unix_timestamp
		var nested = d3.nest()
		    .key(function(d) { return d.unix_time; })
		    .entries(csv);

		// Create a hash for this month's data that can be accessed
		// via the unix_timestamp
		nested.forEach(function(o){
			var u_t = o.key;
			CONFIG.current_month_data[u_t] = o.values;
		});

	});

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

		// Only fire if it isn't already selected
		if (!$(this).hasClass('selected')) {
			playTimer();
			var $playBtn = $('#play-btn');
			$playBtn.html('Stop');
			$playBtn.show();

			$('#animation-drawer .overlay-select').removeClass('selected');
			$(this).addClass('selected');
			$('#slider-container').show();
   		}
	});

	$('#play-btn').click( function(){
		var $this = $(this);
		if ($this.html() == 'Play'){
			$this.html('Stop');
			playTimer();
		}else{
			$this.html('Play');
			stopTimer();
		}
	});

	var map = new L.Map('map-canvas').setView(new L.LatLng(CONFIG.start_lat, CONFIG.start_lng), CONFIG.start_zoom);

	var day_url   = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/48535/256/{z}/{x}/{y}.png';
	var night_url = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/82102/256/{z}/{x}/{y}.png';
	var day_layer   = new L.TileLayer(day_url,   {attribution:"Mapbox"});
	var night_layer = new L.TileLayer(night_url, {attribution:"Mapbox"});

	map.addLayer(night_layer);


	// Test
	$(document).keyup(function(e) {
	  if (e.keyCode == 27){
	  	map.removeLayer(day_layer);
	  	map.addLayer(night_layer);
		// $('.leaflet-marker-custom').addClass('expand-marker').css({
		// 	'margin-top': '-=' + CONFIG.marker_width/2 + 'px!important',
		// 	'margin-left': '-=' + CONFIG.marker_width/2 + 'px!important'
		// });
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


})();