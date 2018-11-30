import { Grid, IconButton, MenuItem, Select, Table, TableBody, TableCell, TableRow, TextField } from "@material-ui/core"
import * as React from "react"
import { arrayMove, SortableContainer, SortableElement, SortableHandle, SortEnd } from "react-sortable-hoc"
import { StatDescription } from "../../../../Models/Player"
import { SettingsResponse } from "../../../../Models/Player/Settings"
import { getChartSettings } from "../../../../Requests/Player/getPlayStyle"
import { getStatsList } from "../../../../Requests/Replay"
import { LoadableWrapper } from "../../../Shared/LoadableWrapper"
import Add from "@material-ui/icons/Add"

interface State {
    settings?: SettingsResponse
    sorted?: string[][]
    stats?: StatDescription[]
}

//  Component which uses drag-n-drop activation when clicking inside the component
const DragHandle = SortableHandle(({style}) => (
    < span style={{...style, ...{cursor: " move "}}}> {" ::: "} </span>)
)

// Universal component for turning a TableBody into a sortable container
const TableBodySortable = SortableContainer(({children, displayRowCheckbox}) => (
    <TableBody>
        {children}
    </TableBody>
))

const Row = SortableElement(({name, children}) => {
    return (
        <TableRow>
            <TableCell>
                <DragHandle/>
            </TableCell>
            <TableCell>
                {children}
            </TableCell>
        </TableRow>
    )
})

export class PlayStyleEdit extends React.PureComponent<{}, State> {

    constructor(props: {}) {
        super(props)
        this.state = {}
    }

    public render() {
        return (
            <>
                <LoadableWrapper load={this.getData}>
                    <Grid container spacing={32}>
                        {this.state.settings && this.state.settings.settings.filter((item) =>
                            item.key === "spider_titles")[0].value.map((group: string, i: number) => (
                                <Grid item xs={12}>
                                    <Grid item xs={12}>
                                        <TextField key={group} value={group} label={`Chart ${i + 1}`}/>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Table>
                                            <TableBodySortable onSortEnd={this.createSortEnd(i)} useDragHandle>
                                                {this.state.sorted && this.state.sorted[i].map((name: string, idx: number) => <>
                                                        {this.state.stats && <>
                                                            <Row index={idx}
                                                                 children={<Select multiple={false} value={name}>
                                                                     {this.state.stats &&
                                                                     this.state.stats.map((stat: StatDescription) =>
                                                                         <MenuItem value={stat.field_name}
                                                                                   key={stat.field_name}>
                                                                             {stat.field_rename}
                                                                         </MenuItem>)}
                                                                 </Select>}/>

                                                        </>}
                                                    </>
                                                )}
                                            </TableBodySortable>
                                            <IconButton onClick={this.addRow(i)}>
                                                <Add/>
                                            </IconButton>
                                        </Table>
                                    </Grid>
                                </Grid>
                            )
                        )}
                    </Grid>
                    {/*)}*/}
                </LoadableWrapper>
            </>
        )
    }

    private createSortEnd = (idx: number) => {
        return (sort: SortEnd) => {
            const {sorted} = this.state
            if (sorted) {
                console.log(idx, sort.oldIndex, sort.newIndex, sorted[idx])
                sorted[idx] = arrayMove(sorted[idx], sort.oldIndex, sort.newIndex)
                this.setState({
                    sorted
                })

                this.forceUpdate()
                if (this.state.sorted) {
                    console.log(this.state.sorted[idx])
                }

            }
        }
    }

    private readonly addRow = (idx: number) => {
        return () => {
            if (this.state.stats) {
                const {sorted} = this.state
                if (sorted) {
                    const newStat = this.state.stats[0].field_name
                    if (newStat !== undefined) {
                        sorted[idx].push(newStat)
                    }
                    this.setState({sorted})
                    this.forceUpdate()
                }
            }
        }
    }


    private readonly getData = (): Promise<any> => {
        return Promise.all([getChartSettings(), getStatsList()]).then((data) => {
            this.setState({
                settings: data[0], stats: data[1], sorted: data[0].settings.filter((item) =>
                    item.key === "spider_groups")[0].value
            })
        })
    }
}
