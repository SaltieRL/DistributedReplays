interface PlayerInCommonStat {
    count: number
    id: string
    name: string
    avatar: string
}

interface CarStat {
    carName: string
    carPercentage: number
}

interface PlayerStats {
    car: CarStat
    playersInCommon: PlayerInCommonStat[]
    loadout: Loadout
}
