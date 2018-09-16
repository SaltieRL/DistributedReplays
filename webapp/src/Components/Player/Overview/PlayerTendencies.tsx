import {Card, CardContent, CardHeader, Grid, Typography} from "@material-ui/core"
import * as React from "react"
import {ChartDataResponse} from "../../../Models/ChartData"
import {getPlayerTendencies} from "../../../Requests/Player"
import {LoadableComponent} from "../../Shared/LoadableComponent"
import {PlayerTendenciesChart} from "./Charts/PlayerTendenciesChart"


interface Props {
    player: Player
}

interface State {
    data?: ChartDataResponse[]
    reloadSignal: boolean
}


export class PlayerTendencies extends React.PureComponent<Props, State> {
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
                        <LoadableComponent load={this.getPlayerTendencies} reloadSignal={this.state.reloadSignal}>
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
                        </LoadableComponent>
                    </Grid>
                </CardContent>
            </Card>
        )
    }

    private readonly getPlayerTendencies = (): Promise<void> => {
        return getPlayerTendencies(this.props.player.id)
            .then((data) => this.setState({data}))
    }

    private readonly triggerReload = () => {
        this.setState({reloadSignal: !this.state.reloadSignal})
    }
}
