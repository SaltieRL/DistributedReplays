import { Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from "@material-ui/core"
import * as React from "react"
import { CSSProperties } from "react"
import { GroupPlayerStatsResponse, PlayerStat } from "../../Models/Replay/Groups"
import { convertSnakeAndCamelCaseToReadable, roundNumberToMaxDP } from "../../Utils/String"

interface Props {
    stats: GroupPlayerStatsResponse
    style: CSSProperties | undefined
}

interface SortOptions {
    statName: string
    direction: "asc" | "desc"
}

interface State {
    currentSort?: SortOptions
}

export class GroupPlayerStatsTable extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public render() {
        // const players = Object.keys(this.props.stats.playerStats)
        const player0 = this.props.stats.playerStats[0]
        const stats = Object.keys(player0.stats)
        const playerStats = this.props.stats.playerStats
        if (this.state.currentSort) {
            this.sortPlayerStats(playerStats)
        }
        return (
            <div style={this.props.style}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Name
                            </TableCell>
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
                                )
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {playerStats.map((playerStat) => (
                            <TableRow key={playerStat.name}>
                                <TableCell>
                                    <div style={{
                                        // left: this.props.scrollLeft,
                                        // backgroundColor: this.props.theme.palette.background.paper
                                    }}
                                        // className={this.props.classes.sticky}
                                    >{playerStat.name}</div>
                                </TableCell>
                                {stats.map((stat, i) => (
                                    <TableCell key={i} align="right">
                                        {roundNumberToMaxDP(playerStat.stats[stat])}
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
    private readonly sortPlayerStats = (playerStats: PlayerStat[]): void => {
        const {statName, direction} = this.state.currentSort!

        if (playerStats.length > 0 && Object.keys(playerStats[0].stats).find((stat: string) => stat === statName) !== undefined) {
            playerStats.sort((playerStatA, playerStatB) => {
                return playerStatA.stats[statName]
                    - playerStatB.stats[statName]
            })
            if (direction !== "asc") {
                playerStats.reverse()
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
