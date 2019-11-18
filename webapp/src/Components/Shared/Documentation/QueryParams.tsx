import {
    TableCell,
    TableRow
} from "@material-ui/core"
import * as React from "react"

interface Props {
    queryParam: any
}

export class QueryParams extends React.PureComponent<Props> {
    public render() {
        return (
            <TableRow>
                {/* REQUIRED, LIST, NAME */}
                <TableCell>
                    {this.props.queryParam.required && (
                        <span style={{fontWeight: "bold", color: "Red"}}>Required </span>
                    )}
                    {this.props.queryParam.is_list && (
                        <span style={{fontWeight: "bold", color: "Blue"}}>List </span>
                    )}
                    <span style={{fontWeight: "bold"}}>"{this.props.queryParam.name}"</span>
                </TableCell>

                {/* TYPE*/}
                <TableCell>
                    <span style={{fontWeight: "bold"}}>type: </span>
                    {this.props.queryParam.type}
                </TableCell>

                {/* SIBLINGS */}
                {this.props.queryParam.required_siblings !== null &&
                this.props.queryParam.required_siblings !== undefined &&
                this.props.queryParam.required_siblings.length > 0 && (
                    <TableCell>
                        <span style={{fontWeight: "bold"}}>Required Sibling Parameters: </span>
                        <div>
                            {Object.keys(this.props.queryParam.required_siblings).map((index: any) => (
                                <span key={index}>
                                        {this.props.queryParam.required_siblings[index]}
                                    {this.props.queryParam.required_siblings.length - 1 > index && (
                                        <span>, </span>
                                    )}
                                    </span>
                            ))}
                        </div>
                    </TableCell>
                )}

                {/* TIP */}
                {this.props.queryParam.tip && (
                    <TableCell>
                        <span style={{fontWeight: "bold"}}>Tip: </span>
                        {this.props.queryParam.tip}
                    </TableCell>
                )}
            </TableRow>
        )
    }
}
