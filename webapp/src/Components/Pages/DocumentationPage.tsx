import {
    Card,
    CardHeader,
    Divider,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableRow
} from "@material-ui/core"
import * as React from "react"
import { getDocumentation } from "../../Requests/Documentation"
import { LoadableWrapper } from "../Shared/LoadableWrapper"
import { BasePage } from "./BasePage"
import {QueryParams} from "../Shared/Documentation/QueryParams"

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
                                                                        <QueryParams
                                                                            key={index}
                                                                            queryParam=
                                                                                {explanations[key].query_params[index]}
                                                                        />
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
                                                <Table>
                                                    <TableBody>
                                                        {
                                                            Object.keys(explanations[key].path_params)
                                                                .map((index: any) => {
                                                                    return (
                                                                        <QueryParams
                                                                            key={index}
                                                                            queryParam=
                                                                                {explanations[key].path_params[index]}
                                                                        />
                                                                    )
                                                                })
                                                        }
                                                    </TableBody>
                                                </Table>
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
