import {CompactReplay} from ".."

interface Stream {
    name: string
    game: string
    thumbnail: string
    title: string
    viewers: number
}

interface StreamResponse {
    streams: Stream[]
}

interface PatreonResponse {
    progress: number
    total: number
}

interface RecentReplaysResponse {
    recent: CompactReplay[]
}
