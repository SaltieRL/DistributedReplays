$.getJSON('/uploads/h', function (data) {

    Highcharts.chart('uploads-hour', {

        title: {
            text: 'Uploads grouped by hour'
        },

        subtitle: {
            text: 'Source: this website'
        },

        yAxis: {
            title: {
                text: 'Number of uploads'
            }
        },

        series: [{
            name: 'Data',
            data: [data.map(x => [x[3], x[4]])]
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

    });
})