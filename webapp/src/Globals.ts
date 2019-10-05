import { ReplaysSearchQueryParams, stringifyReplaySearchQueryParam } from "./Models"

// TODO: Move this into a namespace?

export const GITHUB_LINK = "https://github.com/SaltieRL"
export const DISCORD_LINK = "https://discord.gg/c8cArY9"
export const TWITTER_LINK = "https://twitter.com/calculated_gg"
export const REDDIT_LINK = "https://reddit.com/r/calculated"
export const PATREON_LINK = "https://patreon.com/calculated"

export const STATUS_PAGE_LINK = "/status"

export const LEADERBOARDS_LINK = `/leaderboards`
export const TRAINING_LINK = `/training`

export const PLAYER_PAGE_LINK = (id: string) => `/players/${id}`
export const PLAYER_MATCH_HISTORY_PAGE_LINK = (id: string) => `/players/${id}/match_history`
export const PLAYER_COMPARE_PAGE_LINK = "/compare"
export const PLAYER_COMPARE_WITH_LINK = (id: string) => `/compare?ids=${id}`  // TODO: Make link generation less manual

export const REPLAY_PAGE_LINK = (id: string) => `/replays/${id}`
export const REPLAYS_GROUP_PAGE_LINK = "/replay/group"
export const REPLAYS_SEARCH_PAGE_LINK = (queryParams?: Partial<ReplaysSearchQueryParams>) => {
    let pageLink = "/search/replays"
    if (queryParams !== undefined) {
        pageLink += stringifyReplaySearchQueryParam(queryParams)
    }
    return pageLink
}

export const GLOBAL_STATS_LINK = "/global/stats"
export const STEAM_LOGIN_LINK = "/auth/steam"
export const LOGOUT_LINK = "/auth/logout"
export const ABOUT_LINK = "/about"
export const UPLOAD_LINK = "/upload"
export const PLUGINS_LINK = "/plugins"
export const EXPLANATIONS_LINK = "/explanations"
export const DOCUMENTATION_LINK = "/documentation"
export const PRIVACY_POLICY_LINK = "/privacy"

export const GOOGLE_ANALYTICS_ID = "UA-137482750-1"
