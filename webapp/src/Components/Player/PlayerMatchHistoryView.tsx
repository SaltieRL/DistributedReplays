import {
    createStyles,
    FormControlLabel,
    Paper,
    Switch,
    Theme,
    Toolbar,
    Typography,
    WithStyles,
    withStyles
} from "@material-ui/core"
import * as React from "react"
import {PlayerMatchHistory} from "../MatchHistory/PlayerMatchHistory"

interface OwnProps {
    player: Player
}

type Props = OwnProps
    & WithStyles<typeof styles>

interface State {
    useBoxScore: boolean
}

class PlayerMatchHistoryViewComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {useBoxScore: false}
    }

    public render() {
        const {classes, player} = this.props
        return (
            <Paper className={classes.root}>
                <Toolbar>
                    <Typography variant="title">
                        {`${player.name}'s Match History`}
                    </Typography>
                    <div style={{flexGrow: 1}}/>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.state.useBoxScore}
                                onChange={this.handleSwitchChange}
                            />
                        }
                        label="Use box score"

                    />
                </Toolbar>
                <PlayerMatchHistory player={player} useHeader useBoxScore={this.state.useBoxScore}/>
            </Paper>
        )
    }

    private readonly handleSwitchChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        this.setState({useBoxScore: event.target.checked})
    }
}

const styles = (theme: Theme) => createStyles({
    root: {
        width: "100%",
        maxWidth: 1000,
        marginTop: theme.spacing.unit * 3
    }
})

export const PlayerMatchHistoryView = withStyles(styles)(PlayerMatchHistoryViewComponent)
