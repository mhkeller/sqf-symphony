(function(){
	var CONFIG = {
		marker_number: 1,
		marker_width: 80
	}

	var DUMMYDATA = [
	]

	var popMarker = function(mark_numb){
		$('#marker_' + mark_numb).addClass('expand-marker').css({
			'margin-top': '-=' + CONFIG.marker_width/2 + 'px!important',
			'margin-left': '-=' + CONFIG.marker_width/2 + 'px!important'
		});
	}

	var addMarker = function(mark_numb){
		var center = new L.LatLng(40.81069108268215, -73.94622802734375);
		var marker = new L.CustomMarker(center);
		map.addLayer(marker);
		$('#marker_' + mark_numb).bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
			$(this).remove();
		});
	}

	// $('.month-select').click(function(){
	// 	var month = $(this).attr('data-month-select');
	// 	console.log(month)
	// })

	// create a map in the "map" div, set the view to a given place and zoom
	var map = new L.Map('map-canvas').setView(new L.LatLng(40.81069108268215, -73.94622802734375), 10);

	// replace "toner" here with "terrain" or "watercolor"
	var layer = new L.StamenTileLayer("toner-background");
	map.addLayer(layer);
	// var marker = L.marker([40.81069108268215, -73.94622802734375]).addTo(map);
	addMarker(CONFIG.marker_number);

	// Test
	$(document).keyup(function(e) {
	  if (e.keyCode == 27){
		popMarker(CONFIG.marker_number);
		addMarker(CONFIG.marker_number);
		CONFIG.marker_number++
	  }
	});

})();