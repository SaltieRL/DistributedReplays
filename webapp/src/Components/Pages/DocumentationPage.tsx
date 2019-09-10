import { Card, CardHeader, Divider, Grid, Table, TableBody, TableCell, TableRow } from "@material-ui/core"
import * as React from "react"
import { getDocumentation } from "../../Requests/Documentation"
import { LoadableWrapper } from "../Shared/LoadableWrapper"
import { BasePage } from "./BasePage"
import ReactJson from "react-json-view";


interface State {
    reloadSignal: boolean
    explanations?: Record<string, any>
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
                            <Card raised={true} style={{marginBottom: '20px'}}>
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
                                                        Object.keys(explanations[key].query_params).map((index:any) => {
                                                            return (
                                                                <TableRow key={index}>
                                                                    {/* REQUIRED, LIST, NAME */}
                                                                    <TableCell>{
                                                                        explanations[key].query_params[index].required !== null &&
                                                                        explanations[key].query_params[index].required !== undefined &&
                                                                        explanations[key].query_params[index].required &&
                                                                        (<span style={{fontWeight: "bold", color: "Red"}}>Required </span>)
                                                                    }
                                                                    {   explanations[key].query_params[index].is_list !== null &&
                                                                    explanations[key].query_params[index].is_list !== undefined &&
                                                                    explanations[key].query_params[index].is_list &&
                                                                    (<span style={{fontWeight: "bold", color: "Blue"}}>List </span>)
                                                                    }
                                                                        <span style={{fontWeight: "bold"}}>"{explanations[key].query_params[index].name}"</span></TableCell>

                                                                    {/* TYPE*/}
                                                                    <TableCell><span style={{fontWeight: "bold"}}>type: </span>{explanations[key].query_params[index].type}</TableCell>

                                                                    {/* SIBLINGS */}
                                                                    {   explanations[key].query_params[index].required_siblings !== null &&
                                                                    explanations[key].query_params[index].required_siblings !== undefined &&
                                                                    explanations[key].query_params[index].required_siblings.length > 0 &&
                                                                    (<TableCell>
                                                                        <span style={{fontWeight: "bold"}}>Required Sibling Parameters: </span>
                                                                        <div>
                                                                        {Object.keys(explanations[key].query_params[index].required_siblings).map((index2:any) => {
                                                                            return (<span key={index2}>
                                                                                {explanations[key].query_params[index].required_siblings[index2]}
                                                                                {explanations[key].query_params[index].required_siblings.length - 1 > index2 && (<span>, </span>)}
                                                                            </span>)
                                                                        })}
                                                                        </div>
                                                                        </TableCell>)
                                                                    }

                                                                    {/* TIP */}
                                                                    {   explanations[key].query_params[index].tip !== null &&
                                                                    explanations[key].query_params[index].tip !== undefined &&
                                                                    explanations[key].query_params[index].tip &&
                                                                    (<TableCell><span style={{fontWeight: "bold"}}>Tip: </span>{explanations[key].query_params[index].tip}</TableCell>)
                                                                    }
                                                                </TableRow>
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
