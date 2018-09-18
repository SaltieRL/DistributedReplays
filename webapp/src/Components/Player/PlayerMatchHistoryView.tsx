import {createStyles, Paper, Theme, Toolbar, Typography, WithStyles, withStyles} from "@material-ui/core"
import * as React from "react"
import {PlayerMatchHistory} from "./Overview/MatchHistory/PlayerMatchHistory"

interface OwnProps {
    player: Player
}

type Props = OwnProps
    & WithStyles<typeof styles>

class PlayerMatchHistoryViewComponent extends React.PureComponent<Props> {
    public render() {
        const {classes, player} = this.props
        return (
            <Paper className={classes.root}>
                <Toolbar>
                    <Typography variant="title">
                        {`${player.name}'s Match History`}
                    </Typography>
                </Toolbar>
                <div className={classes.tableWrapper}>
                    <PlayerMatchHistory player={player} useHeader/>
                </div>
            </Paper>
        )
    }
}

const styles = (theme: Theme) => createStyles({
    root: {
        width: "100%",
        marginTop: theme.spacing.unit * 3
    },
    tableWrapper: {
        // overflowX: "auto"
    }
})

export const PlayerMatchHistoryView = withStyles(styles)(PlayerMatchHistoryViewComponent)
