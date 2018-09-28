import {Grid, Typography} from "@material-ui/core"
import * as React from "react"
import {Replay} from "../../../Models/Replay/Replay"
import {getReplayViewerData} from "../../../Requests/Replay"
import {ThreeScene} from "./ThreeScene"

interface OwnProps {
    replay: Replay
}

type Props = OwnProps

interface State {
    replayData?: any,
    currentFrame: number,
    play: boolean
}

export class ReplayViewer extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            currentFrame: 0,
            play: false
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
                <Grid item xs={8}>
                    {
                        !this.state.replayData &&
                        <Typography>Loading...</Typography>
                    }
                    {
                        this.state.replayData &&
                        <ThreeScene
                            replayData={this.state.replayData}
                            frame={this.state.currentFrame}
                        />
                    }
                </Grid>
                <Grid item xs={4}>
                    <Typography>Playback Controls</Typography>
                    <button onClick={this.startPlayback}>Play</button>
                    <button onClick={this.stopPlayback}>Pause</button>
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

    private readonly setCurrentFrame: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const value: number = parseInt(event.target.value, 10)
        this.setState({currentFrame: value})
    }

    private startPlayback = () => {
        if (!this.state.play) {
            this.setState({play: true})
            setTimeout(() => this.playLoop(), 0)
        }
    }

    private stopPlayback = () => {
        this.setState({play: false})
    }

    private playLoop = () => {
        if (this.state.play) {
            this.setState({currentFrame: this.state.currentFrame + 1})
            setTimeout(() => this.playLoop(), 1000 / 30)
        }
    }
}
