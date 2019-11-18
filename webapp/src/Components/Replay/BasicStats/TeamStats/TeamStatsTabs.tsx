import {faBraille, faHandshake, IconDefinition} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Tab, Tabs, withWidth} from "@material-ui/core"
import {isWidthDown, WithWidth} from "@material-ui/core/withWidth"
import * as React from "react"
import {TeamStatsSubcategory} from "../../../../Models"

interface OwnProps {
    selectedTab: TeamStatsSubcategory
    handleChange: (event: any, selectedTab: TeamStatsSubcategory) => void
}

type Props = OwnProps & WithWidth

class TeamStatsTabsComponent extends React.PureComponent<Props> {
    public render() {
        const categoryToIcon: Record<TeamStatsSubcategory, IconDefinition> = {
            Positioning: faBraille,
            "Center of Mass": faHandshake
        }
        const belowXs = isWidthDown("xs", this.props.width)

        return (
            <Tabs
                value={this.props.selectedTab}
                onChange={this.props.handleChange}
                centered={!belowXs}
                variant={belowXs ? "scrollable" : "standard"}
                scrollButtons="auto"
            >
                {Object.values(TeamStatsSubcategory).map((subcategoryValue) => (
                    <Tab
                        label={subcategoryValue}
                        value={subcategoryValue}
                        key={subcategoryValue}
                        icon={<FontAwesomeIcon icon={categoryToIcon[subcategoryValue]} />}
                    />
                ))}
            </Tabs>
        )
    }
}

export const TeamStatsTabs = withWidth()(TeamStatsTabsComponent)
