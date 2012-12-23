(function(){
	var CONFIG = {
		marker_number: 1,
		marker_width: 80,
		animation_speed: 50,
		current_month_data: {},
		start_lat: 40.81069108268215,
		start_lng: -73.94622802734375,
		na_lat: 40.909361,
		na_lng: -74.230714,
		start_zoom: 10
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
			return 'h'
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

	var popMarker = function(){
		var mark_number_pop = CONFIG.marker_number;
		$('#marker_' + mark_number_pop).delay(1)
                                       .queue(function(n) {
                                          $(this).addClass('expand-marker');
                                       n();
                                       })
									   .css({
										'margin-top': '-=' + CONFIG.marker_width/2 + 'px!important',
										'margin-left': '-=' + CONFIG.marker_width/2 + 'px!important'
		});
		CONFIG.marker_number++;
	}

	var addMarker = function(sqf_incident){
		var mark_number_add = CONFIG.marker_number;
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

		var center = new L.LatLng(lat, lng);
		var marker = new L.CustomMarker(center);
		map.addLayer(marker);
		$('#marker_' + mark_number_add).bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
			$(this).remove();
		}).addClass(race_arstmade);
		popMarker();
	}

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

			var current_time = new Date(ui.value*1000);
			var current_time_string = String(current_time);
			$('#time-display').html(current_time_string);

			if (CONFIG.current_month_data[ui.value]){
				var sqf_incident = CONFIG.current_month_data[ui.value];
				$.each(sqf_incident, function(key, value){
					addMarker(value);
				})
			}


		},
		slide: function(event, ui) {
			//manually

			// startingTime = ui.value;
			// realTime = new Date((ui.value)*1000)
			// var realTimeString = String(realTime)
			// $( "#time_display" ).html(realTimeString);

			//loopFeatures();
			//createJSONLists();
		}
	});

	function timer(){
		//grab the current tiem from the slider
		var interval = $("#slider").slider("value");

		//add a minute to it in unix time
		interval = interval + 60;

		//make this variable for some reason
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


	d3.csv('data/head_sqf_edward2000.csv', function(csv){
		// Nest the entries by unix_timestamp
		var nested = d3.nest()
		    .key(function(d) { return d.unix_time; })
		    .entries(csv);

		// Create a hash for this month's data that can be accessed
		// via the unix_timestamp
		nested.forEach(function(o){
			u_t = o.key;
			CONFIG.current_month_data[u_t] = o.values
		});

	});

	// var ds = new Miso.Dataset({
	//   url : 'data/head_sqf_edward.csv',
	//   delimiter : ','
	// });

	// ds.fetch({
	// 	success : function() {

	// 		var rows = this.toJSON();

	// 		$.each(rows, function(key, value){
	// 			var u_t = value.unix_time
	// 			CONFIG.current_month_data[u_t] = value;

	// 		});
	// 		console.log(CONFIG.current_month_data)

	// 	} // End Success
	// });


	 //    var chart = new Highcharts.Chart({
		//     chart: {
		//         renderTo: 'area-chart-canvas',
		//         type: 'area',
		//         // margin: 0,
		//         spacingBottom: 3,
		//         spacingLeft: -50,
		//         spacingRight: -20
		//     },
		//     legend:{
		//     	enabled: false
		//     },
		//     title: {
		//         text: ''
		//     },
		//     subtitle: {
		//         text: ''
		//     },
		//     xAxis: {
		//     	gridLineWidth: -1,
		//     	enabled: false,
		//         categories: ['1750', '1800', '1850', '1900', '1950', '1999', '2050'],
		//         title: {
		//             enabled: false
		//         }
		//     },
		//     yAxis: {
		//     	gridLineWidth: -1,
		//     	enabled: false,
		//         title: {
		//             text: ''
		//         },
		//         labels: {
		//             formatter: function() {
		//                 return this.value / 1000;
		//             }
		//         }
		//     },
		//     tooltip: {
		//         formatter: function() {
		//             return ''+
		//                 this.x +': '+ Highcharts.numberFormat(this.y, 0, ',') +' millions';
		//         },
		// 		borderRadius:1,
		// 		borderWidth:1,
		// 		shadow:false
		//     },
		//     plotOptions: {
		//         area: {
		//             stacking: 'normal',
		//             lineColor: '#666666',
		//             lineWidth: 0,
		//             marker: {
		//                 lineWidth: 0,
		//                 lineColor: 'transparent',
		//                 enabled: false,
		//                 states: {
	 //                        hover: {
	 //                            enabled: false
	 //                        }
	 //                    }
		//             }
		//         }
		//     },
		//     credits:{
		//     	enabled: false
		//     },
		//     series: [{
		// 	        name: 'Asia',
		// 	        color: '#3887bf',
		// 	        data: [502, 635, 809, 947, 1402, 3634, 5268]
		// 	    }, {
		// 	        name: 'Africa',
		// 	        color: '#e05b18',
		// 	        data: [106, 107, 111, 133, 221, 767, 1766]
		// 	    }, {
		// 	        name: 'Europe',
		// 	        color: '#34a359',
		// 	        data: [163, 203, 276, 408, 547, 729, 628]
		// 	    }, {
		// 	        name: 'America',
		// 	        color: '#bd1f8c',
		// 	        data: [18, 31, 54, 156, 339, 818, 1201]
		//     }]
		// }); // End Highcharts


	// $('#area-chart-canvas').hover( function(){
	// 	$('#animation-scrubber').show();
	// }, function(){
	// 	$('#animation-scrubber').hide();
	// });

	// $('#area-chart-canvas').mousemove(function(e){
	// 	$('#animation-scrubber').offset({
	// 		'left': e.pageX - 20
	// 	})
	// });
	// $('.month-select').click(function(){
	// 	var month = $(this).attr('data-month-select');
	// 	console.log(month);
	// });

	$('#play-btn').click( function(){
		var $this = $(this);
		if ($this.html() == 'play'){
			$this.html('stop');
			playTimer();

		}else{
			$this.html('play');
			stopTimer();
		}
	});

	// create a map in the "map" div, set the view to a given place and zoom
	var map = new L.Map('map-canvas').setView(new L.LatLng(CONFIG.start_lat, CONFIG.start_lng), CONFIG.start_zoom);

	// replace "toner" here with "terrain" or "watercolor"
	// var layer = new L.StamenTileLayer("toner-background");
	var tile_url = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/48535/256/{z}/{x}/{y}.png'
	var layer = new L.TileLayer(tile_url, {attribution:"Mapbox"});
	map.addLayer(layer);
	// var marker = L.marker([40.81069108268215, -73.94622802734375]).addTo(map);

	// Test
	$(document).keyup(function(e) {
	  if (e.keyCode == 27){
		$('.leaflet-marker-custom').addClass('expand-marker').css({
			'margin-top': '-=' + CONFIG.marker_width/2 + 'px!important',
			'margin-left': '-=' + CONFIG.marker_width/2 + 'px!important'
		});
	  }
	});

})();