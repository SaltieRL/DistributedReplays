import { Action, handleActions } from "redux-actions"
import { LoggedInUserActions } from "./actions"

export type LoggedInUserState = LoggedInUser | null

const initialState: LoggedInUserState = null

export const loggedInUserReducer = handleActions<LoggedInUserState, any>(
    {
        [LoggedInUserActions.Type.SET_LOGGED_IN_USER]: (
            state,
            action: Action<LoggedInUser>
        ): LoggedInUserState => {
            return action.payload || null
        }
    },
    initialState
)
