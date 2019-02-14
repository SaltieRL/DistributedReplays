import { Grid, Typography } from "@material-ui/core"
import * as React from "react"
import { Replay } from "../../../Models"
import { getReplayViewerData } from "../../../Requests/Replay"
import { ThreeScene } from "./ThreeScene"

interface OwnProps {
    replay: Replay
}

type Props = OwnProps

interface State {
    replayData?: any,
    currentFrame: number,
    gameTime: number,
    play: boolean
}

export class ReplayViewer extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            currentFrame: 0,
            gameTime: 300,
            play: false
        }
    }

    public async componentDidMount() {
        await this.getReplayPositions()
        // console.log(this.state.replayData)
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
                    <Typography>
                        {/*We should use padStart on seconds, but that is in es2017, not es6*/}
                        Game Time: {(this.state.gameTime / 60).toFixed(0)}:{(this.state.gameTime % 60).toString()}
                    </Typography>
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
        this.updateGameTime()
    }

    private readonly updateGameTime = () => {
        // Update game time
        const frame = this.state.replayData.frames[this.state.currentFrame]
        const time: number = parseFloat(frame[1])
        this.setState({gameTime: time})
    }

    private readonly startPlayback = () => {
        if (!this.state.play) {
            this.setState({play: true})
            setTimeout(() => this.playLoop(), 0)
        }
    }

    private readonly stopPlayback = () => {
        this.setState({play: false})
    }

    private readonly playLoop = () => {
        if (this.state.play) {
            if (this.state.currentFrame === this.state.replayData.frames.length) {
                this.setState({play: false})
            }
            this.setState({currentFrame: this.state.currentFrame + 1})
            this.updateGameTime()
            const frame = this.state.replayData.frames[this.state.currentFrame]
            const delta: number = parseFloat(frame[0])
            setTimeout(() => this.playLoop(), delta * 1000)
        }
    }
}
