import {Card, CardHeader, Divider, Grid, Table, TableBody, TableCell, TableRow} from "@material-ui/core"
import * as React from "react"
import {getDocumentation} from "../../Requests/Documentation"
import {QueryParams} from "../Shared/Documentation/QueryParams"
import {LoadableWrapper} from "../Shared/LoadableWrapper"
import {BasePage} from "./BasePage"

interface State {
    explanations?: Record<string, any>
}

export class DocumentationPage extends React.PureComponent<{}, State> {
    constructor(props: {}) {
        super(props)
        this.state = {}
    }

    public render() {
        const {explanations} = this.state
        const documentation = (
            <LoadableWrapper load={this.getDocumentation}>
                {explanations && // TODO: Refactorise into components.
                    Object.keys(explanations).map((key) => (
                        <Card raised style={{marginBottom: 20}} key={key}>
                            <CardHeader title={explanations[key].path} />
                            {explanations[key].logged_in && (
                                <div>
                                    <span style={{color: "red", marginLeft: 20}}>Requires Login</span>
                                </div>
                            )}
                            <Divider />
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Function name</TableCell>
                                        <TableCell>{key}</TableCell>
                                    </TableRow>
                                    {explanations[key].query_params !== null &&
                                        explanations[key].query_params !== undefined &&
                                        explanations[key].query_params.length > 0 && (
                                            <TableRow>
                                                <TableCell>Query Params</TableCell>
                                                <TableCell>
                                                    <Table>
                                                        <TableBody>
                                                            {Object.keys(explanations[key].query_params).map(
                                                                (index) => (
                                                                    <QueryParams
                                                                        key={index}
                                                                        queryParam={
                                                                            explanations[key].query_params[index]
                                                                        }
                                                                    />
                                                                )
                                                            )}
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
                                                            {Object.keys(explanations[key].path_params).map((index) => (
                                                                <QueryParams
                                                                    key={index}
                                                                    queryParam={explanations[key].path_params[index]}
                                                                />
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                </TableBody>
                            </Table>
                        </Card>
                    ))}
            </LoadableWrapper>
        )

        return (
            <BasePage useSplash>
                <Grid container justify="center" spacing={3}>
                    <Grid item xs={12}>
                        {documentation}
                    </Grid>
                </Grid>
            </BasePage>
        )
    }

    private readonly getDocumentation = (): Promise<void> => {
        return getDocumentation().then((data) => {
            this.setState({explanations: data})
        })
    }
}
