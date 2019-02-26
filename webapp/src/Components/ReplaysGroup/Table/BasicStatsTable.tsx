import { Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from "@material-ui/core"
import * as React from "react"
import { BasicStat, StatsSubcategory } from "../../../Models"
import { convertSnakeAndCamelCaseToReadable } from "../../../Utils/String"

interface StatMetadata {
    name: string
    category: StatsSubcategory
}

interface Stat {
    statName: string
    value: number
    isMax: boolean
}

interface PlayerStat {
    playerName: string
    stats: Stat[]
}

interface Props {
    basicStats: BasicStat[]
}

interface SortOptions {
    statName: string
    direction: "asc" | "desc"
}

interface State {
    currentSort?: SortOptions
}

export class BasicStatsTable extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {currentSort: {statName: "hits", direction: "desc"}}
    }

    public render() {
        const stats: StatMetadata[] = this.props.basicStats.map((basicStat) => (
            {
                name: basicStat.title,
                category: basicStat.subcategory
            }
        ))
        const playerNames: string[] = this.props.basicStats[0].chartDataPoints
            .map((statDataPoint) => statDataPoint.name)

        const playerStats: PlayerStat[] = playerNames.map((playerName) => {
            return {
                playerName,
                stats: this.props.basicStats.map((basicStat) => ({
                    statName: basicStat.title,
                    value: basicStat.chartDataPoints
                        .find((statDataPoint) => statDataPoint.name === playerName)!
                        .value,
                    isMax: false
                }))
            }
        })

        // Bolding maxes.
        const maxStats = this.props.basicStats.map((basicStat) => {
            return Math.max(...basicStat.chartDataPoints.map((statDataPoint) => statDataPoint.value))
        })

        playerStats.forEach((playerStat) => {
            playerStat.stats.forEach((stat, i) => {
                if (stat.value === maxStats[i]) {
                    stat.isMax = true
                }
            })
        })

        if (this.state.currentSort) {
            this.sortPlayerStats(playerStats)
        }

        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        {stats.map((stat) => (
                            <TableCell key={stat.name} align="right">
                                <TableSortLabel
                                    active={this.state.currentSort && stat.name === this.state.currentSort.statName}
                                    direction={this.state.currentSort && this.state.currentSort.direction}
                                    onClick={this.handleSortChange(stat.name)}
                                >
                                    {convertSnakeAndCamelCaseToReadable(stat.name)}
                                </TableSortLabel>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {playerStats.map((playerStat) => (
                        <TableRow key={playerStat.playerName}>
                            <TableCell>{playerStat.playerName}</TableCell>
                            {playerStat.stats.map((stat, i) => (
                                <TableCell key={i} align="right">
                                    {stat.isMax ?
                                        <b>{stat.value}</b>
                                        :
                                        stat.value
                                    }
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }

    // Sorts playerStats inplace
    private readonly sortPlayerStats = (playerStats: PlayerStat[]): void => {
        const {statName, direction} = this.state.currentSort!

        playerStats.sort((playerStatA, playerStatB) => {
            return playerStatA.stats.find((stat) => stat.statName === statName)!.value
                - playerStatB.stats.find((stat) => stat.statName === statName)!.value
        })
        if (direction !== "asc") {
            playerStats.reverse()
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
