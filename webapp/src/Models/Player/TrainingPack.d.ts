import moment from "moment"

interface TrainingPackResponse {
    packs: TrainingPack[]
    totalCount: number
}

interface TrainingPack {
    guid: string
    shots: TrainingPackShot[]
    date: moment.Moment
    link: string
}

interface TrainingPackShot {
    frame: number
    game: string
    timeRemaining: number
}
