define('colors', function () {
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    /**
     * Converts a color to string + alpha
     * @param color
     * @param alpha between 0 and 1
     * @param shouldFakeAlpha if true this will recreate the alpha color
     * @returns {string}
     */
    function convertColorToString(color, alpha = 1, shouldFakeAlpha = false) {
        let r = (color >> 16) & 255;
        let g = (color >> 8) & 255;
        let b = color & 255;
        let a = alpha;
        if (shouldFakeAlpha) {
            a = 1;
        }
        return 'rgba(' +
            fakeAlpha(r, alpha, shouldFakeAlpha) + ', ' +
            fakeAlpha(g, alpha, shouldFakeAlpha) + ', ' +
            fakeAlpha(b, alpha, shouldFakeAlpha) + ', ' + a + ')';
    }

    function fakeAlpha(component, alpha, shouldFakeAlpha = false) {
        if (!shouldFakeAlpha) {
            return component
        }
        return component * alpha + (1 - alpha) * 255;
    }

    const blueBorderColor = convertColorToString(0x6464ff, 0.8);
    const materialBlueBorderColor = convertColorToString(0x108EF5, 0.8);
    const orangeBorderColor = convertColorToString(0xff9600, 0.8);
    const materialOrangeBorderColor = convertColorToString(0xff8a00, 0.8);

    const designer = {
        "blue": [
            {
                // darkest blue
                backgroundColor: convertColorToString(0x0511F5, 1),
                borderColor: blueBorderColor,
                borderWidth: 1
            },
            {
                // lighter blue
                backgroundColor: convertColorToString(0x108EF5, 0.8),
                borderColor: blueBorderColor,
                borderWidth: 1
            },
            {
                // lightest blue
                backgroundColor: convertColorToString(0x05E0CC, 1),
                borderColor: blueBorderColor,
                borderWidth: 1
            },
        ],
        "orange": [
            {
                // Red
                backgroundColor: convertColorToString(0xEB1000, 1),
                borderColor: orangeBorderColor,
                borderWidth: 1
            },
            {
                backgroundColor: convertColorToString(0xF55105, 1),
                borderColor: orangeBorderColor,
                borderWidth: 1
            },
            {
                backgroundColor: convertColorToString(0xFF9C12, 1),
                borderColor: orangeBorderColor,
                borderWidth: 1
            },
        ]
    };

    const overallColors = [0x108EF5, 0xF55105, 0x05E0CC, 0xaffeaa7];
    const alphas = [0.5, 0.5, 0.5, 0.7];

    function getHorizontalChartColor(index, is_orange) {
        let chart = designer;
        let list = is_orange ? chart.orange : chart.blue;
        return list[index % list.length];
    }

    function getHorizontalColors() {
        let chart = designer;
        return [].concat(chart.orange).concat(chart.blue);
    }

    function getSpiderColors(numberOfColorsNeeded) {
        numberOfColorsNeeded = Math.min(numberOfColorsNeeded, overallColors.length);
        let colors = overallColors.slice(0, numberOfColorsNeeded);
        let result = [];
        for (let i = 0; i < colors.length; i++) {
            result.push({
                backgroundColor: convertColorToString(colors[i], 0.2),
                pointBackgroundColor: convertColorToString(colors[i], 0.6),
                borderColor: convertColorToString(colors[i], 0.5)
            });
        }
        return result
    }

    function getLineColor() {
        return "rgba(32, 45, 21, 0.3)";
    }

    function getChartColorList(numberOfColorsNeeded, colorList=overallColors, alphaList=alphas) {
        numberOfColorsNeeded = Math.min(numberOfColorsNeeded, colorList.length);
        let colors = colorList.slice(0, numberOfColorsNeeded);
        let result = [];
        for (let i = 0; i < colors.length; i++) {
            let backgroundColor = convertColorToString(colors[i], alphaList[i], true);
            let hoverBackgroundColor = convertColorToString(colors[i], alphaList[i] + 0.2, true);
            result.push({
                backgroundColor: backgroundColor,
                hoverBackgroundColor: hoverBackgroundColor,
                borderColor: backgroundColor,
                hoverBorderColor: hoverBackgroundColor
            })
        }
        return result
    }

    return {
        getHorizontalColors: getHorizontalColors,
        getHorizontalChartColor: getHorizontalChartColor,
        getLineColor: getLineColor,
        getChartColors: getChartColorList,
        getSpiderColors: getSpiderColors,
    }
});


function oldColors() {
    const overallColorsOld = [0x36a2eb, 0xff6384, 0xaFF9C12, 0xffeaa7, 0x55efc4, 0xfd79a8];

    const builtInTeamChartColors = {
        "blue": [
            {
                backgroundColor: convertColorToString(0x1d35e0, 0.4),
                borderColor: blueBorderColor,
                borderWidth: 1
            },
            {
                backgroundColor: convertColorToString(0x0173d6, 0.4),
                borderColor: blueBorderColor,
                borderWidth: 1
            },
            {
                backgroundColor: convertColorToString(0x00de79, 0.4),
                borderColor: blueBorderColor,
                borderWidth: 1
            },
            {
                backgroundColor: convertColorToString(0x00d3cc, 0.4),
                borderColor: blueBorderColor,
                borderWidth: 1
            }
        ],
        "orange": [
            {
                backgroundColor: convertColorToString(0xddf029, 0.4),
                borderColor: orangeBorderColor,
                borderWidth: 1
            },
            {
                backgroundColor: convertColorToString(0xff6c00, 0.4),
                borderColor: orangeBorderColor,
                borderWidth: 1
            },
            {
                backgroundColor: convertColorToString(0xff0080, 0.4),
                borderColor: orangeBorderColor,
                borderWidth: 1
            },
            {
                backgroundColor: convertColorToString(0xfb323c, 0.4),
                borderColor: orangeBorderColor,
                borderWidth: 1
            }
        ]
    };


    const materialTeamChartColors = {
        "blue": [
            {
                // dark green
                backgroundColor: convertColorToString(0x308137, 0.8),
                borderColor: materialBlueBorderColor,
                borderWidth: 1
            },
            {
                // turquoise
                backgroundColor: convertColorToString(0x2dccd3, 0.8),
                borderColor: materialBlueBorderColor,
                borderWidth: 1
            },
            {
                // blue
                backgroundColor: convertColorToString(0x1b6add, 0.8),
                borderColor: materialBlueBorderColor,
                borderWidth: 1
            },
            {
                // purple
                backgroundColor: convertColorToString(0x6c5ce7, 0.8),
                borderColor: materialBlueBorderColor,
                borderWidth: 1
            }
        ],
        "orange": [
            {
                // yellow
                backgroundColor: convertColorToString(0xfece3e, 0.8),
                borderColor: materialOrangeBorderColor,
                borderWidth: 1
            },
            {
                // orange
                backgroundColor: convertColorToString(0xff8a00, 0.8),
                borderColor: materialOrangeBorderColor,
                borderWidth: 1
            },
            {
                // red
                backgroundColor: convertColorToString(0xf01e28, 0.8),
                borderColor: materialOrangeBorderColor,
                borderWidth: 1
            },
            {
                // super light yellow
                backgroundColor: convertColorToString(0xffeaa7, 0.8),
                borderColor: materialOrangeBorderColor,
                borderWidth: 1
            },
        ]
    };
}
