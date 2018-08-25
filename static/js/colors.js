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
     * @param returnHex if true this will return hex value otherwise it will return rgba
     * @returns {string}
     */
    function convertColorToString(color, alpha = 1, returnHex = false) {
        if (returnHex) {
            return "#" + ((color) >>> 0).toString(16).slice(-6) + Math.round(alpha * 255).toString(16)
        } else {
            let r = (color >> 16) & 255;
            let g = (color >> 8) & 255;
            let b = color & 255;
            return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
        }
    }

    const blueBorderColor = convertColorToString(0x6464ff, 0.8);
    const materialBlueBorderColor = convertColorToString(0x1b6add, 0.8);
    const orangeBorderColor = convertColorToString(0xff9600, 0.8);
    const materialOrangeBorderColor = convertColorToString(0xff8a00, 0.8);

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

    const ganderTeamChartColors = {
        "blue": [
            {
                // purple
                backgroundColor: convertColorToString(0xb868ad, 0.8),
                borderColor: blueBorderColor,
                borderWidth: 1
            },
            {
                // dark blue
                backgroundColor: convertColorToString(0x3276b5, 0.8),
                borderColor: blueBorderColor,
                borderWidth: 1
            },
            {
                // light blue
                backgroundColor: convertColorToString(0x33b8a5, 0.8),
                borderColor: blueBorderColor,
                borderWidth: 1
            }
        ],
        "orange": [
            {
                backgroundColor: convertColorToString(0xf04950, 0.8),
                borderColor: orangeBorderColor,
                borderWidth: 1
            },
            {
                backgroundColor: convertColorToString(0xf58d4e, 0.4),
                borderColor: orangeBorderColor,
                borderWidth: 1
            },
            {
                backgroundColor: convertColorToString(0xfece3e, 0.4),
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

    const overallColors = [0x36a2eb, 0xa29bfe, 0xffeaa7, 0x55efc4, 0xfd79a8];

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

    return {
        getHorizontalChartColor: getHorizontalChartColor,
        getLineColor: getLineColor,
        getChartColors: getChartColorList,
        getSpiderColors: getSpiderColors,
    }
});
