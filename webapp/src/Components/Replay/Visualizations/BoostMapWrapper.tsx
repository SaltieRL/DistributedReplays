import {Grid} from "@material-ui/core"
import * as React from "react"
import {Replay} from "../../../Models"
import {BoostCountsTable} from "./BoostCountsTable"
import {BoostField} from "./BoostField"

interface Props {
    data: any
    replay: Replay
}

interface State {
    rotateCharts: boolean
    highlight: number
}

export class BoostMapWrapper extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {rotateCharts: false, highlight: -1}
    }

    public render() {
        const {data, replay} = this.props
        const ratios = data.map((pad: any) => {
            const totalCount = pad.length
            const blueCount = pad.filter((pickup: any) => pickup.playerTeam === 0).length
            const orangeCount = totalCount - blueCount
            return [blueCount / totalCount, orangeCount / totalCount]
        })
        const boostNames = ["Blue Top", "Mid Top", "Orange Top", "Blue Bottom", "Mid Bottom", "Orange Bottom"]

        const boostField = (
            <BoostField
                key={this.state.rotateCharts ? 1 : 0}
                data={ratios}
                rotationEnabled={this.state.rotateCharts}
                onMouseover={this.onMouseover}
                onMouseout={this.onMouseout}
            />
        )
        return (
            <>
                <Grid
                    item
                    xs={12}
                    lg={6}
                    xl={5}
                    style={{padding: "20px 40px 20px 40px", textAlign: "center", margin: "auto", overflowX: "auto"}}
                >
                    {boostField}
                </Grid>
                <Grid item xs={12} lg={6} xl={7} style={{padding: "20px 40px 20px 40px"}} container>
                    <Grid item xs={12}>
                        <BoostCountsTable
                            replay={replay}
                            data={data}
                            boostNames={boostNames}
                            rotateCharts={this.state.rotateCharts}
                            toggleRotate={this.toggleRotate}
                            highlight={this.state.highlight}
                        />
                    </Grid>
                </Grid>
            </>
        )
    }

    private readonly toggleRotate = () => {
        this.setState({rotateCharts: !this.state.rotateCharts})
    }

    private readonly onMouseover = (index: number, data: any) => {
        this.setState({highlight: index})
    }

    private readonly onMouseout = (index: number, data: any) => {
        this.setState({highlight: -1})
    }
}
