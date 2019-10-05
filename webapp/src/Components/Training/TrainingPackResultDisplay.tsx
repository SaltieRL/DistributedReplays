import { Card, CardHeader, Divider, List, Typography } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import * as _ from "lodash"
import * as React from "react"
import { doGet } from "../../apiHandler/apiHandler"
import { TrainingPack, TrainingPackResponse } from "../../Models/Player/TrainingPack"
import { withNotifications, WithNotifications } from "../Shared/Notification/NotificationUtils"
import { TrainingPackDisplayRow } from "./TrainingPackDisplayRow"
import { TrainingPackTablePagination } from "./TrainingPackTablePagination"

interface OwnProps {
    trainingPacks: TrainingPackResponse
    page: number
    limit: number
}

type Props = OwnProps
    & WithNotifications

interface State {
    selectable: boolean
    selectedReplayIds: string[]
}

class TrainingPackResultDisplayComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectable: false, selectedReplayIds: []}
    }

    public render() {

        const linkButton = (
            <Button onClick={this.createPack}>
                Create pack
            </Button>
        )

        const {trainingPacks, page, limit} = this.props
        const {selectable} = this.state

        return (
            <>
                {trainingPacks.packs.length > 0 ?
                    <Card>
                        <CardHeader title="Training Packs"
                                    subheader={"Packs can be placed in " +
                                    "Documents\\My Games\\Rocket League\\TAGame\\Training\\[id]\\MyTraining " +
                                    "and accessed in Training > Created"} action={
                            <div style={{paddingRight: 8}}>
                                <div style={{display: "flex"}}>
                                    {linkButton}
                                </div>
                            </div>}/>
                        {selectable ?
                            <List dense>
                                <Divider/>
                                {this.props.trainingPacks.packs.map((pack: TrainingPack, i) =>
                                    <>
                                        <TrainingPackDisplayRow
                                            key={pack.guid}
                                            pack={pack}
                                            selectProps={{
                                                selected: _.includes(
                                                    this.state.selectedReplayIds,
                                                    pack.guid
                                                ),
                                                handleSelectChange: this.handleSelectChange(pack.guid)
                                            }}/>
                                        {!(i === this.props.trainingPacks.packs.length) && <Divider/>}
                                    </>
                                )}
                            </List>
                            :
                            this.props.trainingPacks.packs.map((pack: TrainingPack) =>
                                <TrainingPackDisplayRow
                                    key={pack.guid}
                                    pack={pack}
                                />
                            )
                        }
                        <TrainingPackTablePagination
                            totalCount={trainingPacks.totalCount}
                            page={page}
                            limit={limit}/>
                    </Card>
                    :
                    <Typography variant="subtitle1" align="center">
                        <i>No training packs exist.</i>
                        {linkButton}
                    </Typography>
                }
            </>
        )
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

    private readonly createPack = () => {
        doGet("/training/create")
            .then(() => {
                this.props.showNotification({
                    variant: "success",
                    message: "Successfully created! Give up to a minute for generation to complete",
                    timeout: 5000
                })
            })
    }

    // private readonly getGroupLink = () => {
    //     const url = qs.stringify({ids: this.state.selectedReplayIds},
    //         {arrayFormat: "repeat", addQueryPrefix: true})
    //     return REPLAYS_GROUP_PAGE_LINK + url
    // }
}

export const TrainingPackResultDisplay = withNotifications()(TrainingPackResultDisplayComponent)
