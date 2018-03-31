$.getJSON('/uploads/d', function (data) {

    d = data.map(x => [Date.UTC(x['year'], x['month'] - 1, x['day']), x['count']]);
    console.log(d);
    Highcharts.chart('uploads-hour', {
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Uploads grouped by hour'
        },

        subtitle: {
            text: 'Source: this website'
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            title: {
                text: 'Number of uploads'
            }
        },

        series: [{
            name: 'Data',
            data: d
        }]
    });
});