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
            // TODO: Improve error handling
            console.log(response.status)
            console.log(response.statusText)
            return
        }
        return response.json()
    })
}

export const doPost = (destination: string, body: BodyInit): Promise<any> => {
    return fetch(baseUrl + destination, {
        method: "POST",
        body
    }).then((response) => {
        if (!response.ok) {
            // TODO: Improve error handling
            console.log(response.status)
            console.log(response.statusText)
            return
        }
        return response.json()
    })
}
