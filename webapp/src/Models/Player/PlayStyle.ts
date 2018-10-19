import * as moment from "moment"

export interface PlayStyleResponse {
    showWarning: boolean
    chartDatas: ChartDataResponse[]
}

interface DataPoint {
    average: number
    name: string
    stdDev: number | null
}

export interface PlayStyleProgressionPoint {
    date: moment.Moment
    dataPoints: DataPoint[]
}

export const parsePlayStyleProgression = (data: any) => {
    return {
        ...data,
        date: moment(data.date)
    }
}
