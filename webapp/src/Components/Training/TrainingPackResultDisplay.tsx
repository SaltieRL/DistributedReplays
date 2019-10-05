import { Card, CardHeader, Divider, List, Typography } from "@material-ui/core"
import * as _ from "lodash"
import * as React from "react"
import { TrainingPack, TrainingPackResponse } from "../../Models/Player/TrainingPack"
import { TrainingPackDisplayRow } from "./TrainingPackDisplayRow"
import { TrainingPackResultsActions } from "./TrainingPackResultsActions"
import { TrainingPackTablePagination } from "./TrainingPackTablePagination"

interface Props {
    trainingPacks: TrainingPackResponse
    page: number
    limit: number
}

interface State {
    selectable: boolean
    selectedReplayIds: string[]
}

export class TrainingPackResultDisplay extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectable: false, selectedReplayIds: []}
    }

    public render() {
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
                            <TrainingPackResultsActions to={"/test"}/>}/>
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
                        <i>No replays match the selected filters.</i>
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

    // private readonly getGroupLink = () => {
    //     const url = qs.stringify({ids: this.state.selectedReplayIds},
    //         {arrayFormat: "repeat", addQueryPrefix: true})
    //     return REPLAYS_GROUP_PAGE_LINK + url
    // }
}
