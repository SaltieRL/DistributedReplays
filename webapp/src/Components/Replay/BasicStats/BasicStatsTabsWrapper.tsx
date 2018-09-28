import {faBraille, faBullseye, faCarSide, faCircle, faFutbol, IconDefinition} from "@fortawesome/free-solid-svg-icons"
import {faRocket} from "@fortawesome/free-solid-svg-icons/faRocket"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {CardContent, Divider, Grid, Tab, Tabs, withWidth} from "@material-ui/core"
import {isWidthDown, WithWidth} from "@material-ui/core/withWidth"
import * as React from "react"
import {BasicStatsSubcategory, basicStatsSubcategoryValues} from "../../../Models/ChartData"
import {Replay} from "../../../Models/Replay/Replay"
import {BasicStatsCharts} from "./BasicStatsCharts"

interface OwnProps {
    replay: Replay
}

type Props = OwnProps
    & WithWidth

interface State {
    selectedTab: BasicStatsSubcategory
}

class BasicStatsTabsWrapperComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedTab: "Hits"}
    }

    public render() {
        const categoryToIcon: Record<BasicStatsSubcategory, IconDefinition> = {
            Hits: faBullseye,
            Ball: faFutbol,
            Playstyles: faCarSide,
            Possession: faCircle,
            Positioning: faBraille,
            Boosts: faRocket
        }

        return (
            <>
                <Divider/>
                <Tabs value={this.state.selectedTab}
                      onChange={this.handleSelectTab}
                      centered
                      scrollable={isWidthDown("xs", this.props.width)}
                      scrollButtons={isWidthDown("xs", this.props.width) ? "on" : undefined}
                >
                    {basicStatsSubcategoryValues
                        .map((subcategory: BasicStatsSubcategory) =>
                            <Tab label={subcategory} value={subcategory} key={subcategory}
                                 icon={<FontAwesomeIcon icon={categoryToIcon[subcategory]}/>}
                            />
                        )
                    }
                </Tabs>
                <CardContent>
                    <Grid container spacing={32}>
                        <BasicStatsCharts replay={this.props.replay} selectedTab={this.state.selectedTab}/>
                    </Grid>
                </CardContent>
            </>
        )
    }

    private readonly handleSelectTab = (event: React.ChangeEvent, selectedTab: BasicStatsSubcategory) => {
        this.setState({selectedTab})
    }
}

export const BasicStatsTabsWrapper = withWidth()(BasicStatsTabsWrapperComponent)
