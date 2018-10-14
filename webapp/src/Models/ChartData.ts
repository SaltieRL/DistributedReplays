interface ChartDataPoint {
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

// TODO: Investigate if can be replaced with enum to avoid repetition
export type PlayerStatsSubcategory =
    "Positioning"
    | "Hits"
    | "Ball"
    | "Boosts"
    | "Playstyles"
    | "Possession"
    | "Efficiency"
    | "Team Positioning"

export const playerStatsSubcategoryValues: PlayerStatsSubcategory[] = [
    "Hits", "Ball", "Positioning", "Boosts", "Playstyles", "Possession", "Efficiency", "Team Positioning"
]  // Needed as these values cannot be gotten from the type at runtime (TypeScript is a lie)

export type TeamStatsSubcategory =
    "Positioning"
    | "Center of Mass"

export const teamStatsSubcategoryValues: TeamStatsSubcategory[] = [
    "Positioning", "Center of Mass"
]

export type StatsSubcategory =
    PlayerStatsSubcategory
    | TeamStatsSubcategory
