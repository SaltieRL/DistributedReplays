import { Omit } from "lodash"
import { createAction } from "redux-actions"

export namespace LoggedInUserActions {
    export enum Type {
        SET_LOGGED_IN_USER = "SET_LOGGED_IN_USER"
    }

    export const setLoggedInUserAction = createAction<LoggedInUser>(Type.SET_LOGGED_IN_USER)
}

export type LoggedInUserActions = Omit<typeof LoggedInUserActions, "Type">
