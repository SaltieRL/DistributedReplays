import { IconButton, TextField, Tooltip } from "@material-ui/core"
import Add from "@material-ui/icons/Add"
import * as React from "react"

interface Props {
    onSubmit: () => void
    value: string
    onChange: React.ChangeEventHandler<HTMLInputElement>
}

export class AddPlayerInput extends React.PureComponent<Props> {
    public render() {
        return (
            <form onSubmit={this.handleFormSubmit} style={{minWidth: 250, maxWidth: 500, width: "90%"}}>
                <TextField value={this.props.value}
                           onChange={this.props.onChange}
                           label="Enter a steamId or username"
                           fullWidth
                           InputProps={{
                               endAdornment: (
                                   <Tooltip title="Add player" placement="left">
                                       <IconButton type="submit"><Add/></IconButton>
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
