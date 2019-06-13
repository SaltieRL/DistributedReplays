import { CardContent, Divider } from "@material-ui/core"
import Grid from "@material-ui/core/Grid"
import * as React from "react"
import { HeatmapSubcategory, Replay } from "../../../Models"
import { getHeatmaps } from "../../../Requests/Replay"
import { LoadableWrapper } from "../../Shared/LoadableWrapper"
import { HeatmapContent } from "./HeatmapContent"
import { HeatmapTabs } from "./HeatmapTabs"

interface Props {
    replay: Replay
}

interface State {
    heatmapData: any
    heatmap: any
    selectedTab: HeatmapSubcategory
    reloadSignal: boolean
}

export class HeatmapTabsWrapper extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            heatmapData: null,
            heatmap: null,
            selectedTab: HeatmapSubcategory.POSITIONING,
            reloadSignal: false
        }
    }

    // public componentDidMount() {
    //     const config = {container: ReactDOM.findDOMNode(this) as HTMLElement}
    //     const heatmap = h337.create(config)
    //     this.setState({heatmap})
    // }

    public render() {

        return (
            <>
                <Divider/>
                <HeatmapTabs selectedTab={this.state.selectedTab} handleChange={this.handleSelectTab}/>
                <CardContent>
                    <Grid container spacing={32}>
                        <LoadableWrapper load={this.getHeatmapsData} reloadSignal={this.state.reloadSignal}>
                            <HeatmapContent replay={this.props.replay} heatmapData={this.state.heatmapData}/>
                        </LoadableWrapper>
                    </Grid>
                </CardContent>
            </>
        )

    }

    private readonly getHeatmapsData = () => {
        return getHeatmaps(this.props.replay.id, this.state.selectedTab.toString())
            .then((data) => this.setState({heatmapData: data}))
    }

    private readonly handleSelectTab = (event: React.ChangeEvent, selectedTab: HeatmapSubcategory) => {
        this.setState({selectedTab}, this.triggerReload)
    }

    private readonly triggerReload = () => {
        this.setState({reloadSignal: !this.state.reloadSignal})
    }
}
