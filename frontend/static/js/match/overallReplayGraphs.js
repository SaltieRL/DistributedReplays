define(['colors'], function (colors) {

    function createGraphs(hostId, hostClass, graphs, replayData,) {
        let graphsHolder = document.getElementById(hostId).querySelector(hostClass);
        for (let i = 0; i < graphs.length; i++) {
            let canvas = document.createElement('canvas');
            canvas.className = 'canvas-' + graphs[i];
            let canvasHolder = graphsHolder.querySelector('.' + graphs[i]);
            canvasHolder.appendChild(canvas);
            let showLabel = i===0;
            canvas.height = 75;
            loadBarChart(showLabel, graphs[i], canvas, replayData);
        }
    }

    function reverseBlues(playerList) {
        let oranges = [];
        let blues = [];
        playerList.forEach((player, index) => {
            if (isOrange(player.is_orange)) {
                oranges.push(player);
            } else {
                blues.push(player);
            }
        });
        return oranges.concat(blues.reverse());
    }

    function removeGraphs(hostId) {
        let elements = document.getElementById(hostId).querySelectorAll("canvas");
        for (let i = 0; i < elements.length; i++) {
            elements[i].parentNode.removeChild(elements[i]);
        }
    }

    function createColorMap(playerList) {
        let blueCount = 0;
        let orangeCount = 0;
        let colorMap = [];
        let totalNumberOfBlue = playerList.filter(player => !isOrange(player.is_orange)).length;
        let blues = [];
        for (let i = 0; i < totalNumberOfBlue; i++) {
            blues.push(colors.getHorizontalChartColor(i, false));
        }
        blues = blues.reverse();
        playerList.forEach((player, index) => {
            if (isOrange(player.is_orange)) {
                colorMap[player.name] = colors.getHorizontalChartColor(orangeCount, isOrange(player.is_orange));
                orangeCount += 1;
            } else {
                colorMap[player.name] = blues[blueCount];
                blueCount += 1;
            }
        });
        return colorMap;
    }

    function colorGraphLabel(hostElement, replayData) {
        let colorMap = createColorMap(replayData);
        replayData.forEach((player, index) => {
            console.log(".player-" + player.player + ' .label-color');
            console.log(player);
            let labelElement = hostElement.querySelector(".player-" + player.player + ' .label-color');
            let color_option = colorMap[player.name];
            labelElement.style.backgroundColor = color_option.backgroundColor;
            labelElement.style.borderColor = color_option.borderColor;
            labelElement.style.borderWidth = color_option.borderWidth + "px";
        });
    }

    function loadBarChart(shouldShowLabel, graphLabel, canvas, replayData) {
        const barData = {
            // labels: [graphLabel],
            datasets: getDatasetsForReplay(replayData, graphLabel)
        };
        let positiveValuesSum = 0;
        let negativeValuesSum = 0;
        barData.datasets.forEach((dataset) => {
            const playerData = dataset.data;
            playerData[0] < 0 ? negativeValuesSum += playerData[0] : positiveValuesSum += playerData[0];
        });
        const xLimit = Math.round(Math.max(-negativeValuesSum, positiveValuesSum) * 1.2);
        console.log(xLimit);
        new Chart(canvas, {
            type: 'horizontalBar',
            data: barData,
            options: getOptions(shouldShowLabel, xLimit)
        });
    }

    function getDatasetsForReplay(replayData, key) {
        let datasets = [];
        let colorMap = createColorMap(replayData);
        let players = reverseBlues(replayData);
        players.forEach((player, index) => {
            let playerData = [parseInt(player[key], 10)];
            if (!isOrange(player.is_orange)) {
                playerData = playerData.map((value) => -value);
            }

            const playerDataSet = {
                label: player.name,
                data: playerData,
                stack: "1",  // player.team_is_orange? "orange" : "blue"
                ...colorMap[player.name]
            };
            datasets.push(playerDataSet)
        });
        return datasets;
    }

    function isOrange(isOrange) {
        return isOrange === "True"
    }

    function getOptions(showLegend, xLimit) {
        return {
            scales: {
                xAxes: [{
                    stacked: true,
                    gridLines: {
                        zeroLineWidth: 2,
                        zeroLineColor: colors.getLineColor(),
                        drawBorder: false
                    },
                    ticks: {
                        min: -xLimit,
                        max: xLimit,
                        callback: (value) =>
                            value < 0 ? -parseInt(value, 10) : parseInt(value, 10)
                    },
                    afterFit: (scaleInstance) => scaleInstance.width = 100 /* sets the width to 100px */
                }],
                yAxes: [{
                    stacked: true,
                    gridLines: {
                        display: false
                    },
                    barThickness: 25,
                    afterFit: (scaleInstance) => scaleInstance.height = 50 // sets the height to 100px
                }]
            },
            legend: {
                display: false,
                onClick: (e) => e.stopPropagation()
            },
            tooltips: {
                callbacks: {
                    label: (tooltipItem, data) =>
                        data.datasets[tooltipItem.datasetIndex].label + ": " +
                        Math.abs(parseInt(tooltipItem.xLabel, 10))
                }
            },
            maintainAspectRatio: false
        }
    }

    function showOverallReplayGraphs(hostId, hostClass, labelData, replayData) {
        let hostElement = document.getElementById(hostId);
        colorGraphLabel(hostElement, replayData);
        createGraphs(hostId, hostClass, labelData, replayData);
    }

    return {
        showOverallReplayGraphs: showOverallReplayGraphs,
        removeGraphs: removeGraphs
    }
});
