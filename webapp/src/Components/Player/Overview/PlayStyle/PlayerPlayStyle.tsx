import {createStyles, Grid, Theme, Typography, withStyles, WithStyles} from "@material-ui/core"
import Warning from "@material-ui/icons/Warning"
import * as React from "react"
import {PlayStyleResponse} from "../../../../Models/Player/PlayStyle"
import {getPlayStyle} from "../../../../Requests/Player/getPlayStyle"
import {LoadableWrapper} from "../../../Shared/LoadableWrapper"
import {PlayerPlayStyleChart} from "./PlayerPlayStyleChart"

interface OwnProps {
    player: Player
}

type Props = OwnProps
    & WithStyles<typeof styles>

interface State {
    data?: PlayStyleResponse
    reloadSignal: boolean
}

class PlayerPlayStyleComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {reloadSignal: false}
    }

    public componentDidUpdate(prevProps: Readonly<Props>) {
        if (prevProps.player.id !== this.props.player.id) {
            this.triggerReload()
        }
    }

    public render() {
        const {classes} = this.props
        const notEnoughDataWarning =
            "This may not be a good representation of the player as there are too few replays. " +
            "Upload more replays to get more accurate stats."
        return (
            <Grid container justify="space-around" spacing={32}>
                <LoadableWrapper load={this.getPlayStyles} reloadSignal={this.state.reloadSignal}>
                    {this.state.data &&
                    <>
                        {this.state.data.showWarning &&
                        <Grid item xs={12} container justify="center">
                            <Grid item xs={11} sm={10} md={9} lg={7} xl={5}
                                  style={{textAlign: "center", display: "flex"}}
                                  className={classes.warningContainer}
                            >
                                <Warning className={classes.inlineWarning}/>
                                <Typography>
                                    {notEnoughDataWarning}
                                </Typography>
                            </Grid>
                        </Grid>
                        }
                        {this.state.data.chartDatas.map((chartDataResponse) => {
                            return (
                                <Grid item xs={12} md={5} lg={3} key={chartDataResponse.title}
                                      style={{height: 400}}>
                                    <Typography variant="subheading" align="center">
                                        {chartDataResponse.title}
                                    </Typography>
                                    <PlayerPlayStyleChart names={["Player"]} data={[chartDataResponse]}/>
                                </Grid>
                            )
                        })}

                    </>
                    }
                </LoadableWrapper>
            </Grid>
        )
    }

    private readonly getPlayStyles = (): Promise<void> => {
        return getPlayStyle(this.props.player.id)
            .then((data) => this.setState({data}))
    }

    private readonly triggerReload = () => {
        this.setState({reloadSignal: !this.state.reloadSignal})
    }
}

const styles = (theme: Theme) => createStyles({
    inlineWarning: {
        color: theme.palette.error.main,
        margin: "auto",
        marginRight: theme.spacing.unit
    },
    warningContainer: {
        border: "1px rgba(0, 0, 0, 0.4) solid",
        borderRadius: 8,
        padding: 8
    }
})

export const PlayerPlayStyle = withStyles(styles)(PlayerPlayStyleComponent)
