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
    subcategory: BasicStatsSubcategory
}

export type BasicStatsSubcategory =
    "Positioning"
    | "Hits"
    | "Ball"
    | "Boosts"
    | "Playstyles"
    | "Possession"
    | "Efficiency"
    | "TeamPositioning"
    | "CenterOfMass"

export const playerStatsSubcategoryValues = [
    "Hits", "Ball", "Positioning", "Boosts", "Playstyles", "Possession", "Efficiency", "TeamPositioning"
]  // Needed as these values cannot be gotten from the type at runtime (TypeScript is a lie)

export const teamStatsSubcategoryValues = [
    "Positioning", "CenterOfMass"
]  // Needed as these values cannot be gotten from the type at runtime (TypeScript is a lie)
