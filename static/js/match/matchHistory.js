define(['colors'], function (colors) {

    function isOrange(isOrange) {
        return isOrange == "True"
    }

    function loadBarChart(shouldShowLabel, graphLabel, canvas, replayData, playerNames) {
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
          options: getOptions(shouldShowLabel, xLimit)
        });
    }

    function getDatasetsForReplay(replayData, key) {
        var datasets = [];
        var blueCount = 0;
        replayData.forEach((player, index) => {
            let playerData = [parseInt(player[key], 10)];
            let colorIndex = 0;
            if (!isOrange(player.is_orange)) {
                playerData = playerData.map((value) => -value);
                blueCount += 1;
                colorIndex = blueCount;
            } else {
                colorIndex = index - blueCount;
            }

            const playerDataSet = {
                label: player.name,
                data: playerData,
                stack: "1",  // player.team_is_orange? "orange" : "blue"
                ...colors.getHorizontaChartColor(colorIndex, isOrange(player.is_orange))
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
            let show_label = i===0;
            canvas.height = 75;
            loadBarChart(show_label, graphs[i], canvas, replayData, playerNames);
        }
    }

    function remove_canvas_elements(host_id) {
        var elements = document.getElementById(host_id).querySelectorAll("canvas");
        for (var i = 0; i < elements.length; i++) {
            elements[i].parentNode.removeChild(elements[i]);
        }
    }

    function addAction(action_element_id, host_id, label_data, replayData, playerNames) {
        var touched = false;
        document.getElementById(action_element_id).addEventListener("click", function (ev) {
            touched = true;
            var elements = document.getElementById(host_id).querySelectorAll("canvas");
            if (elements.length <= 0) {
                console.log('creating canvas');
                createCanvasElements(host_id, label_data, replayData, playerNames);
            }
        });

        var observer = new MutationObserver(function (mutations) {
            var element = document.getElementById(host_id);
            for(var mutation of mutations) {
                if (mutation.type == 'attributes' && mutation.attributeName == 'class') {
                    var hidden = !element.classList.contains('show');
                    if (hidden && !touched) {
                        console.log('removing canvs');
                        remove_canvas_elements(host_id);
                    } else if (touched) {
                        touched = false;
                    }
                }
            }
        });
        observer.observe(document.getElementById(host_id), { attributes:true});
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
