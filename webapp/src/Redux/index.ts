import {combineReducers, createStore, Reducer} from "redux"
import {devToolsEnhancer} from "redux-devtools-extension"
import {loggedInUserReducer, LoggedInUserState} from "./loggedInUser/reducer"
import {notificationsReducer, NotificationsState} from "./notifications/reducer"
import {tagsReducer, TagsState} from "./tags/reducer"

export interface StoreState {
    loggedInUser: LoggedInUserState
    notifications: NotificationsState
    tags: TagsState
}

const rootReducer: Reducer<StoreState> = combineReducers<StoreState>({
    loggedInUser: loggedInUserReducer as any,
    notifications: notificationsReducer as any,
    tags: tagsReducer as any
})

export const store = createStore(rootReducer, devToolsEnhancer({}))

export * from "./loggedInUser/actions"
export * from "./notifications/actions"
export * from "./tags/actions"
