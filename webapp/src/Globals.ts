export const GITHUB_LINK = "https://github.com/SaltieRL"
export const DISCORD_LINK = "https://discord.gg/c8cArY9"
export const TWITTER_LINK = "https://twitter.com/calculated_gg"
export const REDDIT_LINK = "https://reddit.com/r/calculated"
export const LOCAL_LINK = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://calculated.gg"

export const PLAYER_PAGE_LINK = (id: string) => `/players/${id}`
export const PLAYER_MATCH_HISTORY_PAGE_LINK = (id: string) => `/players/${id}/match_history`
export const PLAYER_COMPARE_PAGE_LINK = "/compare/"
export const PLAYER_COMPARE_WITH_LINK = (id: string) => `/compare/?ids=${id}`  // TODO: Make link generation less manual

export const REPLAY_PAGE_LINK = (id: string) => `/replays/${id}`
export const REPLAYS_DETAILS_PAGE_LINK = "/details"

export const GLOBAL_STATS_LINK = "/global/stats"
export const STEAM_LOGIN_LINK = "/auth/steam"
export const LOGOUT_LINK = "/auth/logout"
export const ABOUT_LINK = "/about"
export const UPLOAD_LINK = "/upload"
export const PLUGINS_LINK = "/plugins"
