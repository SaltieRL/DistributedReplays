import { Action } from "redux"
import { LoggedInUser } from "src/Models"

interface SetLoggedInUserAction extends Action<"SET_LOGGED_IN_USER"> {
    loggedInUser: LoggedInUser
}

export const setLoggedInUserAction = (loggedInUser: LoggedInUser): SetLoggedInUserAction => ({
    loggedInUser,
    type: "SET_LOGGED_IN_USER"
})

export type LoggedInUserActionTypes = SetLoggedInUserAction

export type LoggedInUserState = LoggedInUser | null
