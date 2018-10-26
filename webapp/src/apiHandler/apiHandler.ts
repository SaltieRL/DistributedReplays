import { baseUrl } from "../Requests/Config"

export const doGet = (destination: string): Promise<any> => {
    return fetch(baseUrl + destination, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    }).then(handleResponse)
}

export const doPost = (destination: string, body: BodyInit): Promise<any> => {
    return fetch(baseUrl + destination, {
        method: "POST",
        body
    }).then(handleResponse)
}

export const doRequest = (destination: string, requestInit: RequestInit): Promise<any> => {
    return fetch(baseUrl + destination, requestInit)
        .then(handleResponse)
}

const handleResponse = (response: Response): Promise<any> => {
    if (!response.ok) {
        const code = response.status
        let message: string = response.statusText
        return response.json()
            .catch(() => {
                throw {code, message} as AppError
            })
            .then((responseJson: any) => {
                if (responseJson.message) {
                    message = responseJson.message
                }
            })
            .then(() => {
                throw {code, message} as AppError
            })
    } else {
        if (response.status !== 204) {
            return response.json()
        }
        return Promise.resolve()
    }
}
