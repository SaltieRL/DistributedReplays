import moment from "moment"
import { GameMode, GameVisibility, PlayStyleRawResponse, PlayStyleResponse, Replay } from "../Models"

export const MOCK_PLAY_STYLE: PlayStyleResponse = {
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

export const MOCK_PLAY_STYLE_RAW: PlayStyleRawResponse = {
    dataPoints: [
        {
            average: 279.004401155593,
            name: "score"
        },
        {
            average: 0.818047302323525,
            name: "goals"
        },
        {
            average: 0.489000342729705,
            name: "assists"
        },
        {
            average: 0.914019332205055,
            name: "saves"
        },
        {
            average: 2.36731007041109,
            name: "shots"
        },
        {
            average: 1969.69577421437,
            name: "boost usage"
        },
        {
            average: 70.9461805657564,
            name: "num small boosts"
        },
        {
            average: 19.0298824965093,
            name: "num large boosts"
        },
        {
            average: 564.31585820637,
            name: "wasted collection"
        },
        {
            average: 161.484146125004,
            name: "wasted usage"
        },
        {
            average: 21.9399040093052,
            name: "time full boost"
        },
        {
            average: 102.891914314886,
            name: "time low boost"
        },
        {
            average: 38.7533007663358,
            name: "time no boost"
        },
        {
            average: 2.4952727769198,
            name: "num stolen boosts"
        },
        {
            average: 111.963562011719,
            name: "average boost level"
        },
        {
            average: 77.1755339914768,
            name: "wasted big"
        },
        {
            average: 7.54872694629005,
            name: "wasted small"
        },
        {
            average: 38418.6153232948,
            name: "ball hit forward"
        },
        {
            average: 5214.22816894169,
            name: "ball hit backward"
        },
        {
            average: 48.3593164196261,
            name: "time closest to ball"
        },
        {
            average: 51.5722676703838,
            name: "time furthest from ball"
        },
        {
            average: 18.9332334854082,
            name: "time close to ball"
        },
        {
            average: 77.5470823932595,
            name: "time closest to team center"
        },
        {
            average: 17.8024480632801,
            name: "time furthest from team center"
        },
        {
            average: 49.3358355252072,
            name: "possession"
        },
        {
            average: 5.19162980692471,
            name: "turnovers"
        },
        {
            average: 2.14337533402085,
            name: "turnovers on my half"
        },
        {
            average: 2.27133804052956,
            name: "turnovers on their half"
        },
        {
            average: 5.22362048355189,
            name: "won turnovers"
        },
        {
            average: 168.319175859031,
            name: "time on ground"
        },
        {
            average: 122.484662598367,
            name: "time low in air"
        },
        {
            average: 9.18729494273794,
            name: "time high in air"
        },
        {
            average: 196.732910523979,
            name: "time in defending half"
        },
        {
            average: 103.266868671581,
            name: "time in attacking half"
        },
        {
            average: 142.470078921973,
            name: "time in defending third"
        },
        {
            average: 99.8195969347523,
            name: "time in neutral third"
        },
        {
            average: 57.7103245093788,
            name: "time in attacking third"
        },
        {
            average: 215.957442956688,
            name: "time behind ball"
        },
        {
            average: 84.0240865265321,
            name: "time in front ball"
        },
        {
            average: 15271.4818658418,
            name: "speed"
        },
        {
            average: 2779.73013583097,
            name: "avg hit dist"
        },
        {
            average: 2108.20015471974,
            name: "average distance from center"
        },
        {
            average: 19.34521916612,
            name: "hits"
        },
        {
            average: 0.109682319864607,
            name: "total goals"
        },
        {
            average: 5.04995681043293,
            name: "passes"
        },
        {
            average: 0,
            name: "total saves"
        },
        {
            average: 1.47157112485014,
            name: "total shots"
        },
        {
            average: 3.29960978926025,
            name: "dribbles"
        },
        {
            average: 3.25847891931102,
            name: "total dribble conts"
        },
        {
            average: 7.62749132725119,
            name: "aerials"
        },
        {
            average: 209,
            name: "is keyboard"
        },
        {
            average: 28.9176694107706,
            name: "time at slow speed"
        },
        {
            average: 37.8118520633044,
            name: "time at super sonic"
        },
        {
            average: 180.32668338016,
            name: "time at boost speed"
        },
        {
            average: 300,
            name: "time in game"
        },
        {
            average: 0.955150202154283,
            name: "first frame in game"
        },
        {
            average: 12.535885167464114,
            name: "shots/hit"
        },
        {
            average: 26.028708133971293,
            name: "passes/hit"
        },
        {
            average: 2.6411483253588517,
            name: "assists/hit"
        },
        {
            average: 39.48803827751196,
            name: "useful/hits"
        },
        {
            average: 0.34555984555984554,
            name: "shot %"
        },
        {
            average: 103.266868671581,
            name: "att 1/2"
        },
        {
            average: 57.7103245093788,
            name: "att 1/3"
        },
        {
            average: 196.732910523979,
            name: "def 1/2"
        },
        {
            average: 142.470078921973,
            name: "def 1/3"
        },
        {
            average: 215.957442956688,
            name: "< ball"
        },
        {
            average: 84.0240865265321,
            name: "> ball"
        },
        {
            average: 0.508042465516726,
            name: "luck"
        },
        {
            average: 0.260908032882839,
            name: "raw total boost efficiency"
        },
        {
            average: 0.202736719415449,
            name: "collection boost efficiency"
        },
        {
            average: 0.0807275541068971,
            name: "used boost efficiency"
        },
        {
            average: 0.260908032882839,
            name: "total boost efficiency"
        },
        {
            average: 73.32535885167464,
            name: "turnover efficiency"
        },
        {
            average: 3.4210526315789473,
            name: "boost ratio"
        },
        {
            average: 18.1210821088911,
            name: "aerial_efficiency"
        }
    ],
    name: "76561198055442516"
}

export const MOCK_REPLAY_1: Replay = {
    id: "21312512515FAB213",
    name: "Name",
    date: moment(),
    map: "TESTMAP",
    gameMode: "1's" as GameMode,
    gameScore: {team0Score: 5, team1Score: 6},
    players: [
        {
            id: "214214124",
            name: "[MOCK] Kaydop",
            isOrange: false,
            score: 210,
            goals: 1,
            assists: 0,
            saves: 0,
            shots: 1,
            cameraSettings: {
                distance: 260,
                fieldOfView: 110,
                height: 110,
                pitch: -3,
                stiffness: 0.699999988079071,
                swivelSpeed: 3,
                transitionSpeed: 1
            },
            loadout: {
                car: "Road Hog"
            }
        },
        {
            id: "149019024",
            name: "[MOCK] Fairy Peak!",
            isOrange: false,
            score: 310,
            goals: 1,
            assists: 1,
            saves: 2,
            shots: 4,
            cameraSettings: {
                distance: 260,
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
        },
        {
            id: "1248921984",
            name: "[MOCK] miztik",
            isOrange: false,
            score: 460,
            goals: 3,
            assists: 2,
            saves: 0,
            shots: 8,
            cameraSettings: {
                distance: 250,
                fieldOfView: 107,
                height: 100,
                pitch: -3,
                stiffness: 0.5,
                swivelSpeed: 9,
                transitionSpeed: 1
            },
            loadout: {
                car: "Octane"
            }
        },
        {
            id: "248129841",
            name: "kuxir97",
            isOrange: true,
            score: 485,
            goals: 1,
            assists: 3,
            saves: 3,
            shots: 3,
            cameraSettings: {
                distance: 250,
                fieldOfView: 110,
                height: 110,
                pitch: -4,
                stiffness: 0.449999988079071,
                swivelSpeed: 6,
                transitionSpeed: 2
            },
            loadout: {
                car: "Batmobile '16"
            }
        },
        {
            id: "8132482941",
            name: "gReazymeister",
            isOrange: true,
            score: 285,
            goals: 2,
            assists: 1,
            saves: 1,
            shots: 1,
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
        },
        {
            id: "189489124",
            name: "Markydooda",
            isOrange: true,
            score: 410,
            goals: 3,
            assists: 0,
            saves: 1,
            shots: 4,
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
        }
    ],
    tags: [],
    visibility: GameVisibility.PUBLIC
}
