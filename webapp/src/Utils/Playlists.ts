export interface PlaylistMetadata {
    name: string
    value: number
    current: boolean
    ranked: boolean
    standardMode: boolean
    publicMode: boolean
}

export const playlists: PlaylistMetadata[] = [
    {
        name: "Duels (U)",
        value: 1,
        current: true,
        ranked: false,
        standardMode: true,
        publicMode: true
    },
    {
        name: "Doubles (U)",
        value: 2,
        current: true,
        ranked: false,
        standardMode: true,
        publicMode: true
    },
    {
        name: "Standard (U)",
        value: 3,
        current: true,
        ranked: false,
        standardMode: true,
        publicMode: true
    },
    {
        name: "Chaos (U)",
        value: 4,
        current: true,
        ranked: false,
        standardMode: true,
        publicMode: true
    },
    {
        name: "Custom",
        value: 6,
        current: true,
        ranked: false,
        standardMode: false,
        publicMode: false
    },
    {
        name: "Offline",
        value: 8,
        current: true,
        ranked: false,
        standardMode: false,
        publicMode: false
    },
    {
        name: "Duels",
        value: 10,
        current: true,
        ranked: true,
        standardMode: true,
        publicMode: true
    },
    {
        name: "Doubles",
        value: 11,
        current: true,
        ranked: true,
        standardMode: true,
        publicMode: true
    },
    {
        name: "Solo Standard",
        value: 12,
        current: true,
        ranked: true,
        standardMode: true,
        publicMode: true
    },
    {
        name: "Standard",
        value: 13,
        current: true,
        ranked: true,
        standardMode: true,
        publicMode: true
    },
    {
        name: "Snow Day (U)",
        value: 15,
        current: false,
        ranked: false,
        standardMode: false,
        publicMode: false
    },
    {
        name: "Rocket Labs",
        value: 16,
        current: false,
        ranked: false,
        standardMode: false,
        publicMode: false
    },
    {
        name: "Hoops (U)",
        value: 17,
        current: false,
        ranked: false,
        standardMode: false,
        publicMode: false
    },
    {
        name: "Rumble (U)",
        value: 18,
        current: false,
        ranked: false,
        standardMode: false,
        publicMode: false
    },
    {
        name: "Dropshot (U)",
        value: 23,
        current: false,
        ranked: false,
        standardMode: false,
        publicMode: false
    },
    {
        name: "Anniversary",
        value: 25,
        current: false,
        ranked: false,
        standardMode: false,
        publicMode: false
    },
    {
        name: "Hoops",
        value: 27,
        current: true,
        ranked: true,
        standardMode: false,
        publicMode: true
    },
    {
        name: "Rumble",
        value: 28,
        current: true,
        ranked: true,
        standardMode: false,
        publicMode: true
    },
    {
        name: "Dropshot",
        value: 29,
        current: true,
        ranked: true,
        standardMode: false,
        publicMode: true
    },
    {
        name: "Snow Day",
        value: 30,
        current: true,
        ranked: true,
        standardMode: false,
        publicMode: true
    }
]
