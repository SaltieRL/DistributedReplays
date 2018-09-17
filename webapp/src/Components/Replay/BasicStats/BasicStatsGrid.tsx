import {faBraille, faBullseye, faCarSide, faCircle, faFutbol, IconDefinition} from "@fortawesome/free-solid-svg-icons"
import {Divider, Grid, Tab, Tabs, Typography} from "@material-ui/core"
import * as React from "react"
import {BasicStat, BasicStatsSubcategory, basicStatsSubcategoryValues} from "../../../Models/ChartData"
import {Replay} from "../../../Models/Replay/Replay"
import {getReplayBasicStats} from "../../../Requests/Replay"
import {convertSnakeAndCamelCaseToReadable} from "../../../Utils/String"
import {StatChart} from "../../Shared/Charts/StatChart"
import {LoadableWrapper} from "../../Shared/LoadableWrapper"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"


interface Props {
    replay: Replay
}

interface State {
    basicStats?: BasicStat[]
    selectedTab: BasicStatsSubcategory
}

export class BasicStatsGrid extends React.PureComponent<Props, State> {
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
            Positioning: faBraille

        }
        return (
            <>
                <Divider/>
                <Tabs value={this.state.selectedTab}
                      onChange={this.handleSelectTab}
                      centered
                >
                    {basicStatsSubcategoryValues
                        .map((subcategory: BasicStatsSubcategory) =>
                            <Tab label={subcategory} value={subcategory} key={subcategory}
                                 icon={<FontAwesomeIcon icon={categoryToIcon[subcategory]}/>}
                            />
                        )
                    }
                </Tabs>
                <Grid container spacing={32}>
                    <LoadableWrapper load={this.getBasicStats}>
                        {this.state.basicStats &&
                        this.state.basicStats
                            .filter((basicStat) => basicStat.subcategory === this.state.selectedTab)
                            .map((basicStat) => {
                                return (
                                    <Grid item xs={12} md={6} lg={4} xl={3} key={basicStat.title}>
                                        <Typography variant="subheading" align="center">
                                            {convertSnakeAndCamelCaseToReadable(basicStat.title)}
                                        </Typography>
                                        <StatChart basicStat={basicStat}/>
                                    </Grid>
                                )
                            })}
                    </LoadableWrapper>
                </Grid>
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
