import { createAction } from "redux-actions"

enum Type {
    SET_TAGS = "SET_TAGS",
    ADD_PRIVATE_KEY_TO_TAG = "ADD_PRIVATE_KEY_TO_TAG"
}

export const TagsAction = {
    Type,
    setTagsAction: createAction<Tag[]>(Type.SET_TAGS),
    addPrivateKeyToTagAction: createAction<Tag>(Type.ADD_PRIVATE_KEY_TO_TAG)
}
