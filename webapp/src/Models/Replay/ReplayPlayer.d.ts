interface ReplayPlayer {
    id: string
    name: string
    isOrange: boolean
    score: number
    goals: number
    assists: number
    saves: number
    shots: number
    cameraSettings: CameraSettings
    loadout: Loadout
}

interface CameraSettings {
    distance: number
    fieldOfView: number
    transitionSpeed: number
    pitch: number
    swivelSpeed: number
    stiffness: number
    height: number
}

interface Loadout {
    car: string
}

interface ReplayDataResponse {
    ball: number[][]  // [pos_x, pos_z, pos_y, rot_x, rot_z, rot_y]
    colors: number[]
    frames: number[][]
    names: string[]
    id: string
    players: any[][]
}