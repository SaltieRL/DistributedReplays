import moment from "moment"
import { ChartDataResponse } from "../ChartData"

export interface PlayStyleResponse {
    showWarning: boolean
    chartDatas: ChartDataResponse[]
}

export interface PlayStyleRawResponse {
    dataPoints: RawDataPoint[]
    name: string
}

interface RawDataPoint {
    name: string
    average: number
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
