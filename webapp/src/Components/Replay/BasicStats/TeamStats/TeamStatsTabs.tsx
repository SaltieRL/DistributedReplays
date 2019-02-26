import { faBraille, faHandshake, IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Tab, Tabs, withWidth } from "@material-ui/core"
import { isWidthDown, WithWidth } from "@material-ui/core/withWidth"
import * as React from "react"
import { TeamStatsSubcategory } from "../../../../Models"

interface OwnProps {
    selectedTab: TeamStatsSubcategory
    handleChange: (event: any, selectedTab: TeamStatsSubcategory) => void
}

type Props = OwnProps
    & WithWidth

class TeamStatsTabsComponent extends React.PureComponent<Props> {
    public render() {
        const categoryToIcon: Record<TeamStatsSubcategory, IconDefinition> = {
            "Positioning": faBraille,
            "Center of Mass": faHandshake
        }

        return (
            <Tabs value={this.props.selectedTab}
                  onChange={this.props.handleChange}
                  centered
                  scrollable={isWidthDown("xs", this.props.width)}
                  scrollButtons={isWidthDown("xs", this.props.width) ? "on" : undefined}
            >
                {Object.keys(TeamStatsSubcategory)
                    .map((subcategory) => {
                        const value = TeamStatsSubcategory[subcategory]
                        return <Tab label={value} value={value} key={value}
                            icon={<FontAwesomeIcon icon={categoryToIcon[value]}/>}
                        />
                    })
                }
            </Tabs>
        )
    }
}

export const TeamStatsTabs = withWidth()(TeamStatsTabsComponent)
