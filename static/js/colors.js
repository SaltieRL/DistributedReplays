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
                // purple
                backgroundColor: "rgba(180, 100, 173, 0.8)",
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
            }
        ],
        "orange": [
            {
                // red
                backgroundColor: "rgba(208,1,27, 0.8)",
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
                // yellow
                backgroundColor: "rgba(254,206,62, 0.8)",
                borderColor: materialOrangeBorderColor,
                borderWidth: 1
            },
            {
                backgroundColor: "rgba(251, 50, 60, 0.4)",
                borderColor: materialOrangeBorderColor,
                borderWidth: 1
            }
        ]
    };

    const overallColors = ['#fd79a8', '#74b9ff', '#a29bfe', '#ffeaa7', '#55efc4'];

    function getHorizontalChartColor(index, is_orange) {
        let chart = materialTeamChartColors;
        let list = is_orange ? chart.orange : chart.blue;
        return list[index % list.length];
    }

    function getLineColor() {
        return "rgba(32, 45, 21, 0.3)";
    }

    function getChartColorList(numberOfColorsNeeded) {
        return overallColors.slice(0, numberOfColorsNeeded)
    }

    return {
        getHorizontalChartColor: getHorizontalChartColor,
        getLineColor: getLineColor,
        getChartColors: getChartColorList
    }
});
