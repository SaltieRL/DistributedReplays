import { CardHeader, Divider, Grid, Typography } from "@material-ui/core"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import * as React from "react"
import { Stream, StreamResponse } from "../../../Models/types/Homepage"
import { getTwitchStreams } from "../../../Requests/Home"

interface Props {
    cardStyle: React.CSSProperties
}

interface State {
    streams?: StreamResponse
}

export class Twitch extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public componentDidMount() {
        getTwitchStreams()
            .then((streams: StreamResponse) => this.setState({streams}))
    }

    public render() {
        return (
            <Card style={this.props.cardStyle}>
                <CardHeader title={"Featured Twitch Streams"} subheader={"Streamers that support us"}/>
                <CardContent>
                    {this.state.streams ? (
                        <>
                            {this.state.streams.streams.map((stream: Stream) => (
                                <a
                                    key={stream.name}
                                    href={`https://twitch.tv/${stream.name}`}
                                    target="_blank" rel="noreferrer noopener"
                                    style={{textDecoration: "none"}}>
                                    <Grid item container xs={12} style={{padding: 25}}>
                                        <Grid item xs={12} md={6}>
                                            <img width="90%" alt="Thumbnail" src={stream.thumbnail}/>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography noWrap style={{fontStyle: "italic"}}>
                                                {stream.title}
                                            </Typography>
                                            <Typography noWrap style={{fontWeight: "bold"}}>
                                                {stream.name}
                                            </Typography> <Typography noWrap
                                                                      style={{color: "red"}}>
                                            {stream.viewers} {stream.viewers === 1 ? ("viewer") : ("viewers")}
                                        </Typography>
                                            <Typography style={{fontStyle: "italic"}}>
                                                {stream.game}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider/>
                                    </Grid>
                                </a>
                            ))}
                        </>
                    ) : null}
                </CardContent>
            </Card>
        )
    }
}
