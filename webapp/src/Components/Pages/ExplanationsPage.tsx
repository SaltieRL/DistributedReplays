import { Card, CardHeader, Divider, Grid, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { getExplanations } from "../../Requests/Replay"
import { LoadableWrapper } from "../Shared/LoadableWrapper"
import { BasePage } from "./BasePage"

declare var MathJax: any

interface State {
    reloadSignal: boolean
    explanations?: Record<string, any>
}

export class ExplanationsPage extends React.PureComponent<{}, State> {
    constructor(props: any) {
        super(props)
        this.state = {reloadSignal: false}
    }

    public componentDidMount() {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, ReactDOM.findDOMNode(this)])
    }

    public componentDidUpdate() {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, ReactDOM.findDOMNode(this)])
    }

    public render() {
        const {explanations} = this.state
        const explanationsCard = (
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
                                Object.keys(explanations).map((key) => (
                                    <TableRow key={key}>
                                        <TableCell>{key}</TableCell>
                                        <TableCell>{explanations[key].simple_explanation}</TableCell>
                                        <TableCell>{explanations[key].math_explanation !== null ?
                                            `$$${explanations[key].math_explanation}$$` : ""}</TableCell>
                                    </TableRow>
                                )) : null}
                        </LoadableWrapper>
                    </TableBody>
                </Table>
            </Card>
        )

        return (
            <>
                <BasePage useSplash>
                    <Grid container justify="center" spacing={2}>
                        <Grid item xs={12} sm={12} md={12}>
                            {explanationsCard}
                        </Grid>
                    </Grid>
                </BasePage>
            </>
        )
    }

    private readonly getExplanations = (): Promise<any> => {
        return getExplanations().then((data) => {
                this.setState({explanations: data})
            }
        )
    }
}
