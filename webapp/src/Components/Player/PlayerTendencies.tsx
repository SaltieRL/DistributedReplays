import {Card, CardContent, CardHeader, Grid, Typography} from "@material-ui/core"
import * as React from "react"
import {getPlayerTendencies} from "../../Requests/Player"
import {PlayerTendenciesChart} from "./Charts/PlayerTendenciesChart"

interface PlayStyleChartSpokeData {
    name: string
    value: number
    average?: number
}

export interface PlayStyleChartData {
    title: string
    spokeData: PlayStyleChartSpokeData[]
}

interface Props {
    player: Player
}

interface State {
    data?: PlayStyleChartData[]
}


export class PlayerTendencies extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public componentDidMount() {
        getPlayerTendencies(this.props.player.id)
            .then((data) => this.setState({data}))
    }

    public render() {
        return (
            <Card>
                <CardHeader title="Playstyle"/>
                <CardContent>
                    <Grid container justify="space-around">
                    {this.state.data &&
                    this.state.data.map((spokeData) => {
                        return (
                            <Grid item xs={12} md={6} xl={3} key={spokeData.title}>
                                <Typography variant="subheading" align="center">
                                    {spokeData.title}
                                </Typography>
                                <PlayerTendenciesChart data={spokeData}/>
                            </Grid>
                        )
                    })}
                    </Grid>
                </CardContent>
            </Card>
        )
    }
}
