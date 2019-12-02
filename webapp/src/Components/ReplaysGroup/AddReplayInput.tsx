import {IconButton, TextField, Tooltip} from "@material-ui/core"
import Add from "@material-ui/icons/Add"
import * as React from "react"

interface Props {
    onSubmit: () => void
    value: string
    onChange: React.ChangeEventHandler<HTMLInputElement>
}

export class AddReplayInput extends React.PureComponent<Props> {
    public render() {
        return (
            <form onSubmit={this.handleFormSubmit}>
                <TextField
                    value={this.props.value}
                    onChange={this.props.onChange}
                    label="Enter a replay id"
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <Tooltip title="Add replay" placement="left">
                                <IconButton type="submit">
                                    <Add />
                                </IconButton>
                            </Tooltip>
                        )
                    }}
                />
            </form>
        )
    }

    private readonly handleFormSubmit: React.ChangeEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault()
        this.props.onSubmit()
    }
}
