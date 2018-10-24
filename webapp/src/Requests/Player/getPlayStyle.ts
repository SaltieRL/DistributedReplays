import * as qs from "qs"
import { PlayStyleRawResponse, PlayStyleResponse } from "src/Models"
import { doGet } from "../../apiHandler/apiHandler"
import { useMockData } from "../Config"
import { MOCK_PLAY_STYLE, MOCK_PLAY_STYLE_RAW } from "../Mock"

export const getPlayStyle = (id: string, rank?: number, playlist?: number, winLoss?: boolean): Promise<PlayStyleResponse> => {
    if (useMockData) {
        return Promise.resolve(MOCK_PLAY_STYLE)
    }
    const url = qs.stringify({rank, playlist, win: winLoss ? 1 : 0}, {addQueryPrefix: true, indices: false})
    return doGet(`/player/${id}/play_style` + url)
}

export const getPlayStyleRaw = (id: string, playlist?: number): Promise<PlayStyleRawResponse> => {
    if (useMockData) {
        return Promise.resolve(MOCK_PLAY_STYLE_RAW)
    }
    const url = qs.stringify({playlist}, {addQueryPrefix: true, indices: false})
    return doGet(`/player/${id}/play_style/all` + url)
}
