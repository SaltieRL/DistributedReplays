import { Chip, FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@material-ui/core"
import * as React from "react"
import { Replay } from "../../../Models/Replay/Replay"
import { addTagToGame, removeTagFromGame } from "../../../Requests/Tag"

interface Props {
    replay: Replay
    userTags: Tag[]
}

interface State {
    // TODO: Remove this monstrosity - it acts as a local override that avoids mutating this.props.replay
    /* TODO: This means that reopening the dialog resets the changes in the page (but change is actually made in db
     and show if you refresh.*/
    locallyChangedTags?: Tag[]
}

export class ReplayTagDisplay extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public render() {
        const {userTags} = this.props
        const replayTags = this.getReplayTags()
        return (
            <div style={{paddingTop: 16}}>
                <FormControl>
                    <InputLabel>Tags</InputLabel>
                    <Select
                        multiple
                        value={replayTags.map((tag) => tag.name)}
                        onChange={this.handleChange}
                        autoWidth
                        renderValue={(tagNames: string[]) => {
                            return (
                                <div style={{display: "flex", flexWrap: "wrap"}}>
                                    {tagNames.map((tagName) => (
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

    private readonly getReplayTags = () => {
        return this.state.locallyChangedTags ? this.state.locallyChangedTags : this.props.replay.tags
    }

    private readonly handleChipDelete = (tagName: string) => () => {
        const replayTags = this.getReplayTags()
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

        removedTagNames.forEach((tagName) => {
            removeTagFromGame(tagName, replay.id)
        })
        addedTagNames.forEach((tagName) => {
            addTagToGame(tagName, replay.id)
        })

        const selectedTags = this.props.userTags.filter((tag) => selectedTagNames.indexOf(tag.name) !== -1)

        this.setState({locallyChangedTags: selectedTags})
    }
}
