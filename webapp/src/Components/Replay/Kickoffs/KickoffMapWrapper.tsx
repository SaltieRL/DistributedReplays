import { Grid } from "@material-ui/core"
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints"
import withWidth, { isWidthUp } from "@material-ui/core/withWidth"
import * as React from "react"
import { Replay } from "../../../Models"
import { KickoffCountsTable } from "./KickoffCountsTable"
import { KickoffField } from "./KickoffField"

interface Props {
    kickoffIndex: number
    kickoffData: any
    players: any
    replay: Replay
    width: Breakpoint
}

interface State {
    highlight: number
}

const IMAGE_WIDTH = 250
const IMAGE_HEIGHT = 175

class KickoffMapWrapperComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {highlight: -1}
    }

    public render() {
        const size = this.getSize()
        const kickoffField = (
            <KickoffField
                key={this.props.kickoffIndex}
                playerList={this.props.kickoffData.players}
                players={this.props.players}
                onMouseover={this.onMouseover}
                onMouseout={this.onMouseout}
                width={size[0]}
                height={size[1]}
            />
        )
        return (
            <>
                <Grid item xs={12} lg={8} xl={7}
                      style={{padding: "20px 40px 20px 40px", textAlign: "center", margin: "auto", overflowX: "auto"}}>
                    {kickoffField}
                </Grid>
                <Grid item xs={12} lg={6} xl={7} style={{padding: "20px 40px 20px 40px"}} container>
                    <Grid item xs={12}>
                        <KickoffCountsTable
                            kickoff={this.props.kickoffData}
                            players={this.props.players}
                            replay={this.props.replay}
                            highlight={0}
                        />
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

    private readonly getSize = () => {
        const result = [IMAGE_WIDTH, IMAGE_HEIGHT]

        if (isWidthUp("lg", this.props.width, true)) {
            return this.convert(result, 4)
        }

        if (isWidthUp("md", this.props.width, true)) {
            return this.convert(result, 2)
        }

        if (isWidthUp("sm", this.props.width, true)) {
            return this.convert(result, 1)
        }
        return result
    }

    private readonly convert = (list: any, multiple: number) => {
        return list.map((element: number) => {
            return element * multiple
        })
    }
}

export const KickoffMapWrapper = withWidth()(KickoffMapWrapperComponent)
