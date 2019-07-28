import { Button, CardHeader, Grid, Typography } from "@material-ui/core"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import LinearProgress from "@material-ui/core/LinearProgress"
import * as React from "react"
import { getPatreonProgress } from "../../../Requests/Home"

interface Props {
    style: any
}

interface State {
    patreonProgress?: PatreonResponse
}

export class Patreon extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public componentDidMount() {
        getPatreonProgress()
            .then((patreonProgress: PatreonResponse) => this.setState({patreonProgress}))
    }

    public render() {
        return (
            <Card style={this.props.style}>
                <CardHeader title={"Patreon Goal Progress"}/>
                <CardContent>
                    {this.state.patreonProgress ? (
                        <>
                            <div style={{marginBottom: "15px"}}>
                                <Typography variant="h5">${this.state.patreonProgress.progress} /
                                    ${this.state.patreonProgress.total}</Typography>
                            </div>
                            <Grid item xs={12}>
                                <LinearProgress variant="determinate"
                                                value={this.state.patreonProgress.progress /
                                                this.state.patreonProgress.total * 100.0}/>
                            </Grid>

                            <Grid item xs={12} container justify="flex-end">
                                <a
                                    href={"https://patreon.com/calculated"}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    style={{textDecoration: "none"}}
                                >
                                    <Button variant="text" size="small">
                                        <Typography variant="subtitle1">
                                            Link
                                        </Typography>
                                    </Button>
                                </a>
                            </Grid>
                        </>) : null}
                </CardContent>

            </Card>
        )
    }
}
