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
}
