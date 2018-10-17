import { Card, CardContent, CardHeader, Grid, List, ListItem, ListItemText } from "@material-ui/core"
import * as React from "react"
import { GlobalService } from "src/Requests"
import { LoadableWrapper } from "../Shared/LoadableWrapper"
import { BasePage } from "./BasePage"

interface State {
    queueStatuses?: QueueStatus[]
}

export class StatusPage extends React.PureComponent<{}, State> {
    constructor(props: {}) {
        super(props)
        this.state = {}
    }

    public render() {
        return (
            <BasePage backgroundImage={"/splash.png"}>
                <Grid container justify="center" spacing={16}>
                    <Grid item xs="auto">
                        <Card>
                            <CardHeader title="Queue" />
                            <CardContent>
                                <LoadableWrapper load={this.getQueueStatuses}>
                                    {this.state.queueStatuses &&
                                        <List>
                                            {this.state.queueStatuses.map((queueStatus) => {
                                                return (
                                                    <ListItem key={queueStatus.priority}>
                                                        <ListItemText primary={queueStatus.name}
                                                            secondary={queueStatus.count} />
                                                    </ListItem>
                                                )
                                            })}
                                        </List>
                                    }
                                </LoadableWrapper>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </BasePage>
        )
    }

    private readonly getQueueStatuses = (): Promise<void> => {
        return GlobalService.getInstance().getQueueStatuses()
            .then((queueStatuses) => this.setState({ queueStatuses }))
    }
}
