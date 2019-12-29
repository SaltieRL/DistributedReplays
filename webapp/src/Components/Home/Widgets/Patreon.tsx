import { Button, CardHeader, Grid, Typography } from "@material-ui/core"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import LinearProgress from "@material-ui/core/LinearProgress"
import * as React from "react"

import { PATREON_LINK } from "../../../Globals"
import { PatreonResponse } from "../../../Models/types/Homepage"
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
                <CardHeader
                    title={"Patreon Goal Progress"}
                    subheader={"100% of contributions go to server costs"}
                />
                <CardContent>
                    {this.state.patreonProgress ? (
                        <>
                            <div style={{marginBottom: "15px"}}>
                                <Typography variant="h5" className="tex2jax_ignore">
                                    ${this.state.patreonProgress.progress} /
                                    ${this.state.patreonProgress.total}
                                </Typography>
                            </div>
                            <Grid item xs={12}>
                                <LinearProgress variant="determinate"
                                                value={this.state.patreonProgress.progress /
                                                this.state.patreonProgress.total * 100.0} />
                            </Grid>
                        </>
                    ) : null}

                    <Grid item xs={12} container justify="flex-end">
                        <a
                            href={PATREON_LINK}
                            target="_blank"
                            rel="noreferrer noopener"
                            style={{textDecoration: "none"}}
                        >
                            <Button variant="text" size="small">
                                <Typography variant="subtitle1">
                                    Support us
                                </Typography>
                            </Button>
                        </a>
                    </Grid>
                </CardContent>

            </Card>
        )
    }
}
