import { createStyles, Grid, Theme, Typography, withStyles, WithStyles } from "@material-ui/core"
import * as React from "react"

interface OwnProps {
    team0Score: number
    team1Score: number
    gameTime: string
}

type Props = OwnProps & WithStyles<typeof styles>

class ScoreboardComponent extends React.PureComponent<Props> {
    public render() {
        const {classes, team0Score, team1Score, gameTime} = this.props
        return (
            <Grid item xs={12} container className={classes.container}>
                <Grid item xs={3} className={classes.blueScoreboard}>
                    <Typography align="center" className={classes.score}>
                        {team0Score}
                    </Typography>
                </Grid>
                <Grid item xs={6} className={classes.gameTimeBoard}>
                    <Typography align="center" className={classes.gameTime}>
                        {gameTime}
                    </Typography>
                </Grid>
                <Grid item xs={3} className={classes.orangeScoreboard}>
                    <Typography align="center" className={classes.score}>
                        {team1Score}
                    </Typography>
                </Grid>
            </Grid>
        )
    }
}

const styles = (theme: Theme) => createStyles({
    container: {
        position: "absolute",
        zIndex: 10,
        left: "50%",
        transform: "translateX(-50%)",
        width: 400,
        borderStyle: "solid",
        borderWidth: 3,
        borderColor: "#fffa",
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
    },
    score: {
        color: "#fff",
        fontFamily: "monospace",
        fontSize: "xx-large"
    },
    gameTime: {
        color: "#fff",
        fontFamily: "monospace",
        fontSize: "xx-large"
    },
    gameTimeBoard: {
        backgroundColor: "#000A"
    },
    orangeScoreboard: {
        backgroundColor: "#E27740AA",
        borderBottomRightRadius: 5
    },
    blueScoreboard: {
        backgroundColor: "#4874EFAA",
        borderBottomLeftRadius: 5
    }
})

export const Scoreboard = withStyles(styles)(ScoreboardComponent)
