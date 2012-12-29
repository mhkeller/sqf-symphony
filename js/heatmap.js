(function(){
	var DATA = {
		max: null,
		min: null
	};

	var SETTINGS = {
		block_width: 34.6
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

	var color = d3.scale.quantize()
	    .domain([311, 3255])
	    .range(d3.range(6).map(function(d) { return "q" + d + "-11"; }));

	// Hack for plotting the months as separate svg elements
	// so they can have spaces between them and be used as buttons
	for (var i = 0; i < 12; i++){
		plotMonth(i);
	}

	function plotMonth(month_key){
		var svg = d3.select("#heat-map-"+month_key).selectAll("svg")
	    .data([month_key])
	    // .data(d3.range(2011, 2012))
	  .enter().append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("class", "RdYlGn")

	// svg.append("text")
	//     .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
	//     .style("text-anchor", "middle")
	//     .text(function(d) { return d; });

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
	    .datum(format);

	rect.append("title")
	    .text(function(d) { return d; });

	// svg.selectAll(".month")
	//     .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
	//   .enter().append("path")
	//     .attr("class", function(d){ var mnth = String(d).split(' ')[1]; return 'month ' + mnth })
	//     .attr("d", monthPath);

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
	      .attr("class", function(d) { return "day " + color(data[d]); })
	    .select("title")
	      .text(function(d) { return d.replace('2011-0','').replace('2011-','').replace('-','/') + ": " + addCommas(data[d]) + ' stops'; });
	});
}

	// function monthPath(t0) {
	//   var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
	//       d0 = +day(t0), w0 = +week(t0),
	//       d1 = +day(t1), w1 = +week(t1);
	//   var path = "M" + (w0 + (1)) * cellSize + "," + d0 * cellSize
	//       + "H" + w0 * cellSize + "V" + 7 * cellSize
	//       + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
	//       + "H" + (w1 + 1) * cellSize + "V" + 0
	//       + "H" + (w0 + 1) * cellSize + "Z";

	//   console.log(path)
	//   return path
	// }

	// d3.select(self.frameElement).style("height", "2910px");

})();