import {combineReducers, createStore, Reducer} from "redux"
import {devToolsEnhancer} from "redux-devtools-extension"
import {loggedInUserReducer} from "./loggedInUser/reducer"
import {NotificationsState} from "./notifications/actions"
import {notificationsReducer} from "./notifications/reducer"

export interface StoreState {
    loggedInUser: LoggedInUser | null
    notifications: NotificationsState
}

const rootReducer: Reducer<StoreState> = combineReducers<StoreState>({
    loggedInUser: loggedInUserReducer,
    notifications: notificationsReducer
})

export const store = createStore(
    rootReducer, devToolsEnhancer({})
)
