import {Checkbox, createStyles, Grid, ListItem, Theme, Typography, WithStyles, withStyles} from "@material-ui/core"
import * as React from "react"
import {Link as DOMLink} from "react-router-dom"
import {Entry} from "../../Models/Replay/Groups"

const styles = (theme: Theme) =>
    createStyles({
        panelDetails: {
            overflowX: "auto",
            maxWidth: "95vw",
            margin: "auto"
        },
        checkboxPadding: {
            padding: 0,
            paddingLeft: 8,
            paddingRight: 8
        }
    })

interface OwnProps {
    entry: Entry
    selectProps?: SelectProps
}

type Props = OwnProps & WithStyles<typeof styles>

interface SelectProps {
    selected: boolean
    handleSelectChange: (selected: boolean) => void
}

interface State {}

class SubgroupEntryComponent extends React.PureComponent<Props, State> {
    public render() {
        const {selectProps, classes} = this.props
        return (
            <DOMLink color="inherit" to={`/groups/${this.props.entry.uuid}`} style={{textDecoration: "none"}}>
                <ListItem style={{padding: "12px 24px"}}>
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" color="textPrimary">
                                {this.props.entry.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
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
                                    className={classes.checkboxPadding}
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

export const SubgroupEntry = withStyles(styles)(SubgroupEntryComponent)
