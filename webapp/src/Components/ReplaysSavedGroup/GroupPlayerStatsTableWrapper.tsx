import {Tab, Tabs} from "@material-ui/core"
import * as React from "react"

import {AllGroupPlayerStats, GroupPlayerStats, GroupPlayerStatsResponse} from "../../Models/Replay/Groups"
import {GroupPlayerStatsTable} from "./GroupPlayerStatsTable"
import {GroupStatsButtons} from "./Shared/GroupStatsButtons"

interface State {
    selectedTab: string
}

interface Props {
    stats: GroupPlayerStatsResponse
}

export class GroupPlayerStatsTableWrapper extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedTab: "(per Norm Game)"}
    }

    public render() {
        const {playerStats} = this.props.stats
        return (
            <>
                <Tabs value={this.state.selectedTab} onChange={this.handleTabChange}>
                    {this.getTabs()
                        .reverse()
                        .map((tab) => (
                            <Tab label={tab} value={tab} key={tab} />
                        ))}
                </Tabs>
                <GroupStatsButtons style={{display: "none"}} />
                <GroupPlayerStatsTable
                    stats={playerStats.map(
                        (player: AllGroupPlayerStats): GroupPlayerStats => ({
                            player: player.player,
                            name: player.name,
                            stats: player.stats[this.state.selectedTab]
                        })
                    )}
                    style={{overflowX: "auto"}}
                />
            </>
        )
    }

    private getTabs() {
        const firstPlayer = this.props.stats.playerStats[0]
        if (!firstPlayer) {
            return []
        }
        return Object.keys(firstPlayer.stats)
    }

    private readonly handleTabChange = (_: React.ChangeEvent<{}>, selectedTab: string) => {
        this.setState({selectedTab})
    }
}
