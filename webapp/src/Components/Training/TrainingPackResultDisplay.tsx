import {Card, CardHeader, Divider, List, TablePagination, Typography, withWidth} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import {isWidthUp, WithWidth} from "@material-ui/core/withWidth"
import * as _ from "lodash"
import * as React from "react"
import {TrainingPack, TrainingPackResponse, TrainingPackShot} from "../../Models/Player/TrainingPack"
import {Viewer} from "../Replay/ReplayViewer/Viewer"
import {CreatePackDialog} from "./CreatePackDialog"
import {TrainingPackDisplayRow} from "./TrainingPackDisplayRow"

interface OwnProps {
    trainingPacks: TrainingPackResponse
    page: number
    limit: number
    handleChangePage: (event: unknown, page: number) => void
    handleChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
}

type Props = OwnProps & WithWidth

interface State {
    selectable: boolean
    selectedReplayIds: string[]
    game?: string
    frame?: number
    openDialog: boolean
}

class TrainingPackResultDisplayComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            selectable: false,
            selectedReplayIds: [],
            openDialog: false
        }
    }

    public render() {
        const {width} = this.props
        const isWidthUpLg = isWidthUp("lg", width)
        const linkButton = (
            <Button onClick={this.openDialog} variant={"outlined"}>
                New pack
            </Button>
        )
        const viewer =
            this.state.game && this.state.frame ? (
                <Grid item xs={isWidthUpLg ? 5 : 12} style={{minHeight: "40vh"}}>
                    <Viewer
                        replayId={this.state.game}
                        frameMin={this.state.frame}
                        frameCount={150}
                        pauseOnStart={true}
                        compact={true}
                    />
                </Grid>
            ) : null

        const createPackDialog = (
            <CreatePackDialog openDialog={this.state.openDialog} onCloseDialog={this.closeDialog} />
        )

        const {trainingPacks, page, limit} = this.props
        const {selectable} = this.state
        const subheader =
            "Packs can be placed in " +
            "Documents\\My Games\\Rocket League\\TAGame\\Training\\[id]\\MyTraining " +
            "and accessed in Training > Created"

        return (
            <Grid container>
                <Grid item xs={this.state.game && isWidthUpLg ? 7 : 12}>
                    {!isWidthUpLg && viewer}
                    {trainingPacks.packs.length > 0 ? (
                        <Card>
                            <CardHeader
                                title="Training Packs"
                                subheader={subheader}
                                action={
                                    <div style={{paddingRight: 8}}>
                                        <div style={{display: "flex"}}>{linkButton}</div>
                                    </div>
                                }
                            />
                            {selectable ? (
                                <List dense style={isWidthUpLg ? {} : {overflowY: "scroll", height: "50vh"}}>
                                    <Divider />
                                    {this.props.trainingPacks.packs.map((pack: TrainingPack, i) => (
                                        <>
                                            <TrainingPackDisplayRow
                                                key={pack.guid}
                                                pack={pack}
                                                selectProps={{
                                                    selected: _.includes(this.state.selectedReplayIds, pack.guid),
                                                    handleSelectChange: this.handleSelectChange(pack.guid)
                                                }}
                                                selectShotHandler={(shotNum: number) => {
                                                    this.handleSelectShot(i, shotNum)
                                                }}
                                                gameMap={this.props.trainingPacks.games}
                                            />
                                            {i !== this.props.trainingPacks.packs.length && <Divider />}
                                        </>
                                    ))}
                                </List>
                            ) : (
                                <div style={isWidthUpLg ? {} : {overflowY: "scroll", height: "30vh"}}>
                                    {this.props.trainingPacks.packs.map((pack: TrainingPack, i) => (
                                        <TrainingPackDisplayRow
                                            key={pack.guid}
                                            pack={pack}
                                            selectShotHandler={(shotNum: number) => {
                                                this.handleSelectShot(i, shotNum)
                                            }}
                                            gameMap={this.props.trainingPacks.games}
                                        />
                                    ))}
                                </div>
                            )}
                            <TablePagination
                                component="div"
                                count={trainingPacks.totalCount}
                                onChangePage={this.props.handleChangePage}
                                onChangeRowsPerPage={this.props.handleChangeRowsPerPage}
                                page={page}
                                rowsPerPage={limit}
                                rowsPerPageOptions={[10, 25, 50]}
                            />
                        </Card>
                    ) : (
                        <Typography variant="subtitle1" align="center">
                            <i>No training packs exist.</i>
                            {linkButton}
                        </Typography>
                    )}
                </Grid>
                {isWidthUpLg && viewer}
                {createPackDialog}
            </Grid>
        )
    }

    private readonly handleSelectShot = (pack: number, shotNumber: number) => {
        const shot: TrainingPackShot = this.props.trainingPacks.packs[pack].shots[shotNumber]
        this.setState({game: shot.game, frame: shot.frame})
    }
    // private readonly handleSelectableChange = (event: React.ChangeEvent<HTMLInputElement>,
    //                                            selectable: boolean) => {
    //     this.setState({selectable})
    //     if (!selectable) {
    //         this.setState({
    //             selectedReplayIds: []
    //         })
    //     }
    // }

    private readonly handleSelectChange = (id: string) => (checked: boolean) => {
        if (!checked) {
            this.setState({
                selectedReplayIds: this.state.selectedReplayIds.filter((replayId) => replayId !== id)
            })
        } else {
            this.setState({
                selectedReplayIds: [...this.state.selectedReplayIds, id]
            })
        }
    }

    private readonly openDialog = () => {
        this.setState({openDialog: true})
    }
    private readonly closeDialog = () => {
        this.setState({openDialog: false})
    }
}

export const TrainingPackResultDisplay = withWidth()(TrainingPackResultDisplayComponent)
