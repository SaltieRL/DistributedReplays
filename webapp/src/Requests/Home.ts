import {doGet} from "../apiHandler/apiHandler"
import {PatreonResponse, RecentReplaysResponse, StreamResponse} from "../Models/types/Homepage"

export const getTwitchStreams = (): Promise<StreamResponse> => doGet("/home/twitch")

export const getPatreonProgress = (): Promise<PatreonResponse> => doGet("/home/patreon")

export const getRecentReplays = (): Promise<RecentReplaysResponse> => doGet("/home/recent")
