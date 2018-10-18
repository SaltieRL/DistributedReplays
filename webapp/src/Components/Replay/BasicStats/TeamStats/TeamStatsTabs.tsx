import {faBraille, faHandshake, IconDefinition} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Tab, Tabs, withWidth} from "@material-ui/core"
import {isWidthDown, WithWidth} from "@material-ui/core/withWidth"
import * as React from "react"
import {TeamStatsSubcategory, teamStatsSubcategoryValues} from "../../../../Models/ChartData"

interface OwnProps {
    selectedTab: TeamStatsSubcategory
    handleChange: (event: unknown, selectedTab: TeamStatsSubcategory) => void
}

type Props = OwnProps
    & WithWidth

class TeamStatsTabsComponent extends React.PureComponent<Props> {
    public render() {
        const categoryToIcon: Record<TeamStatsSubcategory, IconDefinition> = {
            Positioning: faBraille,
            "Center of Mass": faHandshake
        }

        return (
            <Tabs value={this.props.selectedTab}
                  onChange={this.props.handleChange}
                  centered
                  scrollable={isWidthDown("xs", this.props.width)}
                  scrollButtons={isWidthDown("xs", this.props.width) ? "on" : undefined}
            >
                {teamStatsSubcategoryValues
                    .map((subcategory) =>
                        <Tab label={subcategory} value={subcategory} key={subcategory}
                             icon={<FontAwesomeIcon icon={categoryToIcon[subcategory]}/>}
                        />
                    )
                }
            </Tabs>
        )
    }
}

export const TeamStatsTabs = withWidth()(TeamStatsTabsComponent)
