import {
    faArrowsAlt,
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
import {faRocket} from "@fortawesome/free-solid-svg-icons/faRocket"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Tab, Tabs} from "@material-ui/core"
import * as React from "react"
import {PlayerStatsSubcategory} from "../../../../Models"

interface Props {
    selectedTab: PlayerStatsSubcategory
    handleChange: (event: any, selectedTab: PlayerStatsSubcategory) => void
    exclude?: string[]
}

export class PlayerStatsTabs extends React.PureComponent<Props> {
    public render() {
        const categoryToIcon: Record<PlayerStatsSubcategory, IconDefinition> = {
            "Main Stats": faChartBar,
            Hits: faBullseye,
            Ball: faFutbol,
            Playstyles: faCarSide,
            Possession: faCircle,
            Positioning: faBraille,
            Boosts: faRocket,
            Efficiency: faPercent,
            "Team Positioning": faHandshake,
            "Ball Carries": faShoppingCart,
            Kickoffs: faArrowsAlt
        }
        const {selectedTab, handleChange} = this.props

        return (
            <Tabs value={selectedTab} onChange={handleChange} variant="scrollable" scrollButtons="on">
                {Object.keys(PlayerStatsSubcategory)
                    .filter((subcategory) =>
                        this.props.exclude !== undefined ? !this.props.exclude.includes(subcategory) : true
                    )
                    .map((subcategory) => {
                        const value = PlayerStatsSubcategory[subcategory]
                        return (
                            <Tab
                                label={value}
                                value={value}
                                key={value}
                                icon={<FontAwesomeIcon icon={categoryToIcon[value]} />}
                            />
                        )
                    })}
            </Tabs>
        )
    }
}
