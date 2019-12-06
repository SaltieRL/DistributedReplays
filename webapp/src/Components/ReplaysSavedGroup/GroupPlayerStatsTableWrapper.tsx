import {Tab, Tabs} from "@material-ui/core"
import * as React from "react"
import {GroupPlayerStatsResponse} from "../../Models/Replay/Groups"
import {GroupPlayerStatsTable} from "./GroupPlayerStatsTable"

interface State {
    selectedTab: string
}

interface Props {
    stats: GroupPlayerStatsResponse
}

export class GroupPlayerStatsTableWrapper extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedTab: "(per Norm Game)"}
    }

    public render() {
        const playerStats = this.props.stats.playerStats
        console.log(playerStats)

        return (
            <>
                <Tabs value={this.state.selectedTab} onChange={this.handleTabChange}>
                    {Object.keys(playerStats[0].stats)
                        .reverse()
                        .map((tab) => (
                            <Tab label={tab} value={tab} key={tab} />
                        ))}
                </Tabs>
                <GroupPlayerStatsTable
                    stats={{
                        playerStats: playerStats.map((player) => {
                            return {
                                player: player.player,
                                name: player.name,
                                stats: player.stats[this.state.selectedTab]
                            }
                        })
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
