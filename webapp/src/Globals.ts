export const GITHUB_LINK = "https://github.com/SaltieRL"
export const DISCORD_LINK = "https://discord.gg/c8cArY9"
export const LOCAL_LINK = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://calculated.gg"

export const PLAYER_PAGE_LINK = (id: string) => `/players/overview/${id}`
export const REPLAY_PAGE_LINK = (id: string) => `/replays/parsed/view/${id}`
export const GLOBAL_STATS_LINK = "/global/stats"
export const STEAM_LOGIN_LINK = "/auth/steam"
export const LOGOUT_LINK = "/logout"
