define(function () {

    function loadBarChart(graphLabel, canvas, replayData, playerNames) {
        const barData = {
            labels: [graphLabel],
            datasets: getDatasetsForReplay(replayData, graphLabel)
        };
        var positiveValuesSum = 0;
        var negativeValuesSum = 0;
        barData.datasets.forEach((dataset) => {
            const playerData = dataset.data;
            playerData[0] < 0 ? negativeValuesSum += playerData[0] : positiveValuesSum += playerData[0];
        });
        const xLimit = Math.round(Math.max(-negativeValuesSum, positiveValuesSum) * 1.2);
        console.log(xLimit);
        new Chart(canvas, {
          type: 'horizontalBar',
          data: barData,
          options: getOptions(true, xLimit)
        });
    }

    function getDatasetsForReplay(replayData, key) {
        var datasets = [];
        replayData.forEach((player, index) => {
            let playerData = [parseInt(player[key], 10)];
            if (!player.is_orange) {
                playerData = playerData.map((value) => -value);
            }

            const playerDataSet = {
                label: player.name,
                data: playerData,
                stack: "1",  // player.team_is_orange? "orange" : "blue"
                // ...getColour(player.team_is_orange)
            };
            datasets.push(playerDataSet)
        });
        return datasets;
    }

    function createCanvasElements(host_id, graphs, replayData, playerNames) {
        var graphs_holder = document.getElementById(host_id).querySelector('.graph_holder');
        for (let i = 0; i < graphs.length; i++) {
            let canvas = document.createElement('canvas');
            canvas.className = graphs[i];
            let canvas_holder = graphs_holder.querySelector('.' + graphs[i]);
            canvas_holder.appendChild(canvas);
            canvas.width = 100;
            canvas.height = 50;
            loadBarChart(graphs[i], canvas, replayData, playerNames);
        }
    }

    function remove_canvas_elements() {
        var elements = document.getElementById(host_id).querySelectorAll("canvas");
        for (var i = 0; i < elements.length; i++) {
            elements[i].parentNode.removeChild(elements[i]);
        }
    }

    function addAction(action_element_id, host_id, label_data, replayData, playerNames) {
        document.getElementById(action_element_id).addEventListener("click", function (ev) {
            var elements = document.getElementById(host_id).querySelectorAll("canvas");
            if (elements.length <= 0) {
                console.log('creating canvs');
                createCanvasElements(host_id, label_data, replayData, playerNames);
            } else {
                console.log('removing canvs');
                remove_canvas_elements();
            }
        });
    }

    function getOptions(showLegend, xLimit) {
        return {
            scales: {
                xAxes: [{
                    stacked: true,
                    gridLines: {
                        zeroLineWidth: 2,
                        zeroLineColor: "rgba(0, 0, 0, 0.3)",
                        drawBorder: false
                    },
                    ticks: {
                        min: -xLimit,
                        max: xLimit,
                        callback: function(value) {
                            value < 0 ? -parseInt(value, 10) : parseInt(value, 10)
                        }
                    },
                    afterFit: function(scaleInstance) {
                        scaleInstance.width = 100; /* sets the width to 100px */
                    }
                }],
                yAxes: [{
                    stacked: true,
                    gridLines: {
                        display: false
                    },
                    barThickness: 25,
                    afterFit: function(scaleInstance) {
                        scaleInstance.height = 50; // sets the height to 100px
                    }
                }]
            },
            legend: {
                display: showLegend,
                onClick: function(e) { e.stopPropagation() }
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        return data.datasets[tooltipItem.datasetIndex].label + ": " +
                        Math.abs(parseInt(tooltipItem.xLabel, 10))
                    }
                }
            },
            maintainAspectRatio: false
        }
    }

    return {
        addAction: addAction
    }
});
