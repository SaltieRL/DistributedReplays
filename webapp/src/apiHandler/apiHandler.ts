import {AppError} from "../Models/Error"
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
            const code = response.status
            let message: string = response.statusText
            return response.json()
                .then((responseJson: any) => {
                    if (responseJson.message) {
                        message = responseJson.message
                    }
                })
                .then(() => {
                    throw {code, message} as AppError
                })
        } else {
            return response.json()
        }
    })
}

export const doPost = (destination: string, body: BodyInit): Promise<any> => {
    return fetch(baseUrl + destination, {
        method: "POST",
        body
    }).then((response) => {
        if (!response.ok) {
            throw {code: response.status, message: response.statusText} as AppError
        }
        return response
    })
}
