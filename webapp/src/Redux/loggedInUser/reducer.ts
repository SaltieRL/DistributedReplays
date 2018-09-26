import {Reducer} from "redux"
import {LoggedInUserActionTypes, LoggedInUserState} from "./actions"

export const loggedInUserReducer: Reducer<LoggedInUserState, LoggedInUserActionTypes> = (
    state = null, action) => {
    switch (action.type) {
        case "SET_LOGGED_IN_USER":
            return {...action.loggedInUser}
        default:
            return state
    }
}
