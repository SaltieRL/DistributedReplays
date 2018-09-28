import {Grid, Typography} from "@material-ui/core"
import * as React from "react"
import {getReplayViewerData} from "../../../Requests/Replay"
import {ThreeScene} from "./ThreeScene"
import {Replay} from "../../../Models/Replay/Replay"
import {ChangeEvent} from "react"

interface OwnProps {
    replay: Replay
}

type Props = OwnProps

interface State {
    replayData?: any,
    currentFrame: number,
}

export class ReplayViewer extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            replayData: null,
            currentFrame: 0
        }
    }

    public async componentDidMount() {
        await this.getReplayPositions()
        console.log(this.state.replayData)
    }

    public render() {
        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <Typography>
                        Replay Viewer
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    {
                        !this.state.replayData &&
                        <Typography>Loading...</Typography>
                    }
                    {
                        this.state.replayData &&
                        <ThreeScene replayData={this.state.replayData} frame={this.state.currentFrame}/>
                    }
                </Grid>
                <Grid item xs={6}>
                    <label>Frame:</label>
                    <input type="number" value={this.state.currentFrame} onChange={this.setCurrentFrame}/>
                </Grid>
                <Grid item xs={6}>
                    <Typography>
                        Ball Position:
                        {
                            this.state.replayData &&
                            this.state.replayData.ball[this.state.currentFrame][0]
                        },
                        {
                            this.state.replayData &&
                            this.state.replayData.ball[this.state.currentFrame][1]
                        },
                        {
                            this.state.replayData &&
                            this.state.replayData.ball[this.state.currentFrame][2]
                        }
                    </Typography>
                </Grid>
            </Grid>
        )
    }

    private readonly getReplayPositions = async() => {
        const data: any = await getReplayViewerData(this.props.replay.id)
        this.setState({replayData: data})
    }

    private readonly setCurrentFrame = (event: ChangeEvent) => {
        const target = event.target as HTMLInputElement
        const value: number = parseInt(target.value, 10)
        this.setState({currentFrame: value})
    }
}
