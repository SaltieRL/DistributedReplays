/* tslint:disable:max-line-length */

import {parseReplay} from "../../Models"

export const testPlayerName = "SquishyMuffinz"
export const mockImplementationResolvePlayerNameOrID = (nameOrId: string) => {
    switch (nameOrId) {
        case testPlayerName:
            return Promise.resolve("76561198286759507")
        default:
            throw Error(`Unknown nameOrId in mock: ${nameOrId}`)
    }
}

export const testGetPlayerName = "TESTSquishyTEST"
export const mockImplementationGetPlayer = (id: string) => {
    switch (id) {
        case "76561198286759507":
            return Promise.resolve({
                avatarLink:
                    "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/56/563a198ff25a301997b7c1806afdec3abf3e50e5_full.jpg",
                groups: [],
                id: "76561198286759507",
                name: testGetPlayerName,
                pastNames: [
                    "Squishy (746)",
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

export const testReplayId = "TESTA40EFC4411EA07A0CB19E48DDEE4DFF5TEST"
export const testReplayName = "Test2019-11-15.07.16 Relbuh Ranked Doubles LTest"
export const mockImplementationGetMatchHistory = (id: string, page: number, limit: number) => {
    switch (id) {
        case "76561198286759507":
            return Promise.resolve({
                replays: [
                    {
                        date: "2019-11-15T02:16:04",
                        gameMode: "Doubles",
                        gameScore: {team0Score: 6, team1Score: 3},
                        id: testReplayId,
                        map: "NeoTokyo_Standard_P",
                        mmrs: [2021, 2069, 2039, 1547],
                        name: "Test2019-11-15.07.16 Relbuh Ranked Doubles LTest",
                        players: [
                            {
                                assists: 2,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 110,
                                    height: 90,
                                    pitch: -3,
                                    stiffness: 0.400000005960464,
                                    swivelSpeed: 5,
                                    transitionSpeed: 2.0
                                },
                                goals: 1,
                                id: "76561198258911562",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/903ad0a3dc1555529374.png",
                                        itemName: "G2 Esports",
                                        paintId: 0,
                                        rarity: 4
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/bcf62588db1509208990.png",
                                        itemName: "Standard",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/d0345504de1447516436.png",
                                        itemName: "Dominus",
                                        paintId: 0,
                                        rarity: 2
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/c83a7cc18e1535898151.png",
                                        itemName: "Default",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/58f553376a1499480991.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/16f4343bf51555530012.png",
                                        itemName: "G2 Esports",
                                        paintId: 0,
                                        rarity: 6
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/028d029aa21436130637.png",
                                        itemName: "Trahere",
                                        paintId: 0,
                                        rarity: 0
                                    }
                                },
                                name: "Mijo.",
                                saves: 2,
                                score: 477,
                                shots: 3
                            },
                            {
                                assists: 1,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 110,
                                    height: 110,
                                    pitch: -3,
                                    stiffness: 0.349999994039536,
                                    swivelSpeed: 6,
                                    transitionSpeed: 1.0
                                },
                                goals: 5,
                                id: "76561198286759507",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a15133b6941513041635.png",
                                        itemName: "Winter's Warmth",
                                        paintId: 0,
                                        rarity: 6
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/59a07ffb751560084126.png",
                                        itemName: "Fennec",
                                        paintId: 0,
                                        rarity: 7
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/9bdfd1aa701535900217.png",
                                        itemName: "XP Level 1200",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/712450b3901566940352.png",
                                        itemName: "Dust Cloud",
                                        paintId: 3,
                                        rarity: 3
                                    },
                                    skin: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/dieci/dieci-Black.png",
                                        itemName: "Dieci",
                                        paintId: 3,
                                        rarity: 0
                                    }
                                },
                                name: "Squishy",
                                saves: 2,
                                score: 1046,
                                shots: 9
                            },
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 330,
                                    fieldOfView: 109,
                                    height: 170,
                                    pitch: -11,
                                    stiffness: 1.0,
                                    swivelSpeed: 4,
                                    transitionSpeed: 1.0
                                },
                                goals: 2,
                                id: "76561198347347697",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1ed65865661555515106.png",
                                        itemName: "Mister Monsoon",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/fc54f307611555703711.png",
                                        itemName: "Crown",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/c08eb46c991566939417.png",
                                        itemName: "Big Splash",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/f8faa65b1c1551122318.png",
                                        itemName: "Hex Tide",
                                        paintId: 0,
                                        rarity: 9
                                    },
                                    topper: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/d778652e1f1455229268.png",
                                        itemName: "Beret",
                                        paintId: 0,
                                        rarity: 1
                                    },
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/2e7387c05c1535733756.png",
                                        itemName: "Laser Wave III",
                                        paintId: 3,
                                        rarity: 3
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/8b17e66d471509567593.png",
                                        itemName: "Goldstone (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    }
                                },
                                name: "Relbuh",
                                saves: 2,
                                score: 514,
                                shots: 4
                            },
                            {
                                assists: 1,
                                cameraSettings: {
                                    distance: 260,
                                    fieldOfView: 110,
                                    height: 90,
                                    pitch: -3,
                                    stiffness: 0.600000023841858,
                                    swivelSpeed: 5,
                                    transitionSpeed: 1.0
                                },
                                goals: 1,
                                id: "76561198299709908",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/472ea695811535727882.png",
                                        itemName: "Camo",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/59a07ffb751560084126.png",
                                        itemName: "Fennec",
                                        paintId: 0,
                                        rarity: 7
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/c83a7cc18e1535898151.png",
                                        itemName: "Default",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/712450b3901566940352.png",
                                        itemName: "Dust Cloud",
                                        paintId: 3,
                                        rarity: 3
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/e574121eb11473421648.png",
                                        itemName: "Heatwave",
                                        paintId: 0,
                                        rarity: 9
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a67e907fb81451699877.png",
                                        itemName: "Cristiano",
                                        paintId: 0,
                                        rarity: 2
                                    }
                                },
                                name: "200 IQ NRG Juicetin Kapp",
                                saves: 4,
                                score: 595,
                                shots: 5
                            }
                        ],
                        ranks: [19, 19, 19, 19],
                        tags: [],
                        visibility: 0
                    },
                    {
                        date: "2019-11-08T09:34:25",
                        gameMode: "Doubles",
                        gameScore: {team0Score: 2, team1Score: 5},
                        id: "EBF278BC11EA025DC706F0A1C72D623C",
                        map: "cs_day_p",
                        mmrs: [1849, 2050, 1978, 1894],
                        name: "2019-11-08.14.34 Radoko. Ranked Doubles ",
                        players: [
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 280,
                                    fieldOfView: 110,
                                    height: 90,
                                    pitch: -6,
                                    stiffness: 0.400000005960464,
                                    swivelSpeed: 5,
                                    transitionSpeed: 1.0
                                },
                                goals: 2,
                                id: "76561198219259227",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19be6f365b1555529656.png",
                                        itemName: "Rogue",
                                        paintId: 0,
                                        rarity: 4
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/bcf62588db1509208990.png",
                                        itemName: "Standard",
                                        paintId: 12,
                                        rarity: 0
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/f74f574a311535899707.png",
                                        itemName: "XP Level 900",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/0115fc90961560082977.png",
                                        itemName: "Shattered",
                                        paintId: 5,
                                        rarity: 9
                                    },
                                    skin: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/adc6463f6c1544467784.png",
                                        itemName: "Tachyon III",
                                        paintId: 12,
                                        rarity: 3
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/zomba/zomba-TitaniumWhite.png",
                                        itemName: "Zomba",
                                        paintId: 12,
                                        rarity: 8
                                    }
                                },
                                name: "Wonder",
                                saves: 0,
                                score: 378,
                                shots: 2
                            },
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 109,
                                    height: 100,
                                    pitch: -3,
                                    stiffness: 0.550000011920929,
                                    swivelSpeed: 7,
                                    transitionSpeed: 1.0
                                },
                                goals: 0,
                                id: "76561198441123172",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/05b6a46b201555529432.png",
                                        itemName: "Mousesports",
                                        paintId: 0,
                                        rarity: 4
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/b9a11d86d71509208809.png",
                                        itemName: "Standard Yellow",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/24cfb9941b1555515892.png",
                                        itemName: "Fire Main",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/0115fc90961560082977.png",
                                        itemName: "Shattered",
                                        paintId: 10,
                                        rarity: 9
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/6958e354d31509214827.png",
                                        itemName: "Stripes",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/0ca99d568e1506795191.png",
                                        itemName: "Hot Rocks",
                                        paintId: 0,
                                        rarity: 6
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a67e907fb81451699877.png",
                                        itemName: "Cristiano",
                                        paintId: 0,
                                        rarity: 2
                                    }
                                },
                                name: "iSharrieff lft",
                                saves: 1,
                                score: 164,
                                shots: 3
                            },
                            {
                                assists: 2,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 110,
                                    height: 100,
                                    pitch: -4,
                                    stiffness: 0.449999988079071,
                                    swivelSpeed: 6,
                                    transitionSpeed: 1.0
                                },
                                goals: 2,
                                id: "76561198286759507",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a86bab8a611508199273.png",
                                        itemName: "Howler",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/0ef2f7db2c1535899265.png",
                                        itemName: "XP Level 800",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/8a7b232a1f1522776922.png",
                                        itemName: "Atomizer",
                                        paintId: 0,
                                        rarity: 9
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/6958e354d31509214827.png",
                                        itemName: "Stripes",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a67e907fb81451699877.png",
                                        itemName: "Cristiano",
                                        paintId: 0,
                                        rarity: 2
                                    }
                                },
                                name: "Squishy",
                                saves: 0,
                                score: 472,
                                shots: 4
                            },
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 109,
                                    height: 80,
                                    pitch: -4,
                                    stiffness: 0.449999988079071,
                                    swivelSpeed: 7,
                                    transitionSpeed: 1.0
                                },
                                goals: 3,
                                id: "76561198125183894",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/58f0fbd6151506779544.png",
                                        itemName: "Triangle",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/c83a7cc18e1535898151.png",
                                        itemName: "Default",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/58f553376a1499480991.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/51dfa9513b1499315194.png",
                                        itemName: "Lone Wolf",
                                        paintId: 0,
                                        rarity: 4
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a67e907fb81451699877.png",
                                        itemName: "Cristiano",
                                        paintId: 0,
                                        rarity: 2
                                    }
                                },
                                name: "Radoko.",
                                saves: 2,
                                score: 757,
                                shots: 4
                            }
                        ],
                        ranks: [19, 19, 19, 19],
                        tags: [],
                        visibility: 0
                    },
                    {
                        date: "2019-11-08T08:41:31",
                        gameMode: "Doubles",
                        gameScore: {team0Score: 5, team1Score: 2},
                        id: "30AD1DB411EA026787EF9B9D777CAF14",
                        map: "Stadium_P",
                        mmrs: [2018, 1979, 1970, 1901],
                        name: "2019-11-08.13.41 uprincess tallie birbu ",
                        players: [
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 110,
                                    height: 90,
                                    pitch: -5,
                                    stiffness: 0.5,
                                    swivelSpeed: 8,
                                    transitionSpeed: 1.0
                                },
                                goals: 4,
                                id: "76561198119259610",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/d45fe72f391555529451.png",
                                        itemName: "NRG Esports",
                                        paintId: 0,
                                        rarity: 4
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/59a07ffb751560084126.png",
                                        itemName: "Fennec",
                                        paintId: 0,
                                        rarity: 7
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/c83a7cc18e1535898151.png",
                                        itemName: "Default",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/c08eb46c991566939417.png",
                                        itemName: "Big Splash",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/342148e9851473411817.png",
                                        itemName: "Slipstream",
                                        paintId: 0,
                                        rarity: 9
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1a9256d75a1567239452.png",
                                        itemName: "Emerald Pro",
                                        paintId: 0,
                                        rarity: 3
                                    }
                                },
                                name: "\ue075princess tallie birb\ue075",
                                saves: 2,
                                score: 779,
                                shots: 7
                            },
                            {
                                assists: 3,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 110,
                                    height: 90,
                                    pitch: -4,
                                    stiffness: 0.400000005960464,
                                    swivelSpeed: 6,
                                    transitionSpeed: 1.0
                                },
                                goals: 1,
                                id: "76561198237161718",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/29010e69921506779517.png",
                                        itemName: "Crisscross",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/bcf62588db1509208990.png",
                                        itemName: "Standard",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/d0345504de1447516436.png",
                                        itemName: "Dominus",
                                        paintId: 0,
                                        rarity: 2
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/fc54f307611555703711.png",
                                        itemName: "Crown",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/712450b3901566940352.png",
                                        itemName: "Dust Cloud",
                                        paintId: 3,
                                        rarity: 3
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/b9900449a81555515630.png",
                                        itemName: "Skewered",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/zomba/zomba-TitaniumWhite.png",
                                        itemName: "Zomba",
                                        paintId: 12,
                                        rarity: 8
                                    }
                                },
                                name: "Roll Dizz",
                                saves: 1,
                                score: 597,
                                shots: 5
                            },
                            {
                                assists: 1,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 110,
                                    height: 100,
                                    pitch: -4,
                                    stiffness: 0.5,
                                    swivelSpeed: 6,
                                    transitionSpeed: 1.0
                                },
                                goals: 1,
                                id: "76561198286759507",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a86bab8a611508199273.png",
                                        itemName: "Howler",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/0ef2f7db2c1535899265.png",
                                        itemName: "XP Level 800",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/8a7b232a1f1522776922.png",
                                        itemName: "Atomizer",
                                        paintId: 0,
                                        rarity: 9
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/37ed36ed611555529746.png",
                                        itemName: "Cloud9",
                                        paintId: 0,
                                        rarity: 6
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a67e907fb81451699877.png",
                                        itemName: "Cristiano",
                                        paintId: 0,
                                        rarity: 2
                                    }
                                },
                                name: "Squishy",
                                saves: 0,
                                score: 390,
                                shots: 2
                            },
                            {
                                assists: 1,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 110,
                                    height: 100,
                                    pitch: -4,
                                    stiffness: 0.449999988079071,
                                    swivelSpeed: 4,
                                    transitionSpeed: 1.0
                                },
                                goals: 1,
                                id: "76561198411090295",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/52860defa21521483902.png",
                                        itemName: "Shooting Star",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/fc54f307611555703711.png",
                                        itemName: "Crown",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/712450b3901566940352.png",
                                        itemName: "Dust Cloud",
                                        paintId: 3,
                                        rarity: 3
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/2558fbbf411508200188.png",
                                        itemName: "Thanatos",
                                        paintId: 0,
                                        rarity: 4
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/dieci/dieci-Black.png",
                                        itemName: "Dieci",
                                        paintId: 3,
                                        rarity: 0
                                    }
                                },
                                name: "Shadow",
                                saves: 4,
                                score: 626,
                                shots: 3
                            }
                        ],
                        ranks: [19, 19, 19, 19],
                        tags: [],
                        visibility: 0
                    },
                    {
                        date: "2019-11-04T23:13:23",
                        gameMode: "Standard",
                        gameScore: {team0Score: 6, team1Score: 0},
                        id: "B438622411E9FFABD2DC3E88A58FAB1B",
                        map: "UtopiaStadium_P",
                        mmrs: [1568, 1502, 1574, 1378, 1797, 2053],
                        name: "2019-11-05.04.13 Owl Ranked Standard Win",
                        players: [
                            {
                                assists: 1,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 110,
                                    height: 100,
                                    pitch: -4,
                                    stiffness: 0.449999988079071,
                                    swivelSpeed: 4,
                                    transitionSpeed: 1.0
                                },
                                goals: 1,
                                id: "76561198106317128",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/f37e3cee221535734400.png",
                                        itemName: "Soccar Nebula",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/59a07ffb751560084126.png",
                                        itemName: "Fennec",
                                        paintId: 0,
                                        rarity: 7
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d510aec6f1535899807.png",
                                        itemName: "XP Level 950",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/c08eb46c991566939417.png",
                                        itemName: "Big Splash",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    skin: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/zomba/zomba-TitaniumWhite.png",
                                        itemName: "Zomba",
                                        paintId: 12,
                                        rarity: 8
                                    }
                                },
                                name: "Owl",
                                saves: 1,
                                score: 355,
                                shots: 2
                            },
                            {
                                assists: 3,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 110,
                                    height: 100,
                                    pitch: -4,
                                    stiffness: 0.349999994039536,
                                    swivelSpeed: 5,
                                    transitionSpeed: 1.0
                                },
                                goals: 0,
                                id: "76561198409592760",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/0ed32d660c1539015582.png",
                                        itemName: "Lucky Stars",
                                        paintId: 0,
                                        rarity: 4
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/bcf62588db1509208990.png",
                                        itemName: "Standard",
                                        paintId: 12,
                                        rarity: 0
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/33655265b41535898653.png",
                                        itemName: "XP Level 50",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/712450b3901566940352.png",
                                        itemName: "Dust Cloud",
                                        paintId: 12,
                                        rarity: 3
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/542d3d77811466510286.png",
                                        itemName: "Racer",
                                        paintId: 0,
                                        rarity: 4
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/3092cb70601499318812.png",
                                        itemName: "Friction",
                                        paintId: 0,
                                        rarity: 6
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a67e907fb81451699877.png",
                                        itemName: "Cristiano",
                                        paintId: 0,
                                        rarity: 2
                                    }
                                },
                                name: "Jumpy",
                                saves: 3,
                                score: 460,
                                shots: 1
                            },
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 110,
                                    height: 110,
                                    pitch: -3,
                                    stiffness: 0.699999988079071,
                                    swivelSpeed: 6,
                                    transitionSpeed: 1.0
                                },
                                goals: 5,
                                id: "76561198286759507",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/e294f2f0a51506780985.png",
                                        itemName: "Dendritic",
                                        paintId: 0,
                                        rarity: 4
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/0ef2f7db2c1535899265.png",
                                        itemName: "XP Level 800",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/58f553376a1499480991.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/bd92e4dcdb1475684113.png",
                                        itemName: "MG-88",
                                        paintId: 0,
                                        rarity: 6
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/6d54c8f1171527626317.png",
                                        itemName: "Reaper",
                                        paintId: 0,
                                        rarity: 6
                                    }
                                },
                                name: "Squishy",
                                saves: 1,
                                score: 845,
                                shots: 8
                            },
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 320,
                                    fieldOfView: 110,
                                    height: 110,
                                    pitch: -12,
                                    stiffness: 0.5,
                                    swivelSpeed: 4,
                                    transitionSpeed: 1.0
                                },
                                goals: 0,
                                id: "76561198093156545",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/903ad0a3dc1555529374.png",
                                        itemName: "G2 Esports",
                                        paintId: 0,
                                        rarity: 4
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/5904442bf41509210467.png",
                                        itemName: "Ion Red",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/d0345504de1447516436.png",
                                        itemName: "Dominus",
                                        paintId: 0,
                                        rarity: 2
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/836c24fba81535900067.png",
                                        itemName: "XP Level 1100",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/571524ea461566942380.png",
                                        itemName: "Wall Breaker II",
                                        paintId: 12,
                                        rarity: 3
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/16f4343bf51555530012.png",
                                        itemName: "G2 Esports",
                                        paintId: 0,
                                        rarity: 6
                                    },
                                    topper: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/fez/fez-Black.png",
                                        itemName: "Fez",
                                        paintId: 3,
                                        rarity: 0
                                    },
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/6e3364167f1555516363.png",
                                        itemName: "Hack Swerve III",
                                        paintId: 1,
                                        rarity: 3
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1c11dd17ec1558112689.png",
                                        itemName: "Bionic",
                                        paintId: 0,
                                        rarity: 7
                                    }
                                },
                                name: "not so creative emito",
                                saves: 1,
                                score: 237,
                                shots: 2
                            },
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 300,
                                    fieldOfView: 110,
                                    height: 120,
                                    pitch: -5,
                                    stiffness: 0.649999976158142,
                                    swivelSpeed: 8,
                                    transitionSpeed: 2.0
                                },
                                goals: 0,
                                id: "76561198799920679",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/d7007628121555703845.png",
                                        itemName: "Retro Fresh",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/bcf62588db1509208990.png",
                                        itemName: "Standard",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/d0345504de1447516436.png",
                                        itemName: "Dominus",
                                        paintId: 0,
                                        rarity: 2
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/f74f574a311535899707.png",
                                        itemName: "XP Level 900",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/58f553376a1499480991.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/5dc6fe3b441535729412.png",
                                        itemName: "Partly Cloudy",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/dieci/dieci-Black.png",
                                        itemName: "Dieci",
                                        paintId: 3,
                                        rarity: 0
                                    }
                                },
                                name: "OreOtv_",
                                saves: 0,
                                score: 112,
                                shots: 2
                            },
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 110,
                                    height: 100,
                                    pitch: -4,
                                    stiffness: 0.5,
                                    swivelSpeed: 6,
                                    transitionSpeed: 1.0
                                },
                                goals: 0,
                                id: "76561198980289404",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/99f9e823ea1527626708.png",
                                        itemName: "S. Watercolour",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/bcf62588db1509208990.png",
                                        itemName: "Standard",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/39d03681c31535898335.png",
                                        itemName: "XP Level 25",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/58f553376a1499480991.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    skin: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/2273d6d6d51436132376.png",
                                        itemName: "OEM",
                                        paintId: 0,
                                        rarity: 0
                                    }
                                },
                                name: "0 IQ still juicy",
                                saves: 0,
                                score: 124,
                                shots: 3
                            }
                        ],
                        ranks: [19, 18, 19, 17, 19, 19],
                        tags: [],
                        visibility: 0
                    },
                    {
                        date: "2019-11-04T01:39:37",
                        gameMode: "Standard",
                        gameScore: {team0Score: 4, team1Score: 3},
                        id: "ED11B39E11E9FF0FBB62A9BE327FF865",
                        map: "UtopiaStadium_Dusk_P",
                        mmrs: [1429, 1348, 1686, 1978, 2035, 1873],
                        name: "2019-11-04.06.39 not so juicy kinda juic",
                        players: [
                            {
                                assists: 1,
                                cameraSettings: {
                                    distance: 230,
                                    fieldOfView: 110,
                                    height: 90,
                                    pitch: -3,
                                    stiffness: 0.699999988079071,
                                    swivelSpeed: 6,
                                    transitionSpeed: 1.0
                                },
                                goals: 2,
                                id: "76561198286759507",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/e294f2f0a51506780985.png",
                                        itemName: "Dendritic",
                                        paintId: 0,
                                        rarity: 4
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/0ef2f7db2c1535899265.png",
                                        itemName: "XP Level 800",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/58f553376a1499480991.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/bd92e4dcdb1475684113.png",
                                        itemName: "MG-88",
                                        paintId: 0,
                                        rarity: 6
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/2273d6d6d51436132376.png",
                                        itemName: "OEM",
                                        paintId: 0,
                                        rarity: 0
                                    }
                                },
                                name: "Squishy",
                                saves: 0,
                                score: 462,
                                shots: 5
                            },
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 110,
                                    height: 90,
                                    pitch: -4,
                                    stiffness: 0.400000005960464,
                                    swivelSpeed: 5,
                                    transitionSpeed: 1.0
                                },
                                goals: 1,
                                id: "76561198299709908",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/da93c6d9b61506781381.png",
                                        itemName: "Season 5 - Gold (Dragon)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/75e8bb7e5d1473412157.png",
                                        itemName: "Dominus GT",
                                        paintId: 0,
                                        rarity: 7
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/163fc79ec61566937723.png",
                                        itemName: "Flame",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/4cfbdb64de1521481749.png",
                                        itemName: "Butterflies",
                                        paintId: 0,
                                        rarity: 8
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/20a38cc7901522775948.png",
                                        itemName: "NNTR",
                                        paintId: 0,
                                        rarity: 4
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/zomba/zomba-TitaniumWhite.png",
                                        itemName: "Zomba",
                                        paintId: 12,
                                        rarity: 8
                                    }
                                },
                                name: "slumpedlonelyanddepressedpoggers",
                                saves: 0,
                                score: 332,
                                shots: 4
                            },
                            {
                                assists: 1,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 109,
                                    height: 100,
                                    pitch: -3,
                                    stiffness: 0.400000005960464,
                                    swivelSpeed: 10,
                                    transitionSpeed: 1.0
                                },
                                goals: 1,
                                id: "76561198327846028",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/ab4eac29171518048039.png",
                                        itemName: "RL Esports",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/2d54cb99ee1571074754.png",
                                        itemName: "Scoops Ahoy",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/fe806d90ef1555516209.png",
                                        itemName: "Poof",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    skin: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/dieci/dieci-Black.png",
                                        itemName: "Dieci",
                                        paintId: 3,
                                        rarity: 0
                                    }
                                },
                                name: "Firstkiller",
                                saves: 0,
                                score: 288,
                                shots: 5
                            },
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 108,
                                    height: 120,
                                    pitch: -3,
                                    stiffness: 0.300000011920929,
                                    swivelSpeed: 3,
                                    transitionSpeed: 1.0
                                },
                                goals: 2,
                                id: "76561198968509265",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/158038bc571563816821.png",
                                        itemName: "Knight Rider",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/fbb8ed1e641535899685.png",
                                        itemName: "XP Level 350",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/8f9995ded31555516678.png",
                                        itemName: "Force Razor II",
                                        paintId: 4,
                                        rarity: 3
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/37ed36ed611555529746.png",
                                        itemName: "Cloud9",
                                        paintId: 0,
                                        rarity: 6
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/7af727868a1499480859.png",
                                        itemName: "Season 4 - Champion",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/zomba/zomba-TitaniumWhite.png",
                                        itemName: "Zomba",
                                        paintId: 12,
                                        rarity: 8
                                    }
                                },
                                name: "not so juicy kinda juicy AJT",
                                saves: 1,
                                score: 358,
                                shots: 1
                            },
                            {
                                assists: 1,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 110,
                                    height: 110,
                                    pitch: -4,
                                    stiffness: 1.0,
                                    swivelSpeed: 4,
                                    transitionSpeed: 1.0
                                },
                                goals: 0,
                                id: "76561198967700884",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/6e52d440621562009298.png",
                                        itemName: "Sunset 1986",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/bcf62588db1509208990.png",
                                        itemName: "Standard",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/59a07ffb751560084126.png",
                                        itemName: "Fennec",
                                        paintId: 0,
                                        rarity: 7
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/11bcd689b91566937981.png",
                                        itemName: "Paladin",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/58f553376a1499480991.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/f3d1eb2af01560086184.png",
                                        itemName: "Nitty-Gritty",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a165441fc51571075955.png",
                                        itemName: "Starcourt",
                                        paintId: 0,
                                        rarity: 3
                                    }
                                },
                                name: "ILLAY",
                                saves: 1,
                                score: 226,
                                shots: 0
                            },
                            {
                                assists: 1,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 109,
                                    height: 100,
                                    pitch: -3,
                                    stiffness: 0.400000005960464,
                                    swivelSpeed: 7,
                                    transitionSpeed: 1.0
                                },
                                goals: 1,
                                id: "76561198143665060",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/dd4475dacd1527623319.png",
                                        itemName: "Migraine",
                                        paintId: 0,
                                        rarity: 6
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/bcf62588db1509208990.png",
                                        itemName: "Standard",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/2d54cb99ee1571074754.png",
                                        itemName: "Scoops Ahoy",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/4c9d399f811506784704.png",
                                        itemName: "Party Time",
                                        paintId: 0,
                                        rarity: 9
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/c4c4cf2e6b1555530074.png",
                                        itemName: "Ghost Gaming",
                                        paintId: 0,
                                        rarity: 6
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/veloce/veloce-Black.png",
                                        itemName: "Veloce",
                                        paintId: 3,
                                        rarity: 0
                                    }
                                },
                                name: "Shmuggums.",
                                saves: 3,
                                score: 537,
                                shots: 2
                            }
                        ],
                        ranks: [18, 17, 19, 19, 19, 19],
                        tags: [],
                        visibility: 0
                    },
                    {
                        date: "2019-11-04T00:08:09",
                        gameMode: "Standard",
                        gameScore: {team0Score: 0, team1Score: 5},
                        id: "7D01108811E9FEEAFB16F6A782A3D4C9",
                        map: "EuroStadium_Rainy_P",
                        mmrs: [1716, 1630, 1623, 1701, 1802, 2037],
                        name: "2019-11-04.05.08 Owl Ranked Standard Win",
                        players: [
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 240,
                                    fieldOfView: 110,
                                    height: 90,
                                    pitch: -5,
                                    stiffness: 0.0,
                                    swivelSpeed: 7,
                                    transitionSpeed: 2.0
                                },
                                goals: 0,
                                id: "76561198073115641",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/e294f2f0a51506780985.png",
                                        itemName: "Dendritic",
                                        paintId: 0,
                                        rarity: 4
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/bcf62588db1509208990.png",
                                        itemName: "Standard",
                                        paintId: 3,
                                        rarity: 0
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/24cfb9941b1555515892.png",
                                        itemName: "Fire Main",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/2edd5c32581499318998.png",
                                        itemName: "Hellfire",
                                        paintId: 0,
                                        rarity: 9
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/c428f570501475684232.png",
                                        itemName: "Shisa",
                                        paintId: 0,
                                        rarity: 4
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/7b93afc3031566941112.png",
                                        itemName: "Rally Tracks I",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/veloce/veloce-Black.png",
                                        itemName: "Veloce",
                                        paintId: 3,
                                        rarity: 0
                                    }
                                },
                                name: "BaconBair",
                                saves: 1,
                                score: 159,
                                shots: 0
                            },
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 260,
                                    fieldOfView: 110,
                                    height: 110,
                                    pitch: -3,
                                    stiffness: 0.699999988079071,
                                    swivelSpeed: 4,
                                    transitionSpeed: 1.0
                                },
                                goals: 0,
                                id: "76561198121387808",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1f451871511506779599.png",
                                        itemName: "Dead Serious",
                                        paintId: 0,
                                        rarity: 4
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/16e41cfd961509208748.png",
                                        itemName: "Standard Pink",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/59a07ffb751560084126.png",
                                        itemName: "Fennec",
                                        paintId: 0,
                                        rarity: 7
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/2d54cb99ee1571074754.png",
                                        itemName: "Scoops Ahoy",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/c08eb46c991566939417.png",
                                        itemName: "Big Splash",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    skin: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/camo/camo-Black.png",
                                        itemName: "Camo",
                                        paintId: 3,
                                        rarity: 3
                                    }
                                },
                                name: "...",
                                saves: 1,
                                score: 111,
                                shots: 0
                            },
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 280,
                                    fieldOfView: 110,
                                    height: 110,
                                    pitch: -4,
                                    stiffness: 0.449999988079071,
                                    swivelSpeed: 5,
                                    transitionSpeed: 2.0
                                },
                                goals: 0,
                                id: "76561198361813649",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/8a25d21e231560084014.png",
                                        itemName: "NeOctane",
                                        paintId: 1,
                                        rarity: 4
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/9fa0aafdf41436155523.png",
                                        itemName: "Sparkles",
                                        paintId: 1,
                                        rarity: 0
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/23f29247211535898686.png",
                                        itemName: "XP Level 75",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/58f553376a1499480991.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    skin: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a67e907fb81451699877.png",
                                        itemName: "Cristiano",
                                        paintId: 0,
                                        rarity: 2
                                    }
                                },
                                name: "easy",
                                saves: 1,
                                score: 91,
                                shots: 0
                            },
                            {
                                assists: 2,
                                cameraSettings: {
                                    distance: 230,
                                    fieldOfView: 110,
                                    height: 90,
                                    pitch: -3,
                                    stiffness: 0.699999988079071,
                                    swivelSpeed: 6,
                                    transitionSpeed: 1.0
                                },
                                goals: 2,
                                id: "76561198286759507",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/e294f2f0a51506780985.png",
                                        itemName: "Dendritic",
                                        paintId: 0,
                                        rarity: 4
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/0ef2f7db2c1535899265.png",
                                        itemName: "XP Level 800",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/8a7b232a1f1522776922.png",
                                        itemName: "Atomizer",
                                        paintId: 0,
                                        rarity: 9
                                    },
                                    skin: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a67e907fb81451699877.png",
                                        itemName: "Cristiano",
                                        paintId: 0,
                                        rarity: 2
                                    }
                                },
                                name: "Squishy",
                                saves: 0,
                                score: 432,
                                shots: 4
                            },
                            {
                                assists: 1,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 110,
                                    height: 100,
                                    pitch: -4,
                                    stiffness: 0.449999988079071,
                                    swivelSpeed: 4,
                                    transitionSpeed: 1.0
                                },
                                goals: 0,
                                id: "76561198106317128",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/f37e3cee221535734400.png",
                                        itemName: "Soccar Nebula",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d510aec6f1535899807.png",
                                        itemName: "XP Level 950",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/c08eb46c991566939417.png",
                                        itemName: "Big Splash",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    skin: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/dieci/dieci-Black.png",
                                        itemName: "Dieci",
                                        paintId: 3,
                                        rarity: 0
                                    }
                                },
                                name: "Owl",
                                saves: 0,
                                score: 70,
                                shots: 0
                            },
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 280,
                                    fieldOfView: 110,
                                    height: 110,
                                    pitch: -3,
                                    stiffness: 0.300000011920929,
                                    swivelSpeed: 10,
                                    transitionSpeed: 1.0
                                },
                                goals: 3,
                                id: "76561198070392546",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/7d359358801506779908.png",
                                        itemName: "Island Scales",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/d0345504de1447516436.png",
                                        itemName: "Dominus",
                                        paintId: 0,
                                        rarity: 2
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/c83a7cc18e1535898151.png",
                                        itemName: "Default",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a3774764d11528750437.png",
                                        itemName: "Beach Party",
                                        paintId: 0,
                                        rarity: 8
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/6958e354d31509214827.png",
                                        itemName: "Stripes",
                                        paintId: 0,
                                        rarity: 2
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/dieci/dieci-Black.png",
                                        itemName: "Dieci",
                                        paintId: 3,
                                        rarity: 0
                                    }
                                },
                                name: "Fireburner",
                                saves: 0,
                                score: 471,
                                shots: 4
                            }
                        ],
                        ranks: [19, 19, 19, 19, 19, 19],
                        tags: [],
                        visibility: 0
                    },
                    {
                        date: "2019-11-04T00:01:54",
                        gameMode: "Standard",
                        gameScore: {team0Score: 2, team1Score: 4},
                        id: "3795114411E9FEE915ABC0B37925C4DE",
                        map: "stadium_day_p",
                        mmrs: [1806, 1848, 1621, 1704, 1800, 2034],
                        name: "2019-11-04.05.01 Owl Ranked Standard Win",
                        players: [
                            {
                                assists: 1,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 110,
                                    height: 100,
                                    pitch: -4,
                                    stiffness: 0.449999988079071,
                                    swivelSpeed: 7,
                                    transitionSpeed: 1.0
                                },
                                goals: 1,
                                id: "76561198240090904",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/0ff68618a71566942730.png",
                                        itemName: "Sunstruck",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/bcf62588db1509208990.png",
                                        itemName: "Standard",
                                        paintId: 3,
                                        rarity: 0
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/163fc79ec61566937723.png",
                                        itemName: "Flame",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/712450b3901566940352.png",
                                        itemName: "Dust Cloud",
                                        paintId: 4,
                                        rarity: 3
                                    },
                                    skin: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/0b77921bf31518046651.png",
                                        itemName: "Luminous",
                                        paintId: 0,
                                        rarity: 6
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a67e907fb81451699877.png",
                                        itemName: "Cristiano",
                                        paintId: 0,
                                        rarity: 2
                                    }
                                },
                                name: "jimmerz",
                                saves: 2,
                                score: 449,
                                shots: 4
                            },
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 107,
                                    height: 100,
                                    pitch: -4,
                                    stiffness: 0.5,
                                    swivelSpeed: 4,
                                    transitionSpeed: 1.0
                                },
                                goals: 0,
                                id: "76561198046668774",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/607f582c2f1521483872.png",
                                        itemName: "Soccer Splash",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/bcf62588db1509208990.png",
                                        itemName: "Standard",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/2d54cb99ee1571074754.png",
                                        itemName: "Scoops Ahoy",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/560bd960141529540379.png",
                                        itemName: "T. rex",
                                        paintId: 0,
                                        rarity: 2
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/da8c179d0a1571074673.png",
                                        itemName: "Hawaiian Hopper",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/0b77921bf31518046651.png",
                                        itemName: "Luminous",
                                        paintId: 0,
                                        rarity: 6
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a67e907fb81451699877.png",
                                        itemName: "Cristiano",
                                        paintId: 0,
                                        rarity: 2
                                    }
                                },
                                name: "ko",
                                saves: 1,
                                score: 188,
                                shots: 0
                            },
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 260,
                                    fieldOfView: 110,
                                    height: 110,
                                    pitch: -3,
                                    stiffness: 0.699999988079071,
                                    swivelSpeed: 4,
                                    transitionSpeed: 1.0
                                },
                                goals: 1,
                                id: "76561198121387808",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1f451871511506779599.png",
                                        itemName: "Dead Serious",
                                        paintId: 0,
                                        rarity: 4
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/16e41cfd961509208748.png",
                                        itemName: "Standard Pink",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/59a07ffb751560084126.png",
                                        itemName: "Fennec",
                                        paintId: 0,
                                        rarity: 7
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/2d54cb99ee1571074754.png",
                                        itemName: "Scoops Ahoy",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/c08eb46c991566939417.png",
                                        itemName: "Big Splash",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    skin: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/camo/camo-Black.png",
                                        itemName: "Camo",
                                        paintId: 3,
                                        rarity: 3
                                    }
                                },
                                name: "...",
                                saves: 1,
                                score: 319,
                                shots: 1
                            },
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 110,
                                    height: 100,
                                    pitch: -4,
                                    stiffness: 0.449999988079071,
                                    swivelSpeed: 4,
                                    transitionSpeed: 1.0
                                },
                                goals: 1,
                                id: "76561198106317128",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/f37e3cee221535734400.png",
                                        itemName: "Soccar Nebula",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d510aec6f1535899807.png",
                                        itemName: "XP Level 950",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/c08eb46c991566939417.png",
                                        itemName: "Big Splash",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    skin: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/dieci/dieci-Black.png",
                                        itemName: "Dieci",
                                        paintId: 3,
                                        rarity: 0
                                    }
                                },
                                name: "Owl",
                                saves: 0,
                                score: 176,
                                shots: 3
                            },
                            {
                                assists: 1,
                                cameraSettings: {
                                    distance: 230,
                                    fieldOfView: 110,
                                    height: 90,
                                    pitch: -3,
                                    stiffness: 0.699999988079071,
                                    swivelSpeed: 6,
                                    transitionSpeed: 1.0
                                },
                                goals: 2,
                                id: "76561198286759507",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/e294f2f0a51506780985.png",
                                        itemName: "Dendritic",
                                        paintId: 0,
                                        rarity: 4
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/0ef2f7db2c1535899265.png",
                                        itemName: "XP Level 800",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/8a7b232a1f1522776922.png",
                                        itemName: "Atomizer",
                                        paintId: 0,
                                        rarity: 9
                                    },
                                    skin: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a67e907fb81451699877.png",
                                        itemName: "Cristiano",
                                        paintId: 0,
                                        rarity: 2
                                    }
                                },
                                name: "Squishy",
                                saves: 2,
                                score: 567,
                                shots: 4
                            },
                            {
                                assists: 1,
                                cameraSettings: {
                                    distance: 280,
                                    fieldOfView: 110,
                                    height: 110,
                                    pitch: -3,
                                    stiffness: 0.300000011920929,
                                    swivelSpeed: 10,
                                    transitionSpeed: 1.0
                                },
                                goals: 1,
                                id: "76561198070392546",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/7d359358801506779908.png",
                                        itemName: "Island Scales",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/d0345504de1447516436.png",
                                        itemName: "Dominus",
                                        paintId: 0,
                                        rarity: 2
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/c83a7cc18e1535898151.png",
                                        itemName: "Default",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a3774764d11528750437.png",
                                        itemName: "Beach Party",
                                        paintId: 0,
                                        rarity: 8
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/6958e354d31509214827.png",
                                        itemName: "Stripes",
                                        paintId: 0,
                                        rarity: 2
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/dieci/dieci-Black.png",
                                        itemName: "Dieci",
                                        paintId: 3,
                                        rarity: 0
                                    }
                                },
                                name: "Fireburner",
                                saves: 1,
                                score: 447,
                                shots: 2
                            }
                        ],
                        ranks: [19, 19, 19, 19, 19, 19],
                        tags: [],
                        visibility: 0
                    },
                    {
                        date: "2019-11-03T23:42:05",
                        gameMode: "Standard",
                        gameScore: {team0Score: 3, team1Score: 4},
                        id: "6135146611E9FEE684240F9A72A1FFC1",
                        map: "Farm_UpsideDown_P",
                        mmrs: [1573, 1421, 1575, 1635, 1814, 2048],
                        name: "2019-11-04.04.42 Owl Ranked Standard Win",
                        players: [
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 110,
                                    height: 110,
                                    pitch: -3,
                                    stiffness: 0.400000005960464,
                                    swivelSpeed: 4,
                                    transitionSpeed: 1.0
                                },
                                goals: 2,
                                id: "76561198868484026",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/84ec7af62d1566942638.png",
                                        itemName: "Checkered Flag",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/16e41cfd961509208748.png",
                                        itemName: "Standard Pink",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/f34393d9641535899537.png",
                                        itemName: "XP Level 300",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/15bddf59e41535732469.png",
                                        itemName: "Supernova III",
                                        paintId: 5,
                                        rarity: 3
                                    },
                                    skin: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a67e907fb81451699877.png",
                                        itemName: "Cristiano",
                                        paintId: 0,
                                        rarity: 2
                                    }
                                },
                                name: "Tac is giving",
                                saves: 2,
                                score: 468,
                                shots: 5
                            },
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 110,
                                    height: 100,
                                    pitch: -4,
                                    stiffness: 0.5,
                                    swivelSpeed: 4,
                                    transitionSpeed: 1.0
                                },
                                goals: 1,
                                id: "76561198380670870",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/97346421511527630963.png",
                                        itemName: "Season 7 - Tier 7",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/54b0ca915a1509208717.png",
                                        itemName: "Standard Blue",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/272c7598001535899782.png",
                                        itemName: "XP Level 400",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/e77b1135a91544467264.png",
                                        itemName: "Quasar III",
                                        paintId: 12,
                                        rarity: 3
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/f049e0c6df1544467152.png",
                                        itemName: "Future Shock",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/zomba/zomba-Cobalt.png",
                                        itemName: "Zomba",
                                        paintId: 4,
                                        rarity: 8
                                    }
                                },
                                name: "Elliot",
                                saves: 1,
                                score: 349,
                                shots: 4
                            },
                            {
                                assists: 3,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 110,
                                    height: 100,
                                    pitch: -3,
                                    stiffness: 0.699999988079071,
                                    swivelSpeed: 3,
                                    transitionSpeed: 1.0
                                },
                                goals: 0,
                                id: "76561198156609534",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/42d9054fef1506781537.png",
                                        itemName: "Season 5 - Champion (Dragon)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/b9a11d86d71509208809.png",
                                        itemName: "Standard Yellow",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/f34393d9641535899537.png",
                                        itemName: "XP Level 300",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/93c89c571d1557758777.png",
                                        itemName: "Season 10 - Champion",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a0d11681611527618215.png",
                                        itemName: "Streamline",
                                        paintId: 0,
                                        rarity: 9
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/2e7387c05c1535733756.png",
                                        itemName: "Laser Wave III",
                                        paintId: 11,
                                        rarity: 3
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a67e907fb81451699877.png",
                                        itemName: "Cristiano",
                                        paintId: 0,
                                        rarity: 2
                                    }
                                },
                                name: "Cam^",
                                saves: 1,
                                score: 349,
                                shots: 1
                            },
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 110,
                                    height: 100,
                                    pitch: -4,
                                    stiffness: 0.449999988079071,
                                    swivelSpeed: 4,
                                    transitionSpeed: 1.0
                                },
                                goals: 0,
                                id: "76561198106317128",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/f37e3cee221535734400.png",
                                        itemName: "Soccar Nebula",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d510aec6f1535899807.png",
                                        itemName: "XP Level 950",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/c08eb46c991566939417.png",
                                        itemName: "Big Splash",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/ccc65d49891518049453.png",
                                        itemName: "Storm Watch",
                                        paintId: 0,
                                        rarity: 9
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a67e907fb81451699877.png",
                                        itemName: "Cristiano",
                                        paintId: 0,
                                        rarity: 2
                                    }
                                },
                                name: "Owl",
                                saves: 1,
                                score: 172,
                                shots: 2
                            },
                            {
                                assists: 2,
                                cameraSettings: {
                                    distance: 280,
                                    fieldOfView: 110,
                                    height: 110,
                                    pitch: -3,
                                    stiffness: 0.300000011920929,
                                    swivelSpeed: 10,
                                    transitionSpeed: 1.0
                                },
                                goals: 1,
                                id: "76561198070392546",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/7d359358801506779908.png",
                                        itemName: "Island Scales",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/d0345504de1447516436.png",
                                        itemName: "Dominus",
                                        paintId: 0,
                                        rarity: 2
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/c83a7cc18e1535898151.png",
                                        itemName: "Default",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a3774764d11528750437.png",
                                        itemName: "Beach Party",
                                        paintId: 0,
                                        rarity: 8
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/6958e354d31509214827.png",
                                        itemName: "Stripes",
                                        paintId: 0,
                                        rarity: 2
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/dieci/dieci-Black.png",
                                        itemName: "Dieci",
                                        paintId: 3,
                                        rarity: 0
                                    }
                                },
                                name: "Fireburner",
                                saves: 3,
                                score: 528,
                                shots: 4
                            },
                            {
                                assists: 1,
                                cameraSettings: {
                                    distance: 230,
                                    fieldOfView: 110,
                                    height: 90,
                                    pitch: -3,
                                    stiffness: 0.699999988079071,
                                    swivelSpeed: 6,
                                    transitionSpeed: 1.0
                                },
                                goals: 3,
                                id: "76561198286759507",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/e294f2f0a51506780985.png",
                                        itemName: "Dendritic",
                                        paintId: 0,
                                        rarity: 4
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/0ef2f7db2c1535899265.png",
                                        itemName: "XP Level 800",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/8a7b232a1f1522776922.png",
                                        itemName: "Atomizer",
                                        paintId: 0,
                                        rarity: 9
                                    },
                                    skin: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a67e907fb81451699877.png",
                                        itemName: "Cristiano",
                                        paintId: 0,
                                        rarity: 2
                                    }
                                },
                                name: "Squishy",
                                saves: 3,
                                score: 790,
                                shots: 3
                            }
                        ],
                        ranks: [19, 18, 19, 19, 19, 19],
                        tags: [],
                        visibility: 0
                    },
                    {
                        date: "2019-11-03T23:30:09",
                        gameMode: "Standard",
                        gameScore: {team0Score: 4, team1Score: 1},
                        id: "CFD6888E11E9FEE49C4426A3FB07660C",
                        map: "Stadium_P",
                        mmrs: [1946, 1695, 1634, 1741, 1813, 2047],
                        name: "2019-11-04.04.30 Owl Ranked Standard Los",
                        players: [
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 110,
                                    height: 90,
                                    pitch: -4,
                                    stiffness: 0.5,
                                    swivelSpeed: 5,
                                    transitionSpeed: 1.0
                                },
                                goals: 1,
                                id: "76561198236507532",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1712d51ab91535727686.png",
                                        itemName: "Vice",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/bcf62588db1509208990.png",
                                        itemName: "Standard",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/f74f574a311535899707.png",
                                        itemName: "XP Level 900",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/c08eb46c991566939417.png",
                                        itemName: "Big Splash",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    skin: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a67e907fb81451699877.png",
                                        itemName: "Cristiano",
                                        paintId: 0,
                                        rarity: 2
                                    }
                                },
                                name: "Sixteen",
                                saves: 0,
                                score: 268,
                                shots: 4
                            },
                            {
                                assists: 3,
                                cameraSettings: {
                                    distance: 230,
                                    fieldOfView: 110,
                                    height: 90,
                                    pitch: -3,
                                    stiffness: 0.699999988079071,
                                    swivelSpeed: 6,
                                    transitionSpeed: 1.0
                                },
                                goals: 1,
                                id: "76561198286759507",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/e294f2f0a51506780985.png",
                                        itemName: "Dendritic",
                                        paintId: 0,
                                        rarity: 4
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/0ef2f7db2c1535899265.png",
                                        itemName: "XP Level 800",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/8a7b232a1f1522776922.png",
                                        itemName: "Atomizer",
                                        paintId: 0,
                                        rarity: 9
                                    },
                                    skin: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a67e907fb81451699877.png",
                                        itemName: "Cristiano",
                                        paintId: 0,
                                        rarity: 2
                                    }
                                },
                                name: "Squishy",
                                saves: 1,
                                score: 530,
                                shots: 4
                            },
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 280,
                                    fieldOfView: 110,
                                    height: 110,
                                    pitch: -3,
                                    stiffness: 0.300000011920929,
                                    swivelSpeed: 10,
                                    transitionSpeed: 1.0
                                },
                                goals: 2,
                                id: "76561198070392546",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/7d359358801506779908.png",
                                        itemName: "Island Scales",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/d0345504de1447516436.png",
                                        itemName: "Dominus",
                                        paintId: 0,
                                        rarity: 2
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/c83a7cc18e1535898151.png",
                                        itemName: "Default",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a3774764d11528750437.png",
                                        itemName: "Beach Party",
                                        paintId: 0,
                                        rarity: 8
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/6958e354d31509214827.png",
                                        itemName: "Stripes",
                                        paintId: 0,
                                        rarity: 2
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/dieci/dieci-Black.png",
                                        itemName: "Dieci",
                                        paintId: 3,
                                        rarity: 0
                                    }
                                },
                                name: "Fireburner",
                                saves: 1,
                                score: 442,
                                shots: 2
                            },
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 260,
                                    fieldOfView: 110,
                                    height: 110,
                                    pitch: -4,
                                    stiffness: 0.600000023841858,
                                    swivelSpeed: 5,
                                    transitionSpeed: 1.0
                                },
                                goals: 0,
                                id: "76561198247356798",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/0ff68618a71566942730.png",
                                        itemName: "Sunstruck",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/5c81bbf5611535899580.png",
                                        itemName: "XP Level 850",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/15bddf59e41535732469.png",
                                        itemName: "Supernova III",
                                        paintId: 12,
                                        rarity: 3
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/c428f570501475684232.png",
                                        itemName: "Shisa",
                                        paintId: 0,
                                        rarity: 4
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a67e907fb81451699877.png",
                                        itemName: "Cristiano",
                                        paintId: 0,
                                        rarity: 2
                                    }
                                },
                                name: "Sea-Bass",
                                saves: 3,
                                score: 395,
                                shots: 1
                            },
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 110,
                                    height: 110,
                                    pitch: -3,
                                    stiffness: 0.449999988079071,
                                    swivelSpeed: 10,
                                    transitionSpeed: 1.0
                                },
                                goals: 0,
                                id: "76561198040631598",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a0a5c269061535734459.png",
                                        itemName: "Hoagie",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/bcf62588db1509208990.png",
                                        itemName: "Standard",
                                        paintId: 1,
                                        rarity: 0
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/272c7598001535899782.png",
                                        itemName: "XP Level 400",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/2edd5c32581499318998.png",
                                        itemName: "Hellfire",
                                        paintId: 0,
                                        rarity: 9
                                    },
                                    skin: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/df02a818351544466766.png",
                                        itemName: "Polychrome",
                                        paintId: 0,
                                        rarity: 3
                                    }
                                },
                                name: "Sub'N",
                                saves: 2,
                                score: 248,
                                shots: 0
                            },
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 110,
                                    height: 100,
                                    pitch: -4,
                                    stiffness: 0.449999988079071,
                                    swivelSpeed: 4,
                                    transitionSpeed: 1.0
                                },
                                goals: 1,
                                id: "76561198106317128",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/f37e3cee221535734400.png",
                                        itemName: "Soccar Nebula",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/d1ff3b0a291436133259.png",
                                        itemName: "Breakout",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d510aec6f1535899807.png",
                                        itemName: "XP Level 950",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/c08eb46c991566939417.png",
                                        itemName: "Big Splash",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/f049e0c6df1544467152.png",
                                        itemName: "Future Shock",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a67e907fb81451699877.png",
                                        itemName: "Cristiano",
                                        paintId: 0,
                                        rarity: 2
                                    }
                                },
                                name: "Owl",
                                saves: 0,
                                score: 280,
                                shots: 2
                            }
                        ],
                        ranks: [19, 19, 19, 19, 19, 19],
                        tags: [],
                        visibility: 0
                    },
                    {
                        date: "2019-11-03T23:22:40",
                        gameMode: "Standard",
                        gameScore: {team0Score: 5, team1Score: 1},
                        id: "C61FA06A11E9FEE33FB9D28E92002E75",
                        map: "TrainStation_Night_P",
                        mmrs: [1643, 1849, 1628, 1818, 1818, 2042],
                        name: "2019-11-04.04.22 Owl Ranked Standard Win",
                        players: [
                            {
                                assists: 1,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 110,
                                    height: 100,
                                    pitch: -4,
                                    stiffness: 0.449999988079071,
                                    swivelSpeed: 4,
                                    transitionSpeed: 1.0
                                },
                                goals: 0,
                                id: "76561198106317128",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/f37e3cee221535734400.png",
                                        itemName: "Soccar Nebula",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/d1ff3b0a291436133259.png",
                                        itemName: "Breakout",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d510aec6f1535899807.png",
                                        itemName: "XP Level 950",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/c08eb46c991566939417.png",
                                        itemName: "Big Splash",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/f049e0c6df1544467152.png",
                                        itemName: "Future Shock",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/zomba/zomba-TitaniumWhite.png",
                                        itemName: "Zomba",
                                        paintId: 12,
                                        rarity: 8
                                    }
                                },
                                name: "Owl",
                                saves: 2,
                                score: 204,
                                shots: 1
                            },
                            {
                                assists: 2,
                                cameraSettings: {
                                    distance: 280,
                                    fieldOfView: 110,
                                    height: 110,
                                    pitch: -3,
                                    stiffness: 0.300000011920929,
                                    swivelSpeed: 10,
                                    transitionSpeed: 1.0
                                },
                                goals: 1,
                                id: "76561198070392546",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/7d359358801506779908.png",
                                        itemName: "Island Scales",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/d0345504de1447516436.png",
                                        itemName: "Dominus",
                                        paintId: 0,
                                        rarity: 2
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/c83a7cc18e1535898151.png",
                                        itemName: "Default",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a3774764d11528750437.png",
                                        itemName: "Beach Party",
                                        paintId: 0,
                                        rarity: 8
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/6958e354d31509214827.png",
                                        itemName: "Stripes",
                                        paintId: 0,
                                        rarity: 2
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/dieci/dieci-Black.png",
                                        itemName: "Dieci",
                                        paintId: 3,
                                        rarity: 0
                                    }
                                },
                                name: "Fireburner",
                                saves: 0,
                                score: 320,
                                shots: 4
                            },
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 230,
                                    fieldOfView: 110,
                                    height: 90,
                                    pitch: -3,
                                    stiffness: 0.699999988079071,
                                    swivelSpeed: 6,
                                    transitionSpeed: 1.0
                                },
                                goals: 4,
                                id: "76561198286759507",
                                isOrange: false,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/e294f2f0a51506780985.png",
                                        itemName: "Dendritic",
                                        paintId: 0,
                                        rarity: 4
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                        itemName: "Gold Rush (Alpha Reward)",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/0ef2f7db2c1535899265.png",
                                        itemName: "XP Level 800",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/8a7b232a1f1522776922.png",
                                        itemName: "Atomizer",
                                        paintId: 0,
                                        rarity: 9
                                    },
                                    skin: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a67e907fb81451699877.png",
                                        itemName: "Cristiano",
                                        paintId: 0,
                                        rarity: 2
                                    }
                                },
                                name: "Squishy",
                                saves: 1,
                                score: 712,
                                shots: 7
                            },
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 280,
                                    fieldOfView: 110,
                                    height: 110,
                                    pitch: -4,
                                    stiffness: 0.449999988079071,
                                    swivelSpeed: 5,
                                    transitionSpeed: 1.0
                                },
                                goals: 0,
                                id: "76561198800003299",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/fd3f3451101506779653.png",
                                        itemName: "Moai",
                                        paintId: 0,
                                        rarity: 6
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/bcf62588db1509208990.png",
                                        itemName: "Standard",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/2d54cb99ee1571074754.png",
                                        itemName: "Scoops Ahoy",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/7fa980d8521527631042.png",
                                        itemName: "Striker Pro",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/6958e354d31509214827.png",
                                        itemName: "Stripes",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/2273d6d6d51436132376.png",
                                        itemName: "OEM",
                                        paintId: 0,
                                        rarity: 0
                                    }
                                },
                                name: "asdf",
                                saves: 1,
                                score: 207,
                                shots: 1
                            },
                            {
                                assists: 1,
                                cameraSettings: {
                                    distance: 270,
                                    fieldOfView: 107,
                                    height: 100,
                                    pitch: -4,
                                    stiffness: 0.5,
                                    swivelSpeed: 4,
                                    transitionSpeed: 1.0
                                },
                                goals: 0,
                                id: "76561198046668774",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/607f582c2f1521483872.png",
                                        itemName: "Soccer Splash",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/bcf62588db1509208990.png",
                                        itemName: "Standard",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                        itemName: "Octane",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/2d54cb99ee1571074754.png",
                                        itemName: "Scoops Ahoy",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/560bd960141529540379.png",
                                        itemName: "T. rex",
                                        paintId: 0,
                                        rarity: 2
                                    },
                                    skin: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/da8c179d0a1571074673.png",
                                        itemName: "Hawaiian Hopper",
                                        paintId: 0,
                                        rarity: 3
                                    },
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/0b77921bf31518046651.png",
                                        itemName: "Luminous",
                                        paintId: 0,
                                        rarity: 6
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/a67e907fb81451699877.png",
                                        itemName: "Cristiano",
                                        paintId: 0,
                                        rarity: 2
                                    }
                                },
                                name: "ko",
                                saves: 3,
                                score: 420,
                                shots: 1
                            },
                            {
                                assists: 0,
                                cameraSettings: {
                                    distance: 280,
                                    fieldOfView: 110,
                                    height: 110,
                                    pitch: -5,
                                    stiffness: 0.699999988079071,
                                    swivelSpeed: 8,
                                    transitionSpeed: 2.0
                                },
                                goals: 1,
                                id: "76561198361025993",
                                isOrange: true,
                                loadout: {
                                    antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    banner: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/29010e69921506779517.png",
                                        itemName: "Crisscross",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    boost: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/bcf62588db1509208990.png",
                                        itemName: "Standard",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    car: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/d0345504de1447516436.png",
                                        itemName: "Dominus",
                                        paintId: 0,
                                        rarity: 2
                                    },
                                    engine_audio: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/c83a7cc18e1535898151.png",
                                        itemName: "Default",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    goal_explosion: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/235796ba9c1499481107.png",
                                        itemName: "Standard Orange",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    skin: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                                    trail: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                        itemName: "Classic",
                                        paintId: 0,
                                        rarity: 0
                                    },
                                    wheels: {
                                        imageUrl:
                                            "https://rocket-league.com/content/media/items/avatar/220px/tunica/tunica-Crimson.png",
                                        itemName: "Tunica",
                                        paintId: 1,
                                        rarity: 0
                                    }
                                },
                                name: "n-n",
                                saves: 2,
                                score: 313,
                                shots: 3
                            }
                        ],
                        ranks: [19, 19, 19, 19, 19, 19],
                        tags: [],
                        visibility: 0
                    }
                ],
                totalCount: 799
            }).then((data) => ({...data, replays: data.replays.map(parseReplay)}))
        default:
            throw Error(`Unknown id in mock: ${id}`)
    }
}

export const mockImplementationGetReplay = (id: string) => {
    switch (id) {
        case testReplayId:
            return Promise.resolve({
                date: "2019-11-15T02:16:04",
                gameMode: "Doubles",
                gameScore: {team0Score: 6, team1Score: 3},
                id: testReplayId,
                map: "NeoTokyo_Standard_P",
                mmrs: [2021, 2069, 2039, 1547],
                name: "Test2019-11-15.07.16 Relbuh Ranked Doubles LTest",
                players: [
                    {
                        assists: 2,
                        cameraSettings: {
                            distance: 270,
                            fieldOfView: 110,
                            height: 90,
                            pitch: -3,
                            stiffness: 0.400000005960464,
                            swivelSpeed: 5,
                            transitionSpeed: 2.0
                        },
                        goals: 1,
                        id: "76561198258911562",
                        isOrange: false,
                        loadout: {
                            antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                            banner: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/903ad0a3dc1555529374.png",
                                itemName: "G2 Esports",
                                paintId: 0,
                                rarity: 4
                            },
                            boost: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/bcf62588db1509208990.png",
                                itemName: "Standard",
                                paintId: 0,
                                rarity: 0
                            },
                            car: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/d0345504de1447516436.png",
                                itemName: "Dominus",
                                paintId: 0,
                                rarity: 2
                            },
                            engine_audio: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/c83a7cc18e1535898151.png",
                                itemName: "Default",
                                paintId: 0,
                                rarity: 0
                            },
                            goal_explosion: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/58f553376a1499480991.png",
                                itemName: "Classic",
                                paintId: 0,
                                rarity: 0
                            },
                            skin: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/16f4343bf51555530012.png",
                                itemName: "G2 Esports",
                                paintId: 0,
                                rarity: 6
                            },
                            topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                            trail: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                itemName: "Classic",
                                paintId: 0,
                                rarity: 0
                            },
                            wheels: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/028d029aa21436130637.png",
                                itemName: "Trahere",
                                paintId: 0,
                                rarity: 0
                            }
                        },
                        name: "Mijo.",
                        saves: 2,
                        score: 477,
                        shots: 3
                    },
                    {
                        assists: 1,
                        cameraSettings: {
                            distance: 270,
                            fieldOfView: 110,
                            height: 110,
                            pitch: -3,
                            stiffness: 0.349999994039536,
                            swivelSpeed: 6,
                            transitionSpeed: 1.0
                        },
                        goals: 5,
                        id: "76561198286759507",
                        isOrange: false,
                        loadout: {
                            antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                            banner: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/a15133b6941513041635.png",
                                itemName: "Winter's Warmth",
                                paintId: 0,
                                rarity: 6
                            },
                            boost: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                itemName: "Gold Rush (Alpha Reward)",
                                paintId: 0,
                                rarity: 3
                            },
                            car: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/59a07ffb751560084126.png",
                                itemName: "Fennec",
                                paintId: 0,
                                rarity: 7
                            },
                            engine_audio: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/9bdfd1aa701535900217.png",
                                itemName: "XP Level 1200",
                                paintId: 0,
                                rarity: 3
                            },
                            goal_explosion: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/712450b3901566940352.png",
                                itemName: "Dust Cloud",
                                paintId: 3,
                                rarity: 3
                            },
                            skin: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                            topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                            trail: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                itemName: "Classic",
                                paintId: 0,
                                rarity: 0
                            },
                            wheels: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/dieci/dieci-Black.png",
                                itemName: "Dieci",
                                paintId: 3,
                                rarity: 0
                            }
                        },
                        name: "Squishy",
                        saves: 2,
                        score: 1046,
                        shots: 9
                    },
                    {
                        assists: 0,
                        cameraSettings: {
                            distance: 330,
                            fieldOfView: 109,
                            height: 170,
                            pitch: -11,
                            stiffness: 1.0,
                            swivelSpeed: 4,
                            transitionSpeed: 1.0
                        },
                        goals: 2,
                        id: "76561198347347697",
                        isOrange: true,
                        loadout: {
                            antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                            banner: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/1ed65865661555515106.png",
                                itemName: "Mister Monsoon",
                                paintId: 0,
                                rarity: 3
                            },
                            boost: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                itemName: "Gold Rush (Alpha Reward)",
                                paintId: 0,
                                rarity: 3
                            },
                            car: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/1d349731e61509568153.png",
                                itemName: "Octane",
                                paintId: 0,
                                rarity: 0
                            },
                            engine_audio: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/fc54f307611555703711.png",
                                itemName: "Crown",
                                paintId: 0,
                                rarity: 3
                            },
                            goal_explosion: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/c08eb46c991566939417.png",
                                itemName: "Big Splash",
                                paintId: 0,
                                rarity: 3
                            },
                            skin: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/f8faa65b1c1551122318.png",
                                itemName: "Hex Tide",
                                paintId: 0,
                                rarity: 9
                            },
                            topper: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/d778652e1f1455229268.png",
                                itemName: "Beret",
                                paintId: 0,
                                rarity: 1
                            },
                            trail: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/2e7387c05c1535733756.png",
                                itemName: "Laser Wave III",
                                paintId: 3,
                                rarity: 3
                            },
                            wheels: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/8b17e66d471509567593.png",
                                itemName: "Goldstone (Alpha Reward)",
                                paintId: 0,
                                rarity: 3
                            }
                        },
                        name: "Relbuh",
                        saves: 2,
                        score: 514,
                        shots: 4
                    },
                    {
                        assists: 1,
                        cameraSettings: {
                            distance: 260,
                            fieldOfView: 110,
                            height: 90,
                            pitch: -3,
                            stiffness: 0.600000023841858,
                            swivelSpeed: 5,
                            transitionSpeed: 1.0
                        },
                        goals: 1,
                        id: "76561198299709908",
                        isOrange: true,
                        loadout: {
                            antenna: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                            banner: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/472ea695811535727882.png",
                                itemName: "Camo",
                                paintId: 0,
                                rarity: 3
                            },
                            boost: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/a943e71c601436141243.png",
                                itemName: "Gold Rush (Alpha Reward)",
                                paintId: 0,
                                rarity: 3
                            },
                            car: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/59a07ffb751560084126.png",
                                itemName: "Fennec",
                                paintId: 0,
                                rarity: 7
                            },
                            engine_audio: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/c83a7cc18e1535898151.png",
                                itemName: "Default",
                                paintId: 0,
                                rarity: 0
                            },
                            goal_explosion: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/712450b3901566940352.png",
                                itemName: "Dust Cloud",
                                paintId: 3,
                                rarity: 3
                            },
                            skin: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/e574121eb11473421648.png",
                                itemName: "Heatwave",
                                paintId: 0,
                                rarity: 9
                            },
                            topper: {imageUrl: "", itemName: "None", paintId: 0, rarity: 0},
                            trail: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/19068d454d1499480364.png",
                                itemName: "Classic",
                                paintId: 0,
                                rarity: 0
                            },
                            wheels: {
                                imageUrl:
                                    "https://rocket-league.com/content/media/items/avatar/220px/a67e907fb81451699877.png",
                                itemName: "Cristiano",
                                paintId: 0,
                                rarity: 2
                            }
                        },
                        name: "200 IQ NRG Juicetin Kapp",
                        saves: 4,
                        score: 595,
                        shots: 5
                    }
                ],
                ranks: [19, 19, 19, 19],
                tags: [],
                visibility: 0
            }).then(parseReplay)
        default:
            throw Error(`Unknown id in mock: ${id}`)
    }
}

export const mockImplementationGetReplayPlayerStats = (id: string) => {
    switch (id) {
        case testReplayId:
            return Promise.resolve([
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 3377.4013671875
                        },
                        {isOrange: false, name: "Squishy", value: 2433.306396484375},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 2328.8583984375
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 3144.707275390625}
                    ],
                    subcategory: "Hits",
                    title: "average hit distance",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 54019.49016189575
                        },
                        {isOrange: false, name: "Squishy", value: 90754.30128669739},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 52934.080907821655
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 69558.65057945251}
                    ],
                    subcategory: "Hits",
                    title: "ball hit forward",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 10.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 15.0
                        },
                        {isOrange: true, name: "Relbuh", value: 6.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 8.0
                        }
                    ],
                    subcategory: "Hits",
                    title: "dribbles",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 13.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 9.0
                        },
                        {isOrange: true, name: "Relbuh", value: 5.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 6.0
                        }
                    ],
                    subcategory: "Hits",
                    title: "passes",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 12.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 21.0
                        },
                        {isOrange: true, name: "Relbuh", value: 6.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 14.0
                        }
                    ],
                    subcategory: "Hits",
                    title: "aerials",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 0.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 0.0
                        },
                        {isOrange: true, name: "Relbuh", value: 1.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 0.0
                        }
                    ],
                    subcategory: "Hits",
                    title: "total_flicks",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 3.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 0.0
                        },
                        {isOrange: true, name: "Relbuh", value: 2.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 0.0
                        }
                    ],
                    subcategory: "Ball Carries",
                    title: "total_carries",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 0.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 0.0
                        },
                        {isOrange: true, name: "Relbuh", value: 1.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 0.0
                        }
                    ],
                    subcategory: "Ball Carries",
                    title: "total_flicks",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 1.548416256904602
                        },
                        {isOrange: false, name: "Squishy", value: 0.0},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 1.451646327972412
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 0.0}
                    ],
                    subcategory: "Ball Carries",
                    title: "longest_carry",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 2627.0830078125},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 0.0
                        },
                        {isOrange: true, name: "Relbuh", value: 2178.705078125},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 0.0
                        }
                    ],
                    subcategory: "Ball Carries",
                    title: "furthest_carry",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 3.677492141723633
                        },
                        {isOrange: false, name: "Squishy", value: 0.0},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 2.612961530685425
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 0.0}
                    ],
                    subcategory: "Ball Carries",
                    title: "total_carry_time",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 1.2258306741714478
                        },
                        {isOrange: false, name: "Squishy", value: 0.0},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 1.3064807653427124
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 0.0}
                    ],
                    subcategory: "Ball Carries",
                    title: "average_carry_time",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 17340.46875},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 0.0
                        },
                        {isOrange: true, name: "Relbuh", value: 14894.259765625},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 0.0
                        }
                    ],
                    subcategory: "Ball Carries",
                    title: "fastest_carry_speed",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 6046.716796875},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 0.0
                        },
                        {isOrange: true, name: "Relbuh", value: 3971.46044921875},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 0.0
                        }
                    ],
                    subcategory: "Ball Carries",
                    title: "total_carry_distance",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 17340.46875},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 0.0
                        },
                        {isOrange: true, name: "Relbuh", value: 14894.259765625},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 0.0
                        }
                    ],
                    subcategory: "Ball Carries",
                    title: "average_carry_speed",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 2118.92431640625},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 0.0
                        },
                        {isOrange: true, name: "Relbuh", value: 2171.6787109375},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 0.0
                        }
                    ],
                    subcategory: "Ball Carries",
                    title: "distance_along_path",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 37.59819030761719
                        },
                        {isOrange: false, name: "Squishy", value: 50.61504364013672},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 28.887863159179688
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 28.74422264099121}
                    ],
                    subcategory: "Ball",
                    title: "time close to ball",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 85.01880645751953
                        },
                        {isOrange: false, name: "Squishy", value: 112.06798553466797},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 66.63065338134766
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 59.66407012939453}
                    ],
                    subcategory: "Ball",
                    title: "time closest to ball",
                    type: "pie"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 82.55204010009766
                        },
                        {isOrange: false, name: "Squishy", value: 78.29296112060547},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 91.16392517089844
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 71.3725814819336}
                    ],
                    subcategory: "Ball",
                    title: "time furthest from ball",
                    type: "pie"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 207.8780059814453
                        },
                        {isOrange: false, name: "Squishy", value: 226.55487060546875},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 231.5399627685547
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 233.8634796142578}
                    ],
                    subcategory: "Ball",
                    title: "time behind ball",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 115.50350952148438
                        },
                        {isOrange: false, name: "Squishy", value: 96.8266372680664},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 85.79232025146484
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 80.32427978515625}
                    ],
                    subcategory: "Ball",
                    title: "time in front ball",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 14.178065299987793
                        },
                        {isOrange: false, name: "Squishy", value: 25.59731101989746},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 9.580866813659668
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 13.161639213562012}
                    ],
                    subcategory: "Positioning",
                    title: "time high in air",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 100.79299926757812
                        },
                        {isOrange: false, name: "Squishy", value: 148.26441955566406},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 127.9393310546875
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 134.37696838378906}
                    ],
                    subcategory: "Positioning",
                    title: "time low in air",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 188.4734649658203
                        },
                        {isOrange: false, name: "Squishy", value: 136.74533081054688},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 165.58596801757812
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 151.3101348876953}
                    ],
                    subcategory: "Positioning",
                    title: "time on ground",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 108.00281524658203
                        },
                        {isOrange: false, name: "Squishy", value: 91.93827056884766},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 180.0060272216797
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 164.327880859375}
                    ],
                    subcategory: "Positioning",
                    title: "time in defending third",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 105.92234802246094
                        },
                        {isOrange: false, name: "Squishy", value: 123.39092254638672},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 89.66384887695312
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 104.13276672363281}
                    ],
                    subcategory: "Positioning",
                    title: "time in neutral third",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 109.45634460449219
                        },
                        {isOrange: false, name: "Squishy", value: 108.05231475830078},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 47.66241455078125
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 45.72712326049805}
                    ],
                    subcategory: "Positioning",
                    title: "time in attacking third",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 165.2466583251953
                        },
                        {isOrange: false, name: "Squishy", value: 151.60166931152344},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 226.8946533203125
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 220.21731567382812}
                    ],
                    subcategory: "Positioning",
                    title: "time in defending half",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 158.1348419189453
                        },
                        {isOrange: false, name: "Squishy", value: 171.7798309326172},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 90.43763732910156
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 93.97045135498047}
                    ],
                    subcategory: "Positioning",
                    title: "time in attacking half",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 66.24449920654297
                        },
                        {isOrange: false, name: "Squishy", value: 56.22700119018555},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 74.42271423339844
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 67.88920593261719}
                    ],
                    subcategory: "Positioning",
                    title: "time near wall",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 2.516193151473999
                        },
                        {isOrange: false, name: "Squishy", value: 3.677503824234009},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 2.032931089401245
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 3.5323374271392822}
                    ],
                    subcategory: "Positioning",
                    title: "time in corner",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 17757.6796875},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 16515.69921875
                        },
                        {isOrange: true, name: "Relbuh", value: 15310.5869140625},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 15046.81640625
                        }
                    ],
                    subcategory: "Playstyles",
                    title: "speed",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 235.75042724609375
                        },
                        {isOrange: false, name: "Squishy", value: 217.16903686523438},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 199.41004943847656
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 182.42660522460938}
                    ],
                    subcategory: "Playstyles",
                    title: "time at boost speed",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 13.597139358520508
                        },
                        {isOrange: false, name: "Squishy", value: 22.452138900756836},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 36.629817962646484
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 44.80751419067383}
                    ],
                    subcategory: "Playstyles",
                    title: "time at slow speed",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 108.29486846923828
                        },
                        {isOrange: false, name: "Squishy", value: 67.6954345703125},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 55.59822082519531
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 63.631309509277344}
                    ],
                    subcategory: "Playstyles",
                    title: "time at super sonic",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 74.76023466400001
                        },
                        {isOrange: false, name: "Squishy", value: 100.358056606},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 55.21098554899999
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 68.325412715}
                    ],
                    subcategory: "Possession",
                    title: "possession time",
                    type: "pie"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 5.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 11.0
                        },
                        {isOrange: true, name: "Relbuh", value: 14.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 11.0
                        }
                    ],
                    subcategory: "Possession",
                    title: "turnovers",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 2.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 3.0
                        },
                        {isOrange: true, name: "Relbuh", value: 8.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 5.0
                        }
                    ],
                    subcategory: "Possession",
                    title: "turnovers on my half",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 2.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 5.0
                        },
                        {isOrange: true, name: "Relbuh", value: 4.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 1.0
                        }
                    ],
                    subcategory: "Possession",
                    title: "turnovers on their half",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 3995.951948083467
                        },
                        {isOrange: false, name: "Squishy", value: 3083.48266703773},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 2477.8772155344627
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 2659.1304629474935}
                    ],
                    subcategory: "Boosts",
                    title: "boost usage",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 924.3335571289062
                        },
                        {isOrange: false, name: "Squishy", value: 459.8454284667969},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 344.45361328125
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 144.80126953125}
                    ],
                    subcategory: "Boosts",
                    title: "wasted collection",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 1240.747802734375
                        },
                        {isOrange: false, name: "Squishy", value: 562.9347534179688},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 277.724365234375
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 496.39599609375}
                    ],
                    subcategory: "Boosts",
                    title: "wasted usage",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 79.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 44.0
                        },
                        {isOrange: true, name: "Relbuh", value: 82.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 59.0
                        }
                    ],
                    subcategory: "Boosts",
                    title: "num small boosts",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 38.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 26.0
                        },
                        {isOrange: true, name: "Relbuh", value: 16.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 20.0
                        }
                    ],
                    subcategory: "Boosts",
                    title: "num large boosts",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 0.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 0.0
                        },
                        {isOrange: true, name: "Relbuh", value: 0.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 1.0
                        }
                    ],
                    subcategory: "Boosts",
                    title: "num stolen boosts",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 21.194011688232422
                        },
                        {isOrange: false, name: "Squishy", value: 28.645811080932617},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 7.307194232940674
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 8.51632022857666}
                    ],
                    subcategory: "Boosts",
                    title: "time full boost",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 94.11624908447266
                        },
                        {isOrange: false, name: "Squishy", value: 125.56926727294922},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 104.47013092041016
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 148.11749267578125}
                    ],
                    subcategory: "Boosts",
                    title: "time low boost",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 35.56525421142578
                        },
                        {isOrange: false, name: "Squishy", value: 52.744178771972656},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 27.00065803527832
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 39.29116439819336}
                    ],
                    subcategory: "Boosts",
                    title: "time no boost",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 2.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 1.0
                        },
                        {isOrange: true, name: "Relbuh", value: 5.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 2.0
                        }
                    ],
                    subcategory: "Boosts",
                    title: "boost ratio",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 907.6148071289062
                        },
                        {isOrange: false, name: "Squishy", value: 459.8454284667969},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 322.03173828125
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 144.80126953125}
                    ],
                    subcategory: "Boosts",
                    title: "wasted big",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 16.71875},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 0.0
                        },
                        {isOrange: true, name: "Relbuh", value: 22.421875},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 0.0
                        }
                    ],
                    subcategory: "Boosts",
                    title: "wasted small",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 9.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 9.0
                        },
                        {isOrange: true, name: "Relbuh", value: 9.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 9.0
                        }
                    ],
                    subcategory: "Kickoffs",
                    title: "total_kickoffs",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 4.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 0.0
                        },
                        {isOrange: true, name: "Relbuh", value: 0.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 5.0
                        }
                    ],
                    subcategory: "Kickoffs",
                    title: "num_time_boost",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 2.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 1.0
                        },
                        {isOrange: true, name: "Relbuh", value: 4.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 1.0
                        }
                    ],
                    subcategory: "Kickoffs",
                    title: "num_time_cheat",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 3.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 6.0
                        },
                        {isOrange: true, name: "Relbuh", value: 5.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 3.0
                        }
                    ],
                    subcategory: "Kickoffs",
                    title: "num_time_go_to_ball",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 0.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 6.0
                        },
                        {isOrange: true, name: "Relbuh", value: 0.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 3.0
                        }
                    ],
                    subcategory: "Kickoffs",
                    title: "num_time_first_touch",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 115.6153564453125
                        },
                        {isOrange: false, name: "Squishy", value: 30.38636589050293},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 66.98477935791016
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 131.90977478027344}
                    ],
                    subcategory: "Kickoffs",
                    title: "average_boost_used",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 0.805321491758866
                        },
                        {isOrange: false, name: "Squishy", value: 0.852990591922379},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 0.866697518080012
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 0.946528334737352}
                    ],
                    subcategory: "Efficiency",
                    title: "collection boost efficiency",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 0.689498818090277
                        },
                        {isOrange: false, name: "Squishy", value: 0.817435408528249},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 0.887918431351946
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 0.81332394066009}
                    ],
                    subcategory: "Efficiency",
                    title: "used boost efficiency",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 0.544001398512367
                        },
                        {isOrange: false, name: "Squishy", value: 0.673024238527888},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 0.759219048562065
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 0.763221098365953}
                    ],
                    subcategory: "Efficiency",
                    title: "total boost efficiency",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 80.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 73.0
                        },
                        {isOrange: true, name: "Relbuh", value: 50.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 53.0
                        }
                    ],
                    subcategory: "Efficiency",
                    title: "turnover efficiency",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {
                            isOrange: false,
                            name: "Mijo.",
                            value: 0.3333333333333333
                        },
                        {isOrange: false, name: "Squishy", value: 0.5555555555555556},
                        {
                            isOrange: true,
                            name: "Relbuh",
                            value: 0.5
                        },
                        {isOrange: true, name: "200 IQ NRG Juicetin Kapp", value: 0.2}
                    ],
                    subcategory: "Efficiency",
                    title: "shot %",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 68.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 55.0
                        },
                        {isOrange: true, name: "Relbuh", value: 35.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 65.0
                        }
                    ],
                    subcategory: "Efficiency",
                    title: "useful/hits",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 33.7526491341581},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 39.0598407288689
                        },
                        {isOrange: true, name: "Relbuh", value: 13.8451927924544},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 29.8134089567876
                        }
                    ],
                    subcategory: "Efficiency",
                    title: "aerial efficiency",
                    type: "radar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 477.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 1046.0
                        },
                        {isOrange: true, name: "Relbuh", value: 514.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 595.0
                        }
                    ],
                    subcategory: "Main Stats",
                    title: "score",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 1.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 5.0
                        },
                        {isOrange: true, name: "Relbuh", value: 2.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 1.0
                        }
                    ],
                    subcategory: "Main Stats",
                    title: "goals",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 2.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 1.0
                        },
                        {isOrange: true, name: "Relbuh", value: 0.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 1.0
                        }
                    ],
                    subcategory: "Main Stats",
                    title: "assists",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 2.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 2.0
                        },
                        {isOrange: true, name: "Relbuh", value: 2.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 4.0
                        }
                    ],
                    subcategory: "Main Stats",
                    title: "saves",
                    type: "bar"
                },
                {
                    chartDataPoints: [
                        {isOrange: false, name: "Mijo.", value: 3.0},
                        {
                            isOrange: false,
                            name: "Squishy",
                            value: 9.0
                        },
                        {isOrange: true, name: "Relbuh", value: 4.0},
                        {
                            isOrange: true,
                            name: "200 IQ NRG Juicetin Kapp",
                            value: 5.0
                        }
                    ],
                    subcategory: "Main Stats",
                    title: "shots",
                    type: "bar"
                }
            ])
        default:
            throw Error(`Unknown id in mock: ${id}`)
    }
}
