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
import { faRocket } from "@fortawesome/free-solid-svg-icons/faRocket"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Tab, Tabs, withWidth } from "@material-ui/core"
import { isWidthDown, WithWidth } from "@material-ui/core/withWidth"
import * as React from "react"
import { PlayerStatsSubcategory } from "../../../../Models"

interface OwnProps {
    selectedTab: PlayerStatsSubcategory
    handleChange: (event: any, selectedTab: PlayerStatsSubcategory) => void
}

type Props = OwnProps
    & WithWidth

class PlayerStatsTabsComponent extends React.PureComponent<Props> {
    public render() {
        const categoryToIcon: Record<PlayerStatsSubcategory, IconDefinition> = {
            "Hits": faBullseye,
            "Ball": faFutbol,
            "Playstyles": faCarSide,
            "Possession": faCircle,
            "Positioning": faBraille,
            "Boosts": faRocket,
            "Efficiency": faPercent,
            "Team Positioning": faHandshake
        }

        const belowMd = isWidthDown("md", this.props.width)
        return (
            <Tabs value={this.props.selectedTab}
                  onChange={this.props.handleChange}
                  centered={!belowMd}
                  variant={belowMd ? "scrollable" : "standard"}
                  scrollButtons={belowMd ? "on" : undefined}
            >
                {Object.keys(PlayerStatsSubcategory).map((subcategory) => {
                    const value = PlayerStatsSubcategory[subcategory]
                    return <Tab label={value} value={value} key={value}
                                icon={<FontAwesomeIcon icon={categoryToIcon[value]}/>}/>
                })}
            </Tabs>
        )
    }
}

export const PlayerStatsTabs = withWidth()(PlayerStatsTabsComponent)
