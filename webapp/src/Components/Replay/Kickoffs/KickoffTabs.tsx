import {createStyles, Tab, Tabs, Theme, WithStyles, withStyles} from "@material-ui/core"
import * as React from "react"

const styles = (theme: Theme) =>
    createStyles({
        verticalTabs: {
            minWidth: 150,
            borderRight: `1px solid ${theme.palette.divider}`
        }
    })

interface OwnProps {
    selectedTab: number
    handleChange: (event: React.ChangeEvent<{}>, selectedTab: number) => void
    kickoffData: KickoffData
    orientation: "horizontal" | "vertical"
}

type Props = OwnProps & WithStyles<typeof styles>

class KickoffTabsComponent extends React.PureComponent<Props> {
    public render() {
        const {classes, orientation, handleChange, selectedTab} = this.props

        return (
            <Tabs
                value={selectedTab}
                onChange={handleChange}
                orientation={orientation}
                variant="scrollable"
                scrollButtons="on"
                className={orientation === "vertical" ? classes.verticalTabs : undefined}
            >
                {this.createTabList().map((kickoff: string, index: number) => (
                    <Tab label={kickoff} value={index} key={index} />
                ))}
            </Tabs>
        )
    }

    private readonly createTabList = () => {
        const modifiedKickoffData = this.props.kickoffData.kickoffs.map((_, index: number) => "Kickoff " + index)
        modifiedKickoffData.unshift("Overall") // Add to beginning of array
        return modifiedKickoffData
    }
}

export const KickoffTabs = withStyles(styles)(KickoffTabsComponent)
