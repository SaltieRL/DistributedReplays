import {Tab, Tabs} from "@material-ui/core"
import * as React from "react"
import {GroupTeamStatsResponse} from "../../Models/Replay/Groups"
import {GroupTeamStatsTable} from "./GroupTeamStatsTable"

interface State {
    selectedTab: string
}

interface Props {
    stats: GroupTeamStatsResponse
}

export class GroupTeamStatsTableWrapper extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedTab: "(per Norm Game)"}
    }

    public render() {
        const teamStats = this.props.stats.teamStats

        return (
            <>
                <Tabs value={this.state.selectedTab} onChange={this.handleTabChange}>
                    {Object.keys(teamStats[0].stats)
                        .reverse()
                        .map((tab) => (
                            <Tab label={tab} value={tab} key={tab} />
                        ))}
                </Tabs>
                <GroupTeamStatsTable
                    stats={{
                        teamStats: teamStats.map((team) => {
                            return {
                                games: team.games,
                                names: team.names,
                                team: team.team,
                                stats: team.stats[this.state.selectedTab]
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
