define(['colors'], function (colors) {

    /**
     * Creates a single spider chart given a bunch of data.
     * @param chartId the id of the chart being added
     * @param title the title for this chart
     * @param stats the stats for all users, stored as a map of label to stat
     * @param users the usernames in this chart
     * @param group where to pull data from
     */
    function createChart(chartId, title, stats, users, group) {
        let user_colors = colors.getSpiderColors(users.length + 1);
        let dataset = [
            {
                data: Array(group.length - 0 + 1).fill(0),
                label: 'Average',
                ...user_colors[0]
            },
        ];

        for (let i = 0; i < users.length; i++) {
            dataset.push(addDataset(stats[i], users[i], group, user_colors[i + 1]));
        }
        let labels = [];
        for (let i = 0; i < group.length; i++) {
            labels.push(group[i]);
        }
        let data = {
            datasets: dataset,
            labels: labels
        };

        let ctx = document.getElementById(chartId).getContext('2d');
        let myRadarChart = new Chart(ctx, {
            type: 'radar',
            data: data,
            options: {
                scale: {
                    ticks: {
                        // beginAtZero: true
                        // suggestedMin: -0.5,
                        // suggestedMax: 0.5
                        suggestedMin: -1,
                        suggestedMax: 1
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
