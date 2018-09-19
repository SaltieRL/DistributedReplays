import {combineReducers, createStore, Reducer} from "redux"
import {devToolsEnhancer} from "redux-devtools-extension"
import {loggedInUserReducer} from "./loggedInUser/reducer"

export interface StoreState {
    loggedInUser: LoggedInUser | null
}

const rootReducer: Reducer<StoreState> = combineReducers<StoreState>({
    loggedInUser: loggedInUserReducer
})

export const store = createStore(
    rootReducer, devToolsEnhancer({})
)
