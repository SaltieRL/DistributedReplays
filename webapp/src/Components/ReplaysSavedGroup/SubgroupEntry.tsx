import {Checkbox, Grid, ListItem, Typography} from "@material-ui/core"
import * as React from "react"
import {Link as DOMLink} from "react-router-dom"
import {Entry} from "../../Models/Replay/Groups"

interface Props {
    entry: Entry
    selectProps?: SelectProps
}

interface SelectProps {
    selected: boolean
    handleSelectChange: (selected: boolean) => void
}
interface State {}

export class SubgroupEntry extends React.Component<Props, State> {
    public render() {
        const {selectProps} = this.props
        return (
            <DOMLink color="inherit" to={`/groups/${this.props.entry.uuid}`} style={{textDecoration: "none"}}>
                <ListItem style={{padding: "12px 24px"}}>
                    <Grid container>
                        <Grid item xs={4}>
                            <Typography variant="subtitle1" color="textPrimary">
                                {this.props.entry.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography variant="subtitle1" color="textPrimary">
                                {this.props.entry.descendantCount} replays
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            {selectProps && (
                                <Checkbox
                                    checked={selectProps.selected}
                                    onChange={this.toggleSelect}
                                    color="secondary"
                                    onClick={this.stopClickPropagation}
                                />
                            )}
                        </Grid>
                    </Grid>
                </ListItem>
            </DOMLink>
        )
    }

    private readonly toggleSelect = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        this.props.selectProps!.handleSelectChange(checked)
    }

    private readonly stopClickPropagation: React.MouseEventHandler = (event) => {
        event.stopPropagation()
    }
}
