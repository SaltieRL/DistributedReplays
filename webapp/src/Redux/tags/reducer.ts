import {Action, handleActions} from "redux-actions"
import {TagsAction} from "./actions"

export type TagsState = Tag[] | null

const initialState: TagsState = null

export const tagsReducer = handleActions<TagsState, any>(
    {
        [TagsAction.Type.SET_TAGS]: (state, action: Action<TagsState>): TagsState => {
            if (action.payload) {
                return action.payload
            }
            return state
        },
        [TagsAction.Type.ADD_PRIVATE_KEY_TO_TAG]: (state, action: Action<Tag>): TagsState => {
            if (action.payload !== undefined && state !== null) {
                return state.map((tag) => {
                    if (tag.name === action.payload!.name && tag.ownerId === action.payload!.ownerId) {
                        return {...tag, privateKey: action.payload!.privateKey}
                    } else {
                        return tag
                    }
                })
            }
            return state
        }
    },
    initialState
)
