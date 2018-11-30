export interface SettingsResponse {
    settings: Setting[]
}

interface Setting {
    key: string
    value: any
}
