import {baseUrl, useLiveQueries} from "../Requests/Config"

export const doGet = (destination: string): Promise<any> => {
    const url = useLiveQueries ? "https://calculated.gg/" + baseUrl + destination : baseUrl + destination
    return fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    }).then(handleResponse)
}

export const doPost = (destination: string, body: BodyInit): Promise<any> => {
    const url = useLiveQueries ? "https://calculated.gg/" + baseUrl + destination : baseUrl + destination
    return fetch(url, {
        method: "POST",
        body
    }).then(handleResponse)
}

export const doRequest = (destination: string, requestInit: RequestInit): Promise<any> => {
    const url = useLiveQueries ? "https://calculated.gg/" + baseUrl + destination : baseUrl + destination
    return fetch(url, requestInit).then(handleResponse)
}

const handleResponse = (response: Response): Promise<any> => {
    if (!response.ok) {
        const code = response.status
        let message: string = response.statusText
        return response
            .json()
            .catch(() => {
                // eslint-disable-next-line
                throw {code, message} as AppError
            })
            .then((responseJson: any) => {
                if (responseJson.message) {
                    message = responseJson.message
                }
            })
            .then(() => {
                // eslint-disable-next-line
                throw {code, message} as AppError
            })
    } else {
        if (response.status !== 204) {
            return response.json()
        }
        return Promise.resolve()
    }
}
