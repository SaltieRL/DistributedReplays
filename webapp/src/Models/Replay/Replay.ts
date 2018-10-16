import * as moment from "moment"
import { Player } from "src/Models"
import { ReplayPlayer } from "./ReplayPlayer"

export type GameMode = "1's" | "2's" | "3's"

interface GameScore {
    team0Score: number
    team1Score: number
}

export interface Replay {
    id: string
    name: string
    date: moment.Moment
    gameMode: GameMode
    gameScore: GameScore
    players: ReplayPlayer[]
}

export const parseReplay = (data: any) => {
    return {
        ...data,
        date: moment(data.date)
    }
}

type GameResult = "Win" | "Loss"

export const getReplayResult = (replay: Replay, player: Player): GameResult => {
    const playerIsOrange = replay.players.find((replayPlayer) => replayPlayer.id === player.id)!.isOrange
    return replay.gameScore.team1Score > replay.gameScore.team0Score === playerIsOrange ? "Win" : "Loss"
}
