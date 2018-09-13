import * as moment from "moment"
import {PlayStyleChartData} from "../Components/Player/PlayerTendencies"
import {PlayerRanks} from "../Components/Player/SideBar/PlayerRanksCard"
import {PlayerStats} from "../Components/Player/SideBar/PlayerStatsCard"
import {GameMode, Replay} from "../Models/Replay/Replay"

export const getPlayer = (id: string): Promise<Player> => {
    // TODO: Make request to get player
    // noinspection TsLint
    return Promise.resolve({
        name: "LongNameTesting",
        pastNames: ["PastName1", "PastName 2: Electric Boogaloo"],
        id,
        profileLink: `https://steamcommunity.com/id/${id}/`,
        platform: "Steam",
        avatarLink: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/a5/a541aa2146a49c396aa9e159fc176c2799ab231e_full.jpg"
    })
}

export const getStats = (id: string): PlayerStats => {
    // TODO: Replace with actual query.
    return {
        car: {
            carName: "octane",
            carPercentage: 0.8
        }
    }
}


export const getPlayerTendencies = (id: string): Promise<PlayStyleChartData[]> => {
    // TODO: Do actual fetch
    return Promise.resolve([{
            title: "Aggressiveness",
            spokeData: [
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
    )
}


export const getRanks = (id: string): PlayerRanks => {
    // TODO: Replace with actual query.
    const rating = {
        name: "Eggplant III (div 3)",
        rating: 2,
        rank: 5
    }
    return {
        duel: rating,
        doubles: rating,
        solo: rating,
        standard: rating
    }
}


export const getMatchHistory = (id: string): Promise<Replay[]> => {
    // TODO: Do actual fetch
    return Promise.resolve([
        {
            name: "Replay1",
            date: moment(),
            gameMode: "1's" as GameMode,
            score: {team0Score: 1, team1Score: 2},
            players: [
                {
                    name: "testplayerblue",
                    isOrange: false,
                    score: 1,
                    goals: 1,
                    assists: 0,
                    saves: 4,
                    shots: 2

                },
                {
                    name: "testplayerorange",
                    isOrange: true,
                    score: 1,
                    goals: 2,
                    assists: 1,
                    saves: 2,
                    shots: 6
                }
            ]
        }
    ])
}
