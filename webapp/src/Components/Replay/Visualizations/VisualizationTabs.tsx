import {Card, Tab, Tabs, Tooltip, withWidth} from "@material-ui/core"
import {isWidthUp, WithWidth} from "@material-ui/core/withWidth"
import * as React from "react"
import {connect} from "react-redux"
import {Replay} from "../../../Models"
import {StoreState} from "../../../Redux"
import {HeatmapTabsWrapper} from "./Heatmap/HeatmapTabsWrapper"
import {KickoffTabsWrapper} from "./Kickoffs/KickoffTabsWrapper"
import {VisualizationsContent} from "./Boosts/VisualizationsContent"

interface DisabledTabProps {
    label: string
}

const TabDisabled = (props: DisabledTabProps) => (
    <Tooltip title="In beta; Patrons only">
        <Tab label={props.label} style={{color: "#ccc", cursor: "not-allowed"}} />
    </Tooltip>
)

const mapStateToProps = (state: StoreState) => ({
    loggedInUser: state.loggedInUser
})

interface OwnProps {
    replay: Replay
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & WithWidth

type ReplayTab =
    | "heatmaps"
    | "kickoffs"
    | "boosts"

interface State {
    selectedTab: ReplayTab
}

class ReplayTabsComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedTab: "kickoffs"}
    }

    public render() {
        const aboveXl = isWidthUp("xl", this.props.width)
        return (
            <Card square style={{width: "100%"}}>
                <Tabs
                    value={this.state.selectedTab}
                    onChange={this.handleSelectTab}
                    centered={aboveXl}
                    variant={aboveXl ? "standard" : "scrollable"}
                    scrollButtons="on"
                >
                    <Tab key="heatmaps" label="Heatmaps" value="heatmaps" />
                    {this.props.loggedInUser && this.props.loggedInUser.beta ? (
                        <Tab key="kickoffs" label="Kickoffs" value="kickoffs" />
                    ) : (
                        <TabDisabled label="Kickoffs" />
                    )}
                    {this.props.loggedInUser && this.props.loggedInUser.beta ? (
                        <Tab key="boosts" label="Boosts" value="boosts" />
                    ) : (
                        <TabDisabled label="Boosts" />
                    )}
                </Tabs>
                {this.state.selectedTab === "heatmaps" && <HeatmapTabsWrapper replay={this.props.replay} />}
                {this.state.selectedTab === "kickoffs" && <KickoffTabsWrapper replay={this.props.replay} />}
                {this.state.selectedTab === "boosts" && <VisualizationsContent replay={this.props.replay} />}
            </Card>
        )
    }

    private readonly handleSelectTab = (_: React.ChangeEvent<{}>, selectedTab: ReplayTab) => {
        this.setState({selectedTab})
    }
}

export const VisualizationTabs = withWidth()(connect(mapStateToProps)(ReplayTabsComponent))
