import { combineReducers, createStore, Reducer } from "redux"
import { devToolsEnhancer } from "redux-devtools-extension"
import { loggedInUserReducer, LoggedInUserState } from "./loggedInUser/reducer"
import { notificationsReducer, NotificationsState } from "./notifications/reducer"

export interface StoreState {
    loggedInUser: LoggedInUserState
    notifications: NotificationsState
}

const rootReducer: Reducer<StoreState> = combineReducers<StoreState>({
    loggedInUser: loggedInUserReducer as any,
    notifications: notificationsReducer as any
})

export const store = createStore(rootReducer, devToolsEnhancer({}))

export * from "./loggedInUser/actions"
export * from "./notifications/actions"
