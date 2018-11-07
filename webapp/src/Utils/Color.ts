import { ChartDataSets } from "chart.js"

export const convertHexToRgba = (hex: string, alpha: number = 1) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)

    if (alpha) {
        return `rgba(${r}, ${g}, ${b}, ${alpha})`
    } else {
        return `rgba(${r}, ${g}, ${b})`
    }
}

const bluePrimaryColors =
    // [  // Mine
    //     "rgba(29, 53, 224, 0.4)",
    //     "rgba(1, 115, 214, 0.4)",
    //     "rgba(0, 222, 121, 0.4)",
    //     "rgba(0, 211, 204, 0.4)"
    // ]
    // [  // Gander's
    //     "rgba(51, 184, 165, 0.4)",
    //     "rgba(50, 118, 181, 0.4)",
    //     "rgb(184, 104, 173, 0.4)",
    //     "rgba(0, 211, 204, 0.4)"
    // ]
    [  // dtracers's
        "rgba(5,17,245,0.55)",
        "rgba(16,142,245,0.55)",
        "rgba(5,224,204, 0.55)",
        "rgba(0, 211, 204, 0.55)"
    ]

const orangePrimaryColors =
    // ["rgba(221, 240, 41, 0.4)", "rgba(255, 108, 0, 0.4)", "rgba(255, 0, 128, 0.4)", "rgba(251, 50, 60, 0.4)"]
    // ["rgba(240, 73, 80, 0.4)", "rgba(245, 141, 78, 0.4)", "rgba(254, 206, 62, 0.4)", "rgba(251, 50, 60, 0.4)"]
    ["rgba(235,16,0,0.55)", "rgba(245,81,5,0.55)", "rgba(255,156,18,0.55)", "rgba(251, 50, 60, 0.55)"]

export const getPrimaryColorsForPlayers = (teams: boolean[]): string[] => {
    let blueIndex = 0
    let orangeIndex = 0

    return teams.map((isOrange) => {
        if (isOrange) {
            const playerColor = orangePrimaryColors[orangeIndex]
            orangeIndex = orangeIndex + 1
            return playerColor
        } else {
            const playerColor = bluePrimaryColors[blueIndex]
            blueIndex = blueIndex + 1
            return playerColor
        }
    })
}

// TODO: Remove this function
export const getChartColors = (isOrange: boolean, colorNumber: number): ChartDataSets => {
    const teamColor: teamColors = isOrange ? "orange" : "blue"
    return chartColors[teamColor][colorNumber % 3]
}

type teamColors = "blue" | "orange"

interface ChartColors {
    blue: ChartDataSets[],
    orange: ChartDataSets[]
}

const blueBorderColour = bluePrimaryColors[0]  // "rgba(100, 100, 255, 0.8)"
const orangeBorderColour = orangePrimaryColors[0]  // "rgba(255, 150, 0, 0.8)"

const chartColors: ChartColors = {
    blue: bluePrimaryColors.map((primaryColor) => ({
        backgroundColor: primaryColor,
        borderColor: blueBorderColour,
        borderWidth: 1
    })),
    orange: orangePrimaryColors.map((primaryColor) => ({
        backgroundColor: primaryColor,
        borderColor: orangeBorderColour,
        borderWidth: 1
    }))
}

export const colorsForPlaylists = ["#71EFAF", "#F9A782", "#88C6F9", "#E888F7"]

export const primaryColours = [
    "#33B8A5",
    "#F04950",
    "#3276B5",
    "#F58D4E",
    "#B868AD",
    "#FECE3E",
    "#A2C334",
    "#f0447c"
]
