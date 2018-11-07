interface GlobalStatsGraphDataset {
    keys: number[]
    values: number[]
    name: string
}

interface GlobalStatsGraph {
    name: string
    data: GlobalStatsGraphDataset[]
}
