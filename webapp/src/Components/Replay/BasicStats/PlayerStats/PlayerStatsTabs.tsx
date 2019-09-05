import {
    faBraille,
    faBullseye,
    faCarSide,
    faChartBar,
    faCircle,
    faFutbol,
    faHandshake,
    faPercent,
    faShoppingCart,
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
    exclude?: string[]
}

type Props = OwnProps
    & WithWidth

class PlayerStatsTabsComponent extends React.PureComponent<Props> {
    public render() {
        const categoryToIcon: Record<PlayerStatsSubcategory, IconDefinition> = {
            "Main Stats": faChartBar,
            "Hits": faBullseye,
            "Ball": faFutbol,
            "Playstyles": faCarSide,
            "Possession": faCircle,
            "Positioning": faBraille,
            "Boosts": faRocket,
            "Efficiency": faPercent,
            "Team Positioning": faHandshake,
            "Ball Carries": faShoppingCart
        }
        const { width, selectedTab, handleChange } = this.props
        const belowMd = isWidthDown("md", width)

        return (
            <Tabs value={selectedTab}
                  onChange={handleChange}
                  centered
                  variant={belowMd ? "scrollable" : "standard"}
                  scrollButtons={belowMd ? "on" : undefined}
            >
                {Object.keys(PlayerStatsSubcategory).filter((subcategory) => {
                    return this.props.exclude !== undefined
                        ? this.props.exclude.indexOf(subcategory) === -1
                        : true
                }).map((subcategory) => {
                    const value = PlayerStatsSubcategory[subcategory]
                    return <Tab label={value} value={value} key={value}
                                icon={<FontAwesomeIcon icon={categoryToIcon[value]}/>}/>
                })}
            </Tabs>
        )
    }
}

export const PlayerStatsTabs = withWidth()(PlayerStatsTabsComponent)
