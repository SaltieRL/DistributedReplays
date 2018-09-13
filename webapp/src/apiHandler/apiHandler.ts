import {baseUrl} from "../Requests/Config"

export const doGet = (destination: string): Promise<any> => {
    return fetch(baseUrl + destination, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    }).then((response) => {
        if (!response.ok) {
            console.log(response.status)
            console.log(response.statusText)
            return
        }
        return response.json()
    })
}
