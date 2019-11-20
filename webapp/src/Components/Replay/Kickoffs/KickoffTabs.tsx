import {Tab, Tabs} from "@material-ui/core"
import * as React from "react"

interface Props {
    selectedTab: number
    handleChange: (event: any, selectedTab: number) => void
    kickoffData: any
    orientation: "horizontal" | "vertical"
}

export class KickoffTabs extends React.PureComponent<Props> {
    public render() {
        return (
            <Tabs
                value={this.props.selectedTab}
                onChange={this.props.handleChange}
                orientation={this.props.orientation}
                variant="scrollable"
                scrollButtons="on"
                style={{minWidth: 150}}
            >
                {this.createTabList().map((kickoff: string, index: number) => (
                    <Tab label={kickoff} value={index} key={index} />
                ))}
            </Tabs>
        )
    }

    private readonly createTabList = () => {
        const modifiedKickoffData = this.props.kickoffData.kickoffs.map((_: any, index: number) => "Kickoff " + index)
        modifiedKickoffData.unshift("Overall") // Add to beginning of array
        return modifiedKickoffData
    }
}
