export const TEST_PLAYER_ID = "TESTPLAYERID"

export const mockImplementationGetPlayer = (id: string) => {
    switch (id) {
        case TEST_PLAYER_ID:
            return Promise.resolve({
                avatarLink:
                    "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/56/563a198ff25a301997b7c1806afdec3abf3e50e5_full.jpg",
                groups: [],
                id: TEST_PLAYER_ID,
                name: "Squishy",
                pastNames: [
                    "Squishy (754)",
                    "C9 Squishy (164)",
                    "SquishyMuffinz (154)",
                    "Squishy Muffinz (58)",
                    "Zodiac | SquishyMuffinz (12)"
                ],
                platform: "Steam",
                profileLink: "https://steamcommunity.com/id/SquishyMuffinz/"
            })
        default:
            throw Error(`Unknown id in mock: ${id}`)
    }
}
export const mockImplementationGetRank = (id: string) => {
    switch (id) {
        case TEST_PLAYER_ID:
            return Promise.resolve({
                doubles: {name: "Grand Champion", rank: 19, rating: 2140},
                dropshot: {name: "Unranked (div 1)", rank: 0, rating: 1194},
                duel: {name: "Grand Champion", rank: 19, rating: 1426},
                hoops: {name: "Unranked (div 1)", rank: 0, rating: 1213},
                rumble: {name: "Unranked (div 1)", rank: 0, rating: 1167},
                snowday: {name: "Unranked (div 1)", rank: 0, rating: 1166},
                standard: {name: "Grand Champion", rank: 19, rating: 2040}
            })
        default:
            throw Error(`Unknown id in mock: ${id}`)
    }
}
