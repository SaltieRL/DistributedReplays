import qs from "qs"
import {doGet} from "../../apiHandler/apiHandler"
import {PlayStyleRawResponse, PlayStyleResponse} from "../../Models"

export const getPlayStyle = (
    id: string,
    rank?: number,
    playlist?: number,
    result?: boolean
): Promise<PlayStyleResponse> => {
    let params
    if (result === undefined) {
        params = {rank, playlist}
    } else {
        params = {rank, playlist, result: result ? "win" : "loss"}
    }
    const url = qs.stringify(params, {addQueryPrefix: true, indices: false})
    return doGet(`/player/${id}/play_style` + url)
}

export const getPlayStyleRaw = (id: string, playlist?: number): Promise<PlayStyleRawResponse> => {
    const url = qs.stringify({playlist}, {addQueryPrefix: true, indices: false})
    return doGet(`/player/${id}/play_style/all` + url)
}
