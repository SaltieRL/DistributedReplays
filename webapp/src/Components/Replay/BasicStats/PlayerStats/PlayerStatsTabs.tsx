import {
    faBraille,
    faBullseye,
    faCarSide,
    faCircle,
    faFutbol,
    faHandshake,
    faPercent,
    IconDefinition
} from "@fortawesome/free-solid-svg-icons"
import {faRocket} from "@fortawesome/free-solid-svg-icons/faRocket"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Tab, Tabs, withWidth} from "@material-ui/core"
import {isWidthDown, WithWidth} from "@material-ui/core/withWidth"
import * as React from "react"
import {PlayerStatsSubcategory, playerStatsSubcategoryValues} from "../../../../Models/ChartData"

interface OwnProps {
    selectedTab: PlayerStatsSubcategory
    handleChange: (event: unknown, selectedTab: PlayerStatsSubcategory) => void
}

type Props = OwnProps
    & WithWidth

class PlayerStatsTabsComponent extends React.PureComponent<Props> {
    public render() {
        const categoryToIcon: Record<PlayerStatsSubcategory, IconDefinition> = {
            Hits: faBullseye,
            Ball: faFutbol,
            Playstyles: faCarSide,
            Possession: faCircle,
            Positioning: faBraille,
            Boosts: faRocket,
            Efficiency: faPercent,
            "Team Positioning": faHandshake
        }

        return (
            <Tabs value={this.props.selectedTab}
                  onChange={this.props.handleChange}
                  centered
                  scrollable={isWidthDown("xs", this.props.width)}
                  scrollButtons={isWidthDown("xs", this.props.width) ? "on" : undefined}
            >
                {playerStatsSubcategoryValues
                    .map((subcategory: PlayerStatsSubcategory) =>
                        <Tab label={subcategory} value={subcategory} key={subcategory}
                             icon={<FontAwesomeIcon icon={categoryToIcon[subcategory]}/>}
                        />
                    )
                }
            </Tabs>
        )
    }
}

export const PlayerStatsTabs = withWidth()(PlayerStatsTabsComponent)
