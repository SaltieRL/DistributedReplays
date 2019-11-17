import {
    createStyles,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel, withStyles,
    WithStyles,
    WithTheme,
    withTheme
} from "@material-ui/core"
import * as React from "react"
import { BasicStat, StatsSubcategory } from "../../../Models"
import { convertSnakeAndCamelCaseToReadable, roundNumberToMaxDP } from "../../../Utils/String"

const styles = createStyles({
    sticky: {
        position: "relative",
        height: "100%",
        width: "100%"
    }
})

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

interface OwnProps {
    basicStats: BasicStat[]
    scrollLeft: number
}

type Props = OwnProps
    & WithStyles<typeof styles>
    & WithTheme

interface SortOptions {
    statName: string
    direction: "asc" | "desc"
}

interface State {
    currentSort?: SortOptions
}

class BasicStatsTableComponent extends React.PureComponent<Props, State> {
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
                            <TableCell>
                                <div style={{
                                    left: this.props.scrollLeft,
                                    backgroundColor: this.props.theme.palette.background.paper
                                }} className={this.props.classes.sticky}>{playerStat.playerName}</div>
                            </TableCell>
                            {playerStat.stats.map((stat, i) => (
                                <TableCell key={i} align="right">
                                    {stat.isMax ?
                                        <b>{roundNumberToMaxDP(stat.value)}</b>
                                        :
                                        roundNumberToMaxDP(stat.value)
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

        if (playerStats.length > 0 && playerStats[0].stats.find((stat) => stat.statName === statName) !== undefined) {
            playerStats.sort((playerStatA, playerStatB) => {
                return playerStatA.stats.find((stat) => stat.statName === statName)!.value
                    - playerStatB.stats.find((stat) => stat.statName === statName)!.value
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

export const BasicStatsTable = withStyles(styles)(withTheme(BasicStatsTableComponent))
