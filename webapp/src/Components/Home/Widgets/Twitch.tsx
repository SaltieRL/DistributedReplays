import Card from "@material-ui/core/Card"
import { CardHeader, Divider, Grid, Typography } from "@material-ui/core"
import CardContent from "@material-ui/core/CardContent"
import * as React from "react"
import { getTwitchStreams } from "../../../Requests/Home"

interface Props {

}

interface State {
    streams?: StreamResponse
}

export class Twitch extends React.Component<Props, State> {
    constructor(props: {}) {
        super(props)
        this.state = {}
    }

    public componentDidMount() {
        getTwitchStreams()
            .then((streams: StreamResponse) => this.setState({streams}))
    }

    public render() {
        return (
            <Card>
                <CardHeader title={"Featured Twitch Streams"}/>
                <CardContent>
                    {this.state.streams ? <>
                        {this.state.streams.streams.map((stream: Stream) => (
                            <a href={`https://twitch.tv/${stream.name}`} target={"_blank"}
                               style={{textDecoration: "none"}}>
                                <Grid item container xs={12} style={{padding: "25px"}}>
                                    <Grid item xs={12} md={3}>
                                        <img src={stream.thumbnail}/>
                                    </Grid>
                                    <Grid item xs={12} md={9}>
                                        <Typography noWrap
                                                    style={{fontStyle: "italic"}}>
                                            {stream.title}
                                        </Typography>
                                        <Typography noWrap
                                                    style={{fontWeight: "bold"}}>
                                            {stream.name}
                                        </Typography>
                                        <Typography noWrap
                                                    style={{color: "red"}}>
                                            {stream.viewers} viewers
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider/>
                                </Grid>
                            </a>
                        ))}
                    </> : null}
                </CardContent>
            </Card>
        )
    }
}