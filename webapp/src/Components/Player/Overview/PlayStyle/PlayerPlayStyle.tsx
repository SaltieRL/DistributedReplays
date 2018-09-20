import {Grid, Typography} from "@material-ui/core"
import * as React from "react"
import {ChartDataResponse} from "../../../../Models/ChartData"
import {getPlayerPlayStyles} from "../../../../Requests/Player"
import {LoadableWrapper} from "../../../Shared/LoadableWrapper"
import {PlayerPlayStyleChart} from "./PlayerPlayStyleChart"

interface Props {
    player: Player
}

interface State {
    data?: ChartDataResponse[]
    reloadSignal: boolean
}

export class PlayerPlayStyle extends React.PureComponent<Props, State> {
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
        return (
            <Grid container justify="space-around" spacing={32}>
                <LoadableWrapper load={this.getPlayStyles} reloadSignal={this.state.reloadSignal}>
                    {this.state.data &&
                    this.state.data.map((chartDataResponse) => {
                        return (
                            <Grid item xs={12} md={5} xl={3} key={chartDataResponse.title} style={{height: 400}}>
                                <Typography variant="subheading" align="center">
                                    {chartDataResponse.title}
                                </Typography>
                                <PlayerPlayStyleChart data={chartDataResponse}/>
                            </Grid>
                        )
                    })}
                </LoadableWrapper>
            </Grid>
        )
    }

    private readonly getPlayStyles = (): Promise<void> => {
        return getPlayerPlayStyles(this.props.player.id)
            .then((data) => this.setState({data}))
    }

    private readonly triggerReload = () => {
        this.setState({reloadSignal: !this.state.reloadSignal})
    }
}
