import { Chip, FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@material-ui/core"
import * as React from "react"
import { Replay } from "../../../Models"
import { addTagToGame, removeTagFromGame } from "../../../Requests/Tag"

interface UserTagProps {
    userTags: Tag[]
    handleUpdateTags: (tags: Tag[]) => void // TODO: Investigate if this should be moved to avoid passing down a lot.
}

interface Props {
    replay: Replay
    userTagProps?: UserTagProps
}

export class ReplayTagDisplay extends React.PureComponent<Props> {
    public render() {
        const {replay, userTagProps} = this.props

        const formHelperText = userTagProps ? "Select tags for replay" : "Log in to edit/apply your own tags"
        const formControl = userTagProps ? (
            <FormControl>
                <InputLabel>Tags</InputLabel>
                <Select
                    multiple
                    value={replay.tags.map((tag) => tag.name)}
                    onChange={this.handleChange}
                    autoWidth
                    renderValue={(tagNames: any) => {
                        return (
                            <div style={{display: "flex", flexWrap: "wrap"}}>
                                {tagNames.map((tagName: string) => (
                                    <Chip
                                        key={tagName} label={tagName}
                                        onDelete={this.handleChipDelete(tagName)}
                                        style={{margin: 4}}
                                    />
                                ))}
                            </div>
                        )
                    }}
                >
                    {userTagProps.userTags.map((tag) => (
                        <MenuItem key={tag.name} value={tag.name}>
                            {tag.name}
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText>{formHelperText}</FormHelperText>
            </FormControl>
        ) : (
            <FormControl>
                <InputLabel>Tags</InputLabel>
                <Select
                    multiple
                    value={replay.tags.map((tag) => tag.name)}
                    autoWidth
                    renderValue={(tagNames: any) => {
                        return (
                            <div style={{display: "flex", flexWrap: "wrap"}}>
                                {tagNames.map((tagName: string) => (
                                    <Chip
                                        key={tagName} label={tagName}
                                        style={{margin: 4}}
                                    />
                                ))}
                            </div>
                        )
                    }}
                >
                    {replay.tags.map((tag) => (
                        <MenuItem key={tag.name} value={tag.name}>
                            {tag.name}
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText>{formHelperText}</FormHelperText>
            </FormControl>
        )
        return (
            <div style={{paddingTop: 16}}>
                {formControl}
            </div>
        )
    }

    private readonly handleChipDelete = (tagName: string) => () => {
        const replayTags = this.props.replay.tags
        this.handleChange({
            target: {
                value: replayTags.filter((tag) => tag.name !== tagName)
                    .map((tag) => tag.name)
            }
        } as any as React.ChangeEvent<HTMLSelectElement>)
    }

    private readonly handleChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        const {replay, userTagProps} = this.props
        if (userTagProps) {
            const selectedTagNames = event.target.value as any as string[]
            const originalTagNames = replay.tags.map((tag) => tag.name)

            const removedTagNames = originalTagNames.filter((tagName) => selectedTagNames.indexOf(tagName) === -1)

            const addedTagNames = selectedTagNames.filter((tagName) => originalTagNames.indexOf(tagName) === -1)

            Promise.all([
                ...removedTagNames.map((tagName) => removeTagFromGame(tagName, replay.id)),
                ...addedTagNames.map((tagName) => addTagToGame(tagName, replay.id))
            ])
                .then(() => {
                    const selectedTags = userTagProps.userTags
                        .filter((tag) => selectedTagNames.indexOf(tag.name) !== -1)
                    userTagProps.handleUpdateTags(selectedTags)
                })
        }
    }
}
