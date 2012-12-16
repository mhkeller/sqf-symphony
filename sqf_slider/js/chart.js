var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'chart_canvas_2',
            type: 'column'
        },
        xAxis: {
            categories: ['B', 'H', 'A', 'W', 'X']
        },

        plotOptions: {


                column: {

                    pointPadding: 0,

                    borderWidth: 0,
                    shadow: false,
                    groupPadding: 0.1,

            },series: {
                        animation: false


                }

            },

                series: [{

                name: 'Stopped',

                data: [49.9, 71.5, 106.4, 129.2, 144.0]



            }, {

                name: 'Arrested',

                data: [42.4, 33.2, 34.5, 39.7, 52.6]



            }]

        });


    //button handler
    $('#button').click(function() {
    		       chart.series[0].data[0].update(150); 
    		    });