import {
    IconDefinition,
    faBraille,
    faBullseye,
    faCarSide,
    faCircle,
    faFutbol,
    faPercent,
    faHandshake
} from "@fortawesome/free-solid-svg-icons"
import {faRocket} from "@fortawesome/free-solid-svg-icons/faRocket"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Tab, Tabs, withWidth} from "@material-ui/core"
import {isWidthDown, WithWidth} from "@material-ui/core/withWidth"
import * as React from "react"
import {BasicStatsSubcategory, basicStatsSubcategoryValues} from "../../../../Models/ChartData"

interface OwnProps {
    selectedTab: BasicStatsSubcategory
    handleChange: (event: unknown, selectedTab: BasicStatsSubcategory) => void
}

type Props = OwnProps
    & WithWidth

class BasicStatsTabsComponent extends React.PureComponent<Props> {
    public render() {
        const categoryToIcon: Record<BasicStatsSubcategory, IconDefinition> = {
            Hits: faBullseye,
            Ball: faFutbol,
            Playstyles: faCarSide,
            Possession: faCircle,
            Positioning: faBraille,
            Boosts: faRocket,
            Efficiency: faPercent,
            TeamPositioning: faHandshake
        }

        return (
            <Tabs value={this.props.selectedTab}
                  onChange={this.props.handleChange}
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
        )
    }
}

export const PlayerStatsTabs = withWidth()(BasicStatsTabsComponent)
