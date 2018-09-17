import {Card, CardContent, CardHeader, Grid, Typography} from "@material-ui/core"
import * as React from "react"
import {ChartDataResponse} from "../../../Models/ChartData"
import {getPlayerPlayStyles} from "../../../Requests/Player"
import {LoadableWrapper} from "../../Shared/LoadableWrapper"
import {PlayerTendenciesChart} from "./Charts/PlayerTendenciesChart"


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
            <Card>
                <CardHeader title="Playstyle"/>
                <CardContent>
                    <Grid container justify="space-around" spacing={32}>
                        <LoadableWrapper load={this.getPlayStyles} reloadSignal={this.state.reloadSignal}>
                            {this.state.data &&
                            this.state.data.map((spokeData) => {
                                return (
                                    <Grid item xs={12} md={5} xl={3} key={spokeData.title} style={{height: 400}}>
                                        <Typography variant="subheading" align="center">
                                            {spokeData.title}
                                        </Typography>
                                        <PlayerTendenciesChart data={spokeData}/>
                                    </Grid>
                                )
                            })}
                        </LoadableWrapper>
                    </Grid>
                </CardContent>
            </Card>
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
