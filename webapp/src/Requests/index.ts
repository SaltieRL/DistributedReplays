import { AppError } from "src/Models"

export * from "./Global"
export * from "./Replay"

export const useMockData = false
export const baseUrl = "/api"

export const doGet = (destination: string): Promise<any> => {
    return fetch(baseUrl + destination, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    }).then((response) => {
        if (!response.ok) {
            const code = response.status
            let message: string = response.statusText
            return response
                .json()
                .catch(() => {
                    throw { code, message } as AppError
                })
                .then((responseJson: any) => {
                    if (responseJson.message) {
                        message = responseJson.message
                    }
                })
                .then(() => {
                    throw { code, message } as AppError
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
            throw { code: response.status, message: response.statusText } as AppError
        }
        return response
    })
}
