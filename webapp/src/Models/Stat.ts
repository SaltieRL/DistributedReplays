interface DataPoint {
    name: string
    average: number
    std_dev?: number
}

export interface ProgressionDataPoint {
    date: string
    points: DataPoint[]
}

export interface PlayerDataPoint {
    name: string
    points: DataPoint[]
}