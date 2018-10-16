interface GlobalStatsGraphDataset {
    keys: number[]
    values: number[]
    name: string
}

export interface GlobalStatsGraph {
    name: string
    data: GlobalStatsGraphDataset[]
}
