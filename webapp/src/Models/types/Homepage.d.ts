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
