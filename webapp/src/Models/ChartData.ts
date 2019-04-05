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
    HITS = "Hits",
    BOOST = "Boost"
}

export type StatsSubcategory = PlayerStatsSubcategory | TeamStatsSubcategory
