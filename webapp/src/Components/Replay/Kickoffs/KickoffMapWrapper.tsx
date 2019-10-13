import { Grid } from "@material-ui/core"
import * as React from "react"
import { Replay } from "../../../Models"
import { KickoffField } from "./KickoffField"
import {KickoffCountsTable} from "./KickoffCountsTable";

interface Props {
    kickoffIndex: number
    kickoffData: any
    players: any
    replay: Replay
}

interface State {
    highlight: number
}

export class KickoffMapWrapper extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {highlight: -1}
    }

    public render() {

        const kickoffField = (
            <KickoffField key={this.props.kickoffIndex}
                          kickoff={this.props.kickoffData}
                          players={this.props.players}
                          onMouseover={this.onMouseover}
                          onMouseout={this.onMouseout}/>
        )
        return (
            <>
                <Grid item xs={12} lg={8} xl={7}
                      style={{padding: "20px 40px 20px 40px", textAlign: "center", margin: "auto", overflowX: "auto"}}>
                    {kickoffField}
                </Grid>
                <Grid item xs={12} lg={6} xl={7} style={{padding: "20px 40px 20px 40px"}} container>
                    <Grid item xs={12}>
                        {
                            <KickoffCountsTable
                                kickoff={this.props.kickoffData}
                                players={this.props.players}
                                replay={this.props.replay}
                            />
                        }
                    </Grid>
                </Grid>
            </>
        )
    }

    private readonly onMouseover = (index: number, data: any) => {
        this.setState({highlight: index})
    }

    private readonly onMouseout = (index: number, data: any) => {
        this.setState({highlight: -1})
    }
}
