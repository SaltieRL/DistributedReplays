interface ChartDataPoint {
    name: string
    value: number
    average?: number
}

interface ChartDataResponse {
    title: string
    chartDataPoints: ChartDataPoint[]
}

interface StatDataPoint extends ChartDataPoint {
    isOrange: boolean
}

interface BasicStat extends ChartDataResponse {
    chartDataPoints: StatDataPoint[]
    type: "radar" | "bar" | "pie"
    subcategory: StatsSubcategory
}

// TODO: Investigate if can be replaced with enum to avoid repetition
declare enum PlayerStatsSubcategory {
    POSITIONING = "Positioning",
    HITS = "Hits",
    BALL = "Ball",
    BOOSTS = "Boosts",
    PLAYSTYLES = "Playstyles",
    POSSESION = "Possession",
    EFFICIENCY = "Efficiency",
    TEAM_POSITIONING = "Team Positioning"
}

declare enum TeamStatsSubcategory {
    POSITIONING = "Positioning",
    CENTER_OF_MASS = "Center of Mass"
}

type StatsSubcategory = PlayerStatsSubcategory | TeamStatsSubcategory
