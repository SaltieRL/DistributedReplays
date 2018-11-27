import { Card, CardHeader, Divider, Grid, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core"
import "mathjax"
import * as React from "react"
import { getExplanations } from "../../Requests/Replay"
import { LoadableWrapper } from "../Shared/LoadableWrapper"
import { BasePage } from "./BasePage"

interface State {
    reloadSignal: boolean
    explanations?: Record<string, any>
}

// MathJax.Hub.Config({tex2jax: {inlineMath: [["$", "$"], ["\\(", "\\)"]]}})
export class ExplanationsPage extends React.PureComponent<{}, State> {
    constructor(props: any) {
        super(props)
        this.state = {reloadSignal: false}
    }

    public render() {
        const {explanations} = this.state
        const contributors = (
            <Card>
                <CardHeader title="Stats" subheader="on calculated.gg"/>
                <Divider/>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Name
                            </TableCell>
                            <TableCell>
                                Simple Explanation
                            </TableCell>
                            <TableCell>
                                Math Explanation
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <LoadableWrapper load={this.getExplanations}
                                         reloadSignal={this.state.reloadSignal}>
                            {explanations !== undefined ?
                                Object.keys(explanations).map((key: any) => {
                                    return <>
                                        <TableRow>
                                            <TableCell>{key}</TableCell>
                                            <TableCell>{explanations[key].simple_explanation}</TableCell>
                                            <TableCell>{explanations[key].math_explanation !== null ?
                                                `$$${explanations[key].math_explanation}$$` : ""}</TableCell>

                                        </TableRow>
                                    </>
                                }) : undefined}
                        </LoadableWrapper>
                    </TableBody>
                </Table>
            </Card>
        )

        return (
            <>
                <BasePage backgroundImage={"/splash.png"}>
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

    private readonly getExplanations = (): Promise<any> => {
        const explanations = getExplanations().then((data) => {
                this.setState({explanations: data})
            }
        )
        MathJax.Hub.Queue(["Typeset", MathJax.Hub])
        return explanations
    }
}
