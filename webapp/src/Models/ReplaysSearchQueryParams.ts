import * as _ from "lodash"
import * as moment from "moment"
import * as qs from "qs"

export interface ReplaysSearchQueryParams {
    page: number
    limit: number
    playerIds?: string[]
    rank?: number
    playlists?: number[]
    dateBefore?: moment.Moment
    dateAfter?: moment.Moment
    minLength?: number
    maxLength?: number
}

export const stringifyReplaySearchQueryParam = (queryParams: Partial<ReplaysSearchQueryParams>): string => {
    const parsedQueryParams: any = {
        ...queryParams
    }
    if (queryParams.dateBefore !== undefined) {
        parsedQueryParams.dateBefore = queryParams.dateBefore.unix()
    }
    if (queryParams.dateAfter !== undefined) {
        parsedQueryParams.dateAfter = queryParams.dateAfter.unix()
    }
    // TODO: Check if it's worth it to standardise .unix() stringifying.
    return qs.stringify(
        _.mapKeys(parsedQueryParams, (value: unknown, key) => _.snakeCase(key)),
        {arrayFormat: "repeat", addQueryPrefix: true}
    )
}

export const parseReplaySearchFromQueryString = (queryParams: any): Partial<ReplaysSearchQueryParams> => {
    queryParams = _.mapKeys(queryParams, (value: unknown, key) => _.camelCase(key))

    const replaySearchQueryParams: Partial<ReplaysSearchQueryParams> = {}
    if (queryParams.page !== undefined) {
        replaySearchQueryParams.page = Number(queryParams.page)
    }
    if (queryParams.limit !== undefined) {
        replaySearchQueryParams.limit = Number(queryParams.limit)
    }
    if (queryParams.playerIds !== undefined) {
        if (!Array.isArray(queryParams.playerIds)) {
            queryParams.playerIds = [queryParams.playerIds]
        }
        replaySearchQueryParams.playerIds = queryParams.playerIds
    }
    if (queryParams.playlists !== undefined) {
        if (!Array.isArray(queryParams.playlists)) {
            queryParams.playlists = [queryParams.playlists]
        }
        replaySearchQueryParams.playlists = queryParams.playlists.map((playlist: string) => Number(playlist))
    }
    if (queryParams.rank !== undefined) {
        replaySearchQueryParams.rank = Number(queryParams.rank)
    }
    if (queryParams.dateBefore !== undefined) {
        replaySearchQueryParams.dateBefore = moment.unix(queryParams.dateBefore)
    }
    if (queryParams.dateAfter !== undefined) {
        replaySearchQueryParams.dateAfter = moment.unix(queryParams.dateAfter)
    }
    if (queryParams.minLength !== undefined) {
        replaySearchQueryParams.minLength = Number(queryParams.minLength)
    }
    if (queryParams.maxLength !== undefined) {
        replaySearchQueryParams.maxLength = Number(queryParams.maxLength)
    }
    // TODO: Figure out way to standardise this monstrosity - remember to convert array types to arrays
    return replaySearchQueryParams
}
