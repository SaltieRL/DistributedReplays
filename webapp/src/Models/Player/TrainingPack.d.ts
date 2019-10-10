import moment from "moment"

interface TrainingPackResponse {
    packs: TrainingPack[]
    totalCount: number
    games: any
}

interface TrainingPack {
    guid: string
    shots: TrainingPackShot[]
    date: moment.Moment
    link: string
    name: string
}

interface TrainingPackShot {
    frame: number
    game: string
    timeRemaining: number
}
