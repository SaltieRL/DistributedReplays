export const GITHUB_LINK = "https://github.com/SaltieRL"
export const DISCORD_LINK = "https://discord.gg/c8cArY9"
export const TWITTER_LINK = "https://twitter.com/calculated_gg"
export const LOCAL_LINK = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://calculated.gg"

export const PLAYER_PAGE_LINK = (id: string) => `/players/${id}`
export const PLAYER_MATCH_HISTORY_PAGE_LINK = (id: string) => `/players/${id}/match_history`
export const PLAYER_COMPARE_PAGE_LINK = "/compare/"
export const PLAYER_COMPARE_WITH_LINK = (id: string) => `/compare/?ids=${id}`
export const REPLAY_PAGE_LINK = (id: string) => `/replays/${id}`
export const GLOBAL_STATS_LINK = "/global/stats"
export const QUEUE_LENGTH_LINK = "/global/queue/count"
export const STEAM_LOGIN_LINK = "/auth/steam"
export const LOGOUT_LINK = "/auth/logout"
export const ABOUT_LINK = "/about"
export const UPLOAD_LINK = "/upload"
export const PLUGINS_LINK = "/plugins"

export const BAKKES_MOD_PLUGIN_LINK = "https://cdn.discordapp.com/attachments/481637428143194112/492745525838217221/bakkesmod_replayuploader.zip"  // tslint:disable-line
