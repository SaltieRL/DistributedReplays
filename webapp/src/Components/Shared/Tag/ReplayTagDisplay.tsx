import { Chip, FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@material-ui/core"
import * as React from "react"
import { Replay } from "../../../Models/Replay/Replay"
import { addTagToGame, removeTagFromGame } from "../../../Requests/Tag"

interface Props {
    replay: Replay
    userTags: Tag[]
    handleUpdateTags: (tags: Tag[]) => void // TODO: Investigate if this should be moved to avoid passing down a lot.
}

export class ReplayTagDisplay extends React.PureComponent<Props> {
    public render() {
        const {replay, userTags} = this.props
        return (
            <div style={{paddingTop: 16}}>
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
                        {userTags.map((tag) => (
                            <MenuItem key={tag.name} value={tag.name}>
                                {tag.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>Select tags for replay</FormHelperText>
                </FormControl>
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
        const {replay} = this.props
        const selectedTagNames = event.target.value as any as string[]
        const originalTagNames = replay.tags.map((tag) => tag.name)

        const removedTagNames = originalTagNames.filter((tagName) => selectedTagNames.indexOf(tagName) === -1)

        const addedTagNames = selectedTagNames.filter((tagName) => originalTagNames.indexOf(tagName) === -1)

        Promise.all([
            ...removedTagNames.map((tagName) => removeTagFromGame(tagName, replay.id)),
            ...addedTagNames.map((tagName) => addTagToGame(tagName, replay.id))
        ])
            .then(() => {
                const selectedTags = this.props.userTags.filter((tag) => selectedTagNames.indexOf(tag.name) !== -1)
                this.props.handleUpdateTags(selectedTags)
            })
    }
}
