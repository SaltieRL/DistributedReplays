$.getJSON('/uploads/d', function (data) {
    console.log(data.map(x => [x[0], x[1] - 1, x[2]]));
    d = [data.map(x => [Date.UTC(x[0], x[1] - 1, x[2]), x[3]])];
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
        }],
    });
});