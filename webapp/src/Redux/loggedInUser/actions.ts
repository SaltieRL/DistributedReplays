import { createAction } from "redux-actions"

enum Type {
    SET_LOGGED_IN_USER = "SET_LOGGED_IN_USER"
}

export const LoggedInUserActions = {
    Type,
    setLoggedInUserAction: createAction<LoggedInUser>(Type.SET_LOGGED_IN_USER)
}
