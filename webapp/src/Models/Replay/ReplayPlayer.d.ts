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
    antenna: LoadoutItem
    banner: LoadoutItem
    boost: LoadoutItem
    car: LoadoutItem
    engine_audio: LoadoutItem
    goal_explosion: LoadoutItem
    skin: LoadoutItem
    topper: LoadoutItem
    trail: LoadoutItem
    wheels: LoadoutItem
}

interface LoadoutItem {
    itemName: string
    imageUrl: string
    paintId: number
    rarity: number
}