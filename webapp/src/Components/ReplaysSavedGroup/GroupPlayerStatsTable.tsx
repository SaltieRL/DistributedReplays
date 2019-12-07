import {Grid, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel} from "@material-ui/core"
import * as React from "react"
import {PlayerStatsSubcategory} from "../../Models"
import {GroupPlayerStatsResponse, PlayerStat} from "../../Models/Replay/Groups"
import {convertSnakeAndCamelCaseToReadable, roundNumberToMaxDP} from "../../Utils/String"

interface Props {
    stats: GroupPlayerStatsResponse
    style: React.CSSProperties | undefined
}

interface SortOptions {
    statName: string
    direction: "asc" | "desc"
}

interface State {
    currentSort?: SortOptions
    headerHeight: number
}

export class GroupPlayerStatsTable extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props)
        this.state = {
            headerHeight: -1
        }
    }

    public render() {
        // const players = Object.keys(this.props.stats.playerStats)
        const player0 = this.props.stats.playerStats[0]
        const categories = Object.keys(PlayerStatsSubcategory)
        const stats = Object.keys(player0.stats)
        stats.sort((statA, statB) => {
            return (
                categories.indexOf(player0.stats[statA].subcategory) -
                categories.indexOf(player0.stats[statA].subcategory)
            )
        })
        const playerStats = this.props.stats.playerStats
        if (this.state.currentSort) {
            this.sortPlayerStats(playerStats)
        }
        const maxStats = stats.map((stat) => {
            return Math.max(...playerStats.map((player) => player.stats[stat].value))
        })
        return (
            <Grid container>
                <Grid item xs={2}>
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
                            {playerStats.map((playerStat) => (
                                <TableRow key={playerStat.name}>
                                    <TableCell style={{paddingRight: "20px"}}>
                                        <div
                                            style={
                                                {
                                                    // left: this.props.scrollLeft,
                                                    // backgroundColor: this.props.theme.palette.background.paper
                                                }
                                            }
                                            // className={this.props.classes.sticky}
                                        >
                                            {playerStat.name}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
                <Grid item xs={10} style={this.props.style}>
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
                            {playerStats.map((playerStat) => (
                                <TableRow key={playerStat.name}>
                                    {stats.map((stat, i) => (
                                        <TableCell key={i} align="right">
                                            {playerStat.stats[stat].value === maxStats[i] ? (
                                                <b>{roundNumberToMaxDP(playerStat.stats[stat].value)}</b>
                                            ) : (
                                                roundNumberToMaxDP(playerStat.stats[stat].value)
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
    private readonly sortPlayerStats = (playerStats: PlayerStat[]): void => {
        const {statName, direction} = this.state.currentSort!

        if (playerStats.length > 0 && statName in playerStats[0].stats) {
            playerStats.sort((playerStatA, playerStatB) => {
                return playerStatA.stats[statName].value - playerStatB.stats[statName].value
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
