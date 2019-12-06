import {Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel} from "@material-ui/core"
import * as React from "react"
import {GroupTeamStatsResponse, TeamStat} from "../../Models/Replay/Groups"
import {convertSnakeAndCamelCaseToReadable, roundNumberToMaxDP} from "../../Utils/String"

interface Props {
    stats: GroupTeamStatsResponse
    style?: React.CSSProperties
}

interface SortOptions {
    statName: string
    direction: "asc" | "desc"
}

interface State {
    currentSort?: SortOptions
}

export class GroupTeamStatsTable extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public render() {
        // const players = Object.keys(this.props.stats.playerStats)
        const teamStats = this.props.stats.teamStats
        const team0 = teamStats[0]
        const stats = Object.keys(team0.stats)
        if (this.state.currentSort) {
            this.sortStats(teamStats)
        }
        const maxStats = stats.map((stat) => {
            return Math.max(...teamStats.map((team) => team.stats[stat]))
        })
        return (
            <div style={this.props.style}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            {stats.map((stat) => (
                                <TableCell key={stat} align="right">
                                    <TableSortLabel
                                        active={this.state.currentSort && stat === this.state.currentSort.statName}
                                        direction={this.state.currentSort && this.state.currentSort.direction}
                                        onClick={this.handleSortChange(stat)}
                                    >
                                        {convertSnakeAndCamelCaseToReadable(stat)}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teamStats.map((teamStat) => (
                            <TableRow key={teamStat.names.reduce((prev, current, idx) => `${prev}, ${current}`)}>
                                <TableCell>
                                    <div
                                        style={
                                            {
                                                // left: this.props.scrollLeft,
                                                // backgroundColor: this.props.theme.palette.background.paper
                                            }
                                        }
                                        // className={this.props.classes.sticky}
                                    >
                                        {teamStat.names.reduce((prev, current, idx) => `${prev}, ${current}`)}
                                    </div>
                                </TableCell>
                                {stats.map((stat, i) => (
                                    <TableCell key={i} align="right">
                                        {teamStat.stats[stat] === maxStats[i] ? (
                                            <b>{roundNumberToMaxDP(teamStat.stats[stat])}</b>
                                        ) : (
                                            roundNumberToMaxDP(teamStat.stats[stat])
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }

    // Sorts playerStats inplace
    private readonly sortStats = (stats: TeamStat[]): void => {
        const {statName, direction} = this.state.currentSort!
        if (stats.length > 0 && statName in stats[0].stats) {
            stats.sort((playerStatA, playerStatB) => {
                return playerStatA.stats[statName] - playerStatB.stats[statName]
            })
            if (direction !== "asc") {
                stats.reverse()
            }
        }
    }

    private readonly handleSortChange = (statName: string) => () => {
        if (this.state.currentSort && this.state.currentSort.statName === statName) {
            this.setState({
                currentSort: {
                    ...this.state.currentSort,
                    direction: this.state.currentSort.direction === "asc" ? "desc" : "asc"
                }
            })
        } else {
            this.setState({
                currentSort: {
                    statName,
                    direction: "desc"
                }
            })
        }
    }
}
