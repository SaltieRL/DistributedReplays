export interface ChartDataPoint {
    name: string
    value: number
    average?: number
}

export interface ChartDataResponse {
    title: string
    chartDataPoints: ChartDataPoint[]
}

export interface StatDataPoint extends ChartDataPoint {
    isOrange: boolean
}

export interface BasicStat extends ChartDataResponse {
    chartDataPoints: StatDataPoint[]
    type: "radar" | "bar" | "pie"
    subcategory: StatsSubcategory
}

export enum PlayerStatsSubcategory {
    MAIN_STATS = "Main Stats",
    POSITIONING = "Positioning",
    HITS = "Hits",
    BALL = "Ball",
    BOOSTS = "Boosts",
    PLAYSTYLES = "Playstyles",
    POSSESION = "Possession",
    EFFICIENCY = "Efficiency",
    TEAM_POSITIONING = "Team Positioning"
}

export enum TeamStatsSubcategory {
    POSITIONING = "Positioning",
    CENTER_OF_MASS = "Center of Mass"
}

export enum HeatmapSubcategory {
    POSITIONING = "Positioning",
    // HITS = "Hits",
    BOOST = "Boost",
    BOOST_SPEED = "Boost Speed",
    SLOW_SPEED = "Slow Speed"
}

export type StatsSubcategory = PlayerStatsSubcategory | TeamStatsSubcategory
