import {faBraille, faBullseye, faCarSide, faCircle, faFutbol, IconDefinition} from "@fortawesome/free-solid-svg-icons"
import {faRocket} from "@fortawesome/free-solid-svg-icons/faRocket"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {CardContent, Divider, Grid, Tab, Tabs, Typography, withWidth} from "@material-ui/core"
import {isWidthDown, WithWidth} from "@material-ui/core/withWidth"
import * as React from "react"
import {BasicStat, BasicStatsSubcategory, basicStatsSubcategoryValues} from "../../../Models/ChartData"
import {Replay} from "../../../Models/Replay/Replay"
import {getReplayBasicStats} from "../../../Requests/Replay"
import {convertSnakeAndCamelCaseToReadable} from "../../../Utils/String"
import {StatChart} from "../../Shared/Charts/StatChart"
import {LoadableWrapper} from "../../Shared/LoadableWrapper"
import {faRocket} from "@fortawesome/free-solid-svg-icons/faRocket"

interface OwnProps {
    replay: Replay
}

type Props = OwnProps
    & WithWidth

interface State {
    basicStats?: BasicStat[]
    selectedTab: BasicStatsSubcategory
}

class BasicStatsGridComponent extends React.PureComponent<Props, State> {
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

        const basicTabsForSelectedTab: BasicStat[] = this.state.basicStats ?
            this.state.basicStats
                .filter((basicStat) => basicStat.subcategory === this.state.selectedTab)
            : []

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
                        <LoadableWrapper load={this.getBasicStats}>
                            {basicTabsForSelectedTab.length > 0 ?
                                basicTabsForSelectedTab
                                    .map((basicStat) => {
                                        return (
                                            <Grid item xs={12} md={6} lg={4} xl={3} key={basicStat.title}>
                                                <Typography variant="subheading" align="center">
                                                    {convertSnakeAndCamelCaseToReadable(basicStat.title)}
                                                </Typography>
                                                <StatChart basicStat={basicStat}/>
                                            </Grid>
                                        )
                                    })
                                :
                                <Grid item xs={12}>
                                    <Typography align="center" style={{width: "100%"}}>
                                        These stats have not yet been calculated for this replay
                                    </Typography>
                                </Grid>
                            }
                        </LoadableWrapper>
                    </Grid>
                </CardContent>
            </>
        )
    }

    private readonly getBasicStats = (): Promise<any> => {
        return getReplayBasicStats(this.props.replay.id)
            .then((basicStats) => this.setState({basicStats}))
    }

    private readonly handleSelectTab = (event: React.ChangeEvent, selectedTab: BasicStatsSubcategory) => {
        this.setState({selectedTab})
    }
}

export const BasicStatsGrid = withWidth()(BasicStatsGridComponent)
