// import Grid from "@material-ui/core/Grid/Grid"
// import {ChartDataSets, ChartOptions} from "chart.js"
// import * as React from "react"
// import {HorizontalBar} from "react-chartjs-2"
// import {Paper} from "../../../../node_modules/@material-ui/core/index"
// import {Player, Replay, Team} from "../../madeUpStuff/responseInterfaces"
// import {getColour, resetColourCounts} from "./ColourGetter"
//
// interface Props {
//     replay: Replay
// }
//
// interface State {
//     charts: HorizontalBar[]
// }
//
// export class GameStatsChart extends React.PureComponent<Props, State> {
//     constructor(props: Props) {
//         super(props)
//         this.state = {
//             charts: []
//         }
//     }
//
//     public render() {
//         const labelToKeys = new Map<string, string>()
//             .set("Goals", "matchGoals")
//             .set("Shots", "matchShots")
//             .set("Saves", "matchSaves")
//             .set("MMR", "mmr")
//
//         let showLegend = true
//
//         const paperStyle: React.CSSProperties = {
//             width: "100%",
//             overflowX: "auto",
//             padding: "8px"
//         }
//         return (
//             <Paper style={paperStyle}>
//                 <Grid container style={{minWidth: "400px"}}>
//                     {Array.from(labelToKeys, (([label, key]) => {
//                         resetColourCounts()
//                         const data = {
//                             labels: [label],
//                             datasets: this.getDatasets(this.props.replay, key)
//                         }
//                         let positiveValuesSum = 0
//                         let negativeValuesSum = 0
//                         data.datasets.forEach((dataset) => {
//                             const playerData = dataset.data as number[]
//                             playerData[0] < 0 ? negativeValuesSum += playerData[0] : positiveValuesSum += playerData[0]
//                         })
//
//                         const xLimit = Math.round(Math.max(-negativeValuesSum, positiveValuesSum) * 1.2) + 1
//                         console.log(xLimit)
//                         const element = <HorizontalBar
//                             key={label}
//                             data={data}
//                             options={this.getOptions(showLegend, xLimit)}
//                             height={showLegend ? 100 : 80}
//                             width={300}
//                         />
//
//                         showLegend = false
//                         return (
//                             <Grid item xs={12}>
//                                 {element}
//                             </Grid>
//                         )
//                     }))}
//                 </Grid>
//             </Paper>
//         )
//     }
//
//     // @ts-ignore
//     private getDatasetsForOldReplay(replay: any, key: string): ChartDataSets[] {
//         const datasets: ChartDataSets[] = []
//         replay.players.forEach((player: any) => {
//             let playerData = [player[key]]
//             if (!player.team_is_orange) {
//                 playerData = playerData.map((value) => -value)
//             }
//
//             const playerDataSet = {
//                 label: player.name,
//                 data: playerData,
//                 stack: "1",  // player.team_is_orange? "orange" : "blue"
//                 ...getColour(player.team_is_orange)
//             }
//             datasets.push(playerDataSet)
//         })
//
//         return datasets
//     }
//
//     private getDatasets(replay: Replay, key: string): ChartDataSets[] {
//         const datasets: ChartDataSets[] = []
//         replay.teams.forEach((team: Team) => {
//             team.players.forEach((player: Player) => {
//                 let playerData = [player[key]]
//                 if (!player.isOrange) {
//                     playerData = playerData.map((value) => -value)
//                 }
//
//                 const playerDataSet = {
//                     label: player.name,
//                     data: playerData,
//                     stack: "1",  // player.team_is_orange? "orange" : "blue"
//                     ...getColour(player.isOrange)
//                 }
//                 datasets.push(playerDataSet)
//             })
//         })
//
//         return datasets
//     }
//
//     private readonly getOptions = (showLegend: boolean, xLimit: number): ChartOptions => {
//         return {
//             scales: {
//                 xAxes: [{
//                     stacked: true,
//                     gridLines: {
//                         zeroLineWidth: 2,
//                         zeroLineColor: "rgba(0, 0, 0, 0.3)",
//                         drawBorder: false
//                     },
//                     ticks: {
//                         min: -xLimit,
//                         max: xLimit,
//                         callback: (value: any) => value < 0 ? -parseInt(value, 10) : parseInt(value, 10)
//                     },
//                     afterFit: (scaleInstance) => {
//                         scaleInstance.width = 100 // sets the width to 100px
//                     }
//                 }],
//                 yAxes: [{
//                     stacked: true,
//                     gridLines: {
//                         display: false
//                     },
//                     barThickness: 25,
//                     afterFit: (scaleInstance) => {
//                         scaleInstance.width = 50 // sets the width to 100px
//                     }
//                 }]
//             },
//             legend: {
//                 display: showLegend,
//                 onClick: (e) => e.stopPropagation()
//             },
//             tooltips: {
//                 callbacks: {
//                     label: (tooltipItem, data) => data.datasets[tooltipItem.datasetIndex].label + ": " +
//                         Math.abs(parseInt(tooltipItem.xLabel, 10))
//                 }
//             },
//             maintainAspectRatio: false
//         }
//     }
// }
//
