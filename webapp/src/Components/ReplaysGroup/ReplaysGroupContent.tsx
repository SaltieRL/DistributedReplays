import { Card, CardContent, Divider, Tab, Tabs, Typography } from "@material-ui/core"
import * as React from "react"
import { Replay } from "../../Models"
import { ReplaysGroupChartsWrapper } from "./Charts/ReplaysGroupChartsWrapper"
import { ReplaysGroupTable } from "./Table/ReplaysGroupTable"
import { ThemeContext } from "../../Theme"

interface Props {
    replays: Replay[]
}

type ReplaysDetailsTab = "Table" | "Charts"

interface State {
    selectedTab: ReplaysDetailsTab
}

export class ReplaysGroupContent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedTab: "Charts"}
    }

    public render() {
        const allReplaysSameGameMode = this.props.replays.every((val, _, arr) => val.gameMode === arr[0].gameMode)
        return (
            <>
                {this.props.replays.length > 0 && !allReplaysSameGameMode && (
                    <ThemeContext.Consumer>
                        {(themeValue) => (
                            <Card
                                square
                                style={{width: "100%", backgroundColor: themeValue.dark ? "#aa8301" : "#ebd324"}}>
                                <CardContent>
                                    <Typography variant="subtitle1" align="center">
                                        WARNING: Selected replays are from different modes, stats might be inaccurate!
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}
                    </ThemeContext.Consumer>
                )}
                <Card square style={{width: "100%"}}>
                    <Tabs value={this.state.selectedTab}
                          onChange={this.handleSelectTab}
                          centered
                    >
                        <Tab label="Table" value="Table"/>
                        <Tab label="Charts" value="Charts"/>
                    </Tabs>
                    <Divider/>
                    {this.state.selectedTab === "Table" ?
                        <ReplaysGroupTable replays={this.props.replays}/>
                        :
                        <ReplaysGroupChartsWrapper replays={this.props.replays}/>
                    }
                </Card>
            </>
        )
    }

    private readonly handleSelectTab = (_: React.ChangeEvent<{}>, selectedTab: ReplaysDetailsTab) => {
        this.setState({selectedTab})
    }
}
