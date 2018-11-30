import {
    Button,
    Grid,
    IconButton,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField
} from "@material-ui/core"
import Add from "@material-ui/icons/Add"
import Delete from "@material-ui/icons/Delete"
import * as React from "react"
import { arrayMove, SortableContainer, SortableElement, SortableHandle, SortEnd } from "react-sortable-hoc"
import { doPut } from "../../../../apiHandler/apiHandler"
import { StatDescription } from "../../../../Models/Player"
import { SettingsResponse } from "../../../../Models/Player/Settings"
import { getChartSettings } from "../../../../Requests/Player/getPlayStyle"
import { getStatsList } from "../../../../Requests/Replay"
import { LoadableWrapper } from "../../../Shared/LoadableWrapper"

interface State {
    settings?: SettingsResponse
    sorted?: string[][]
    stats?: StatDescription[]
}

interface Props {
    onUpdate: () => void
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

const Row = SortableElement(({children}) => {
    return (
        <TableRow>
            <TableCell>
                <DragHandle/>
            </TableCell>
            <TableCell>
                {children.children}
            </TableCell>
            <TableCell>
                <IconButton onClick={children.onDelete}>
                    <Delete/>
                </IconButton>
            </TableCell>
        </TableRow>
    )
})

export class PlayStyleEdit extends React.PureComponent<Props, State> {

    constructor(props: Props) {
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
                                                {this.state.sorted &&
                                                this.state.sorted[i].map((name: string, idx: number) => <>
                                                        {this.state.stats &&
                                                        <>
                                                            <Row key={idx}
                                                                 index={idx}
                                                                 children={{
                                                                     children: <Select
                                                                         multiple={false} value={name}

                                                                         onChange={
                                                                             this.createChangeHandler(i, idx)}>
                                                                         {this.state.stats &&
                                                                         this.state.stats.map((stat: StatDescription) =>
                                                                             <MenuItem value={stat.field_name}
                                                                                       key={stat.field_name}>
                                                                                 {stat.field_rename}
                                                                             </MenuItem>)}
                                                                     </Select>,
                                                                     onDelete: this.deleteRow(i, idx)

                                                                 }}
                                                            />

                                                        </>}
                                                    </>
                                                )}
                                            </TableBodySortable>
                                        </Table>
                                        <IconButton onClick={this.addRow(i)}>
                                            <Add/>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            )
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant={"raised"} onClick={this.onSubmit}>
                            Submit
                        </Button>
                    </Grid>
                    {/*)}*/}
                </LoadableWrapper>
            </>
        )
    }

    private readonly createChangeHandler = (chartIndex: number, pointIndex: number): (something: any) => void => {
        return (something: any) => {
            const {sorted} = this.state
            if (sorted) {
                sorted[chartIndex][pointIndex] = something.target.value
                this.forceUpdate()
            }
        }
    }
    private readonly deleteRow = (chartIndex: number, pointIndex: number): () => void => {
        return () => {
            const {sorted} = this.state
            if (sorted) {
                sorted[chartIndex].splice(pointIndex, 1)
                this.forceUpdate()
            }
        }
    }

    private readonly createSortEnd = (idx: number) => {
        return (sort: SortEnd) => {
            const {sorted} = this.state
            if (sorted) {
                sorted[idx] = arrayMove(sorted[idx], sort.oldIndex, sort.newIndex)
                this.setState({
                    sorted
                })
                this.forceUpdate()
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

    private readonly onSubmit = () => {
        doPut("/settings/set", JSON.stringify({spider_groups: this.state.sorted})).then(
            (result) => this.props.onUpdate())
    }
}
