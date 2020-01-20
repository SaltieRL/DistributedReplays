import {CardHeader, Divider, Grid, Typography} from "@material-ui/core"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import * as React from "react"
import { CompactReplay } from "../../../Models"
import { RecentReplaysResponse } from "../../../Models/types/Homepage"
import { getRecentReplays } from "../../../Requests/Home"
import {RecentReplaysResponse} from "../../../Models/types/Homepage"
import {getRecentReplays} from "../../../Requests/Home"
import {ColouredGameScore} from "../../Shared/ColouredGameScore"

interface Props {
    cardStyle: React.CSSProperties
}

interface State {
    recentReplays?: RecentReplaysResponse
}

export class Recent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public componentDidMount() {
        getRecentReplays().then((recentReplays: RecentReplaysResponse) => this.setState({recentReplays}))
    }

    public render() {
        return (
            <Card style={this.props.cardStyle}>
                <CardHeader title={"Recent Submitted Replays"} />
                <CardContent>
                    {this.state.recentReplays &&
                        this.state.recentReplays.recent.map((replay) => (
                            <a
                                key={replay.id}
                                href={`/replays/${replay.id}`}
                                target="_blank"
                                rel="noreferrer noopener"
                                style={{textDecoration: "none"}}
                            >
                                <Grid item container xs={12} style={{padding: 25}}>
                                    <Grid item xs={12} md={3}>
                                        <Typography>
                                            <ColouredGameScore replay={replay} />
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Typography noWrap style={{fontStyle: "bold"}}>
                                            {replay.gameMode}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography noWrap style={{fontStyle: "italic"}}>
                                            {replay.date.format("DD/MM/YYYY")}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                            </a>
                        ))}
                </CardContent>
            </Card>
        )
    }
}
