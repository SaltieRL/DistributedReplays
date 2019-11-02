import { Tab, Tabs, withWidth } from "@material-ui/core"
import { isWidthDown, WithWidth } from "@material-ui/core/withWidth"
import * as React from "react"

interface OwnProps {
    selectedTab: number
    handleChange: (event: any, selectedTab: number) => void
    kickoffData: any
}

type Props = OwnProps
    & WithWidth

class KickoffTabsComponent extends React.PureComponent<Props> {
    public render() {

        const belowXs = isWidthDown("xs", this.props.width)
        return (
            <Tabs value={this.props.selectedTab}
                  onChange={this.props.handleChange}
                  centered={!belowXs}
                  variant={belowXs ? "scrollable" : "standard"}
                  scrollButtons={belowXs ? "on" : undefined}
            >
                {
                    this.createTabList().map((kickoff: string, index: number) => (
                        <Tab label={kickoff} value={index} key={index}/>
                    ))}
            </Tabs>
        )
    }

    private readonly createTabList = () => {
        const modifiedKickoffData = this.props.kickoffData.kickoffs.map((ignore: any, index: number) => {
            return "Kickoff " + index
        })
        modifiedKickoffData.unshift("Overall")
        return modifiedKickoffData
    }
}

export const KickoffTabs = withWidth()(KickoffTabsComponent)
