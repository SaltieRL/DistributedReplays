define(['colors'], function (colors) {
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
        for(let i = 0; i < users.length; i++) {
            default_dataset.add(add_dataset(stats[i], color_index))
        }
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
    function add_dataset(stats, user_label, group, color_index) {

    }
};
