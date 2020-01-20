import {Button, CardActions, CardHeader, Grid, Typography} from "@material-ui/core"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import LinearProgress from "@material-ui/core/LinearProgress"
import * as React from "react"

import {PATREON_LINK} from "../../../Globals"
import {PatreonResponse} from "../../../Models/types/Homepage"
import {getPatreonProgress} from "../../../Requests/Home"

interface Props {
    cardStyle: React.CSSProperties
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
        getPatreonProgress().then((patreonProgress: PatreonResponse) => this.setState({patreonProgress}))
    }

    public render() {
        return (
            <Card style={this.props.cardStyle}>
                <CardHeader title={"Patreon Goal Progress"} subheader={"100% of contributions go to server costs"} />
                <CardContent>
                    {this.state.patreonProgress ? (
                        <>
                            <div style={{marginBottom: "15px"}}>
                                <Typography variant="h5" className="tex2jax_ignore">
                                    ${this.state.patreonProgress.progress} / ${this.state.patreonProgress.total}
                                </Typography>
                            </div>
                            <Grid item xs={12}>
                                <LinearProgress
                                    variant="determinate"
                                    value={
                                        (this.state.patreonProgress.progress / this.state.patreonProgress.total) * 100.0
                                    }
                                />
                            </Grid>
                        </>
                    ) : null}
                </CardContent>
                <CardActions>
                    <Button variant="text" size="small" href={PATREON_LINK} target="_blank" rel="noreferrer noopener">
                        Support us
                    </Button>
                </CardActions>
            </Card>
        )
    }
}
