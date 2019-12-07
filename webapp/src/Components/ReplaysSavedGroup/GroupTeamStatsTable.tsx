import { Grid, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from "@material-ui/core"
import * as React from "react"
import { GroupTeamStatsResponse, TeamStat } from "../../Models/Replay/Groups"
import { convertSnakeAndCamelCaseToReadable, roundNumberToMaxDP } from "../../Utils/String"

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
    headerHeight: number
}

export class GroupTeamStatsTable extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props)
        this.state = {
            headerHeight: -1
        }
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
            <Grid container>
                <Grid item xs={4}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    style={{
                                        height: this.state.headerHeight > 0 ? this.state.headerHeight : undefined
                                    }}
                                >
                                    Name
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {teamStats.map((teamStat) => (
                                <TableRow key={teamStat.names.reduce((prev, current, idx) => `${prev}, ${current}`)}>
                                    <TableCell>
                                        {teamStat.names.reduce((prev, current, idx) => `${prev}, ${current}`)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
                <Grid item xs={8} style={this.props.style}>
                    <Table>
                        <TableHead
                            ref={(ref: HTMLDivElement) => {
                                if (ref) {
                                    const height = ref.clientHeight
                                    if (this.state.headerHeight !== height) {
                                        this.setState({headerHeight: height})
                                    }
                                }
                            }}
                        >
                            <TableRow>
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
                </Grid>
            </Grid>
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
