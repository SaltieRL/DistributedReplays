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
                    this.createTabList().map((kickoff, index) => {
                        return <Tab label={kickoff} value={index} key={index}/>
                })}
            </Tabs>
        )
    }
    private readonly createTabList = () => {
        const modifiedKickoffData = ["Overall"];
        this.props.kickoffData.kickoffs.forEach((ignore: any, index: number) => {
            modifiedKickoffData.push("Kickoff " + index)
        });
        return modifiedKickoffData
    }
}

export const KickoffTabs = withWidth()(KickoffTabsComponent)
