import * as moment from "moment"
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

export interface StatDescription {
    field_name: string | undefined
    field_rename: string | undefined
    file_creation: string | undefined
    math_explanation: string | undefined
    short_name: string | undefined
    simple_explanation: string | undefined
}
