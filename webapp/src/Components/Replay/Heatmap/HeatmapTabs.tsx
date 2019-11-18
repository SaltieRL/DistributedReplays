import { faBraille, faFastForward, faHourglass, IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { faRocket } from "@fortawesome/free-solid-svg-icons/faRocket"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Tab, Tabs, withWidth } from "@material-ui/core"
import { isWidthDown, WithWidth } from "@material-ui/core/withWidth"
import * as React from "react"
import { HeatmapSubcategory } from "../../../Models"

interface OwnProps {
    selectedTab: HeatmapSubcategory
    handleChange: (event: any, selectedTab: HeatmapSubcategory) => void
}

type Props = OwnProps
    & WithWidth

class HeatmapTabsComponent extends React.PureComponent<Props> {
    public render() {
        const categoryToIcon: Record<HeatmapSubcategory, IconDefinition> = {
            // "Hits": faBullseye,
            "Positioning": faBraille,
            "Boost": faRocket,
            "Boost Speed": faFastForward,
            "Slow Speed": faHourglass
        }

        const belowXs = isWidthDown("xs", this.props.width)
        return (
            <Tabs value={this.props.selectedTab}
                  onChange={this.props.handleChange}
                  centered={!belowXs}
                  variant={belowXs ? "scrollable" : "standard"}
                  scrollButtons={belowXs ? "on" : undefined}
            >
                {Object.values(HeatmapSubcategory).map((subcategoryValue) => (
                    <Tab label={subcategoryValue} value={subcategoryValue} key={subcategoryValue}
                         icon={<FontAwesomeIcon icon={categoryToIcon[subcategoryValue]}/>}/>
                ))}
            </Tabs>
        )
    }
}

export const HeatmapTabs = withWidth()(HeatmapTabsComponent)
