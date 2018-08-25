define(['colors'], function () {
    function create_chart(chart_id, title, stats, label_data, users, group) {
        let default_dataset = [
            {
                data: Array(group.length - 0 + 1).fill(1),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                borderColor: 'rgba(54, 162, 235, 1)',
                label: 'Average'
            },
        ];
        var data = {
            datasets:
        };

        var ctx = document.getElementById(chart_id).getContext('2d');
        var myRadarChart = new Chart(ctx, {
            type: 'radar',
            data: data,
            options: {
                scale: {
                    ticks: {
                        beginAtZero: true
                    }
                },
                title: {
                    display: true,
                    text: title
                }
            }
        });
    }
    function add_dataset(stats, user_label) {

    }
};
