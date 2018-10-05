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

export type BasicStatsSubcategory = "Hits" | "Ball" | "Positioning" | "Boosts" | "Playstyles" | "Possession" | "Efficiency"
export const basicStatsSubcategoryValues = [
    "Hits", "Ball", "Positioning", "Boosts",  "Playstyles", "Possession"
]  // Needed as these values cannot be gotten from the type at runtime (TypeScript is a lie)
export interface BasicStat extends ChartDataResponse {
    chartDataPoints: StatDataPoint[]
    type: "radar" | "bar" | "pie"
    subcategory: BasicStatsSubcategory
}
