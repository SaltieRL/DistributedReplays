import qs from "qs"
import { doGet } from "../../apiHandler/apiHandler"
import { PlayStyleRawResponse, PlayStyleResponse } from "../../Models"
import { useMockData } from "../Config"
import { MOCK_PLAY_STYLE, MOCK_PLAY_STYLE_RAW } from "../Mock"

export const getPlayStyle = (id: string, rank?: number, playlist?: number,
                             result?: boolean): Promise<PlayStyleResponse> => {
    if (useMockData) {
        return Promise.resolve(MOCK_PLAY_STYLE)
    }
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
    if (useMockData) {
        return Promise.resolve(MOCK_PLAY_STYLE_RAW)
    }
    const url = qs.stringify({playlist}, {addQueryPrefix: true, indices: false})
    return doGet(`/player/${id}/play_style/all` + url)
}
