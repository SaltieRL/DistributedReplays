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
