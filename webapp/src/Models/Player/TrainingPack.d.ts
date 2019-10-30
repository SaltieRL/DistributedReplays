import moment from "moment"
import { CompactReplay } from ".."

interface TrainingPackResponse {
    packs: TrainingPack[]
    totalCount: number
    games: Record<string, CompactReplay>
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
