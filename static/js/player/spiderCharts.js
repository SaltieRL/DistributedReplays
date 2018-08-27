define(['colors'], function (colors) {

    /**
     * Creates a single spider chart given a bunch of data.
     * @param chartId the id of the chart being added
     * @param title the title for this chart
     * @param stats the stats for all users
     * @param label_data the labels for all charts
     * @param users the usernames in this chart
     * @param group where to pull data from
     */
    function createChart(chartId, title, stats, label_data, users, group) {
        let user_colors = colors.getSpiderColors(users.length + 1);
        let dataset = [
            {
                data: Array(group.length - 0 + 1).fill(1),
                label: 'Average',
                ...user_colors[0]
            },
        ];

        for (let i = 0; i < users.length; i++) {
            dataset.push(addDataset(stats[i], users[i], group, user_colors[i + 1]))
        }
        let labels = [];
        for (let i = 0; i < group.length; i++) {
            labels.push(label_data[group[i]])
        }
        var data = {
            datasets: dataset,
            labels: labels
        };

        var ctx = document.getElementById(chartId).getContext('2d');
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
    function addDataset(stats, userLabel, group, userColor) {
        let statList = stats['stats'];
        let statData = [];

        for (let i = 0; i< group.length; i++) {
            statData.push(statList[group[i]])
        }

        return {
            data: statData,
            label: userLabel,
            ...userColor
        }
    }
    return {
        createChart: createChart
    }
});
