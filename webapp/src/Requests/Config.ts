export const useMockData = false

const getBaseUrl = () => {
    if (window.location.hostname.indexOf("localhost") !== -1) {
        // local dev
        return "/api"
    } else if (window.location.hostname === "cdn.calculated.gg") {
        // google cloud test
        return "https://api.calculated.gg/api"
    } else if (window.location.hostname === "calculated.gg") {
        // main server TODO: change when deploying to google cloud
        return "/api"
    }
    return "/api"
}

export const baseUrl = getBaseUrl()
