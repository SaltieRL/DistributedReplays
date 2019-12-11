import {Tab, Tabs} from "@material-ui/core"
import * as React from "react"
import {GroupPlayerStat} from "../../Models/Replay/Groups"
import {GroupPlayerStatsTable} from "./GroupPlayerStatsTable"
import {GroupStatsButtons} from "./Shared/GroupStatsButtons"

interface State {
    selectedTab: string
}

interface Props {
    stats: GroupPlayerStats
}

export class GroupPlayerStatsTableWrapper extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedTab: "(per Norm Game)"}
    }

    public render() {
        const playerStats = this.props.stats.playerStats

        return (
            <>
                <Tabs value={this.state.selectedTab} onChange={this.handleTabChange}>
                    {Object.keys(playerStats[0].stats)
                        .reverse()
                        .map((tab) => (
                            <Tab label={tab} value={tab} key={tab} />
                        ))}
                </Tabs>
                <GroupStatsButtons style={{display: "none"}} />
                <GroupPlayerStatsTable
                    stats={{
                        playerStats: playerStats.map((player: GroupPlayerStat) => ({
                            player: player.player,
                            name: player.name,
                            stats: player.stats[this.state.selectedTab]
                        }))
                    }}
                    style={{overflowX: "auto"}}
                />
            </>
        )
    }

    private readonly handleTabChange = (_: React.ChangeEvent<{}>, selectedTab: string) => {
        this.setState({selectedTab})
    }
}
