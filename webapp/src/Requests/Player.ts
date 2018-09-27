import * as moment from "moment"
import {doGet} from "../apiHandler/apiHandler"
import {PlayerRanks} from "../Components/Player/Overview/SideBar/PlayerRanksCard"
import {PlayerStats} from "../Components/Player/Overview/SideBar/PlayerStatsCard"
import {MatchHistoryResponse} from "../Models/Player/MatchHistory"
import {PlayStyleResponse} from "../Models/Player/PlayStyle"
import {GameMode, parseReplay} from "../Models/Replay/Replay"
import {useMockData} from "./Config"

// Checks if nameOrId exists by querying backend. Resolves name to Id.
export const resolvePlayerNameOrId = (nameOrId: string): Promise<string> => {
    if (useMockData) {
        return Promise.resolve("testUserId")
    }
    return doGet(`/player/${nameOrId}`)
}

export const getPlayer = (id: string): Promise<Player> => {
    if (useMockData) {
        return Promise.resolve({
            name: "LongNameTesting",
            pastNames: ["PastName1", "PastName 2: Electric Boogaloo"],
            id,
            profileLink: `https://steamcommunity.com/id/${id}/`,
            platform: "Steam",
            avatarLink: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/a5/" +
                "a541aa2146a49c396aa9e159fc176c2799ab231e_full.jpg"
        })
    }
    return doGet(`/player/${id}/profile`)
}

export const getStats = (id: string): Promise<PlayerStats> => {
    if (useMockData) {
        return Promise.resolve({
            car: {
                carName: "octane",
                carPercentage: 0.8
            }
        })
    }
    return doGet(`/player/${id}/profile_stats`)
}

export const getPlayerPlayStyles = (id: string): Promise<PlayStyleResponse> => {
    if (useMockData) {
        return Promise.resolve({
                showWarning: false,
                chartDatas: [{
                    title: "Aggressiveness",
                    chartDataPoints: [
                        {
                            name: "Shots",
                            value: 0.277
                        },
                        {
                            name: "Possession",
                            value: -0.117
                        },
                        {
                            name: "Hits",
                            value: -0.544
                        },
                        {
                            name: "Shots/Hit",
                            value: -0.544
                        },
                        {
                            name: "Boost usage",
                            value: 0.357
                        },
                        {
                            name: "Speed",
                            value: 0.4827
                        }
                    ]
                }]
            }
        )
    }
    return doGet(`/player/${id}/play_style`)
}

export const getRanks = (id: string): Promise<PlayerRanks> => {
    if (useMockData) {
        const rating = {
            name: "Eggplant III (div 3)",
            rating: 2,
            rank: 5
        }
        return Promise.resolve({
            duel: rating,
            doubles: rating,
            solo: rating,
            standard: rating
        })
    }
    return doGet(`/player/${id}/ranks`)
}

export const getMatchHistory = (id: string, page: number, limit: number): Promise<MatchHistoryResponse> => {
    if (useMockData) {
        return Promise.resolve({
            totalCount: 5,
            replays: [
                {
                    id: "215989AB4EF314212",
                    name: "Replay1",
                    date: moment(),
                    gameMode: "1's" as GameMode,
                    gameScore: {team0Score: 1, team1Score: 2},
                    players: [
                        {
                            id: "519021",
                            name: "testplayerblue",
                            isOrange: false,
                            score: 1,
                            goals: 1,
                            assists: 0,
                            saves: 4,
                            shots: 2,
                            cameraSettings: {
                                distance: 280,
                                fieldOfView: 110,
                                height: 110,
                                pitch: -3,
                                stiffness: 0.449999988079071,
                                swivelSpeed: 4,
                                transitionSpeed: 1
                            },
                            loadout: {
                                car: "Octane"
                            }
                        },
                        {
                            id: "31155",
                            name: "testplayerorange",
                            isOrange: true,
                            score: 1,
                            goals: 2,
                            assists: 1,
                            saves: 2,
                            shots: 6,
                            cameraSettings: {
                                distance: 280,
                                fieldOfView: 110,
                                height: 110,
                                pitch: -3,
                                stiffness: 0.449999988079071,
                                swivelSpeed: 5,
                                transitionSpeed: 1
                            },
                            loadout: {
                                car: "Octane"
                            }
                        }
                    ]
                }
            ]
        })
    }
    return doGet(`/player/${id}/match_history?page=${page}&limit=${limit}`)
        .then((data) => ({...data, replays: data.replays.map(parseReplay)}))
}
