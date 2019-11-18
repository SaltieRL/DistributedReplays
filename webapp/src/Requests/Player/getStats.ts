import { doGet } from "../../apiHandler/apiHandler"
import { useMockData } from "../Config"

const loadout = {
    antenna: {
        imageUrl: "",
        itemName: "None",
        rarity: 3,
        paintId: 0
    },
    banner: {
        imageUrl: "https://rocket-league.com/content/media/items/avatar/220px/1ad723c8e61538914741.png",
        itemName: "CRL Eastern",
        rarity: 3,
        paintId: 0
    },
    boost: {
        imageUrl: "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
        itemName: "Gold Rush (Alpha Reward)",
        rarity: 3,
        paintId: 0
    },
    car: {
        imageUrl: "https://rocket-league.com/content/media/items/avatar/220px/d0345504de1447516436.png",
        itemName: "Dominus",
        rarity: 3,
        paintId: 0
    },
    engine_audio: {
        imageUrl: "",
        itemName: "None",
        rarity: 3,
        paintId: 0
    },
    goal_explosion: {
        imageUrl: "https://rocket-league.com/content/media/items/avatar/220px/15bddf59e41535732469.png",
        itemName: "Supernova III",
        rarity: 3,
        paintId: 13
    },
    skin: {
        imageUrl: "",
        itemName: "None",
        rarity: 3,
        paintId: 0
    },
    topper: {
        imageUrl: "",
        itemName: "None",
        rarity: 3,
        paintId: 0
    },
    trail: {
        imageUrl: "https://rocket-league.com/content/media/items/avatar/220px/f4fa8f49811499480724.png",
        itemName: "Season 4 - Gold",
        rarity: 3,
        paintId: 0
    },
    wheels: {
        imageUrl: "https://rocket-league.com/content/media/items/avatar/220px/1a9256d75a1567239452.png",
        itemName: "Emerald Pro",
        rarity: 3,
        paintId: 0
    }
}
export const getStats = (id: string): Promise<PlayerStats> => {
    if (useMockData) {
        return Promise.resolve({
            car: {
                carName: "octane",
                carPercentage: 0.8
            },
            playersInCommon: [
                {
                    count: 3,
                    id: "76561198060924319",
                    name: "synthex",
                    avatar: ""
                },
                {
                    count: 2,
                    id: "76561198296700336",
                    name: "Starsy",
                    avatar: ""
                },
                {
                    count: 1,
                    id: "76561198201788086",
                    name: "Blitze",
                    avatar: ""
                }
            ],
            loadout

        })
    }
    return doGet(`/player/${id}/profile_stats`)
}
