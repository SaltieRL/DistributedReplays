import * as moment from "moment"
import * as React from "react"

export type GameMode = "1's" | "2's" | "3's"

interface GameScore {
    team0Score: number
    team1Score: number
}

export interface Replay {
    name: string
    date: moment.Moment
    gameMode: GameMode
    score: GameScore
    players: ReplayPlayer[]
}

export const getColouredGameScore = (replay: Replay) => {
    return (
        <>
            <span style={{color: "blue"}}>{replay.score.team0Score}</span>
            {" - "}
            <span style={{color: "orange"}}>{replay.score.team1Score}</span>
        </>
    )
}
