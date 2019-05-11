import moment from "moment"
import { doGet } from "../../apiHandler/apiHandler"
import { TimeUnit } from "../../Components/Player/Compare/Progression/PlayerProgressionCharts"
import { parsePlayStyleProgression, PlayStyleProgressionPoint } from "../../Models"
import { QueryParamMetadata, stringifyQueryParams } from "../Utils"

interface ProgressionQueryParams {
    timeUnit?: TimeUnit
    startDate?: moment.Moment
    endDate?: moment.Moment
    playlist?: number
}

const progressionQueryParamMetadatas: QueryParamMetadata[] = [
    {name: "timeUnit", optional: true},
    {name: "startDate", isDate: true, optional: true},
    {name: "endDate", isDate: true, optional: true},
    {name: "playlist", optional: true}
]
export const getProgression = (id: string, queryParams: ProgressionQueryParams):
    Promise<PlayStyleProgressionPoint[]> => {
    return doGet(
        `/player/${id}/play_style/progression` + stringifyQueryParams(queryParams, progressionQueryParamMetadatas)
    )
        .then((data: any[]) => data.map(parsePlayStyleProgression))
}
