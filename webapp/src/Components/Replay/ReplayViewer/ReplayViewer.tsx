import { Button, CardContent, Grid, TextField, Typography } from "@material-ui/core"
import Slider from "@material-ui/lab/Slider"
import * as React from "react"
import { FPSClock, Replay } from "src/Models"
import { getReplayViewerData, getReplayViewerProto } from "../../../Requests/Replay"
import { Scoreboard } from "./Scoreboard"
import { ThreeScene } from "./ThreeScene"

interface OwnProps {
    replay: Replay
}

type Props = OwnProps

interface State {
    replayData?: ReplayDataResponse
    replayProto?: any
    currentFrame: number
    clock?: FPSClock
    gameTime: number
    play: boolean
    team0Score: number
    team1Score: number
    playerTeamMap: Record<string, number>
}

export class ReplayViewer extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            currentFrame: 0,
            gameTime: 300,
            team0Score: 0,
            team1Score: 0,
            play: false,
            playerTeamMap: {}
        }
    }

    public async componentDidMount() {
        await this.getReplayPositions()
        await this.getReplayProto()
        if (this.state.replayData) {
            const clock = FPSClock.convertReplayToClock(this.state.replayData)
            clock.addCallback(this.onFrameUpdate)
            this.setState({ clock })
        }
        // console.log(this.state.replayData)
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        if (this.state.replayProto !== prevState.replayProto) {
            this.getPlayerTeamMap()
        }
        if (this.state.currentFrame !== prevState.currentFrame) {
            this.updateGameTime()
            this.updateGameScore()
        }
    }

    public render() {
        return (
            <CardContent>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        {this.state.replayData && this.state.clock ? (
                            <>
                                <Scoreboard team0Score={this.state.team0Score} team1Score={this.state.team1Score}
                                            gameTime={this.getGameTimeString()} />
                                <ThreeScene clock={this.state.clock}
                                            replayData={this.state.replayData} />
                            </>
                        ) : (
                            <Typography variant="title" align="center">Loading...</Typography>
                        )}
                    </Grid>
                    <Grid item xs={12} container>
                        <Grid item xs={4} container justify="space-around">
                            <Typography align="center">Playback Controls</Typography>
                            <Button variant="outlined" onClick={() => this.setPlayback(true)}>Play</Button>
                            <Button variant="outlined" onClick={() => this.setPlayback(false)}>Pause</Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography>Frame:</Typography>
                            <TextField type="number" value={this.state.currentFrame} onChange={this.setCurrentFrame} />
                        </Grid>
                        <Grid item xs={4}>
                            <Typography>
                                Ball Position:
                                {this.state.replayData && this.state.replayData.ball[this.state.currentFrame][0]},
                                {this.state.replayData && this.state.replayData.ball[this.state.currentFrame][1]},
                                {this.state.replayData && this.state.replayData.ball[this.state.currentFrame][2]}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                    {this.state.replayData && <Slider
                        value={this.state.currentFrame}
                        min={0}
                        max={this.state.replayData.frames.length - 1}
                        step={1}
                        onChange={this.onSliderChange}
                    />}
                    </Grid>
                </Grid>
            </CardContent>
        )
    }

    private readonly getReplayPositions = async(): Promise<void> => {
        const replayData: ReplayDataResponse = await getReplayViewerData(this.props.replay.id)  // TODO: type replayData
        this.setState({ replayData })
    }

    private readonly getReplayProto = async(): Promise<void> => {
        const replayProto: any = await getReplayViewerProto(this.props.replay.id) // TODO: type replayProto.
        this.setState({ replayProto })
    }

    private readonly getPlayerTeamMap = () => {
        const playerTeamMap: Record<string, number> = {}
        this.state.replayProto.teams.forEach((team: any, i: number) => {
            team.playerIds.forEach((player: any) => {
                playerTeamMap[player.id] = i
            })
        })
        this.setState({playerTeamMap})
    }

    private readonly onFrameUpdate = (frame: number) => {
        if (this.state.replayData && this.state.clock) {
            if (frame >= this.state.replayData.frames.length - 1) {
                this.setState({ play: false })
                this.state.clock.pause()
            } else {
                this.setState({ currentFrame: frame })
                this.updateGameTime()
                this.updateGameScore()
            }
        }
    }

    private readonly setCurrentFrame: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const currentFrame: number = Number(event.target.value)
        this.state.clock!.setFrame(currentFrame)
    }

    private readonly onSliderChange = (_: any, value: number): void => {
        this.state.clock!.setFrame(value)
    }

    private readonly updateGameTime = (): void => {
        // Update game time
        const frame: any = this.state.replayData!.frames[this.state.currentFrame] // Specify any.
        const time: number = parseFloat(frame[1])
        this.setState({ gameTime: time })
    }

    private readonly getGameTimeString = (): string => {
        const seconds: number = this.state.gameTime % 60
        const minutes: number = (this.state.gameTime - seconds) / 60

        const secondsString: string = seconds < 10 ? `0${seconds.toString()}` : seconds.toString()
        const minutesString: string = minutes.toString()

        return `${minutesString}:${secondsString}`
    }

    private readonly updateGameScore = (): void => {
        const currentFrame = this.state.currentFrame
        const goals = this.state.replayProto.gameMetadata.goals
        let team0Score = 0
        let team1Score = 0
        goals.forEach((goal: any) => {  // TODO: Specify replayProto type as we"re doing extensive work with it.
            if (goal.frameNumber <= currentFrame) {
                if (this.state.playerTeamMap[goal.playerId.id] === 0) { // Where is playerTeamMap
                    team0Score++
                } else {
                    team1Score++
                }
            }
        })
        this.setState({team0Score, team1Score})
    }

    private readonly setPlayback = (play: boolean): void => {
        if (this.state.clock) {
            if (!this.state.play && play) {
                this.state.clock.play()
            } else if (!play) {
                this.state.clock.pause()
            }
            this.setState({ play })
        }
    }
}
