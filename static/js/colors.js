define('colors', function () {
    const blueBorderColor = "rgba(100, 100, 255, 0.8)";
    const materialBlueBorderColor = "rgba(27,106,221, 0.8)";
    const orangeBorderColor = "rgba(255, 150, 0, 0.8)";
    const materialOrangeBorderColor = "rgba(255,138,0, 0.8)";

    const builtInTeamChartColors = {
        "blue": [
            {
                backgroundColor: "rgba(29, 53, 224, 0.4)",
                borderColor: blueBorderColor,
                borderWidth: 1
            },
            {
                backgroundColor: "rgba(1, 115, 214, 0.4)",
                borderColor: blueBorderColor,
                borderWidth: 1
            },
            {
                backgroundColor: "rgba(0, 222, 121, 0.4)",
                borderColor: blueBorderColor,
                borderWidth: 1
            },
            {
                backgroundColor: "rgba(0, 211, 204, 0.4)",
                borderColor: blueBorderColor,
                borderWidth: 1
            }
        ],
        "orange": [
            {
                backgroundColor: "rgba(221, 240, 41, 0.4)",
                borderColor: orangeBorderColor,
                borderWidth: 1
            },
            {
                backgroundColor: "rgba(255, 108, 0, 0.4)",
                borderColor: orangeBorderColor,
                borderWidth: 1
            },
            {
                backgroundColor: "rgba(255, 0, 128, 0.4)",
                borderColor: orangeBorderColor,
                borderWidth: 1
            },
            {
                backgroundColor: "rgba(251, 50, 60, 0.4)",
                borderColor: orangeBorderColor,
                borderWidth: 1
            }
        ]
    };

    const ganderTeamChartColors = {
        "blue": [
            {
                // purple
                backgroundColor: "rgba(184, 104, 173, 0.8)",
                borderColor: blueBorderColor,
                borderWidth: 1
            },
            {
                // dark blue
                backgroundColor: "rgba(50, 118, 181, 0.8)",
                borderColor: blueBorderColor,
                borderWidth: 1
            },
            {
                // light blue
                backgroundColor: "rgba(51, 184, 165, 0.8)",
                borderColor: blueBorderColor,
                borderWidth: 1
            }
        ],
        "orange": [
            {
                backgroundColor: "rgba(240, 73, 80, 0.8)",
                borderColor: orangeBorderColor,
                borderWidth: 1
            },
            {
                backgroundColor: "rgba(245,141,78, 0.8)",
                borderColor: orangeBorderColor,
                borderWidth: 1
            },
            {
                backgroundColor: "rgba(254,206,62, 0.8)",
                borderColor: orangeBorderColor,
                borderWidth: 1
            },
            {
                backgroundColor: "rgba(251, 50, 60, 0.4)",
                borderColor: orangeBorderColor,
                borderWidth: 1
            }
        ]
    };

    const materialTeamChartColors = {
        "blue": [
            {
                // dark green
                backgroundColor: "rgba(48,129,55, 0.8)",
                borderColor: materialBlueBorderColor,
                borderWidth: 1
            },
            {
                // turquoise
                backgroundColor: "rgba(45,204,211, 0.8)",
                borderColor: materialBlueBorderColor,
                borderWidth: 1
            },
            {
                // blue
                backgroundColor: "rgba(27,106,221, 0.8)",
                borderColor: materialBlueBorderColor,
                borderWidth: 1
            },
            {
                // purple
                backgroundColor: "rgba(108,92,231, 0.8)",
                borderColor: materialBlueBorderColor,
                borderWidth: 1
            }
        ],
        "orange": [
            {
                // yellow
                backgroundColor: "rgba(254,206,62, 0.8)",
                borderColor: materialOrangeBorderColor,
                borderWidth: 1
            },
            {
                // orange
                backgroundColor: "rgba(255,138,0, 0.8)",
                borderColor: materialOrangeBorderColor,
                borderWidth: 1
            },
            {
                // red
                backgroundColor: "rgba(240,30,40, 0.8)",
                borderColor: materialOrangeBorderColor,
                borderWidth: 1
            },
            {
                // super light yellow
                backgroundColor: "rgba(255,234,167, 0.8)",
                borderColor: materialOrangeBorderColor,
                borderWidth: 1
            },
        ]
    };

    const spider_chart_colors = {
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        borderColor: 'rgba(54, 162, 235, 1)',
    };

    const overallColors = [0x74b9ff, 0xa29bfe, 0xffeaa7, 0x55efc4, 0xfd79a8];

    function getHorizontalChartColor(index, is_orange) {
        let chart = materialTeamChartColors;
        let list = is_orange ? chart.orange : chart.blue;
        return list[index % list.length];
    }

    function getSpiderColors(numberOfColorsNeeded) {
        let colors = overallColors.slice(0, numberOfColorsNeeded);
        let result = [];
        for (let i = 0; i < colors.length; i++) {
            result.push({
                backgroundColor: convertColorToString(colors[i], 0.2),
                pointBackgroundColor: convertColorToString(colors[i], 1),
                borderColor: convertColorToString(colors[i], 1)
            })
        }
        return result
    }

    function getLineColor() {
        return "rgba(32, 45, 21, 0.3)";
    }

    function getChartColorList(numberOfColorsNeeded, colorList=overallColors) {
        let colors = colorList.slice(0, numberOfColorsNeeded);
        let result = [];
        for (let i = 0; i < colors.length; i++) {
            result.push(convertColorToString(colors[i]))
        }
        return result
    }

    /**
     * Converts a color to string + alpha
     * @param color
     * @param alpha between 0 and 1
     * @returns {string}
     */
    function convertColorToString(color, alpha = 1) {
        return "#"+((color)>>>0).toString(16).slice(-6) + Math.round(alpha * 255).toString(16)
    }

    return {
        getHorizontalChartColor: getHorizontalChartColor,
        getLineColor: getLineColor,
        getChartColors: getChartColorList,
        getSpiderColors: getSpiderColors,
    }
});
