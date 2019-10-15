interface AdminLogsResponse {
    logs: AdminLog[]
    count: number
}

interface AdminLog {
    id: number
    uuid: string
    result: number
    log?: string
    params?: string
    errorType?: string
    game?: string
}
