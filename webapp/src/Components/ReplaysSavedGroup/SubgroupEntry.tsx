import {Grid, ListItem, Typography} from "@material-ui/core"
import * as React from "react"
import {Link as DOMLink} from "react-router-dom"
import {Entry} from "../../Models/Replay/Groups"

interface Props {
    entry: Entry
}

interface State {}

export class SubgroupEntry extends React.Component<Props, State> {
    public render() {
        return (
            <DOMLink color="inherit" to={`/groups/${this.props.entry.uuid}`} style={{textDecoration: "none"}}>
                <ListItem style={{padding: "12px 24px"}}>
                    <Grid container>
                        <Grid item xs={4}>
                            <Typography variant="subtitle1" color="textPrimary">
                                {this.props.entry.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="subtitle1" color="textPrimary">
                                {this.props.entry.descendantCount} replays
                            </Typography>
                        </Grid>
                    </Grid>
                </ListItem>
            </DOMLink>
        )
    }
}
