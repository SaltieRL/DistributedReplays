interface KickoffPlayers {
    [key: string]: KickoffPlayer
}

interface KickoffData {
    kickoffs: Kickoff[]
    players: KickoffPlayers
}

interface Kickoff {
    first_touch: string
    kickoff_type: string
    players: KickoffPlayerElement[]
    time_till_goal: number
    touch_time: number
}

interface KickoffPlayerElement {
    ball_distance: number
    boost_level: number
    end: End
    jump_times: number[]
    jumps: number
    location: Location
    player_id: string
    start: End
    time_to_boost: number
}

interface End {
    x: number
    y: number
}

enum Location {
    Ball = "BALL",
    Boost = "BOOST",
    Cheat = "CHEAT",
    Goal = "GOAL",
    Unknown = "UNKNOWN"
}

interface KickoffPlayer {
    is_orange: number
    name: string
}
