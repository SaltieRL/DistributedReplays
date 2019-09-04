import moment from "moment"

export type GameMode = "1's" | "2's" | "3's"

interface GameScore {
    team0Score: number
    team1Score: number
}

export enum GameVisibility {
    DEFAULT = 0,
    PUBLIC = 1,
    PRIVATE = 2
}

export interface Replay {
    id: string
    name: string
    date: moment.Moment
    map: string
    gameMode: GameMode
    gameScore: GameScore
    players: ReplayPlayer[]
    tags: Tag[],
    visibility: GameVisibility
    ranks: number[]
    mmrs: number[]
}

export const parseReplay = (data: any) => {
    return {
        ...data,
        date: moment(data.date)
    }
}

type GameResult = "Win" | "Loss"

export const getReplayResult = (replay: Replay, player: Player): GameResult => {
    const playerIsOrange = (replay.players.find((replayPlayer) => replayPlayer.id === player.id) || {} as any)!.isOrange
    const winnerIsOrange = replay.gameScore.team1Score > replay.gameScore.team0Score
    return winnerIsOrange === playerIsOrange ? "Win" : "Loss"
}
