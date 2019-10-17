interface ItemListResponse {
    items: Item[]
    count: number
}

interface Item {
    image: string
    ingameid: number
    name: string
    rarity: number
}

export interface ItemFull {
    category: number
    description: null
    dlcpack: null
    edition: null
    hascoloredicons: number
    id: number
    image: string
    ingameid: number
    isteamitem: number
    name: string
    ownedby: null
    parent: null
    parentitem: null
    photo: string
    platform: string
    rarity: number
    shortname: string
    tradable: number
    translations: any
    unlockmethod: number
}
export interface ItemUsage {
    data: ItemDataPoint[]
}

export interface ItemDataPoint {
    count: number
    date: string
    total: number
}
