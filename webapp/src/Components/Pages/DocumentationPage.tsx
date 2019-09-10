import {
    Card,
    CardHeader,
    Divider,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@material-ui/core"
import * as React from "react"
import { getDocumentation } from "../../Requests/Documentation"
import { LoadableWrapper } from "../Shared/LoadableWrapper"
import { BasePage } from "./BasePage"
import ReactJson from "react-json-view"

interface State {
    reloadSignal: boolean
    explanations?: Record<string, any>
}

interface Props {
    queryParam: any
}

class QueryParams  extends React.PureComponent<Props> {
    public render() {
        return (
            <>
                <TableRow>
                    {/* REQUIRED, LIST, NAME */}
                    <TableCell>{
                        this.props.queryParam.required !== null &&
                        this.props.queryParam.required !== undefined &&
                        this.props.queryParam.required &&
                        (<span style={{fontWeight: "bold", color: "Red"}}>Required </span>)
                    }
                        {   this.props.queryParam.is_list !== null &&
                        this.props.queryParam.is_list !== undefined &&
                        this.props.queryParam.is_list &&
                        (<span style={{fontWeight: "bold", color: "Blue"}}>List </span>)
                        }
                        <span style={{fontWeight: "bold"}}>"{this.props.queryParam.name}"</span>
                    </TableCell>

                    {/* TYPE*/}
                    <TableCell>
                        <span style={{fontWeight: "bold"}}>type: </span>
                        {this.props.queryParam.type}
                    </TableCell>

                    {/* SIBLINGS */}
                    {
                        this.props.queryParam.required_siblings !== null &&
                        this.props.queryParam.required_siblings !== undefined &&
                        this.props.queryParam.required_siblings.length > 0 &&
                        (<TableCell>
                            <span style={{fontWeight: "bold"}}>Required Sibling Parameters: </span>
                            <div>
                                {Object.keys(this.props.queryParam.required_siblings).map((index2:any) => {
                                    return (<span key={index2}>{this.props.queryParam.required_siblings[index2]}
                                        {this.props.queryParam.required_siblings.length - 1 > index2 &&
                                        (<span>, </span>)}</span>)
                                })}
                            </div>
                        </TableCell>)
                    }

                    {/* TIP */}
                    {   this.props.queryParam.tip !== null &&
                    this.props.queryParam.tip !== undefined &&
                    this.props.queryParam.tip &&
                    (<TableCell>
                        <span style={{fontWeight: "bold"}}>Tip: </span>
                        {this.props.queryParam.tip}
                    </TableCell>)
                    }
                </TableRow>
            </>
        )
    }
}

export class DocumentationPage extends React.PureComponent<{}, State> {
    constructor(props: any) {
        super(props)
        this.state = {reloadSignal: false}
    }

    public render() {
        const {explanations} = this.state
        const contributors = (
            <LoadableWrapper load={this.getDocumentation}
                             reloadSignal={this.state.reloadSignal}>
                {explanations !== undefined ?
                    Object.keys(explanations).map((key: any) => {
                        return <>
                            <Card raised={true} style={{marginBottom: "20px"}}>
                                <CardHeader title={key} />
                                <Divider/>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Path</TableCell>
                                            <TableCell>{explanations[key].path}</TableCell>
                                        </TableRow>
                                        {explanations[key].query_params !== null &&
                                         explanations[key].query_params !== undefined &&
                                         explanations[key].query_params.length > 0 && (
                                        <TableRow>
                                            <TableCell>Query Params</TableCell>
                                            <TableCell>
                                                <Table>
                                                    <TableBody>
                                                        {
                                                        Object.keys(explanations[key].query_params)
                                                            .map((index: any) => {
                                                            return (
                                                                <QueryParams key={index}
                                                                             queryParam={explanations[key].
                                                                                 query_params[index]}>

                                                                </QueryParams>
                                                            )
                                                        })
                                                    }
                                                    </TableBody>
                                                </Table>
                                            </TableCell>
                                        </TableRow>
                                        )}
                                        {explanations[key].path_params !== null &&
                                        explanations[key].path_params !== undefined &&
                                        explanations[key].path_params.length > 0 && (
                                        <TableRow>
                                            <TableCell>Path Params</TableCell>
                                            <TableCell>
                                                <ReactJson src={explanations[key].path_params} />
                                            </TableCell>
                                        </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </Card>
                        </>
                    }) : undefined}
            </LoadableWrapper>
        )

        return (
            <>
                <BasePage useSplash>
                    <Grid container justify="center">
                        <Grid item xs={12} lg={12} xl={12}>
                            <Grid container spacing={16} justify="center">
                                <Grid item xs={12} sm={12} md={12}>
                                    {contributors}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </BasePage>
            </>
        )
    }

    private readonly getDocumentation = (): Promise<any> => {
        const explanations = getDocumentation().then((data) => {
                this.setState({explanations: data})
            }
        )
        return explanations
    }
}
