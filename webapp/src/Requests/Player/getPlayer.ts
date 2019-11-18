import {doGet} from "../../apiHandler/apiHandler"
import {useMockData} from "../Config"

export const getPlayer = (id: string): Promise<Player> => {
    if (useMockData) {
        return Promise.resolve({
            name: "LongNameTesting",
            pastNames: ["PastName1", "PastName 2: Electric Boogaloo"],
            id,
            profileLink: `https://steamcommunity.com/id/${id}/`,
            platform: "Steam",
            avatarLink:
                "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/a5/" +
                "a541aa2146a49c396aa9e159fc176c2799ab231e_full.jpg",
            groups: [1, 2, 3]
        })
    }
    return doGet(`/player/${id}/profile`)
}
