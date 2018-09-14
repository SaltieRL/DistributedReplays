import {Card, CardContent, CardHeader, Grid} from "@material-ui/core"
import * as React from "react"
import {BasePage} from "./BasePage"


export class AboutPage extends React.PureComponent {
    public render() {
        // TODO: Complete about page
        return (
            <BasePage>
                <Grid container spacing={16} alignItems="center" justify="center">
                    <Grid item xs>
                        <Card>
                            <CardHeader title="About us" subheader="Saltie"/>
                            <CardContent>
                                Hi.
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </BasePage>
        )
    }
}
