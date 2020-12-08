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
                doubles: {name: "Grand Champion III (div 3)", rank: 21, rating: 1827},
                dropshot: {name: "Unranked (div 1)", rank: 0, rating: 1068},
                duel: {name: "Supersonic Legend", rank: 22, rating: 1387},
                hoops: {name: "Unranked (div 1)", rank: 0, rating: 1104},
                rumble: {name: "Unranked (div 1)", rank: 0, rating: 1104},
                snowday: {name: "Unranked (div 1)", rank: 0, rating: 1050},
                standard: {name: "Grand Champion II (div 3)", rank: 20, rating: 1732},
                tournament: {name: "Grand Champion III (div 1)", rank: 21, rating: 1807}
            })
        default:
            throw Error(`Unknown id in mock: ${id}`)
    }
}
