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
import {Button, Grid} from "@material-ui/core"
import * as React from "react"
import {PlayerStatsSubcategory} from "../../../Models"

interface Props {
    onClick?: any
    exclude?: string[]
    style?: React.CSSProperties
}

export class GroupStatsButtons extends React.PureComponent<Props> {
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

        return (
            <Grid container spacing={2} justify={"space-evenly"} alignItems={"center"} style={this.props.style}>
                {Object.keys(PlayerStatsSubcategory)
                    .filter((subcategory) =>
                        this.props.exclude !== undefined ? !this.props.exclude.includes(subcategory) : true
                    )
                    .map((subcategory) => {
                        const value = PlayerStatsSubcategory[subcategory]
                        return (
                            <Grid item xs={2} key={subcategory}>
                                <Button
                                    variant="outlined"
                                    style={{height: "100%"}}
                                    onClick={this.props.onClick ? this.props.onClick : () => null}
                                >
                                    <FontAwesomeIcon icon={categoryToIcon[value]} /> {value}
                                </Button>
                            </Grid>
                        )
                    })}
            </Grid>
        )
    }
}
