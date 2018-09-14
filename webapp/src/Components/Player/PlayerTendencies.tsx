import {Card, CardContent, CardHeader, Grid, Typography} from "@material-ui/core"
import * as React from "react"
import {ChartDataResponse} from "../../Models/ChartData"
import {getPlayerTendencies} from "../../Requests/Player"
import {PlayerTendenciesChart} from "./Charts/PlayerTendenciesChart"


interface Props {
    player: Player
}

interface State {
    data?: ChartDataResponse[]
}


export class PlayerTendencies extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public componentDidMount() {
        this.getPlayerTendencies()
    }

    public componentDidUpdate(prevProps: Readonly<Props>) {
        if (prevProps.player.id !== this.props.player.id) {
            this.getPlayerTendencies()
        }
    }

    public render() {
        return (
            <Card>
                <CardHeader title="Playstyle"/>
                <CardContent>
                    <Grid container justify="space-around" spacing={32}>
                        {/*TODO: Handle when fails to load due to error*/}
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
                    </Grid>
                </CardContent>
            </Card>
        )
    }

    private readonly getPlayerTendencies = () => {
        getPlayerTendencies(this.props.player.id)
            .then((data) => this.setState({data}))
    }
}
